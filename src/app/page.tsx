import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ProductGrid from "@/components/product/ProductGrid";
import { getAllProducts } from "@/lib/products";
import { CATEGORY_LABELS, ProductCategory } from "@/types/product";

export const metadata: Metadata = {
  title: "NôngSạch — Tươi ngon từ ruộng đồng",
  description:
    "Mang giá trị nông sản thuần khiết và an toàn tuyệt đối từ đôi bàn tay người nông dân Việt đến tận bếp gia đình bạn.",
};

// ── Feature strip data ─────────────────────────────────────────────────────────
const features = [
  {
    icon: "eco",
    title: "100% Sạch & An toàn",
    description: "Quy trình canh tác hữu cơ chuẩn quốc tế.",
  },
  {
    icon: "verified_user",
    title: "Kiểm định chất lượng",
    description: "Mỗi sản phẩm đều có mã truy xuất nguồn gốc.",
  },
  {
    icon: "local_shipping",
    title: "Giao hàng nhanh",
    description: "Sản phẩm đến tay khách hàng trong 2–4h.",
  },
  {
    icon: "star",
    title: "Nông dân uy tín",
    description: "Hợp tác trực tiếp với các HTX địa phương.",
  },
];

// ── Category data ──────────────────────────────────────────────────────────────
const categories: { key: ProductCategory; emoji: string }[] = [
  { key: "vegetables", emoji: "🥬" },
  { key: "fruits",     emoji: "🍊" },
  { key: "grains",     emoji: "🌾" },
  { key: "roots",      emoji: "🥕" },
  { key: "herbs",      emoji: "🌿" },
  { key: "other",      emoji: "🛒" },
];

// ── Page ───────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const featuredProducts = getAllProducts().slice(0, 8);

  return (
    <main>
      {/* ── Hero Section ── */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        {/* Background image with hero-gradient overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuKdJ5TAaBCrjgqV7YJBdGgprSy0oNFoWBRsg8N-TdLyQcaMRBu6WhaFllKKMnZ2BJxZmEfWao-o8NnwPao0ov_h0-SLcEu0VBVokGNojqfA7EpegCv3uV-rHpvbBeBSC1-JwBcWa1kOmKPfqdRCRp_lH3-Dz-BCvYlWqN81ASROnT7S6J985z4L0EYT-xEvGs-H_P5uMEsNB1q09K7tvax_Vxv31FAULGttJ-A1sLxZnkevKq5eUsbeReqXsEGxl2FTC2y6-vMA"
            alt="Cánh đồng nông sản hữu cơ xanh tươi lúc bình minh"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 hero-gradient" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 w-full py-16 text-white">
          <div className="max-w-2xl">
            <h1 className="text-[48px] leading-[56px] tracking-[-0.02em] font-bold mb-6 leading-tight">
              Tươi ngon từ ruộng đồng đến bàn ăn
            </h1>
            <p className="text-[18px] leading-[28px] mb-6 opacity-90">
              Mang giá trị nông sản thuần khiết và an toàn tuyệt đối từ đôi bàn
              tay người nông dân Việt đến tận bếp gia đình bạn.
            </p>

            <div className="flex flex-wrap gap-6 mb-8">
              <Link
                href="/products"
                id="hero-shop-now"
                className="bg-white text-[#006c49] px-8 py-3.5 rounded-2xl font-bold hover:bg-[#e7eeff] transition-all active:opacity-80"
              >
                Mua ngay
              </Link>
              <Link
                href="/about"
                className="border-2 border-white/50 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-white/10 transition-all"
              >
                Tìm hiểu thêm
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-16 border-t border-white/20 pt-10">
              {[
                { value: "500+", label: "Nông dân" },
                { value: "20+",  label: "Sản phẩm" },
                { value: "10K+", label: "Khách hàng" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-[30px] leading-[38px] font-bold">{stat.value}</p>
                  <p className="text-[14px] leading-[20px] opacity-80 uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Strip ── */}
      <section
        aria-label="Cam kết chất lượng"
        className="max-w-[1280px] mx-auto px-6 -mt-16 relative z-20"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white p-10 rounded-2xl shadow-lg flex flex-col items-center text-center bento-hover transition-all duration-300"
            >
              <div className="w-12 h-12 bg-[#10b981]/20 text-[#006c49] rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-3xl">{f.icon}</span>
              </div>
              <h3 className="text-[24px] leading-[32px] font-semibold text-[#006c49] mb-2">
                {f.title}
              </h3>
              <p className="text-[#3c4a42]">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Category Grid ── */}
      <section
        aria-label="Danh mục sản phẩm"
        className="max-w-[1280px] mx-auto px-6 py-16"
      >
        <h2 className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-[#111c2d] mb-8 text-center">
          Danh mục nổi bật
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={`/products?category=${cat.key}`}
              id={`category-${cat.key}`}
              className="group relative overflow-hidden bg-[#f0f3ff] rounded-2xl p-10 flex flex-col items-center justify-center border border-[#bbcabf]/30 hover:border-[#006c49]/50 transition-all aspect-square text-center"
            >
              <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity bg-[url('https://www.transparenttextures.com/patterns/leaves.png')]" />
              <span className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-200 relative z-10">
                {cat.emoji}
              </span>
              <span className="text-sm font-semibold text-[#111c2d] relative z-10">
                {CATEGORY_LABELS[cat.key]}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products Grid ── */}
      <section
        aria-label="Sản phẩm nổi bật"
        className="max-w-[1280px] mx-auto px-6 py-16 bg-white rounded-[3rem]"
      >
        <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-6">
          <div>
            <h2 className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-[#111c2d] mb-2">
              Sản phẩm nổi bật
            </h2>
            <p className="text-[#3c4a42] text-[18px] leading-[28px]">
              Những mặt hàng tươi ngon nhất vừa được thu hoạch
            </p>
          </div>
          <Link
            href="/products"
            id="view-all-products"
            className="text-[#006c49] font-bold flex items-center gap-2 hover:gap-3 transition-all"
          >
            Xem tất cả{" "}
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>

        <ProductGrid products={featuredProducts} />
      </section>

      {/* ── CTA Banner ── */}
      <section
        aria-label="Call to action"
        className="max-w-[1280px] mx-auto px-6 py-16"
      >
        <div className="relative bg-[#10b981] rounded-[2rem] overflow-hidden p-16 flex flex-col md:flex-row items-center justify-between gap-16">
          {/* Texture overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-20 pointer-events-none" />

          {/* Text */}
          <div className="relative z-10 max-w-[36rem]">
            <h2 className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-[#00422b] mb-6">
              Sản phẩm tươi sạch nhất trong ngày
            </h2>
            <p className="text-[18px] leading-[28px] text-[#00422b]/80 mb-8">
              Tham gia chương trình khách hàng thân thiết để nhận ưu đãi lên
              đến 20% mỗi tuần và miễn phí giao hàng cho đơn đầu tiên.
            </p>
            <Link
              href="/products"
              id="cta-browse"
              className="inline-flex items-center gap-2 bg-[#00422b] text-white px-8 py-3 rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg active:opacity-80"
            >
              Khám phá ngay
            </Link>
          </div>

          {/* Decorative image */}
          <div className="relative z-10 hidden lg:block">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuABHtn6jLnZcxCGXI9tieZw4x7dHwFSxWTxAogH6qjiC7esMkBp6YNiqQXAmQVLZo4bUTv-aLRPP94B5Y1rowUS_O-SrP1UvD2yxP8AKllTBUpyMinw51NVLigiZM5vzKRePu5e8yrf_cZ3p9GKMQN2vzHGcd66FNuaThqLyuxuxvEMFg8DWd___sAhBXqC8dtGKc_Tx4MTi2fWkqnrM7bdAhuGHdOo-z6NYcpuJlKzq4zaPuXVkKdcWAL7s_cmjjjcBiJz385R8A"
              alt="Rổ rau củ hữu cơ đa dạng màu sắc trên cánh đồng"
              width={320}
              height={320}
              className="w-80 h-80 object-cover rounded-3xl shadow-2xl rotate-3"
              unoptimized
            />
          </div>
        </div>
      </section>
    </main>
  );
}
