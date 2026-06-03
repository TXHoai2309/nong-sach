import Link from "next/link";
import { Leaf, Phone, Mail, MapPin } from "lucide-react";
import Container from "./Container";

const productLinks = [
  { href: "/products?category=vegetables", label: "Rau củ" },
  { href: "/products?category=fruits", label: "Trái cây" },
  { href: "/products?category=herbs", label: "Rau thơm" },
  { href: "/products?category=mushrooms", label: "Nấm" },
];

const infoLinks = [
  { href: "/about", label: "Về chúng tôi" },
  { href: "/blog", label: "Tin tức & Blog" },
  { href: "/faq", label: "Câu hỏi thường gặp" },
  { href: "/contact", label: "Liên hệ" },
];

// SVG icons for social media (inline to avoid lucide-react version issues)
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" strokeWidth="0" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center w-9 h-9 bg-emerald-600 rounded-xl">
                <Leaf className="w-5 h-5 text-white" />
              </span>
              <span className="text-xl font-bold text-white">
                Nông<span className="text-emerald-400">Sạch</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Nền tảng giao dịch nông sản sạch, kết nối trực tiếp nông dân với
              người tiêu dùng. Tươi ngon — An toàn — Tin cậy.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook NôngSạch"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-emerald-600 transition-colors"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram NôngSạch"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-emerald-600 transition-colors"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-4">Danh mục sản phẩm</h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Thông tin</h3>
            <ul className="space-y-2">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" />
                123 Đường Nông Nghiệp, Quận 12, TP.HCM
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+84901234567" className="hover:text-emerald-400 transition-colors">
                  0901 234 567
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:hello@nongsach.vn" className="hover:text-emerald-400 transition-colors">
                  hello@nongsach.vn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} NôngSạch. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Chính sách bảo mật
            </Link>
            <Link href="/terms" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Điều khoản sử dụng
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
