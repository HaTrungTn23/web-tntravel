import type { StaticImageData } from "next/image";

import haoDatImg from "../../images/location/tea-brands/tea-brands-images/haodat/01.jpg";
import huongVanImg from "../../images/location/tea-brands/tea-brands-images/huongvantra/01.jpg";
import tamTraThaiImg from "../../images/location/tea-brands/tea-brands-images/tamtrathai/01.jpg";
import baoNgocImg from "../../images/location/tea-brands/tea-brands-images/baongoc/01.jpg";
import tanCuongXanhImg from "../../images/location/tea-brands/tea-brands-images/tancuongxanh/01.jpg";
import locTanCuongImg from "../../images/location/tea-brands/tea-brands-images/loctancuong/03.jpg";
import shinTeaImg from "../../images/location/tea-brands/tea-brands-images/shintea/01.png";
import sonDungImg from "../../images/location/tea-brands/tea-brands-images/sondungtra/01.jpg";
import haiTraImg from "../../images/location/tea-brands/tea-brands-images/haitra/04.jpg";
import tuyTraImg from "../../images/location/tea-brands/tea-brands-images/tuytra/01.jpg";
import khanhDungImg from "../../images/location/tea-brands/tea-brands-images/khanhdung/01.jpg";
import huongNgocImg from "../../images/location/tea-brands/tea-brands-images/huongngoc/01.jpg";
import laBangImg from "../../images/location/tea-brands/tea-brands-images/labang/06.jpg";
import thuanTraImg from "../../images/location/tea-brands/tea-brands-images/thuantra/01.jpg";
import vanPhuImg from "../../images/location/tea-brands/tea-brands-images/vanphutra/01.png";
import kheCocImg from "../../images/location/tea-brands/tea-brands-images/khecoc/01.jpg";
import huongQueImg from "../../images/location/tea-brands/tea-brands-images/huongque/01.webp";
import bangPhucImg from "../../images/location/tea-brands/tea-brands-images/bangphuc/01.jpg";

export type OccasionKey = "daily" | "gift" | "experience";

export type TeaRegionId = "tan-cuong" | "dai-tu" | "phu-luong-bang-phuc" | "vo-tranh";

export type TeaBrand = {
  id: string;
  name: string;
  shortName: string;
  region: string;
  regionGroup: TeaRegionId;
  image: StaticImageData;
  imageAlt: string;
  certification: string;
  certHighlight: string;
  hasVerifiedCert: boolean;
  productCount: number;
  price: string;
  priceMinVnd: number | null;
  priceMaxVnd: number | null;
  website: string;
  touristNote: string | null;
  occasions: OccasionKey[];
  featuredProduct: {
    name: string;
    detail: string;
    price: string;
  };
};

export const teaBrands: TeaBrand[] = [
  {
    id: "haodat",
    name: "HTX Chè Hảo Đạt",
    shortName: "Hảo Đạt",
    region: "Tân Cương",
    regionGroup: "tan-cuong",
    image: haoDatImg,
    imageAlt: "Bột trà xanh và lá trà tươi của HTX Chè Hảo Đạt",
    certification:
      "OCOP 5 sao quốc gia (Trà Tôm nõn 2021, sản phẩm 5 sao đầu tiên của tỉnh; Chè Đinh), OCOP 4 sao (Móc câu)",
    certHighlight: "OCOP 5 sao quốc gia",
    hasVerifiedCert: true,
    productCount: 67,
    price: "Từ 30.000đ",
    priceMinVnd: 30000,
    priceMaxVnd: 1650000,
    website: "https://chetancuonghaodat.vn",
    touristNote:
      "Có Không gian văn hóa trà Hảo Đạt tại Tân Cương phục vụ du khách trải nghiệm.",
    occasions: ["daily", "gift", "experience"],
    featuredProduct: {
      name: "Chè Móc Câu Đặc Biệt",
      detail: "Gói 100g, Tân Cương",
      price: "30.000đ",
    },
  },
  {
    id: "huongvan",
    name: "HTX Hương Vân Trà",
    shortName: "Hương Vân",
    region: "Tân Cương",
    regionGroup: "tan-cuong",
    image: huongVanImg,
    imageAlt: "Hộp trà Hương Vân bên chén trà pha sẵn",
    certification:
      "OCOP 5 sao quốc gia 2026 (Ngọc Xuân Trà và Tam Phúc Trà); Thương hiệu Vàng nông nghiệp Việt Nam 2024",
    certHighlight: "OCOP 5 sao quốc gia 2026",
    hasVerifiedCert: true,
    productCount: 5,
    price: "Liên hệ hotline",
    priceMinVnd: 5000000,
    priceMaxVnd: 5000000,
    website: "https://huongvantra.vn",
    touristNote:
      "Có không gian thưởng trà tại tổ 51, phường Phan Đình Phùng, TP Thái Nguyên.",
    occasions: ["gift", "experience"],
    featuredProduct: {
      name: "Ngọc Xuân Trà",
      detail: "Trà Đinh cao cấp, Tân Cương",
      price: "Từ 5.000.000đ/kg",
    },
  },
  {
    id: "tamtrathai",
    name: "HTX Tâm Trà Thái",
    shortName: "Tâm Trà Thái",
    region: "Tân Cương",
    regionGroup: "tan-cuong",
    image: tamTraThaiImg,
    imageAlt: "Chè nõn tôm HTX Tâm Trà Thái đạt chuẩn OCOP 4 sao",
    certification:
      "OCOP 4 sao, VietGAP, quyền sử dụng chỉ dẫn địa lý Tân Cương và chuỗi thực phẩm an toàn",
    certHighlight: "OCOP 4 sao, Chỉ dẫn địa lý",
    hasVerifiedCert: true,
    productCount: 4,
    price: "Theo kênh phân phối",
    priceMinVnd: null,
    priceMaxVnd: null,
    website: "https://bdsgshop.bdsg.vn/cam-nang-ocop-5032/",
    touristNote:
      "Vườn trà trung du cổ chăm sóc hữu cơ, tưới nước Hồ Núi Cốc tại Tân Cương.",
    occasions: ["gift"],
    featuredProduct: {
      name: "Nhất Đinh Trà hộp 250g",
      detail: "Nghệ nhân Trần Văn Thái sáng tạo",
      price: "Liên hệ HTX",
    },
  },
  {
    id: "baongoc",
    name: "Bảo Ngọc Trà (HTX Trà Xanh Thái Nguyên)",
    shortName: "Bảo Ngọc Trà",
    region: "Tân Cương",
    regionGroup: "tan-cuong",
    image: baoNgocImg,
    imageAlt: "Hộp trà biếu cao cấp Bảo Ngọc Trà",
    certification:
      "VietGAP; cam kết hoàn tiền 200% nếu không đúng nguồn gốc Tân Cương (theo website)",
    certHighlight: "Chuẩn VietGAP",
    hasVerifiedCert: true,
    productCount: 20,
    price: "Từ 300.000đ",
    priceMinVnd: 300000,
    priceMaxVnd: 3000000,
    website: "https://trathainguyen.net.vn",
    touristNote: null,
    occasions: ["daily", "gift"],
    featuredProduct: {
      name: "Trà Tân Cương Thượng Hạng",
      detail: "Gói 500g và hộp quà biếu",
      price: "500.000đ",
    },
  },
  {
    id: "tancuongxanh",
    name: "Công ty TNHH Tân Cương Xanh",
    shortName: "Tân Cương Xanh",
    region: "Tân Cương",
    regionGroup: "tan-cuong",
    image: tanCuongXanhImg,
    imageAlt: "Bạch Trà Nguyệt 80g của Tân Cương Xanh",
    certification:
      "VietGAP; có giấy kiểm nghiệm an toàn thực phẩm và chứng nhận FDA Hoa Kỳ (theo website)",
    certHighlight: "VietGAP, Kiểm nghiệm ATTP",
    hasVerifiedCert: true,
    productCount: 237,
    price: "Từ 10.000đ",
    priceMinVnd: 10000,
    priceMaxVnd: 9180000,
    website: "https://tancuongxanh.vn",
    touristNote:
      "Có hệ thống cửa hàng tại Thái Nguyên và nhiều tỉnh thành, thuận tiện mua đặc sản.",
    occasions: ["daily", "gift"],
    featuredProduct: {
      name: "Đinh Ngọc Tiến Vua & Hộp quà",
      detail: "Danh mục rộng từ trà búp tới quà biếu",
      price: "Từ 10.000đ",
    },
  },
  {
    id: "loctancuong",
    name: "Công ty TNHH Lộc Tân Cương",
    shortName: "Lộc Tân Cương",
    region: "Tân Cương",
    regionGroup: "tan-cuong",
    image: locTanCuongImg,
    imageAlt: "Hộp Hồng Phúc Trà Bạch Shan Lộc Tân Cương",
    certification:
      "Chứng nhận vệ sinh an toàn thực phẩm, sản xuất tại xóm Nam Hưng, Tân Cương",
    certHighlight: "Chứng nhận VSATTP",
    hasVerifiedCert: true,
    productCount: 123,
    price: "Từ 10.600đ",
    priceMinVnd: 10600,
    priceMaxVnd: 3000000,
    website: "https://loctancuong.com",
    touristNote:
      "Sản xuất tại Tân Cương, có điểm thử trà miễn phí tại Hà Nội và TP.HCM.",
    occasions: ["daily", "gift", "experience"],
    featuredProduct: {
      name: "4 dòng trà chuẩn hái (Búp đến Đinh)",
      detail: "Có gói thử 10g và hộp quà Hồng Phúc",
      price: "Từ 10.600đ",
    },
  },
  {
    id: "shintea",
    name: "Shin Tea (Vua trà Tân Cương)",
    shortName: "Shin Tea",
    region: "Tân Cương",
    regionGroup: "tan-cuong",
    image: shinTeaImg,
    imageAlt: "Túi bạch trà tiên Hà Giang 100g do Shin Tea phân phối",
    certification:
      "Sản xuất ứng dụng khoa học kỹ thuật, đảm bảo an toàn thực phẩm (theo giới thiệu hãng)",
    certHighlight: "Đảm bảo an toàn thực phẩm",
    hasVerifiedCert: true,
    productCount: 45,
    price: "Từ 19.000đ",
    priceMinVnd: 19000,
    priceMaxVnd: 3500000,
    website: "https://shintea.vn",
    touristNote:
      "Showroom nằm trong Không gian Văn hóa trà Tân Cương, điểm dừng chân du lịch trà.",
    occasions: ["daily", "experience"],
    featuredProduct: {
      name: "Bạch Trà Búp Hà Giang",
      detail: "Cùng dòng trà sen, sâm trà, tôm nõn",
      price: "380.000đ",
    },
  },
  {
    id: "sondungtra",
    name: "HTX Trà Sơn Dung",
    shortName: "Sơn Dung Trà",
    region: "Tân Cương",
    regionGroup: "tan-cuong",
    image: sonDungImg,
    imageAlt: "Sản phẩm trà đặc sản Tân Cương của HTX Trà Sơn Dung",
    certification:
      "VietGAP tại vùng chè Tân Cương, Phúc Xuân, Phúc Trìu (theo giới thiệu HTX)",
    certHighlight: "VietGAP (theo HTX)",
    hasVerifiedCert: true,
    productCount: 6,
    price: "Xem tại Shopee Mall",
    priceMinVnd: null,
    priceMaxVnd: null,
    website: "https://shopee.vn/son_dung_tra",
    touristNote:
      "Có showroom thưởng trà tại vùng Tân Cương, phát triển từ cơ sở gia đình từ năm 1977.",
    occasions: ["daily", "gift", "experience"],
    featuredProduct: {
      name: "Mộc Trà, Sơn Trà, An Trà",
      detail: "Các dòng trà đinh và nõn riêng của HTX",
      price: "Xem gian hàng",
    },
  },
  {
    id: "haitra",
    name: "Hải Trà Tân Cương",
    shortName: "Hải Trà",
    region: "Tân Cương",
    regionGroup: "tan-cuong",
    image: haiTraImg,
    imageAlt: "Hộp quà tặng trà hộp gỗ vuông 250g của Hải Trà",
    certification: "Chưa ghi nhận thông tin chứng nhận trong nguồn khảo sát",
    certHighlight: "Chưa ghi nhận chứng nhận",
    hasVerifiedCert: false,
    productCount: 61,
    price: "Từ 50.000đ",
    priceMinVnd: 50000,
    priceMaxVnd: 3200000,
    website: "https://haitratancuong.com",
    touristNote: null,
    occasions: ["daily", "gift"],
    featuredProduct: {
      name: "Bộ quà tặng Phát Tài 500g",
      detail: "Đủ dòng trà đinh, nõn tôm, trà ướp hoa",
      price: "500.000đ",
    },
  },
  {
    id: "tuytra",
    name: "Túy Trà",
    shortName: "Túy Trà",
    region: "Tân Cương",
    regionGroup: "tan-cuong",
    image: tuyTraImg,
    imageAlt: "Sản phẩm Trà Búp Trung Du của Túy Trà",
    certification: "Chưa ghi nhận thông tin chứng nhận trong nguồn khảo sát",
    certHighlight: "Chưa ghi nhận chứng nhận",
    hasVerifiedCert: false,
    productCount: 10,
    price: "Từ 112.500đ",
    priceMinVnd: 112500,
    priceMaxVnd: 875000,
    website: "https://tuytra.vn",
    touristNote: null,
    occasions: ["daily"],
    featuredProduct: {
      name: "Trà Móc Câu Cao Cấp 1kg",
      detail: "Phân phối từ vùng Hồng Thái, Tân Cương",
      price: "112.500đ",
    },
  },
  {
    id: "khanhdung",
    name: "Cơ sở sản xuất chè Khánh Dung",
    shortName: "Khánh Dung",
    region: "Tân Cương",
    regionGroup: "tan-cuong",
    image: khanhDungImg,
    imageAlt: "Chè đặc sản Tân Cương cơ sở Khánh Dung gói 1kg",
    certification: "Chưa ghi nhận thông tin chứng nhận trong nguồn khảo sát",
    certHighlight: "Bán trực tiếp tại cơ sở",
    hasVerifiedCert: false,
    productCount: 6,
    price: "319.000đ",
    priceMinVnd: 319000,
    priceMaxVnd: 319000,
    website: "https://shopee.vn/chetancuongkhanhdung",
    touristNote:
      "Cơ sở sản xuất tại xóm Hồng Thái 2, Tân Cương, thuận tiện ghé mua trực tiếp.",
    occasions: ["daily"],
    featuredProduct: {
      name: "Chè Đặc Sản Tân Cương 1kg",
      detail: "Cơ sở gia đình, mạnh về tấm đinh và tấm nõn",
      price: "319.000đ",
    },
  },
  {
    id: "huongngoc",
    name: "Trà Xanh Hương Ngọc",
    shortName: "Hương Ngọc",
    region: "Tân Cương",
    regionGroup: "tan-cuong",
    image: huongNgocImg,
    imageAlt: "Sản phẩm Trà Xanh Hương Ngọc đóng gói Tân Cương",
    certification: "Chưa ghi nhận thông tin chứng nhận trong nguồn khảo sát",
    certHighlight: "Chưa ghi nhận chứng nhận",
    hasVerifiedCert: false,
    productCount: 8,
    price: "Xem tại gian hàng",
    priceMinVnd: null,
    priceMaxVnd: null,
    website: "https://shopee.vn/traxanhhuongngoc",
    touristNote: null,
    occasions: ["daily"],
    featuredProduct: {
      name: "Trà búp Lộc Xuân & Móc câu",
      detail: "Có gói dùng thử 10g, bán sỉ lẻ",
      price: "Xem gian hàng",
    },
  },
  {
    id: "labang",
    name: "HTX Chè La Bằng (Thanh Hải Trà)",
    shortName: "La Bằng",
    region: "La Bằng, Đại Từ",
    regionGroup: "dai-tu",
    image: laBangImg,
    imageAlt: "Hộp giấy xanh Thanh Hải Trà 320g của HTX Chè La Bằng",
    certification:
      "OCOP 5 sao quốc gia 2026 (Trà Tôm Nõn Thượng hạng); Đinh Tâm Trà từng là quà tặng APEC 2017",
    certHighlight: "OCOP 5 sao quốc gia 2026",
    hasVerifiedCert: true,
    productCount: 18,
    price: "Từ 76.000đ",
    priceMinVnd: 76000,
    priceMaxVnd: 3000000,
    website: "https://chethai.com.vn",
    touristNote:
      "Điểm lan tỏa văn hóa trà Đại Từ, kết hợp tuyến du lịch sinh thái chân Tam Đảo.",
    occasions: ["gift", "experience"],
    featuredProduct: {
      name: "Hồng Trà Trung Du Cổ",
      detail: "Gói 100g, La Bằng",
      price: "100.000đ",
    },
  },
  {
    id: "thuantra",
    name: "Thuận Trà (HTX Tâm Trà Việt)",
    shortName: "Thuận Trà",
    region: "La Bằng, Đại Từ",
    regionGroup: "dai-tu",
    image: thuanTraImg,
    imageAlt: "Combo Trà Sạch 6 Không và Bạch Trà Mẫu Đơn Thuận Trà",
    certification: "VietGAP và ISO 22000:2018 tại cơ sở sản xuất La Bằng",
    certHighlight: "VietGAP, ISO 22000:2018",
    hasVerifiedCert: true,
    productCount: 29,
    price: "Từ 40.000đ",
    priceMinVnd: 40000,
    priceMaxVnd: 3950000,
    website: "https://thuantrathainguyen.com",
    touristNote:
      "Xưởng chế biến tại La Bằng, Đại Từ, thuận tiện kết hợp tuyến tham quan Tam Đảo.",
    occasions: ["daily", "gift", "experience"],
    featuredProduct: {
      name: "Combo Trà Sạch 6 Không 215g",
      detail: "Niêm yết minh bạch theo quy cách",
      price: "299.000đ",
    },
  },
  {
    id: "vanphu",
    name: "Vạn Phú Trà",
    shortName: "Vạn Phú",
    region: "Đại Từ",
    regionGroup: "dai-tu",
    image: vanPhuImg,
    imageAlt: "Hộp Vạn Phú Hồng Trà Tiến Vua 100g",
    certification:
      "OCOP 3 sao 2026 cho 3 sản phẩm: Trà Vạn Phú, Trà Tâm An và Tam Đảo Thiên Sơn",
    certHighlight: "OCOP 3 sao 2026",
    hasVerifiedCert: true,
    productCount: 26,
    price: "Từ 25.000đ",
    priceMinVnd: 25000,
    priceMaxVnd: 1080000,
    website: "https://vanphutra.vn",
    touristNote:
      "Mô hình HTX chè gắn với du lịch sinh thái tại Đại Từ, phù hợp khách tham quan.",
    occasions: ["daily", "experience"],
    featuredProduct: {
      name: "Hồng Trà Pha Chế",
      detail: "Đại Từ, giá niêm yết",
      price: "70.000đ",
    },
  },
  {
    id: "huongque",
    name: "Hương Quê (HTX Nông sản Phú Lương)",
    shortName: "Hương Quê",
    region: "Phú Lương",
    regionGroup: "phu-luong-bang-phuc",
    image: huongQueImg,
    imageAlt: "Trà Tôm Nõn Hương Quê OCOP 5 sao Phú Lương",
    certification: "OCOP 5 sao quốc gia 2025 (Trà Tôm nõn Hương Quê)",
    certHighlight: "OCOP 5 sao quốc gia 2025",
    hasVerifiedCert: true,
    productCount: 1,
    price: "Liên hệ HTX",
    priceMinVnd: null,
    priceMaxVnd: null,
    website:
      "https://nongsanviet.nongnghiepmoitruong.vn/san-vat-thai-nguyen-la-ocop-5-sao-bai-1-chu-the-dau-tien-d833617.html",
    touristNote:
      "Vùng nguyên liệu tại xã Hợp Thành, huyện Phú Lương, Thái Nguyên.",
    occasions: ["gift"],
    featuredProduct: {
      name: "Trà Tôm Nõn Hương Quê",
      detail: "Xã Hợp Thành, Phú Lương",
      price: "Liên hệ HTX",
    },
  },
  {
    id: "bangphuc",
    name: "Chè Shan tuyết Bằng Phúc (HTX Chè Bạch Vân)",
    shortName: "Bằng Phúc",
    region: "Bằng Phúc, Đồng Phúc",
    regionGroup: "phu-luong-bang-phuc",
    image: bangPhucImg,
    imageAlt: "Minh họa vùng chè Shan tuyết cổ thụ Bằng Phúc",
    certification:
      "12 cây chè Shan tuyết cổ thụ được công nhận Cây di sản Việt Nam",
    certHighlight: "12 Cây di sản Việt Nam",
    hasVerifiedCert: true,
    productCount: 2,
    price: "Từ 100.000đ",
    priceMinVnd: 100000,
    priceMaxVnd: 500000,
    website:
      "https://thuantrathainguyen.com/blogs/news/giai-dap-tu-a-den-z-ve-tra-shan-tuyet-nguon-goc-phan-loai-cong-dung",
    touristNote:
      "Vùng chè cổ thụ trên độ cao 1.200m tại Bằng Phúc, điểm trải nghiệm mới sau sáp nhập tỉnh.",
    occasions: ["daily", "gift", "experience"],
    featuredProduct: {
      name: "Trà ống lam Shan tuyết",
      detail: "Nén trong ống lam khoảng 100g",
      price: "100.000đ - 130.000đ",
    },
  },
  {
    id: "khecoc",
    name: "HTX Chè an toàn Khe Cốc",
    shortName: "Khe Cốc",
    region: "Khe Cốc, Vô Tranh",
    regionGroup: "vo-tranh",
    image: kheCocImg,
    imageAlt: "Du khách trải nghiệm hái trà trên đồi chè Khe Cốc",
    certification:
      "5 sản phẩm OCOP 3-4 sao; sản xuất theo tiêu chuẩn TCVN 11041 nông nghiệp hữu cơ",
    certHighlight: "OCOP 3-4 sao, Hữu cơ TCVN 11041",
    hasVerifiedCert: true,
    productCount: 5,
    price: "Liên hệ hợp tác xã",
    priceMinVnd: null,
    priceMaxVnd: null,
    website:
      "https://danviet.vn/cau-chuyen-thoat-ngheo-tu-nhung-luong-che-o-khe-coc-d1342830.html",
    touristNote:
      "Trải nghiệm trực tiếp quy trình hái và sao chế chè hữu cơ tại Khe Cốc, Vô Tranh.",
    occasions: ["experience"],
    featuredProduct: {
      name: "Trà Tôm Nõn Khe Cốc",
      detail: "Vô Tranh, giá liên hệ HTX",
      price: "Liên hệ HTX",
    },
  },
];

export type TeaRegion = {
  id: TeaRegionId;
  name: string;
  tagline: string;
  note: string;
  heroAlt: string;
};

export const teaRegions: TeaRegion[] = [
  {
    id: "tan-cuong",
    name: "Tân Cương",
    tagline: "Vùng lõi chè đặc sản của Thái Nguyên",
    note: "Quy tụ nhiều HTX đạt OCOP 5 sao, chỉ dẫn địa lý cùng hệ thống showroom thưởng trà.",
    heroAlt: "Nương chè Tân Cương nhìn từ trên cao",
  },
  {
    id: "dai-tu",
    name: "Đại Từ và La Bằng",
    tagline: "Vùng chè dưới chân núi Tam Đảo",
    note: "Phát triển canh tác VietGAP, hướng hữu cơ gắn với tuyến du lịch sinh thái chân Tam Đảo.",
    heroAlt: "Sản phẩm trà từ vùng chè La Bằng, Thuận Trà và Vạn Phú",
  },
  {
    id: "phu-luong-bang-phuc",
    name: "Phú Lương và Bằng Phúc",
    tagline: "Từ vùng trà Phú Lương tới Shan tuyết cổ thụ trên 1.200m",
    note: "Nổi bật với Trà Tôm nõn Hương Quê OCOP 5 sao và quần thể chè Shan tuyết Cây di sản.",
    heroAlt: "Trà Hương Quê và vùng chè Shan tuyết Bằng Phúc",
  },
  {
    id: "vo-tranh",
    name: "Vô Tranh, Khe Cốc",
    tagline: "Điểm hẹn trải nghiệm cộng đồng và chè hữu cơ",
    note: "Tiên phong canh tác hữu cơ theo TCVN 11041 với hoạt động làm chè cùng người dân.",
    heroAlt: "Du khách hái chè tại Khe Cốc, Vô Tranh",
  },
];
