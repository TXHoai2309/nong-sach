"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { useAuthStore } from "@/store/auth-store";

// ── Validation ─────────────────────────────────────────────────────────────────
interface FormErrors {
  name?:            string;
  email?:           string;
  phone?:           string;
  password?:        string;
  confirmPassword?: string;
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const router   = useRouter();
  const register = useAuthStore((s) => s.register);

  const [name,            setName]            = useState("");
  const [email,           setEmail]           = useState("");
  const [phone,           setPhone]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword,    setShowPassword]    = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [errors,          setErrors]          = useState<FormErrors>({});
  const [formError,       setFormError]       = useState("");
  const [loading,         setLoading]         = useState(false);
  const [success,         setSuccess]         = useState(false);

  // ── Validate ────────────────────────────────────────────────────────────────
  function validate(): boolean {
    const errs: FormErrors = {};
    let ok = true;

    if (!name.trim() || name.trim().length < 2) {
      errs.name = "Họ và tên phải có ít nhất 2 ký tự.";
      ok = false;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Định dạng email không hợp lệ.";
      ok = false;
    }

    if (phone.trim() && !/^(0|\+84)[0-9]{8,10}$/.test(phone.trim().replace(/\s/g, ""))) {
      errs.phone = "Số điện thoại không hợp lệ.";
      ok = false;
    }

    if (!password || password.length < 6) {
      errs.password = "Mật khẩu phải có ít nhất 6 ký tự.";
      ok = false;
    }

    if (!confirmPassword || password !== confirmPassword) {
      errs.confirmPassword = "Mật khẩu xác nhận không khớp.";
      ok = false;
    }

    setErrors(errs);
    return ok;
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!validate()) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    const res = register(name.trim(), email.trim(), password);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } else {
      setFormError(res.message);
    }
  }

  // ── Field class helpers ─────────────────────────────────────────────────────
  const inputBase =
    "w-full rounded-2xl border bg-white px-4 py-3 text-[16px] text-[#111c2d] placeholder:text-[#3c4a42]/50 focus:ring-4 transition-all outline-none";
  const inputOk  = "border-[#bbcabf] focus:border-[#006c49] focus:ring-[#006c49]/20";
  const inputErr = "border-[#ba1a1a] focus:ring-[#ba1a1a]/20";

  // ── Success state ───────────────────────────────────────────────────────────
  if (success) {
    return (
      <main className="min-h-screen bg-[#f0f3ff] flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-3xl shadow-lg p-10 max-w-[400px] w-full text-center">
          <div className="w-16 h-16 bg-[#006c49]/10 text-[#006c49] rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl">check_circle</span>
          </div>
          <h2 className="text-[24px] leading-[32px] font-bold text-[#111c2d] mb-2">
            Đăng ký thành công!
          </h2>
          <p className="text-[#3c4a42] text-[16px] mb-6">
            Tài khoản đã được tạo. Đang chuyển đến trang đăng nhập…
          </p>
          <div className="w-12 h-1 bg-[#10b981] rounded-full mx-auto animate-pulse" />
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-[calc(100vh-64px)] bg-[#f9f9ff]">
      <div className="mx-auto max-w-[1280px] px-6 py-6">
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Đăng ký" },
          ]}
        />
      </div>
      <div className="flex flex-col md:flex-row">

      {/* ── Left: Visual panel ── */}
      <section className="hidden md:flex relative w-1/2 min-h-full overflow-hidden">
        {/* Background image */}
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAamNEouDQQeqyCNOQCjqC07gcgTBp6MM9OdSxz31vwpgj8bT_kh4n0fscu5UuidxwStuHKPeErZ74ANetNIgGkE_IdDZXRaxzXaL7OnraD-zo-ZpWpdwxtWi-9EzXn5kap_r03pyya67vEcEHfdZWXBkQO0X79f4ct0iZDTBzHSPujrckROliLUeRlO16y_T8WqP5vg5264xXls-4ZWhga5jhDKP3Ce3XE5IxlAceNSBTx1NEuGjJO5JrXesGJcIJ3cIWBUQ4mGQ"
          alt="Cánh đồng nông sản hữu cơ xanh tươi lúc bình minh"
          fill
          className="object-cover"
          unoptimized
          priority
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#006c49]/80 to-[#00422b]/60 backdrop-blur-[2px]" />

        {/* Text content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <h1 className="text-[48px] leading-[56px] font-bold mb-10 tracking-tight">
            Ăn sạch – Sống khỏe
          </h1>
          <ul className="space-y-5">
            {[
              "Nông sản VietGAP",
              "Giao hàng tận nơi",
              "Hoàn tiền 100% nếu không hài lòng",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-[18px] leading-[28px]">
                <span className="material-symbols-outlined text-2xl shrink-0">check_circle</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Right: Form panel ── */}
      <section className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-16 bg-[#f0f3ff]">
        <div className="w-full max-w-[480px] bg-white rounded-2xl p-8 md:p-10 shadow-[0_10px_15px_-3px_rgba(30,41,59,0.05),0_4px_6px_-2px_rgba(30,41,59,0.02)]">

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-[30px] leading-[38px] font-bold text-[#111c2d] mb-2">
              Đăng ký tài khoản
            </h2>
            <p className="text-[16px] text-[#3c4a42]">
              Tham gia cộng đồng NôngSạch để nhận ưu đãi tốt nhất.
            </p>
          </div>

          {/* Global error */}
          {formError && (
            <div className="mb-6 flex items-start gap-3 bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] rounded-xl px-4 py-3">
              <span className="material-symbols-outlined text-xl mt-0.5 shrink-0">error</span>
              <p className="text-[14px] font-medium">{formError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* ── Họ và tên ── */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-name" className="text-[14px] font-medium text-[#3c4a42]">
                Họ và tên
              </label>
              <input
                id="reg-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                placeholder="Nguyễn Văn A"
                className={`${inputBase} ${errors.name ? inputErr : inputOk}`}
              />
              {errors.name && (
                <span className="text-[12px] text-[#ba1a1a] font-medium mt-0.5">{errors.name}</span>
              )}
            </div>

            {/* ── Email ── */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-email" className="text-[14px] font-medium text-[#3c4a42]">
                Email
              </label>
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                placeholder="example@gmail.com"
                className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
              />
              {errors.email && (
                <span className="text-[12px] text-[#ba1a1a] font-medium mt-0.5">{errors.email}</span>
              )}
            </div>

            {/* ── Số điện thoại ── */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-phone" className="text-[14px] font-medium text-[#3c4a42]">
                Số điện thoại
              </label>
              <input
                id="reg-phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: "" })); }}
                placeholder="090 123 4567"
                className={`${inputBase} ${errors.phone ? inputErr : inputOk}`}
              />
              {errors.phone && (
                <span className="text-[12px] text-[#ba1a1a] font-medium mt-0.5">{errors.phone}</span>
              )}
            </div>

            {/* ── Mật khẩu ── */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-password" className="text-[14px] font-medium text-[#3c4a42]">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                  placeholder="••••••••"
                  className={`${inputBase} pr-12 ${errors.password ? inputErr : inputOk}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3c4a42] hover:text-[#006c49] transition-colors"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              {errors.password && (
                <span className="text-[12px] text-[#ba1a1a] font-medium mt-0.5">{errors.password}</span>
              )}
            </div>

            {/* ── Xác nhận mật khẩu ── */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-confirm" className="text-[14px] font-medium text-[#3c4a42]">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  id="reg-confirm"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmPassword: "" })); }}
                  placeholder="••••••••"
                  className={`${inputBase} pr-12 ${errors.confirmPassword ? inputErr : inputOk}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3c4a42] hover:text-[#006c49] transition-colors"
                  aria-label={showConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  <span className="material-symbols-outlined text-xl">
                    {showConfirm ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-[12px] text-[#ba1a1a] font-medium mt-0.5">{errors.confirmPassword}</span>
              )}
            </div>

            {/* ── Submit ── */}
            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-[#10b981] hover:bg-[#059669] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-2xl py-3.5 mt-2 transition-all shadow-md active:scale-[0.98] text-[16px] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>
                  Đang tạo tài khoản…
                </>
              ) : (
                "Tạo tài khoản"
              )}
            </button>

            {/* ── Footer link ── */}
            <div className="text-center mt-2">
              <p className="text-[14px] text-[#3c4a42]">
                Đã có tài khoản?{" "}
                <Link href="/login" className="text-[#10b981] font-bold hover:underline ml-1">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>

          </form>
        </div>
      </section>

      </div>
    </main>
  );
}
