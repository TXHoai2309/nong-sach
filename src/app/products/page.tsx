"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import Container from "@/components/layout/Container";
import ProductGrid from "@/components/product/ProductGrid";
import { getAllProducts } from "@/lib/products";
import { ProductCategory, CATEGORY_LABELS } from "@/types/product";

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

const allProducts = getAllProducts();

export default function ProductsPage() {
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
  }, [search, selectedCategory, sort]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSort("default");
  };

  const hasActiveFilters =
    search !== "" || selectedCategory !== "all" || sort !== "default";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-white border-b border-slate-100">
        <Container className="py-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-1">
            Tất cả sản phẩm
          </h1>
          <p className="text-slate-500 text-sm">
            {filtered.length} sản phẩm tươi sạch, an toàn
          </p>
        </Container>
      </div>

      <Container className="py-8">
        {/* Filters bar */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-8 flex flex-col gap-4">
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
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all bg-slate-50"
              />
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <select
                id="sort-select"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                aria-label="Sắp xếp sản phẩm"
                className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-emerald-400 bg-slate-50 cursor-pointer"
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
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
          emptyMessage="Không tìm thấy sản phẩm phù hợp. Thử thay đổi bộ lọc nhé!"
        />
      </Container>
    </div>
  );
}
