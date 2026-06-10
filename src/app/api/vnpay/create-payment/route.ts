import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import crypto from "crypto";

// Helper to format date to yyyyMMddHHmmss
function formatVnpayDate(date: Date): string {
  const yyyy = date.getFullYear().toString();
  const MM = (date.getMonth() + 1).toString().padStart(2, "0");
  const dd = date.getDate().toString().padStart(2, "0");
  const HH = date.getHours().toString().padStart(2, "0");
  const mm = date.getMinutes().toString().padStart(2, "0");
  const ss = date.getSeconds().toString().padStart(2, "0");
  return yyyy + MM + dd + HH + mm + ss;
}

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
    const { userId, fullName, phone, email, address, note, items, totalAmount, paymentMethod, appliedVoucher } = body;

    if (!items || items.length === 0 || !totalAmount) {
      return NextResponse.json({ error: "Dữ liệu đơn hàng không hợp lệ" }, { status: 400 });
    }

    const pendingOrderId = `NS-${Date.now()}`;

    // Save pending order details to Firestore
    const pendingOrderRef = doc(db, "pending_orders", pendingOrderId);
    await setDoc(pendingOrderRef, {
      id: pendingOrderId,
      userId: userId || "guest",
      fullName,
      phone,
      email: email || "",
      address,
      note: note || "",
      items,
      totalAmount,
      paymentMethod: paymentMethod || "vnpay",
      createdAt: new Date().toISOString(),
      payment_status: "pending",
      processed: false,
      ...(appliedVoucher ? { appliedVoucher } : {}),
    });

    // Configure VNPay Sandbox parameters
    const tmnCode = process.env.VNP_TMNCODE || "2QXGZSTR";
    const secretKey = process.env.VNP_HASHSECRET || "UXOIZJZWNEAFBJKDUDWGYXNUXQLOUXXT";
    const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    
    // Get host for return URL fallback
    const origin = request.headers.get("origin") || "http://localhost:3000";
    const returnUrl = process.env.VNP_RETURNURL || `${origin}/checkout/vnpay-return`;

    const date = new Date();
    const createDate = formatVnpayDate(date);
    
    // Get client IP address
    const ipAddr = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    const vnp_Params: Record<string, string> = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: pendingOrderId,
      vnp_OrderInfo: `Thanh toan don hang ${pendingOrderId}`,
      vnp_OrderType: "other",
      vnp_Amount: Math.round(totalAmount * 100).toString(),
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    if (paymentMethod === "credit") {
      vnp_Params.vnp_BankCode = "INTCARD";
    } else if (paymentMethod === "wallet") {
      vnp_Params.vnp_BankCode = "VNPAYQR";
    }

    // Generate secure hash signature
    const sortedParams = sortObject(vnp_Params);
    const signData = Object.keys(sortedParams)
      .map((key) => `${key}=${sortedParams[key]}`)
      .join("&");

    const hmac = crypto.createHmac("sha512", secretKey);
    const secureHash = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    // Construct final redirect URL
    const queryStr = Object.keys(sortedParams)
      .map((key) => `${key}=${sortedParams[key]}`)
      .join("&");
    
    const paymentUrl = `${vnpUrl}?${queryStr}&vnp_SecureHash=${secureHash}`;

    return NextResponse.json({ paymentUrl });
  } catch (error: unknown) {
    console.error("Lỗi create-payment route:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi tạo liên kết thanh toán" }, { status: 500 });
  }
}
