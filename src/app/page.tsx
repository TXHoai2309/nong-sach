import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Leaf, Star } from "lucide-react";
import Container from "@/components/layout/Container";
import ProductGrid from "@/components/product/ProductGrid";
import { getAllProducts } from "@/lib/products";
import { CATEGORY_LABELS, ProductCategory } from "@/types/product";

export const metadata: Metadata = {
  title: "NôngSạch — Nông sản sạch tươi ngon mỗi ngày",
  description:
    "Khám phá hàng trăm nông sản sạch, hữu cơ từ khắp Việt Nam. Tươi ngon, an toàn, giao hàng tận nơi.",
};

const features = [
  {
    icon: Leaf,
    title: "100% Sạch & An toàn",
    description: "Trồng theo tiêu chuẩn VietGAP, không thuốc trừ sâu",
    color: "text-emerald-600 bg-emerald-100",
  },
  {
    icon: ShieldCheck,
    title: "Kiểm định chất lượng",
    description: "Mỗi lô hàng đều được kiểm tra trước khi giao",
    color: "text-blue-600 bg-blue-100",
  },
  {
    icon: Truck,
    title: "Giao hàng nhanh",
    description: "Giao tận nơi trong ngày, đảm bảo độ tươi",
    color: "text-orange-600 bg-orange-100",
  },
  {
    icon: Star,
    title: "Nông dân uy tín",
    description: "Kết nối trực tiếp hàng trăm nông dân đã được xét duyệt",
    color: "text-purple-600 bg-purple-100",
  },
];

const categories: { key: ProductCategory; emoji: string; color: string }[] = [
  { key: "vegetables", emoji: "🥬", color: "from-emerald-400 to-green-500" },
  { key: "fruits", emoji: "🍊", color: "from-orange-400 to-red-400" },
  { key: "grains", emoji: "🌾", color: "from-lime-400 to-green-500" },
  { key: "roots", emoji: "🥕", color: "from-yellow-400 to-amber-500" },
  { key: "herbs", emoji: "🌿", color: "from-teal-400 to-emerald-500" },
  { key: "other", emoji: "🛒", color: "from-slate-400 to-slate-500" },
];

export default function HomePage() {
  const allProducts = getAllProducts();
  // Lấy 8 sản phẩm đầu làm featured
  const featuredProducts = allProducts.slice(0, 8);

  return (
    <>
      {/* ── Hero Section ── */}
      <section
        aria-label="Hero"
        className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 text-white"
      >
        <div
          aria-hidden
          className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/10 rounded-full blur-2xl"
        />

        <Container className="relative py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
              Nông sản sạch từ vùng cao Việt Nam
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
              Tươi ngon từ
              <span className="block text-emerald-200">ruộng đồng đến</span>
              bàn ăn của bạn
            </h1>

            <p className="text-emerald-100 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
              Kết nối trực tiếp nông dân và người tiêu dùng. Cam kết{" "}
              <strong className="text-white">sạch — tươi — an toàn</strong>,
              không qua trung gian.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                href="/products"
                id="hero-shop-now"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-emerald-700 font-bold rounded-2xl hover:bg-emerald-50 hover:shadow-lg transition-all duration-200 text-base"
              >
                Mua ngay hôm nay
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-emerald-100 hover:text-white font-medium transition-colors text-sm"
              >
                Tìm hiểu thêm <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex items-center gap-8 mt-14 pt-8 border-t border-white/20">
              {[
                { value: "500+", label: "Nông dân" },
                { value: `${allProducts.length}+`, label: "Sản phẩm" },
                { value: "10K+", label: "Khách hàng" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-extrabold text-white">
                    {stat.value}
                  </p>
                  <p className="text-emerald-200 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Features ── */}
      <section aria-label="Cam kết chất lượng" className="py-16 bg-white">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex flex-col items-start gap-3 p-6 rounded-2xl border border-slate-100 hover:border-emerald-100 hover:shadow-md transition-all duration-200 group"
              >
                <span
                  className={`flex items-center justify-center w-12 h-12 rounded-xl ${f.color} group-hover:scale-110 transition-transform duration-200`}
                >
                  <f.icon className="w-6 h-6" />
                </span>
                <h3 className="font-semibold text-slate-800 text-sm">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Categories ── */}
      <section aria-label="Danh mục sản phẩm" className="py-14 bg-slate-50">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-800">
              Danh mục sản phẩm
            </h2>
            <Link
              href="/products"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
            >
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.key}
                href={`/products?category=${cat.key}`}
                id={`category-${cat.key}`}
                className={`flex flex-col items-center justify-center gap-2 p-5 bg-gradient-to-br ${cat.color} rounded-2xl text-white hover:opacity-90 hover:scale-105 hover:shadow-lg transition-all duration-200 group`}
              >
                <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                  {cat.emoji}
                </span>
                <span className="text-xs font-semibold text-center leading-tight">
                  {CATEGORY_LABELS[cat.key]}
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Featured Products ── */}
      <section aria-label="Sản phẩm nổi bật" className="py-14 bg-white">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Sản phẩm nổi bật
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Được lựa chọn và yêu thích nhất
              </p>
            </div>
            <Link
              href="/products"
              id="view-all-products"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <ProductGrid products={featuredProducts} />
        </Container>
      </section>

      {/* ── CTA Banner ── */}
      <section
        aria-label="Call to action"
        className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
      >
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold mb-4">
              Bắt đầu ăn sạch ngay hôm nay!
            </h2>
            <p className="text-emerald-100 text-base mb-8">
              Đặt hàng online — giao tận nơi — tươi ngon đảm bảo.
            </p>
            <Link
              href="/products"
              id="cta-browse"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-700 font-bold rounded-2xl hover:bg-emerald-50 hover:shadow-lg transition-all duration-200 text-base"
            >
              Xem tất cả sản phẩm <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
