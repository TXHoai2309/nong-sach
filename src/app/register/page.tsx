"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Leaf, ArrowRight, CheckCircle } from "lucide-react";
import Container from "@/components/layout/Container";
import { useAuthStore } from "@/store/auth-store";

export default function RegisterPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { register, currentUser } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);
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

  // Success view
  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Container>
          <div className="max-w-md w-full mx-auto bg-white rounded-3xl border border-slate-100 shadow-xl p-8 sm:p-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-full text-emerald-600 mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 mb-3">
              Đăng ký thành công!
            </h2>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              Tài khoản của bạn đã được đăng ký thành công trên local state. Bây giờ bạn đã có thể đăng nhập để tiếp tục.
            </p>
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 text-sm"
            >
              Đến trang đăng nhập
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const validate = () => {
    const tempErrors: typeof errors = {};
    let isValid = true;
    setFormError("");

    if (!name.trim()) {
      tempErrors.name = "Họ tên không được để trống";
      isValid = false;
    }

    if (!email.trim()) {
      tempErrors.email = "Email không được để trống";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      tempErrors.email = "Định dạng email không hợp lệ";
      isValid = false;
    }

    if (!password) {
      tempErrors.password = "Mật khẩu không được để trống";
      isValid = false;
    } else if (password.length < 6) {
      tempErrors.password = "Mật khẩu phải chứa ít nhất 6 ký tự";
      isValid = false;
    }

    if (password !== confirmPassword) {
      tempErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const res = register(name, email, password);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
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
              Đăng ký tài khoản
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Khám phá thực phẩm tươi sạch mỗi ngày cùng NôngSạch
            </p>
          </div>

          {formError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-xs sm:text-sm text-red-600 font-semibold">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs sm:text-sm font-semibold text-slate-600 block">
                Họ và tên
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4.5 w-4.5 text-slate-400" />
                </span>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50/50 border rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                    errors.name ? "border-red-400 focus:ring-red-500/10 focus:border-red-500" : "border-slate-200"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.name}</p>
              )}
            </div>

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
                  placeholder="example@gmail.com"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50/50 border rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                    errors.email ? "border-red-400 focus:ring-red-500/10 focus:border-red-500" : "border-slate-200"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs sm:text-sm font-semibold text-slate-600 block">
                Mật khẩu (Tối thiểu 6 ký tự)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4.5 w-4.5 text-slate-400" />
                </span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50/50 border rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                    errors.password ? "border-red-400 focus:ring-red-500/10 focus:border-red-500" : "border-slate-200"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-xs sm:text-sm font-semibold text-slate-600 block">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4.5 w-4.5 text-slate-400" />
                </span>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50/50 border rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                    errors.confirmPassword ? "border-red-400 focus:ring-red-500/10 focus:border-red-500" : "border-slate-200"
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/60 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 text-sm mt-2"
            >
              {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Đã có tài khoản?{" "}
            <Link
              href="/login"
              className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
