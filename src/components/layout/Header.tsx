"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import CartBadge from "./CartBadge";
import { useAuthStore } from "@/store/auth-store";

const navLinks = [
  { href: "/products", label: "Sản phẩm" },
  { href: "/about",    label: "Về chúng tôi" },
  { href: "/",         label: "Cửa hàng" },
  { href: "/contact",  label: "Liên hệ" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted]         = useState(false);
  const pathname                       = usePathname();
  const router                         = useRouter();
  const searchRef                      = useRef<HTMLInputElement>(null);
  const { currentUser, logout }        = useAuthStore();

  useEffect(() => { setMounted(true); }, []);

  // Focus search input when opened
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

  return (
    <header className="sticky top-0 z-50 bg-[#f9f9ff]/80 backdrop-blur-md shadow-sm">
      <nav className="flex justify-between items-center px-6 py-4 max-w-[1280px] mx-auto w-full">

        {/* ── Left: logo + desktop nav ── */}
        <div className="flex items-center gap-16">
          {/* Logo */}
          <Link
            href="/"
            aria-label="NôngSạch - Trang chủ"
            className="text-[30px] leading-[38px] font-bold text-[#006c49]"
          >
            NôngSạch
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href && link.href !== "/";
              return (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className={[
                    "text-[14px] leading-[20px] font-medium transition-colors",
                    isActive
                      ? "text-[#006c49] border-b-2 border-[#006c49] pb-1 font-bold"
                      : "text-[#3c4a42] hover:text-[#006c49]",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Right: search + cart + account ── */}
        <div className="flex items-center gap-6">
          {/* Search bar (desktop) */}
          <div className="relative hidden sm:block">
            <form onSubmit={handleSearch}>
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm..."
                className="bg-[#e7eeff] border-none rounded-full py-2 px-10 pl-10 focus:ring-2 focus:ring-[#006c49] text-[16px] w-64 transition-all outline-none"
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#3c4a42] text-xl pointer-events-none select-none">
                search
              </span>
            </form>
          </div>

          {/* Cart */}
          <CartBadge />

          {/* Account / Auth */}
          {mounted && currentUser ? (
            <>
              {/* Desktop: show name + logout */}
              <div className="hidden md:flex items-center gap-3">
                <button
                  className="flex items-center gap-2 text-[#3c4a42] hover:bg-[#10b981]/10 px-2 py-2 rounded-full transition-all"
                >
                  <span className="material-symbols-outlined text-[24px]">account_circle</span>
                  <span className="hidden lg:inline text-[14px] leading-[20px]">
                    {currentUser.name}
                  </span>
                </button>
                <button
                  onClick={logout}
                  className="text-[12px] font-semibold border border-[#bbcabf] text-[#3c4a42] px-3 py-1.5 rounded-full hover:bg-[#f0f3ff] transition-all cursor-pointer"
                >
                  Đăng xuất
                </button>
              </div>
              {/* Mobile: icon only */}
              <button className="md:hidden flex items-center gap-2 text-[#3c4a42] hover:bg-[#10b981]/10 px-2 py-2 rounded-full transition-all">
                <span className="material-symbols-outlined text-[24px]">account_circle</span>
              </button>
            </>
          ) : (
            <>
              {/* Desktop: icon + Tài khoản text */}
              <Link
                href="/login"
                id="login-button"
                className="hidden md:flex items-center gap-2 text-[#3c4a42] hover:bg-[#10b981]/10 px-2 py-2 rounded-full transition-all"
              >
                <span className="material-symbols-outlined text-[24px]">account_circle</span>
                <span className="hidden lg:inline text-[14px] leading-[20px]">Tài khoản</span>
              </Link>
              {/* Mobile: icon only */}
              <Link
                href="/login"
                className="md:hidden flex items-center gap-2 text-[#3c4a42] hover:bg-[#10b981]/10 px-2 py-2 rounded-full transition-all"
              >
                <span className="material-symbols-outlined text-[24px]">account_circle</span>
              </Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Mở menu di động"
            aria-expanded={mobileOpen}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full text-[#3c4a42] hover:bg-[#10b981]/10 transition-colors"
          >
            <span className="material-symbols-outlined">
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </nav>

      {/* ── Mobile nav dropdown ── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#bbcabf]/30 bg-[#f9f9ff]">
          {/* Mobile search */}
          <div className="px-6 py-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full bg-[#e7eeff] border-none rounded-full py-2 px-10 pl-10 text-[16px] focus:ring-2 focus:ring-[#006c49] outline-none"
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#3c4a42] text-xl pointer-events-none select-none">
                search
              </span>
            </form>
          </div>

          {/* Mobile links */}
          <nav className="flex flex-col px-6 pb-4 gap-1" aria-label="Menu di động">
            {navLinks.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 text-[14px] font-medium text-[#3c4a42] hover:text-[#006c49] border-b border-[#bbcabf]/20 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {mounted && currentUser ? (
              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                className="mt-3 w-full py-2.5 bg-[#f0f3ff] text-[#3c4a42] text-[14px] font-semibold rounded-2xl hover:bg-[#e7eeff] transition-colors text-center cursor-pointer"
              >
                Đăng xuất ({currentUser.name})
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-3 py-2.5 bg-[#006c49] text-white text-[14px] font-bold rounded-2xl hover:opacity-90 transition-all text-center"
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
