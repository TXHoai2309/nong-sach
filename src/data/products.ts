import { Product } from "@/types/product";

// =============================================
// Dữ liệu sản phẩm local — không cần API/Firebase
// Để thêm/sửa/xóa sản phẩm, chỉnh trực tiếp mảng này.
// =============================================

export const products: Product[] = [
  {
    id: "1",
    name: "Rau cải sạch",
    category: "vegetables",
    price: 15000,
    image:
      "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=600&h=600&fit=crop",
    description:
      "Rau cải xanh tươi trồng theo tiêu chuẩn VietGAP, không sử dụng thuốc trừ sâu hóa học. Thu hoạch buổi sáng, đảm bảo độ tươi ngon.",
    origin: "Đà Lạt",
    stock: 80,
  },
  {
    id: "2",
    name: "Cà chua hữu cơ",
    category: "vegetables",
    price: 32000,
    image:
      "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600&h=600&fit=crop",
    description:
      "Cà chua hữu cơ chín đỏ, vị ngọt chua tự nhiên. Trồng trong nhà kính công nghệ cao, kiểm soát hoàn toàn môi trường, không hóa chất.",
    origin: "Lâm Đồng",
    stock: 50,
  },
  {
    id: "3",
    name: "Xà lách thủy canh",
    category: "vegetables",
    price: 20000,
    image:
      "https://images.unsplash.com/photo-1622205313162-be1d5712a43f?w=600&h=600&fit=crop",
    description:
      "Xà lách trồng thủy canh trong môi trường sạch, không đất, không côn trùng. Giòn tươi, phù hợp làm salad hoặc ăn kèm.",
    origin: "TP. Hồ Chí Minh",
    stock: 60,
  },
  {
    id: "4",
    name: "Cam Vinh",
    category: "fruits",
    price: 48000,
    image:
      "https://images.unsplash.com/photo-1547514701-42782101795e?w=600&h=600&fit=crop",
    description:
      "Cam Vinh chính gốc vỏ mỏng, múi dày, vị ngọt thanh đặc trưng. Giàu vitamin C, tốt cho sức đề kháng. Chọn trái to đều, không thuốc bảo quản.",
    origin: "Nghệ An",
    stock: 100,
  },
  {
    id: "5",
    name: "Bưởi da xanh",
    category: "fruits",
    price: 65000,
    image:
      "https://images.unsplash.com/photo-1587883012610-e3df17d41270?w=600&h=600&fit=crop",
    description:
      "Bưởi da xanh Bến Tre múi hồng, vị ngọt thanh không đắng. Trái to từ 1,2–1,5 kg, thu hoạch đúng độ chín, không bơm thuốc kích thích.",
    origin: "Bến Tre",
    stock: 40,
  },
  {
    id: "6",
    name: "Gạo ST25",
    category: "grains",
    price: 42000,
    image:
      "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&h=600&fit=crop",
    description:
      "Gạo ST25 — gạo ngon nhất thế giới năm 2019. Hạt dài, cơm dẻo thơm, vị ngọt nhẹ. Canh tác thuần tự nhiên tại vùng sông nước Sóc Trăng.",
    origin: "Sóc Trăng",
    stock: 200,
  },
  {
    id: "7",
    name: "Khoai lang Đà Lạt",
    category: "roots",
    price: 22000,
    image:
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&h=600&fit=crop",
    description:
      "Khoai lang tím mật Đà Lạt thịt dẻo ngọt tự nhiên. Giàu anthocyanin, vitamin B6 và chất xơ. Luộc, nướng hay làm bánh đều ngon.",
    origin: "Đà Lạt",
    stock: 90,
  },
  {
    id: "8",
    name: "Dưa lưới Nhật",
    category: "fruits",
    price: 120000,
    image:
      "https://images.unsplash.com/photo-1571575173700-afb9492e6a50?w=600&h=600&fit=crop",
    description:
      "Dưa lưới Nhật vỏ vàng ươm, ruột cam ngọt, hương thơm dịu. Trồng trong nhà kính theo quy trình Nhật Bản, kiểm soát chất lượng nghiêm ngặt.",
    origin: "Lâm Đồng",
    stock: 25,
  },
  {
    id: "9",
    name: "Rau muống sạch",
    category: "vegetables",
    price: 10000,
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=600&fit=crop",
    description:
      "Rau muống trồng nước sạch, không phân bón hóa học. Ngọn non giòn, phù hợp xào tỏi hoặc luộc chấm mắm. Giao trong ngày.",
    origin: "Hà Nội",
    stock: 120,
  },
  {
    id: "10",
    name: "Húng quế tươi",
    category: "herbs",
    price: 12000,
    image:
      "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&h=600&fit=crop",
    description:
      "Húng quế tươi thơm nồng, thu hoạch sáng sớm. Dùng ăn kèm phở, bún bò, gỏi cuốn hay pha trà đều tuyệt vời. Bó tươi, không héo.",
    origin: "Hưng Yên",
    stock: 70,
  },
];
