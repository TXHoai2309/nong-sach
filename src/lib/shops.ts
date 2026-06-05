// =============================================
// Shop Models and Database — NôngSạch
// =============================================

import { Product } from "@/types/product";

export interface Shop {
  id: string;
  name: string;
  logo: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  productCount: number;
  orderCount: string | number;
  joinDate: string;
  location: string;
  slogan: string;
  altitude: string;
  standard: string;
  description: string;
  farmImages: string[];
  mainCategories: string[];
}

export const STATIC_SHOPS: Shop[] = [
  {
    id: "vuon-sach-da-lat",
    name: "Vườn Sạch Đà Lạt",
    logo: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=120&h=120&fit=crop",
    verified: true,
    rating: 4.8,
    reviewCount: 128,
    productCount: 56,
    orderCount: "1.2K",
    joinDate: "06/2024",
    location: "Lâm Đồng",
    slogan: "Tươi từ vườn mỗi ngày — Đà Lạt",
    altitude: "1500m",
    standard: "VietGAP",
    description: "Vườn Sạch Đà Lạt tự hào là đơn vị tiên phong trong canh tác nông nghiệp công nghệ cao tại độ cao 1500m. Chúng tôi cam kết 100% sản phẩm đạt tiêu chuẩn VietGAP, không dư lượng thuốc trừ sâu, được tưới bằng nước suối tự nhiên và bón phân hữu cơ ủ hoai. Mỗi bó rau, trái quả đến tay bạn đều được thu hoạch trực tiếp trong ngày để giữ trọn vẹn sự tươi ngon và hàm lượng dinh dưỡng cao nhất.",
    farmImages: [
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&h=400&fit=crop",
    ],
    mainCategories: ["Rau củ", "Trái cây", "Thảo mộc"],
  },
  {
    id: "nong-trai-xanh",
    name: "Nông Trại Xanh",
    logo: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=120&h=120&fit=crop",
    verified: true,
    rating: 4.6,
    reviewCount: 92,
    productCount: 34,
    orderCount: "850",
    joinDate: "09/2024",
    location: "Bến Tre",
    slogan: "Nông nghiệp xanh, cuộc sống lành",
    altitude: "Đồng bằng",
    standard: "Hữu cơ",
    description: "Nông Trại Xanh chuyên cung cấp trái cây đặc sản miền Tây sông nước và ngũ cốc hạt dinh dưỡng dồi dào. Quy trình chăm sóc sinh học khép kín, an toàn tuyệt đối cho người dùng và thân thiện với môi trường sinh thái địa phương.",
    farmImages: [
      "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1464226184884-fa280b87c3ab?w=600&h=400&fit=crop",
    ],
    mainCategories: ["Trái cây", "Ngũ cốc"],
  },
  {
    id: "rau-sach-organic",
    name: "Rau Sạch Organic",
    logo: "https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=120&h=120&fit=crop",
    verified: true,
    rating: 4.9,
    reviewCount: 218,
    productCount: 78,
    orderCount: "2.5K",
    joinDate: "03/2024",
    location: "TP. Hồ Chí Minh",
    slogan: "Hữu cơ từ tâm — Sức khỏe xứng tầm",
    altitude: "Nhà kính công nghệ IoT",
    standard: "USDA Organic",
    description: "Rau Sạch Organic tự hào đi đầu trong ứng dụng IoT tự động hóa quy trình nuôi trồng rau sạch hữu cơ chuẩn USDA tại các vùng đô thị vệ tinh. Sản phẩm an lành, đảm bảo hàm lượng dinh dưỡng thiết yếu lý tưởng.",
    farmImages: [
      "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=600&h=400&fit=crop",
    ],
    mainCategories: ["Rau củ", "Củ quả"],
  },
  {
    id: "moc-farm-da-lat",
    name: "Mộc Farm Đà Lạt",
    logo: "https://images.unsplash.com/photo-1605000797439-7571d3c0a524?w=120&h=120&fit=crop",
    verified: true,
    rating: 4.7,
    reviewCount: 110,
    productCount: 42,
    orderCount: "980",
    joinDate: "11/2024",
    location: "Lâm Đồng",
    slogan: "Nông sản mộc mạc, đậm vị quê hương",
    altitude: "1200m",
    standard: "VietGAP",
    description: "Mộc Farm Đà Lạt chuyên bảo tồn và phát triển các giống rau thơm bản địa kết hợp củ quả ôn đới, canh tác kết hợp nông nghiệp truyền thống bản địa và hệ sinh thái thảo mộc sấy lạnh giữ chất lượng cao.",
    farmImages: [
      "https://images.unsplash.com/photo-1605000797439-7571d3c0a524?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=400&fit=crop",
    ],
    mainCategories: ["Thảo mộc", "Củ quả"],
  },
];

/**
 * Lấy thông tin shop theo ID (Hỗ trợ cả static và dynamic shop từ localStorage)
 */
export function getShopById(shopId: string): Shop {
  // 1. Tìm trong danh sách shop tĩnh
  const staticShop = STATIC_SHOPS.find((s) => s.id === shopId);
  if (staticShop) return staticShop;

  // 2. Tìm trong localStorage (Dynamic shop cho custom seller)
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("nong-sach-auth");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const state = parsed.state;
        if (state && state.registeredUsers) {
          const user = state.registeredUsers.find((u: any) => u.id === shopId);
          if (user && user.sellerInfo) {
            const info = user.sellerInfo;
            // Đếm số lượng sản phẩm của shop này
            const productsStored = localStorage.getItem("nong-sach-custom-products");
            let count = 0;
            if (productsStored) {
              try {
                const list = JSON.parse(productsStored);
                count = list.filter((p: any) => p.sellerId === shopId).length;
              } catch {}
            }

            return {
              id: user.id,
              name: info.shopName,
              logo: info.shopLogo || "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=120&h=120&fit=crop",
              verified: true,
              rating: 5.0,
              reviewCount: 0,
              productCount: count,
              orderCount: "0",
              joinDate: user.memberSince || "06/2026",
              location: info.province || "Lâm Đồng",
              slogan: info.slogan || "Cung cấp nông sản sạch tươi ngon hữu cơ",
              altitude: info.farmAddress || "Đà Lạt",
              standard: info.farmingStandards?.join(", ") || "VietGAP",
              description: info.description || "Nông sản sạch từ nông trại của tôi.",
              farmImages: info.farmImages && info.farmImages.length > 0 ? info.farmImages : [
                "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=400&fit=crop"
              ],
              mainCategories: info.mainCategories || ["Rau củ"],
            };
          }
        }
      } catch (e) {
        console.error("Lỗi parse auth state", e);
      }
    }
  }

  // 3. Fallback mặc định
  return STATIC_SHOPS[0];
}

/**
 * Lấy thông tin shop tương ứng với sản phẩm
 */
export function getShopForProduct(product: Product): Shop {
  if (product.sellerId) {
    return getShopById(product.sellerId);
  }

  // Nếu là sản phẩm tĩnh, map dựa vào id/origin/category
  switch (product.id) {
    case "1":
    case "2":
    case "7":
    case "8":
      return getShopById("vuon-sach-da-lat");
    case "4":
    case "5":
    case "6":
      return getShopById("nong-trai-xanh");
    case "3":
    case "9":
      return getShopById("rau-sach-organic");
    case "10":
      return getShopById("moc-farm-da-lat");
    default:
      // Fallback theo xuất xứ
      if (product.origin.includes("Đà Lạt") || product.origin.includes("Lâm Đồng")) {
        return getShopById("vuon-sach-da-lat");
      }
      if (product.origin.includes("Bến Tre") || product.origin.includes("Sóc Trăng")) {
        return getShopById("nong-trai-xanh");
      }
      return getShopById("vuon-sach-da-lat");
  }
}
