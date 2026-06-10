import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Voucher } from "@/types/voucher";
import { CartItem } from "@/types/cart";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, items } = body;

    if (!code || !code.trim()) {
      return NextResponse.json({ error: "Vui lòng nhập mã giảm giá" }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Giỏ hàng trống hoặc không hợp lệ" }, { status: 400 });
    }

    const codeKey = code.toUpperCase().trim();
    const voucherRef = doc(db, "vouchers", codeKey);
    const voucherSnap = await getDoc(voucherRef);

    if (!voucherSnap.exists()) {
      return NextResponse.json({ error: "Mã giảm giá không tồn tại" }, { status: 400 });
    }

    const voucher = voucherSnap.data() as Voucher;

    // Check status
    if (voucher.status === "stopped") {
      return NextResponse.json({ error: "Mã giảm giá đã dừng hoạt động" }, { status: 400 });
    }

    // Check usage limit
    if (voucher.usedCount >= voucher.limit) {
      return NextResponse.json({ error: "Mã giảm giá đã hết lượt sử dụng" }, { status: 400 });
    }

    // Check expiry date (inclusive of the expiry day, so we compare with end of day)
    // E.g., if expiry date is 2026-06-10, it is valid until 2026-06-10 23:59:59
    const expiryTime = new Date(`${voucher.expiryDate}T23:59:59`).getTime();
    if (Number.isNaN(expiryTime) || expiryTime < Date.now()) {
      return NextResponse.json({ error: "Mã giảm giá đã hết hạn" }, { status: 400 });
    }

    // Check if the cart has items belonging to this voucher's seller
    const sellerId = voucher.sellerId || "admin";
    const sellerItems = items.filter((item: CartItem) => (item.sellerId || "admin") === sellerId);

    if (sellerItems.length === 0) {
      return NextResponse.json({
        error: `Mã giảm giá chỉ áp dụng cho các sản phẩm từ shop "${voucher.shopName || "NôngSạch Store"}"`
      }, { status: 400 });
    }

    // Calculate subtotal of this seller's products in cart
    const sellerSubtotal = sellerItems.reduce(
      (sum: number, item: CartItem) => sum + item.price * item.quantity,
      0
    );

    if (sellerSubtotal <= 0) {
      return NextResponse.json({ error: "Giá trị đơn hàng không đủ điều kiện" }, { status: 400 });
    }

    // Calculate discount amount
    let discount = 0;
    if (voucher.type === "percent") {
      discount = Math.floor(sellerSubtotal * (voucher.value / 100));
    } else {
      discount = Math.min(voucher.value, sellerSubtotal);
    }

    return NextResponse.json({
      valid: true,
      discount,
      sellerId,
      code: voucher.code,
      message: "Áp dụng mã giảm giá thành công!"
    });
  } catch (error: unknown) {
    console.error("Lỗi apply voucher route:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi áp dụng mã giảm giá" }, { status: 500 });
  }
}
