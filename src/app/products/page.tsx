"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Container from "@/components/layout/Container";
import ProductGrid from "@/components/product/ProductGrid";
import { getAllProducts } from "@/lib/products";
import { Product, ProductCategory, CATEGORY_LABELS } from "@/types/product";

const ALL_CATEGORIES: ProductCategory[] = [
  "vegetables",
  "fruits",
  "grains",
  "roots",
  "herbs",
  "other",
];

type SortOption = "default" | "price-asc" | "price-desc";

const SORT_LABELS: Record<SortOption, string> = {
  default: "Mặc định",
  "price-asc": "Giá tăng dần",
  "price-desc": "Giá giảm dần",
};
export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await getAllProducts();
        if (active) {
          setAllProducts(data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory | "all">("all");
  const [sort, setSort] = useState<SortOption>("default");

  const filtered = useMemo(() => {
    let result = [...allProducts];

    // Tìm kiếm
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.origin.toLowerCase().includes(q)
      );
    }

    // Lọc danh mục
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Sắp xếp
    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
    }

    return result;
  }, [allProducts, search, selectedCategory, sort]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSort("default");
  };

  const hasActiveFilters =
    search !== "" || selectedCategory !== "all" || sort !== "default";

  return (
    <div className="page-surface min-h-screen">
      {/* Page header */}
      <div>
        <Container className="py-8">
          <Breadcrumb
            className="mb-5"
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "Cửa hàng" },
            ]}
          />
          <h1 className="mb-2 text-3xl font-bold tracking-[-0.03em] text-primary sm:text-4xl">
            Nông sản sạch
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-on-surface-variant">
            Khám phá các sản phẩm nông sản sạch, rõ nguồn gốc.
          </p>
        </Container>
      </div>

      <Container className="py-8">
        {/* Filters bar */}
        <div className="page-card reveal-up mb-8 flex flex-col gap-4 rounded-3xl p-4">
          {/* Row 1: Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="product-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tên, nguồn gốc..."
                aria-label="Tìm kiếm sản phẩm"
                className="w-full rounded-2xl border border-outline-variant/40 bg-white/80 py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <select
                id="sort-select"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                aria-label="Sắp xếp sản phẩm"
                className="cursor-pointer rounded-2xl border border-outline-variant/40 bg-white/80 px-3 py-3 text-sm text-on-surface-variant outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
              >
                {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                  <option key={key} value={key}>
                    {SORT_LABELS[key]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Category chips */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="category-all"
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === "all"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white/80 text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              Tất cả
            </button>

            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                id={`category-filter-${cat}`}
                onClick={() =>
                  setSelectedCategory(selectedCategory === cat ? "all" : cat)
                }
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-primary text-white shadow-sm"
                    : "bg-white/80 text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}

            {hasActiveFilters && (
              <button
                id="clear-filters"
                onClick={clearFilters}
                aria-label="Xóa bộ lọc"
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-500 hover:text-red-600 transition-colors ml-auto"
              >
                <X className="w-3.5 h-3.5" />
                Xóa lọc
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={filtered}
          emptyMessage="Chưa có sản phẩm nào."
        />
      </Container>
    </div>
  );
}
