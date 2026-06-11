"use client";

import { useEffect, useState } from "react";
import ProductGrid from "./ProductGrid";
import { useAuthStore } from "@/store/auth-store";
import { useOrderStore } from "@/store/order-store";
import { getAllProducts } from "@/lib/products";
import { Product, ProductCategory } from "@/types";

interface UserRecommendationsProps {
  excludeProductId?: string;
}

export default function UserRecommendations({ excludeProductId }: UserRecommendationsProps) {
  const { currentUser } = useAuthStore();
  const getOrdersByUserId = useOrderStore((state) => state.getOrdersByUserId);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    const userId = currentUser.id;

    async function loadRecommendations() {
      setIsLoading(true);
      try {
        // 1. Fetch all products and user's order history in parallel
        const [allProds, orders] = await Promise.all([
          getAllProducts(false), // only active products
          getOrdersByUserId(userId),
        ]);

        // 2. Count category frequency in order history
        const categoryCounts: Record<string, number> = {};
        const purchasedProductIds = new Set<string>();

        orders.forEach((order) => {
          order.items?.forEach((item) => {
            purchasedProductIds.add(item.productId);
            // Find product in all products to determine its category
            const originalProduct = allProds.find((p) => p.id === item.productId);
            if (originalProduct?.category) {
              const cat = originalProduct.category;
              categoryCounts[cat] = (categoryCounts[cat] || 0) + item.quantity;
            }
          });
        });

        // Sort categories by purchase frequency descending
        const sortedCategories = Object.keys(categoryCounts).sort(
          (a, b) => categoryCounts[b] - categoryCounts[a]
        );

        // 3. Group remaining active products by category
        const productsByCategory: Record<string, Product[]> = {};
        allProds.forEach((p) => {
          if (excludeProductId && p.id === excludeProductId) return;
          if (p.status && p.status !== "active") return;

          if (!productsByCategory[p.category]) {
            productsByCategory[p.category] = [];
          }
          productsByCategory[p.category].push(p);
        });

        const recommended: Product[] = [];

        // - First pass: Active products in purchased categories that the user hasn't bought yet (exploration)
        sortedCategories.forEach((cat) => {
          const catProds = productsByCategory[cat] || [];
          catProds.forEach((p) => {
            if (!purchasedProductIds.has(p.id)) {
              recommended.push(p);
            }
          });
        });

        // - Second pass: Active products in purchased categories that the user HAS bought before (repurchase)
        sortedCategories.forEach((cat) => {
          const catProds = productsByCategory[cat] || [];
          catProds.forEach((p) => {
            if (purchasedProductIds.has(p.id) && !recommended.some((r) => r.id === p.id)) {
              recommended.push(p);
            }
          });
        });

        // - Third pass: All other active products to fill the grid up to at least 8 items
        allProds.forEach((p) => {
          if (excludeProductId && p.id === excludeProductId) return;
          if (p.status && p.status !== "active") return;
          if (!recommended.some((r) => r.id === p.id)) {
            recommended.push(p);
          }
        });

        // Slice to 8 items to fit nicely in 4-column grid
        setRecommendedProducts(recommended.slice(0, 8));
      } catch (error) {
        console.error("Lỗi khi tải gợi ý sản phẩm:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadRecommendations();
  }, [currentUser, getOrdersByUserId, excludeProductId]);

  if (!currentUser) return null;

  if (isLoading) {
    return (
      <section className="site-container rounded-[3rem] bg-emerald-50/40 py-14 border border-emerald-100/30">
        <div className="mb-6 animate-pulse px-6">
          <div className="h-9 w-48 bg-[#bbcabf]/30 rounded-lg mb-2"></div>
          <div className="h-5 w-80 bg-[#bbcabf]/20 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-100">
              <div className="h-48 bg-slate-100 rounded-t-2xl"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (recommendedProducts.length === 0) return null;

  return (
    <section
      aria-label="Gợi ý dành cho bạn"
      className="site-container rounded-[3rem] bg-gradient-to-br from-emerald-50/30 to-teal-50/20 py-14 border border-emerald-100/40 mt-10"
    >
      <div className="px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
          <div>
            <h2 className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-[#006c49] mb-2">
              Dành cho bạn
            </h2>
            <p className="text-[#3c4a42]/80 text-[16px] leading-[24px]">
              Gợi ý cá nhân hóa dựa trên lịch sử mua sắm nông sản của bạn
            </p>
          </div>
        </div>

        <ProductGrid products={recommendedProducts} />
      </div>
    </section>
  );
}
