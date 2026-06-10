import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import crypto from "crypto";
import { incrementVoucherUsage, saveVoucherHistory } from "@/lib/vouchers";
import { CartItem } from "@/types/cart";

// Helper to sort and encode parameters
function sortObject(obj: Record<string, string>) {
  const sorted: Record<string, string> = {};
  const str: string[] = [];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (let i = 0; i < str.length; i++) {
    const rawKey = decodeURIComponent(str[i]);
    sorted[str[i]] = encodeURIComponent(obj[rawKey]).replace(/%20/g, "+");
  }
  return sorted;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vnp_Params: Record<string, string> = {};
    
    searchParams.forEach((value, key) => {
      vnp_Params[key] = value;
    });

    const vnp_SecureHash = vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHashType;

    const secretKey = process.env.VNP_HASHSECRET || "UXOIZJZWNEAFBJKDUDWGYXNUXQLOUXXT";

    // Verify signature
    const sortedParams = sortObject(vnp_Params);
    const signData = Object.keys(sortedParams)
      .map((key) => `${key}=${sortedParams[key]}`)
      .join("&");

    const hmac = crypto.createHmac("sha512", secretKey);
    const calculatedHash = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (calculatedHash !== vnp_SecureHash) {
      console.error("IPN: Chữ ký không hợp lệ", { calculatedHash, vnp_SecureHash });
      return NextResponse.json({ RspCode: "97", Message: "Invalid checksum" });
    }

    const orderId = vnp_Params.vnp_TxnRef;
    const responseCode = vnp_Params.vnp_ResponseCode;
    const transactionNo = vnp_Params.vnp_TransactionNo;
    const amount = Number(vnp_Params.vnp_Amount);

    // Fetch pending order details
    const pendingOrderRef = doc(db, "pending_orders", orderId);
    const pendingOrderSnap = await getDoc(pendingOrderRef);

    if (!pendingOrderSnap.exists()) {
      return NextResponse.json({ RspCode: "01", Message: "Order not found" });
    }

    const pendingOrder = pendingOrderSnap.data();

    // Verify amount matches
    const expectedAmount = Math.round(pendingOrder.totalAmount * 100);
    if (amount !== expectedAmount) {
      console.error("IPN: Số tiền không khớp", { amount, expectedAmount });
      return NextResponse.json({ RspCode: "04", Message: "Invalid amount" });
    }

    // Check if order has already been processed
    if (pendingOrder.processed) {
      return NextResponse.json({ RspCode: "02", Message: "Order already confirmed" });
    }

    if (responseCode === "00") {
      // Payment succeeded! Update pending order
      await updateDoc(pendingOrderRef, {
        payment_status: "success",
        processed: true,
        vnp_TransactionNo: transactionNo,
        vnp_ResponseCode: responseCode,
        updatedAt: new Date().toISOString(),
      });

      // Split order by sellerId, similar to verify-payment logic
      const items: CartItem[] = pendingOrder.items || [];
      const itemsBySeller = items.reduce((acc: Record<string, CartItem[]>, item: CartItem) => {
        const sellerId = item.sellerId || "admin";
        if (!acc[sellerId]) acc[sellerId] = [];
        acc[sellerId].push(item);
        return acc;
      }, {} as Record<string, CartItem[]>);

      const sellerIds = Object.keys(itemsBySeller);
      const appliedVoucher = pendingOrder.appliedVoucher; // { code, discount, sellerId }

      for (const [index, sellerId] of sellerIds.entries()) {
        const sellerItems = itemsBySeller[sellerId];
        const sellerTotal = sellerItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
        const subOrderId = sellerIds.length > 1 ? `${orderId}-${index + 1}` : orderId;

        // Check if this seller gets the voucher discount
        const isSellerVoucher = appliedVoucher && (sellerId === appliedVoucher.sellerId);
        const voucherDiscount = isSellerVoucher ? appliedVoucher.discount : 0;
        const finalSellerTotal = Math.max(0, sellerTotal - voucherDiscount);

        // Save official order in orders collection
        const officialOrderRef = doc(db, "orders", subOrderId);
        await setDoc(officialOrderRef, {
          id: subOrderId,
          userId: pendingOrder.userId,
          sellerId,
          shopName: sellerItems[0]?.shopName || "NôngSạch Store",
          fullName: pendingOrder.fullName,
          phone: pendingOrder.phone,
          email: pendingOrder.email,
          address: pendingOrder.address,
          note: pendingOrder.note,
          items: sellerItems,
          totalAmount: finalSellerTotal,
          status: "pending",
          paymentMethod: pendingOrder.paymentMethod || "vnpay",
          payment_status: "success",
          vnp_TransactionNo: transactionNo,
          vnp_ResponseCode: responseCode,
          createdAt: pendingOrder.createdAt || new Date().toISOString(),
          ...(isSellerVoucher ? {
            voucherCode: appliedVoucher.code,
            discountAmount: voucherDiscount,
          } : {}),
        });

        // Decrement the voucher limit in Firestore if it was used
        if (isSellerVoucher) {
          try {
            await incrementVoucherUsage(appliedVoucher.code);
            await saveVoucherHistory({
              voucherCode: appliedVoucher.code,
              userId: pendingOrder.userId || "guest",
              orderId: subOrderId,
              discountAmount: voucherDiscount,
              sellerId: appliedVoucher.sellerId,
            });
          } catch (error) {
            console.error("Lỗi khi cập nhật lượt sử dụng voucher trong VNPay IPN:", error);
          }
        }

        // Add seller notification
        const sellerNotiId = `NOTI-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        await setDoc(doc(db, "notifications", sellerNotiId), {
          id: sellerNotiId,
          userId: sellerId,
          title: "Đơn hàng mới!",
          message: `Bạn nhận được đơn hàng mới #${subOrderId} từ ${pendingOrder.fullName}.`,
          type: "new_order",
          orderId: subOrderId,
          isRead: false,
          createdAt: new Date().toISOString(),
        });
      }

      // Add buyer notification
      if (pendingOrder.userId && pendingOrder.userId !== "guest") {
        const buyerNotiId = `NOTI-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        await setDoc(doc(db, "notifications", buyerNotiId), {
          id: buyerNotiId,
          userId: pendingOrder.userId,
          title: "Thanh toán thành công",
          message: `Đơn hàng ${orderId} của bạn đã được thanh toán online thành công qua VNPay.`,
          type: "order_update",
          orderId: orderId,
          isRead: false,
          createdAt: new Date().toISOString(),
        });
      }

      return NextResponse.json({ RspCode: "00", Message: "Confirm Success" });
    } else {
      // Payment failed or cancelled
      let paymentStatus: "failed" | "cancelled" = "failed";
      if (responseCode === "24") {
        paymentStatus = "cancelled";
      }

      await updateDoc(pendingOrderRef, {
        payment_status: paymentStatus,
        processed: true,
        vnp_ResponseCode: responseCode,
        updatedAt: new Date().toISOString(),
      });

      return NextResponse.json({ RspCode: "00", Message: "Confirm Success" }); // Still return RspCode 00 to VNPay as we successfully recorded the failure status
    }
  } catch (error: unknown) {
    console.error("IPN Webhook Error:", error);
    return NextResponse.json({ RspCode: "99", Message: "Unkown error" });
  }
}
