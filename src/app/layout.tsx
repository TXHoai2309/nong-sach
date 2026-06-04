import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import React from "react";

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
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#f9f9ff] text-[#111c2d]">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
