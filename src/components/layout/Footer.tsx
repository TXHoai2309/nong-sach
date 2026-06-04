"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className="bg-surface-container">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start justify-between gap-16 border-t border-outline-variant/30 px-6 py-16 md:flex-row">
        <div className="w-full space-y-6 md:w-[300px] md:flex-none">
          <Link href="/" className="block text-2xl font-bold leading-8 text-primary">
            NôngSạch
          </Link>
          <p className="text-base leading-6 text-on-surface-variant">
            © 2024 NôngSạch. Tươi ngon từ ruộng đồng đến bàn ăn.
          </p>
          <div className="flex gap-4">
            {["face_nod", "photo_camera", "smart_display"].map((icon) => (
              <Link
                key={icon}
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-white"
              >
                <span className="material-symbols-outlined text-[18px]">{icon}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="grid w-full grid-cols-2 gap-16 md:w-auto md:grid-cols-3">
          {NAV_COLUMNS.map((col) => (
            <div key={col.title} className="space-y-4">
              <p className="text-sm font-bold leading-5 text-on-surface">{col.title}</p>
              <div className="flex flex-col gap-4">
                {col.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={[
                      "text-xs font-semibold leading-4 transition-colors hover:text-primary",
                      pathname === link.href ? "text-primary underline" : "text-on-surface-variant",
                    ].join(" ")}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
