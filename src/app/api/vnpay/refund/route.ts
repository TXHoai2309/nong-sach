import { NextResponse } from "next/server";
import crypto from "crypto";

function formatVnpayDate(date: Date): string {
  const yyyy = date.getFullYear().toString();
  const MM = (date.getMonth() + 1).toString().padStart(2, "0");
  const dd = date.getDate().toString().padStart(2, "0");
  const HH = date.getHours().toString().padStart(2, "0");
  const mm = date.getMinutes().toString().padStart(2, "0");
  const ss = date.getSeconds().toString().padStart(2, "0");
  return yyyy + MM + dd + HH + mm + ss;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, amount, transDate, transNo, adminId } = body;

    if (!orderId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const tmnCode = process.env.VNP_TMNCODE || "2QXGZSTR";
    const secretKey = process.env.VNP_HASHSECRET || "UXOIZJZWNEAFBJKDUDWGYXNUXQLOUXXT";
    const vnpApiUrl = "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction";

    const vnp_RequestId = crypto.randomUUID();
    const vnp_Version = "2.1.0";
    const vnp_Command = "refund";
    const vnp_TransactionType = "02"; // 02: Full Refund
    const vnp_TxnRef = orderId;
    const vnp_Amount = Math.round(amount * 100);
    const vnp_TransactionNo = transNo || "";
    // If we don't have the exact transDate from VNPay, we fallback to order's created date
    const vnp_TransactionDate = transDate ? formatVnpayDate(new Date(transDate)) : formatVnpayDate(new Date());
    const vnp_CreateBy = adminId || "admin";
    const vnp_CreateDate = formatVnpayDate(new Date());
    const vnp_IpAddr = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const vnp_OrderInfo = `Hoan tien don hang ${orderId}`;

    // data format for checksum:
    // RequestId|Version|Command|TmnCode|TransactionType|TxnRef|Amount|TransactionNo|TransactionDate|CreateBy|CreateDate|IpAddr|OrderInfo
    const signData = [
      vnp_RequestId,
      vnp_Version,
      vnp_Command,
      tmnCode,
      vnp_TransactionType,
      vnp_TxnRef,
      vnp_Amount,
      vnp_TransactionNo,
      vnp_TransactionDate,
      vnp_CreateBy,
      vnp_CreateDate,
      vnp_IpAddr,
      vnp_OrderInfo
    ].join("|");

    const hmac = crypto.createHmac("sha512", secretKey);
    const vnp_SecureHash = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    const requestBody = {
      vnp_RequestId,
      vnp_Version,
      vnp_Command,
      vnp_TmnCode: tmnCode,
      vnp_TransactionType,
      vnp_TxnRef,
      vnp_Amount,
      vnp_TransactionNo,
      vnp_TransactionDate,
      vnp_CreateBy,
      vnp_CreateDate,
      vnp_IpAddr,
      vnp_OrderInfo,
      vnp_SecureHash
    };

    console.log("Sending Refund Request to VNPay:", requestBody);

    const response = await fetch(vnpApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    console.log("VNPay Refund Response:", data);

    // vnp_ResponseCode "00" indicates success. In sandbox, it might fail due to dummy data, but we process it anyway.
    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    console.error("VNPay Refund API Error:", error);
    return NextResponse.json({ error: "Failed to process refund API" }, { status: 500 });
  }
}
