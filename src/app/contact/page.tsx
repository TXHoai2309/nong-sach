import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Liên hệ",
  description:
    "Liên hệ với NôngSạch để được hỗ trợ đặt hàng, hợp tác và giải đáp thông tin về nông sản sạch.",
};

const mapImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAPj3G70avqSv4gKJN1SxC8-ysY-_cWSFhubEXDrBQtWlsEddANy9GpsJVRtFe0jYvmLS_XDCe6JQUA85tPlFGy2wo-kAoW87yRFs1cNwO0g-woY5AWMcRoC20sGOVaZBr6IA9KjBEEfDwHpXJjy8MjoavIxQTMGs3ULE05ra8AfRje1DD4FgipJICL-ZdjqiDCwFHMA-a21Ht1cxprjcIF_L6GOnl5_lvEIqPeYWtlgCaRL7xPKTwSDPV8LKRRhBdoxkt1TXX51A";

const contactItems = [
  {
    icon: "location_on",
    title: "Địa chỉ:",
    lines: ["123 Đường Nông Nghiệp, Quận 1, TP.HCM"],
  },
  {
    icon: "call",
    title: "Hotline:",
    lines: ["1800 1234 (miễn phí)", "8:00 – 22:00 hàng ngày"],
  },
  {
    icon: "mail",
    title: "Email:",
    lines: ["hello@nongsach.vn"],
  },
  {
    icon: "schedule",
    title: "Giờ làm việc:",
    lines: ["Thứ 2–7: 8:00 – 18:00", "Chủ nhật: Nghỉ"],
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f9f9ff] bg-[radial-gradient(at_0%_0%,rgba(16,185,129,0.05)_0px,transparent_50%),radial-gradient(at_100%_0%,rgba(0,108,73,0.03)_0px,transparent_50%)] text-on-surface">
      <section className="mx-auto max-w-[1280px] px-6 pb-10 pt-16">
        <nav className="mb-2 flex items-center gap-2 text-sm font-medium leading-5 text-on-surface-variant">
          <Link className="hover:text-primary" href="/">
            Trang chủ
          </Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-primary">Liên hệ</span>
        </nav>
        <h1 className="mb-2 text-4xl font-bold leading-[44px] tracking-[-0.02em] text-on-surface">
          Liên hệ với chúng tôi
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-on-surface-variant">
          Chúng tôi luôn sẵn sàng lắng nghe ý kiến và hỗ trợ bạn. Hãy gửi tin nhắn cho
          NôngSạch để được phục vụ tốt nhất.
        </p>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 pb-16">
        <div className="flex flex-col gap-10 md:grid md:grid-cols-10">
          <div className="rounded-[1.5rem] border border-outline-variant/10 bg-white p-6 shadow-sm md:col-span-6 md:p-16">
            <h2 className="mb-10 text-3xl font-semibold leading-[38px] text-on-surface">
              Gửi tin nhắn cho chúng tôi
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="ml-1 text-sm font-medium leading-5 text-on-surface-variant" htmlFor="name">
                    Họ tên
                  </label>
                  <input
                    className="w-full rounded-[1.5rem] border-none bg-surface-container-low px-6 py-6 text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary-container"
                    id="name"
                    placeholder="Nguyễn Văn A"
                    type="text"
                  />
                </div>
                <div className="space-y-1">
                  <label className="ml-1 text-sm font-medium leading-5 text-on-surface-variant" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="w-full rounded-[1.5rem] border-none bg-surface-container-low px-6 py-6 text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary-container"
                    id="email"
                    placeholder="email@example.com"
                    type="email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="ml-1 text-sm font-medium leading-5 text-on-surface-variant" htmlFor="phone">
                    Số điện thoại
                  </label>
                  <input
                    className="w-full rounded-[1.5rem] border-none bg-surface-container-low px-6 py-6 text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary-container"
                    id="phone"
                    placeholder="0901 234 567"
                    type="tel"
                  />
                </div>
                <div className="space-y-1">
                  <label className="ml-1 text-sm font-medium leading-5 text-on-surface-variant" htmlFor="subject">
                    Chủ đề
                  </label>
                  <div className="relative">
                    <select
                      className="w-full appearance-none rounded-[1.5rem] border-none bg-surface-container-low px-6 py-6 text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary-container"
                      id="subject"
                    >
                      <option value="order">Đặt hàng</option>
                      <option value="complaint">Khiếu nại</option>
                      <option value="cooperate">Hợp tác</option>
                      <option value="other">Khác</option>
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-xl text-on-surface-variant">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="ml-1 text-sm font-medium leading-5 text-on-surface-variant" htmlFor="content">
                  Nội dung
                </label>
                <textarea
                  className="min-h-36 w-full resize-none rounded-[1.5rem] border-none bg-surface-container-low px-6 py-6 text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary-container"
                  id="content"
                  placeholder="Nhập nội dung bạn muốn gửi cho chúng tôi..."
                  rows={4}
                />
              </div>

              <button
                className="mt-2 w-full rounded-[1.5rem] bg-primary-container py-6 font-bold text-white shadow-sm transition-all hover:bg-primary hover:shadow-lg active:scale-[0.98]"
                type="submit"
              >
                Gửi tin nhắn
              </button>
            </form>
          </div>

          <div className="flex flex-col gap-6 md:col-span-4">
            <div className="group relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-primary to-secondary p-6 text-white shadow-xl md:p-10">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl transition-all group-hover:bg-white/20" />
              <h3 className="relative z-10 mb-10 text-2xl font-semibold leading-8">Thông tin liên hệ</h3>
              <div className="relative z-10 space-y-6">
                {contactItems.map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <span className="material-symbols-outlined shrink-0">{item.icon}</span>
                    <div className="text-base leading-6">
                      <p className="mb-1 font-bold">{item.title}</p>
                      {item.lines.map((line, index) => (
                        <p
                          key={line}
                          className={index === 1 && item.title === "Hotline:" ? "text-xs font-semibold leading-4 opacity-70" : "opacity-90"}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="relative z-10 mt-16 flex gap-6 border-t border-white/20 pt-6">
                {["face_nod", "photo_camera", "chat", "smart_display"].map((icon) => (
                  <Link key={icon} className="transition-transform hover:scale-110" href="#">
                    <span className="material-symbols-outlined">{icon}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="relative flex min-h-[300px] flex-1 flex-col items-center justify-center overflow-hidden rounded-[1.5rem] border border-outline-variant/30 bg-surface-container p-6">
              <Image
                src={mapImage}
                alt="Bản đồ vị trí cửa hàng NôngSạch"
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover opacity-20 grayscale"
              />
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="flex h-16 w-16 animate-bounce items-center justify-center rounded-full bg-primary-container/20 text-primary">
                  <span className="material-symbols-outlined text-4xl [font-variation-settings:'FILL'_1]">
                    location_on
                  </span>
                </div>
                <span className="text-2xl font-semibold leading-8 text-primary">Xem bản đồ</span>
                <p className="max-w-[220px] text-center text-sm font-medium leading-5 text-on-surface-variant">
                  Click để mở bản đồ đường đi chi tiết trên Google Maps
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 bg-secondary-container/30 py-16">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-10 px-6 md:flex-row">
          <div className="max-w-md">
            <h2 className="mb-2 text-2xl font-semibold leading-8 text-on-surface">Đăng ký nhận bản tin</h2>
            <p className="text-base leading-6 text-on-surface-variant">
              Cập nhật ngay các mẹo nấu ăn hữu ích và ưu đãi đặc biệt hàng tuần từ trang trại của chúng tôi.
            </p>
          </div>
          <form className="flex w-full gap-2 md:w-auto">
            <input
              className="flex-1 rounded-[1.5rem] border-none bg-white px-6 py-6 shadow-sm outline-none focus:ring-2 focus:ring-primary-container md:w-80"
              placeholder="Email của bạn"
              type="email"
            />
            <button className="whitespace-nowrap rounded-[1.5rem] bg-primary px-10 py-6 font-bold text-white transition-all hover:shadow-lg" type="submit">
              Đăng ký
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
