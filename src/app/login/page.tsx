"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, Leaf, ArrowRight, Eye, EyeOff } from "lucide-react";
import Container from "@/components/layout/Container";
import { useAuthStore } from "@/store/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { login, currentUser } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (currentUser) {
      router.push("/products");
    }
  }, [currentUser, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500 font-medium">Đang tải...</div>
      </div>
    );
  }

  const validate = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");
    setFormError("");

    if (!email.trim()) {
      setEmailError("Email không được để trống");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Định dạng email không hợp lệ");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Mật khẩu không được để trống");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    // Simulate brief network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const res = login(email, password);
    setLoading(false);

    if (res.success) {
      router.push("/products");
    } else {
      setFormError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Container>
        <div className="max-w-md w-full mx-auto bg-white rounded-3xl border border-slate-100 shadow-xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-50 rounded-2xl text-emerald-600 mb-4 shadow-inner">
              <Leaf className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
              Chào mừng trở lại!
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Đăng nhập tài khoản NôngSạch của bạn
            </p>
          </div>

          {formError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-xs sm:text-sm text-red-600 font-semibold">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs sm:text-sm font-semibold text-slate-600 block">
                Địa chỉ Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4.5 w-4.5 text-slate-400" />
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nongsach.vn"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50/50 border rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                    emailError ? "border-red-400 focus:ring-red-500/10 focus:border-red-500" : "border-slate-200"
                  }`}
                />
              </div>
              {emailError && (
                <p className="text-xs text-red-500 mt-1 font-medium">{emailError}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs sm:text-sm font-semibold text-slate-600 block">
                Mật khẩu
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4.5 w-4.5 text-slate-400" />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-3 bg-slate-50/50 border rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                    passwordError ? "border-red-400 focus:ring-red-500/10 focus:border-red-500" : "border-slate-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
              {passwordError && (
                <p className="text-xs text-red-500 mt-1 font-medium">{passwordError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/60 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 text-sm"
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Test Accounts Info */}
          <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500 leading-relaxed">
            <p className="font-semibold text-slate-600 mb-1">Tài khoản demo:</p>
            <p>Email: <strong className="text-slate-700">admin@nongsach.vn</strong></p>
            <p>Mật khẩu: <strong className="text-slate-700">12345678</strong></p>
          </div>

          <div className="mt-8 text-center text-sm text-slate-500">
            Chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
