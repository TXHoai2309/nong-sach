"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import CartBadge from "./CartBadge";
import { useAuthStore } from "@/store/auth-store";

const navLinks = [
  { href: "/about", label: "Về chúng tôi" },
  { href: "/products", label: "Cửa hàng" },
  { href: "/contact", label: "Liên hệ" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const { currentUser, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  }

  function isActiveLink(href: string) {
    if (href === "/products") {
      return pathname === "/products" || pathname.startsWith("/products/");
    }
    return pathname === href;
  }

  return (
    <header className="sticky top-0 z-50 bg-[#f9f9ff]/85 shadow-sm backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-[1120px] items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6 lg:gap-12">
          <Link href="/" aria-label="NôngSạch - Trang chủ" className="text-[28px] font-bold leading-9 text-[#006c49] shrink-0 whitespace-nowrap">
            NôngSạch
          </Link>

          <div className="hidden items-center gap-4 lg:gap-7 md:flex shrink-0">
            {navLinks.map((link) => {
              const isActive = isActiveLink(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "text-[14px] font-medium leading-5 transition-colors whitespace-nowrap shrink-0",
                    isActive
                      ? "border-b-2 border-[#006c49] pb-1 font-bold text-[#006c49]"
                      : "text-[#3c4a42] hover:text-[#006c49]",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 lg:gap-5">
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-40 rounded-full border-none bg-[#e7eeff] py-2 pl-10 pr-4 text-[15px] outline-none transition-all focus:ring-2 focus:ring-[#006c49] md:w-52 lg:w-72"
            />
            <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 select-none text-xl text-[#3c4a42]">
              search
            </span>
          </form>

          <CartBadge />

          {mounted && currentUser ? (
            <div className="hidden items-center gap-3 md:flex shrink-0">
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-full px-2 py-2 text-[#3c4a42] transition-all hover:bg-[#10b981]/10 shrink-0 whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[24px]">account_circle</span>
                <span className="hidden text-[14px] leading-5 lg:inline whitespace-nowrap">{currentUser.name}</span>
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              id="login-button"
              className="hidden items-center gap-2 rounded-full px-2 py-2 text-[#3c4a42] transition-all hover:bg-[#10b981]/10 md:flex whitespace-nowrap shrink-0"
            >
              <span className="material-symbols-outlined text-[24px]">account_circle</span>
              <span className="hidden text-[14px] leading-5 lg:inline whitespace-nowrap">Tài khoản</span>
            </Link>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Mở menu di động"
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#3c4a42] transition-colors hover:bg-[#10b981]/10 md:hidden"
          >
            <span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-[#bbcabf]/30 bg-[#f9f9ff] md:hidden">
          <div className="px-6 py-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full rounded-full border-none bg-[#e7eeff] py-2 pl-10 pr-4 text-[16px] outline-none focus:ring-2 focus:ring-[#006c49]"
              />
              <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 select-none text-xl text-[#3c4a42]">
                search
              </span>
            </form>
          </div>

          <nav className="flex flex-col gap-1 px-6 pb-4" aria-label="Menu di động">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="border-b border-[#bbcabf]/20 py-3 text-[14px] font-medium text-[#3c4a42] transition-colors hover:text-[#006c49]"
              >
                {link.label}
              </Link>
            ))}

            {mounted && currentUser ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="mt-3 w-full rounded-2xl bg-[#006c49] py-2.5 text-center text-[14px] font-bold text-white transition-all hover:opacity-90"
                >
                  Trang cá nhân ({currentUser.name})
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="mt-2 w-full cursor-pointer rounded-2xl bg-[#f0f3ff] py-2.5 text-center text-[14px] font-semibold text-[#3c4a42] transition-colors hover:bg-[#e7eeff]"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-3 rounded-2xl bg-[#006c49] py-2.5 text-center text-[14px] font-bold text-white transition-all hover:opacity-90"
              >
                Đăng nhập
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
