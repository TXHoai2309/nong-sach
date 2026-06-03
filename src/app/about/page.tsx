import { Metadata } from "next";
import { Leaf, ShieldCheck, HeartHandshake, Truck } from "lucide-react";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Về chúng tôi — NôngSạch",
  description: "Tìm hiểu câu chuyện, sứ mệnh, giá trị cốt lõi và con đường mang nông sản sạch, an toàn đạt chuẩn VietGAP đến mỗi gia đình Việt Nam của NôngSạch.",
};

const values = [
  {
    icon: Leaf,
    title: "100% Tự nhiên & Tươi ngon",
    description: "Sản phẩm được thu hoạch trực tiếp tại vườn và vận chuyển nhanh chóng tới tay khách hàng để giữ trọn độ tươi ngon tự nhiên nhất.",
  },
  {
    icon: ShieldCheck,
    title: "Tuyệt đối An toàn",
    description: "Tất cả sản phẩm nông sản đều đạt các tiêu chuẩn chất lượng như VietGAP, GlobalGAP, không dư lượng thuốc trừ sâu.",
  },
  {
    icon: HeartHandshake,
    title: "Hỗ trợ Người nông dân",
    description: "Chúng tôi liên kết chặt chẽ với các hợp tác xã nông nghiệp địa phương để đảm bảo giá thu mua hợp lý, bền vững.",
  },
  {
    icon: Truck,
    title: "Giao hàng Nhanh chóng",
    description: "Hệ thống vận chuyển tối ưu và linh hoạt, giao hàng ngay trong ngày giúp sản phẩm không bị dập nát, hỏng hóc.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <Container>
        {/* Hero Banner Section */}
        <section className="relative rounded-3xl overflow-hidden mb-16 bg-gradient-to-r from-emerald-800 to-teal-700 text-white p-8 sm:p-16 text-center shadow-xl">
          <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-xs"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-3 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
              <Leaf className="w-3.5 h-3.5" /> Nông nghiệp xanh
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
              Mang nông sản sạch từ tâm đến bàn ăn Việt
            </h1>
            <p className="text-emerald-100 text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-light">
              NôngSạch kết nối tinh hoa của đất trời đất Việt với bữa ăn an lành, trọn vẹn của mỗi gia đình Việt Nam.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mb-16">
          <div className="md:col-span-6 bg-white rounded-3xl border border-slate-100 shadow-sm p-8 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-6">
              Câu chuyện thương hiệu
            </h2>
            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>
                Được thành lập từ trăn trở về chất lượng bữa ăn hằng ngày của các gia đình Việt Nam, <strong>NôngSạch</strong> ra đời với sứ mệnh mang đến nguồn nông sản tươi ngon, minh bạch về nguồn gốc và tuyệt đối an toàn.
              </p>
              <p>
                Chúng tôi không chỉ là một đơn vị phân phối, mà là cầu nối bền chặt giữa những người nông dân tâm huyết và người tiêu dùng thông thái. Mỗi sản phẩm được chọn lọc kỹ càng, kiểm định ngặt nghèo trước khi đóng gói gửi trao.
              </p>
              <p>
                Với NôngSạch, nông nghiệp sạch không chỉ là một quy trình sản xuất, đó là một lời cam kết về sức khỏe cộng đồng và sự bền vững của môi trường Việt Nam.
              </p>
            </div>
          </div>
          <div className="md:col-span-6 relative aspect-video md:aspect-square rounded-3xl overflow-hidden shadow-md bg-slate-200 border border-slate-100">
            {/* Standard illustrative banner style using CSS & Unsplash */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1000&auto=format&fit=crop&q=80')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
          </div>
        </section>

        {/* Vision & Mission Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-emerald-50/50 rounded-3xl border border-emerald-100/50 p-8 sm:p-10">
            <h3 className="text-xl font-bold text-emerald-800 mb-4">Sứ mệnh của chúng tôi</h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Cung cấp thực phẩm xanh, sạch, đầy đủ dinh dưỡng và an toàn tuyệt đối. Chúng tôi không ngừng phấn đấu cải thiện chất lượng cuộc sống người Việt thông qua những sản phẩm xanh chất lượng cao nhất, đồng thời nâng cao đời sống của người nông dân địa phương.
            </p>
          </div>
          <div className="bg-teal-50/50 rounded-3xl border border-teal-100/50 p-8 sm:p-10">
            <h3 className="text-xl font-bold text-teal-800 mb-4">Tầm nhìn chiến lược</h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Trở thành thương hiệu dẫn đầu và uy tín nhất Việt Nam trong chuỗi cung ứng nông sản hữu cơ và VietGAP, xây dựng một hệ sinh thái nông nghiệp bền vững từ nông trại đến mọi bàn ăn gia đình.
            </p>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 sm:p-12 mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-4 text-center">
            Giá trị cốt lõi
          </h2>
          <p className="text-slate-500 text-sm sm:text-base text-center max-w-xl mx-auto mb-10">
            Định hình mọi hoạt động và triết lý kinh doanh của chúng tôi trong việc phụng sự sức khỏe cộng đồng.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-4">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-5 shadow-inner">
                  <val.icon className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-slate-800 mb-2">{val.title}</h4>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
