"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Leaf } from "lucide-react";
import Container from "./Container";
import CartBadge from "./CartBadge";

const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/products", label: "Sản phẩm" },
  { href: "/about", label: "Về chúng tôi" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-sm">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="NôngSạch - Trang chủ"
          >
            <span className="flex items-center justify-center w-9 h-9 bg-emerald-600 rounded-xl shadow-md group-hover:bg-emerald-700 transition-colors">
              <Leaf className="w-5 h-5 text-white" />
            </span>
            <span className="text-xl font-bold text-slate-800 tracking-tight">
              Nông<span className="text-emerald-600">Sạch</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Menu chính"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-slate-600 rounded-lg hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Cart badge (isolated client component) */}
            <CartBadge />

            {/* Auth */}
            <Link
              href="/login"
              id="login-button"
              className="hidden md:inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Đăng nhập
            </Link>

            {/* Mobile menu toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Mở menu di động"
              aria-expanded={mobileOpen}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-emerald-50">
            <nav className="flex flex-col gap-1" aria-label="Menu di động">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-600 rounded-lg hover:text-emerald-700 hover:bg-emerald-50 transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="mx-0 mt-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors text-center"
              >
                Đăng nhập
              </Link>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}
