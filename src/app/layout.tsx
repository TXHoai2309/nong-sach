import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NôngSạch — Nông sản sạch tươi ngon mỗi ngày",
    template: "%s | NôngSạch",
  },
  description:
    "Mua nông sản sạch trực tiếp từ nông dân Việt Nam. Rau củ quả hữu cơ, tươi ngon, an toàn, giao hàng tận nơi.",
  keywords: [
    "nông sản sạch",
    "rau hữu cơ",
    "thực phẩm sạch",
    "rau củ Đà Lạt",
    "mua rau online",
  ],
  openGraph: {
    title: "NôngSạch — Nông sản sạch tươi ngon mỗi ngày",
    description:
      "Mua nông sản sạch trực tiếp từ nông dân Việt Nam. Tươi ngon — An toàn — Tin cậy.",
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
