"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Container from "@/components/layout/Container";
import ProductDetail from "@/components/product/ProductDetail";
import { getAllProducts, getProductById } from "@/lib/products";
import { useAuthStore } from "@/store/auth-store";

import { Product } from "@/types/product";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [mounted, setMounted] = useState(false);
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUser = useAuthStore((s) => s.currentUser);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    let active = true;
    async function loadData() {
      try {
        const p = await getProductById(id);
        if (!active) return;

        if (p && (p.status === "pending" || p.status === "rejected")) {
          const isSeller = currentUser && currentUser.id === p.sellerId;
          const isAdmin = currentUser && currentUser.role === "admin";
          if (!isSeller && !isAdmin) {
            setProduct(undefined);
          } else {
            setProduct(p);
          }
        } else {
          setProduct(p);
        }

        const all = await getAllProducts();
        const related = all.filter((item) => item.id !== id).slice(0, 4);
        if (!active) return;
        setRelatedProducts(related);
      } catch (err) {
        console.error(err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    loadData();
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [id, currentUser]);

  if (!mounted || loading) {
    return (
      <div className="page-surface min-h-screen py-12 flex items-center justify-center">
        <p className="text-xs font-bold text-[#3c4a42]/60 animate-pulse">Đang tải chi tiết sản phẩm...</p>
      </div>
    );
  }

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
