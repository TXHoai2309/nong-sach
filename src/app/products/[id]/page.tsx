import Link from "next/link";
import { AlertCircle } from "lucide-react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Container from "@/components/layout/Container";
import ProductDetail from "@/components/product/ProductDetail";
import { getAllProducts, getProductById } from "@/lib/products";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = getProductById(id);
  const relatedProducts = getAllProducts()
    .filter((item) => item.id !== id)
    .slice(0, 4);

  if (!product) {
    return (
      <div className="page-surface min-h-screen py-12">
        <Container className="max-w-[448px]">
          <Breadcrumb
            className="mb-8"
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "Cửa hàng", href: "/products" },
              { label: "Không tìm thấy" },
            ]}
          />
          <div className="flex flex-col items-center rounded-2xl border border-outline-variant/20 bg-white p-8 text-center shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-on-surface">Không tìm thấy sản phẩm.</h2>
            <p className="mb-6 text-sm text-on-surface-variant">
              Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ khỏi cửa hàng.
            </p>
            <Link
              href="/products"
              className="inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-container"
            >
              Quay lại danh sách
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-surface min-h-screen">
      <ProductDetail product={product} relatedProducts={relatedProducts} />
    </div>
  );
}
