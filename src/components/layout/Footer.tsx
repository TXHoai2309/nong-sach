"use client";

import Link from "next/link";

// ── Data ───────────────────────────────────────────────────────────────────────
const NAV_COLUMNS = [
  {
    title: "Mua sắm",
    links: [
      { href: "/products", label: "Tất cả sản phẩm" },
      { href: "/products?tag=combo", label: "Combo tiết kiệm" },
      { href: "/products?category=organic", label: "Sản phẩm Organic" },
    ],
  },
  {
    title: "Hỗ trợ",
    links: [
      { href: "/shipping", label: "Vận chuyển" },
      { href: "/returns", label: "Hoàn trả" },
      { href: "/contact", label: "Liên hệ" },
    ],
  },
  {
    title: "Pháp lý",
    links: [
      { href: "/privacy", label: "Chính sách bảo mật" },
      { href: "/terms", label: "Điều khoản sử dụng" },
    ],
  },
];

const SOCIAL_ICONS = [
  { icon: "face_nod",     label: "Facebook" },
  { icon: "photo_camera", label: "Instagram" },
  { icon: "smart_display",label: "YouTube" },
];

// ── Component ──────────────────────────────────────────────────────────────────
export default function Footer() {
  return (
    <footer className="w-full">

      {/* ── Newsletter section ── */}
      <div className="bg-[#86f2e4]/30 py-12">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-[28rem]">
            <h2 className="text-[24px] leading-[32px] font-semibold text-[#111c2d] mb-2">
              Đăng ký nhận bản tin
            </h2>
            <p className="text-[16px] text-[#3c4a42]">
              Cập nhật ngay các mẹo nấu ăn hữu ích và ưu đãi đặc biệt hàng tuần
              từ trang trại của chúng tôi.
            </p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full md:w-auto gap-3"
          >
            <input
              type="email"
              placeholder="Email của bạn"
              aria-label="Email đăng ký nhận bản tin"
              className="flex-1 md:w-72 bg-white border-none rounded-2xl px-5 py-3 text-[16px] text-[#111c2d] placeholder:text-[#3c4a42]/50 focus:ring-2 focus:ring-[#006c49]/30 outline-none shadow-sm"
            />
            <button
              type="submit"
              className="bg-[#006c49] hover:opacity-90 text-white font-bold px-7 py-3 rounded-2xl hover:shadow-lg transition-all whitespace-nowrap text-[15px]"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </div>

      {/* ── Main footer ── */}
      <div className="bg-[#e7eeff] border-t border-[#bbcabf]/30">
        <div className="max-w-[1280px] mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-start gap-10">

          {/* Brand */}
          <div className="max-w-[280px]">
            <Link href="/" className="block mb-3">
              <span className="text-[24px] font-bold text-[#006c49]">NôngSạch</span>
            </Link>
            <p className="text-[14px] text-[#3c4a42] mb-5 leading-relaxed">
              © 2024 NôngSạch. Tươi ngon từ ruộng đồng đến bàn ăn.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {SOCIAL_ICONS.map(({ icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-8 h-8 rounded-full bg-[#006c49]/10 flex items-center justify-center text-[#006c49] hover:bg-[#006c49] hover:text-white transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">{icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 w-full md:w-auto">
            {NAV_COLUMNS.map((col) => (
              <div key={col.title} className="flex flex-col gap-3">
                <span className="text-[14px] font-bold text-[#111c2d] uppercase tracking-wide">
                  {col.title}
                </span>
                {col.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[13px] text-[#3c4a42] hover:text-[#006c49] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>

        </div>
      </div>

    </footer>
  );
}
