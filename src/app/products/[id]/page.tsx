import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Package } from "lucide-react";
import Container from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { getProductById, getAllProducts } from "@/lib/products";
import { CATEGORY_LABELS } from "@/types/product";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) {
    return { title: "Không tìm thấy sản phẩm | NôngSạch" };
  }
  return {
    title: `${product.name} | NôngSạch`,
    description: product.description,
  };
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const allProducts = getAllProducts();
  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50">
      <Container className="py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Quay lại danh sách sản phẩm
          </Link>
        </nav>

        {/* Main product section */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Image — dùng next/image trực tiếp, không có onError vì Server Component */}
            <div className="relative h-72 md:h-full min-h-[320px] bg-slate-50">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Info */}
            <div className="flex flex-col p-8 gap-5">
              {/* Category + Stock */}
              <div className="flex items-center justify-between">
                <Badge
                  label={CATEGORY_LABELS[product.category]}
                  variant="green"
                  size="md"
                />
                <span
                  className={`flex items-center gap-1.5 text-sm font-medium ${
                    product.stock > 0 ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  <Package className="w-4 h-4" />
                  {product.stock > 0
                    ? `Còn ${product.stock} trong kho`
                    : "Hết hàng"}
                </span>
              </div>

              {/* Name */}
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 leading-snug">
                {product.name}
              </h1>

              {/* Origin */}
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>
                  Xuất xứ:{" "}
                  <strong className="text-slate-700">{product.origin}</strong>
                </span>
              </div>

              {/* Price */}
              <div className="py-4 border-y border-slate-100">
                <span className="text-3xl font-extrabold text-emerald-700">
                  {formatPrice(product.price)}
                </span>
                <span className="text-slate-400 text-sm ml-1">/đơn vị</span>
              </div>

              {/* Description */}
              <p className="text-slate-600 text-sm leading-relaxed">
                {product.description}
              </p>

              {/* Add to cart — Client Component */}
              <AddToCartButton product={product} />

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { emoji: "🌿", label: "Sạch & an toàn" },
                  { emoji: "🚚", label: "Giao trong ngày" },
                  { emoji: "✅", label: "Đảm bảo chất lượng" },
                ].map((badge) => (
                  <div
                    key={badge.label}
                    className="flex flex-col items-center gap-1 p-3 bg-slate-50 rounded-xl text-center"
                  >
                    <span className="text-xl">{badge.emoji}</span>
                    <span className="text-xs text-slate-500 font-medium leading-tight">
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-12" aria-label="Sản phẩm liên quan">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Sản phẩm cùng danh mục
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  id={`related-${p.id}`}
                  className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                >
                  <div className="relative h-36 bg-slate-50">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {p.name}
                    </p>
                    <p className="text-emerald-700 font-bold text-sm mt-1">
                      {formatPrice(p.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </Container>
    </div>
  );
}
