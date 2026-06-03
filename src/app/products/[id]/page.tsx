import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Container from "@/components/layout/Container";
import ProductDetail from "@/components/product/ProductDetail";
import { getProductById } from "@/lib/products";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
        <Container className="max-w-md">
          <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Không tìm thấy sản phẩm.
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ bỏ khỏi cửa hàng.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại danh sách</span>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <Container>
        <ProductDetail product={product} />
      </Container>
    </div>
  );
}
