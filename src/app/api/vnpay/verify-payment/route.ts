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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { searchParams } = body; // Parameters passed from frontend vnpay-return page

    if (!searchParams || typeof searchParams !== "object") {
      return NextResponse.json({ error: "Tham số xác thực không hợp lệ" }, { status: 400 });
    }

    const vnp_SecureHash = searchParams.vnp_SecureHash;
    
    // Copy parameters and remove signature fields
    const vnp_Params = { ...searchParams };
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
      console.error("Sai chữ ký VNPay:", { calculatedHash, vnp_SecureHash });
      return NextResponse.json({ error: "Chữ ký thanh toán không hợp lệ" }, { status: 400 });
    }

    const orderId = vnp_Params.vnp_TxnRef;
    const responseCode = vnp_Params.vnp_ResponseCode;
    const transactionNo = vnp_Params.vnp_TransactionNo;

    // Fetch the pending order details
    const pendingOrderRef = doc(db, "pending_orders", orderId);
    const pendingOrderSnap = await getDoc(pendingOrderRef);

    if (!pendingOrderSnap.exists()) {
      return NextResponse.json({ error: "Không tìm thấy thông tin đơn hàng tạm thời" }, { status: 404 });
    }

    const pendingOrder = pendingOrderSnap.data();

    // If already processed, return success directly
    if (pendingOrder.processed) {
      return NextResponse.json({
        success: pendingOrder.payment_status === "success",
        orderId,
        transactionNo: pendingOrder.vnp_TransactionNo || transactionNo,
        alreadyProcessed: true,
      });
    }

    if (responseCode === "00") {
      // Payment succeeded! Mark pending order as success and processed
      await updateDoc(pendingOrderRef, {
        payment_status: "success",
        processed: true,
        vnp_TransactionNo: transactionNo,
        vnp_ResponseCode: responseCode,
        updatedAt: new Date().toISOString(),
      });

      // Split order by sellerId, similar to checkout page logic
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
            console.error("Lỗi khi cập nhật lượt sử dụng voucher trong VNPay verify:", error);
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

      return NextResponse.json({
        success: true,
        orderId,
        transactionNo,
        productIds: items.map((item: CartItem) => item.productId)
      });
    } else {
      // Payment failed/cancelled
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

      return NextResponse.json({
        success: false,
        error: `Thanh toán thất bại hoặc đã bị hủy (Mã lỗi: ${responseCode})`,
        orderId,
      });
    }
  } catch (error: unknown) {
    console.error("Lỗi verify-payment route:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi xác thực thanh toán" }, { status: 500 });
  }
}
