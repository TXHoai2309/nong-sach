import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HandHeart, ShieldCheck, Sprout } from "lucide-react";
import Breadcrumb from "@/components/layout/Breadcrumb";

export const metadata: Metadata = {
  title: "Về chúng tôi",
  description:
    "Tìm hiểu câu chuyện, sứ mệnh và giá trị cốt lõi của NôngSạch trong hành trình kết nối nông dân với bữa ăn sạch của gia đình Việt.",
};

const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDNe2wF5FDSeway6t_8CIq6myFUn9iqkWFJ5_yerZ7PdXuq1bo7gq9hkO3XqGdXA4wSfK5wKVCbw473Yz-hRMTXrqR3sbR6I9080CvlquFgxUw-yyf1ROBaTySwaYSqTT_Zildn5wCQAqTRCx3Td6IO27zY3oJwysEb_nTO-8T14sgoC6Iv9dFDM6sVZdm75xmmv0VWtyAtXNTUWRNAHz_F4sMWy4b9cjzyqnFsH-w-8k6e_cB4rBeUsKDcUowV70PxJYSWUHuINg";

const farmerImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA_KUKBdKXB4KAxDlnPG9QrWyy6TK3MXYFfAlUNRsGEFCupHqP1eI6k_Yna0Xjknx_ORdHWrnZrMrMwVIX6kX7-NigrkSKp_ZisXQsoXF4Qk9E8bJgdt1JeGBfr-FqOCiLQ2XPVomNngvFZhd5pZS8-USHtVseWHYVbGI5W-cTl9hCmL9Ob9ZWqcbN1jhrTp6TO-jg_Nns1SaikHvIpfNB3-Ji9iHzjRUK1wzoDiqCSrKvOK_0JbvDfROHkGSrWp7GNsbHibg6RtQ";

const stats = [
  { value: "500+", label: "Nông dân" },
  { value: "20+", label: "Tỉnh thành" },
  { value: "10,000+", label: "Khách hàng" },
  { value: "98%", label: "Hài lòng" },
];

const values = [
  {
    icon: Sprout,
    title: "Canh tác bền vững",
    description:
      "Chúng tôi áp dụng các kỹ thuật nông nghiệp hữu cơ, bảo vệ độ phì nhiêu của đất và đa dạng sinh học cho thế hệ tương lai.",
  },
  {
    icon: ShieldCheck,
    title: "Minh bạch hoàn toàn",
    description:
      "Mỗi sản phẩm đều có mã QR truy xuất nguồn gốc, thông tin chi tiết về nông trại, ngày thu hoạch và quy trình kiểm định.",
  },
  {
    icon: HandHeart,
    title: "Vì cộng đồng",
    description:
      "NôngSạch cam kết trích một phần lợi nhuận để hỗ trợ giáo dục và hạ tầng cho các vùng nông thôn còn khó khăn.",
  },
];

const team = [
  {
    name: "Nguyễn Văn A",
    role: "Co-founder",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDcUO--vvPfn7b53IEwIG2nNAXKYdExrbZMer1uJ-DEnSN-j4iNS4KQD-CUF4q5NIoyQ3gjWyrGZAYxlurFNIILZAXpR5f4420roXlpEKwFHOrDzNc4advqmuvy4Ung4LhdY1jFZrbm67EHQFfpgR0S-Hrpi3isn7OUIq8URSsjsUt91X2VMVdiYerx-q7ZxP4esWv3ilyKfemrzPs6wxbq9WIdqDMZbTfjEw5wfu8j7HX8jx245zf6wkomDaAg4q9aN0ud7AYyFA",
  },
  {
    name: "Trần Thị B",
    role: "Head of Farming",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA4Di3Rd2IEeZwXRiAbEVm7Ovo8Us17GngldZtlR_3EEO4RWSTkWL837QDow4C3LZdHlkJJ_2VkuQc1iu3htAxOsK_MvSLjmJWpi8I5g-HvSMCaGye4tSQk93ymC1cAR0ztpFYjL7R4OmaaMoo142eO42bjEY0ipJZPttb4UwXurTJhAWcPRhYTHJXzAE_c0NEg_LNWpW1xVCDrmvFaqjom2ps-bmkyBcbXN6piUM2Brjavv0QoYqxk9WUeGc1XpfDsmaOuVlioCA",
  },
  {
    name: "Lê Văn C",
    role: "Tech Lead",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD4r91xvh7CiXnZcETYKx2XJO8E8iyQyNXC4NILZ3QLwpMwmJZVJ3MlciuFtHWwPnlrmnbQ6d5GtruyfXGkeU2wKUAgqXEgxbAmaJYTCJCnUg3MT2v1HPJEJnd5FnD2-L4nhxysKGTOkR1_-GewvLewderejm3WUPE1F3NbqVCrjyckZzFS-3ZmyIDd_HTWDmbboPKHPcQU5rVBHfk98-eYY21w3RWIm84_IHbeomavmqKVQ0tdabvAqr29AEEL07GAK9NgrXcthg",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-background text-on-background">
      <div className="mx-auto max-w-[1280px] px-6 py-6">
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Về chúng tôi" },
          ]}
        />
      </div>
      <section className="relative flex h-[614px] items-center justify-center overflow-hidden md:h-[716px]">
        <Image
          src={heroImage}
          alt="Ruộng bậc thang xanh trong buổi sớm"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-3xl px-6 text-center">
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-[-0.02em] text-white md:text-5xl md:leading-[56px]">
            Chúng tôi tin vào một bữa ăn sạch cho mọi gia đình Việt
          </h1>
          <p className="text-lg leading-8 text-white/90">
            NôngSạch ra đời năm 2024 với sứ mệnh kết nối nông dân và người tiêu dùng, loại bỏ
            hoàn toàn trung gian để mang lại giá trị thực chất nhất.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1280px] items-center gap-16 px-6 py-16 md:grid-cols-2">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold leading-[44px] tracking-[-0.02em] text-primary">
            Câu chuyện của chúng tôi
          </h2>
          <div className="space-y-4 text-base leading-7 text-on-surface-variant">
            <p>
              Khởi nguồn từ những trăn trở về thực phẩm không rõ nguồn gốc đang tràn lan trên thị
              trường, NôngSạch được thành lập bởi một nhóm những người trẻ tâm huyết với nông
              nghiệp bền vững. Chúng tôi khao khát xây dựng một hệ sinh thái nơi mọi sản phẩm đều
              có thể truy xuất nguồn gốc rõ ràng.
            </p>
            <p>
              Sứ mệnh của chúng tôi không chỉ dừng lại ở việc cung cấp thực phẩm sạch. NôngSạch
              hướng tới việc thay đổi tư duy sản xuất của người nông dân, khuyến khích canh tác hữu
              cơ, không hóa chất độc hại, bảo vệ môi trường và sức khỏe cộng đồng.
            </p>
            <p>
              Bằng cách loại bỏ các khâu trung gian phức tạp, chúng tôi đảm bảo nông sản được đưa từ
              ruộng đồng đến bàn ăn trong thời gian ngắn nhất, giữ trọn độ tươi ngon và dinh dưỡng,
              đồng thời đảm bảo thu nhập công bằng cho những người trực tiếp tạo ra sản phẩm.
            </p>
          </div>
        </div>

        <div className="relative">
          <Image
            src={farmerImage}
            alt="Người nông dân Việt Nam"
            width={640}
            height={500}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="h-[500px] w-full rounded-2xl object-cover shadow-xl"
          />
          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-secondary-container p-6 shadow-lg lg:block">
            <p className="text-2xl font-semibold italic leading-8 text-on-secondary-container">
              &ldquo;Tâm huyết từ đất mẹ&rdquo;
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low py-16">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-6 px-6 text-center md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-1">
              <p className="text-4xl font-bold leading-[44px] tracking-[-0.02em] text-primary-container">
                {stat.value}
              </p>
              <p className="text-sm font-medium uppercase tracking-wider text-on-surface-variant">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-16">
        <div className="mb-16 text-center">
          <h2 className="mb-2 text-4xl font-bold leading-[44px] tracking-[-0.02em] text-on-surface">
            Giá trị cốt lõi
          </h2>
          <div className="mx-auto h-1 w-20 rounded-full bg-primary" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <article
                key={value.title}
                className="group rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-16 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-container/10 text-primary-container transition-transform group-hover:scale-110">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="mb-4 text-2xl font-semibold leading-8 text-on-surface">{value.title}</h3>
                <p className="text-base leading-7 text-on-surface-variant">{value.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="mx-auto max-w-[1280px] px-6 text-center">
          <h2 className="mb-16 text-4xl font-bold leading-[44px] tracking-[-0.02em] text-on-surface">
            Đội ngũ sáng lập
          </h2>
          <div className="grid gap-16 md:grid-cols-3">
            {team.map((member) => (
              <article key={member.name} className="flex flex-col items-center">
                <div className="mb-6 h-48 w-48 overflow-hidden rounded-full border-4 border-primary/10">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={192}
                    height={192}
                    sizes="192px"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-semibold leading-8 text-on-surface">{member.name}</h3>
                <p className="mt-1 text-sm font-medium uppercase tracking-widest text-primary-container">
                  {member.role}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto my-16 max-w-[1040px] px-6">
        <div className="relative overflow-hidden rounded-3xl p-12 text-center md:py-16 md:px-12 shadow-lg">
          <Image
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1280&h=400&fit=crop"
            alt="Nông trại rau sạch tươi mát"
            fill
            sizes="(min-width: 1040px) 990px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#006c49]/85 to-[#10b981]/80" />
          
          <div className="relative z-10 mx-auto max-w-[576px]">
            <h2 className="mb-6 text-2xl font-bold leading-9 text-white md:text-3xl md:leading-10">
              Hãy cùng chúng tôi xây dựng nền nông nghiệp sạch
            </h2>
            <Link
              href="/products"
              className="inline-flex rounded-full bg-white px-8 py-3 text-sm font-bold text-[#006c49] shadow-md transition-all hover:bg-gray-100 hover:shadow-lg active:scale-95 cursor-pointer whitespace-nowrap"
            >
              Mua ngay
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
