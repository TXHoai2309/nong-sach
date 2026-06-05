"use client";

import { useState } from "react";
import { runSeed } from "@/lib/seed";
import { CheckCircle2, AlertCircle, Database, ArrowRight, Home } from "lucide-react";
import Link from "next/link";

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleRunSeed = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await runSeed();
      setResult(res);
    } catch (err: any) {
      setResult({
        success: false,
        message: err?.message || "Lỗi không xác định khi chạy seed.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 page-surface">
      <div className="max-w-md w-full bg-white rounded-3xl border border-outline-variant/30 p-8 shadow-xl space-y-6 text-center page-card">
        {/* Icon Header */}
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-sm">
          <Database className="w-8 h-8" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-on-surface">Khởi tạo Dữ liệu Firestore</h1>
          <p className="text-xs font-semibold text-on-surface-variant leading-relaxed">
            Hệ thống sẽ đồng bộ toàn bộ sản phẩm và cửa hàng mặc định của NôngSạch lên Cloud Firestore.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleRunSeed}
            disabled={loading}
            className="w-full py-3 px-6 bg-primary text-white rounded-xl font-bold hover:bg-primary-container hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer border-none"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Đang khởi tạo...</span>
              </>
            ) : (
              <>
                <span>Chạy Seed Dữ Liệu</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Results Message */}
        {result && (
          <div
            className={[
              "p-4 rounded-2xl border text-sm font-semibold flex items-start gap-3 text-left transition-all animate-in fade-in slide-in-from-bottom-2 duration-300",
              result.success
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800",
            ].join(" ")}
          >
            {result.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-bold">{result.success ? "Hoàn thành" : "Thất bại"}</h4>
              <p className="text-xs mt-0.5 opacity-90 leading-relaxed">{result.message}</p>
            </div>
          </div>
        )}

        {/* Navigation Link */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
