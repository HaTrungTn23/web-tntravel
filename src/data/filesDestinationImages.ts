import type { Media } from "@/domain/models";

type PhotoSet = { base: string; files: string[]; source: string; credit: string };
const thaiNguyenCdn = "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/";
const tourismPortal = "https://mythainguyen.vn";

// Ảnh từ trang giới thiệu đúng địa điểm. Giữ URL và trang nguồn để có thể
// đối chiếu/tác quyền; không dùng ảnh stock như ảnh chụp thực địa.
const photos: Record<string, PhotoSet[]> = {
  "chua-hang-kim-son-tu": [
    { base: `${thaiNguyenCdn}thienvn.tnn/Ch%c3%b9aHang/`, files: [
      "chuahang5_637653339736942857.jpg", "doanhtuanhoixuanchuahang_637653309440414594.jpg", "chuahang1_637653336514076622.jpg", "chuahang2_637653337735557005.jpg", "chuahang_637653303626171107.png",
    ], source: `${tourismPortal}/vi/chuahang`, credit: "Cổng du lịch Thái Nguyên" },
    { base: `${thaiNguyenCdn}ngoclinh.tnn/Tin%202024/Ch%c3%b9a%20Hang%20h%e1%bb%99i/`, files: [
      "img_0638_219781702.jpg", "img_0359_621375808.jpg",
    ], source: `${tourismPortal}/vi/chuahang`, credit: "Cổng du lịch Thái Nguyên" },
  ],
  "khu-du-lich-sinh-thai-phuong-hoang": [
    { base: "https://vonhai.thainguyen.vietnaminfo.net/DataFiles/2022/07/Photos/", files: [
      "20220713-102724-zmp5LZiA.webp", "20220713-102724-YFbGMdRc.webp", "20220713-102723-9I37d9Ab.webp", "20220713-102723-i6T8KaMH.webp", "20220713-102723-Ognl5erC.webp", "20220713-102722-bm3UxAkU.webp", "20220713-102724-cbgMnnXx.webp",
    ], source: "https://vonhai.thainguyen.vietnaminfo.net/vi/place/details/hang-phuong-hoang-suoi-mo-ga-9", credit: "Cổng du lịch Võ Nhai" },
  ],
  "khu-khao-co-than-sa": [
    { base: `${thaiNguyenCdn}ngoclinh.tnn/%c4%90i%e1%bb%83m%20%c4%91%e1%ba%bfn/Kh%e1%ba%a3o%20c%e1%bb%95%20Th%e1%ba%a7n%20Sa/`, files: [
      "dji_20250604164935_0058_d_350035013.jpg", "dji_20250604164834_0053_d_783072205.jpg", "20250604_164028_753745867.jpg", "20250604_163738_597848583.jpg", "20250604_163321_291382337.jpg", "20250604_163225_811624735.jpg", "20250604_163136_135563337.jpg",
    ], source: `${tourismPortal}/vi/khuditichkhaocohoc`, credit: "Cổng du lịch Thái Nguyên" },
  ],
  "sen-ho-eco-garden": [
    { base: "https://senhoecogarden.com/images/", files: [
      "hero-hosen-drone.jpg", "gt-daotron.jpg", "gt-hosen-1.jpg", "gal-hosen-nonbo.jpg", "gt-villa-day.jpg", "gal-gazebo-tre.jpg", "gal-sen-trang.jpg",
    ], source: "https://senhoecogarden.com/", credit: "Sen Hồ Eco Garden" },
  ],
  "suoi-kem-homestay": [
    { base: `${thaiNguyenCdn}ngoclinh.tnn/%c4%90i%e1%bb%83m%20%c4%91%e1%ba%bfn/Su%e1%bb%91i%20K%e1%ba%b9m%20Homestay/`, files: [
      "dji_20240708091845_0277_d_727679553.jpg", "20240708_101653_203227891.jpg", "dji_20240708093650_0295_d_264487016.jpg", "dji_20240708105658_0332_d_958020769.jpg", "z5616938714992_5d771a06d9922da7662f523adbd2c94c_866606298.jpg", "z5616938624202_e6d4451e5fc9983b266d498d14720223_12754232.jpg",
    ], source: `${tourismPortal}/vi/suoikemhomestay`, credit: "Cổng du lịch Thái Nguyên" },
    { base: `${thaiNguyenCdn}ngoclinh.tnn/Tin%202024/Su%E1%BB%91i%20K%E1%BA%B9m%20Homestay/`, files: [
      "z5621885166663_27f0112c34f0116a7444054a403d9bdd_856779949.jpg",
    ], source: `${tourismPortal}/iv/detailnews/?id=news_1327`, credit: "Cổng du lịch Thái Nguyên" },
  ],
  "tien-yen-farmstay": [
    { base: `${thaiNguyenCdn}ngoclinh.tnn/Tin%202025/Ti%E1%BA%BFn%20Y%C3%AAn/`, files: [
      "z6616974740335_9ba2b496119cd894e6feba047c554a3e_561391466.jpg", "z6616974375001_3252f0c8fb16f78fb7daff0ba4443044_188706107.jpg", "z6616974422372_7a78209fac1e630dc325600e7272c813_433913229.jpg", "z6616974375000_976499205bf4fc245b8f6d6c488b055f_487661116.jpg", "z6616974289871_16aaaeca5ccb8ebff5dc64b1ae1c9110_124725109.jpg", "z6616974316703_15d6334d85ffa5e916c01abb5d92cc1d_159591535.jpg", "z6616974375002_13e21b14cfc3fe85780424e015357ac1_136367327.jpg",
    ], source: `${tourismPortal}/vi/detailnews/?id=news_1520`, credit: "Cổng du lịch Thái Nguyên" },
  ],
  "dat-ngao-quan-chu": [
    { base: `${thaiNguyenCdn}thienvn.tnn/th%c3%a1cngao/`, files: [
      "04_2_637665486038436688.jpg", "68534207_2392142064210219_6047337991699955712_n_637665485790354199.jpg", "68885324_2392141777543581_15841213777182720_n_637665485833733830.jpg", "69436654_2392141617543597_7713507912085143552_n_637665485919938063.jpg",
    ], source: `${tourismPortal}/vi/thacdatngao`, credit: "Cổng du lịch Thái Nguyên" },
    { base: "https://nongthon.vietnamtourism.gov.vn/wp-content/uploads/2023/09/", files: [
      "1606.Tiem-nang-va-dinh-huong-phat-trien-du-lich-sinh-thai-cong-dong-tai-Thac-Ngao-Quan-Chu-1.jpg", "1606.Tiem-nang-va-dinh-huong-phat-trien-du-lich-sinh-thai-cong-dong-tai-Thac-Ngao-Quan-Chu-2.jpeg", "1606.Tiem-nang-va-dinh-huong-phat-trien-du-lich-sinh-thai-cong-dong-tai-Thac-Ngao-Quan-Chu-3.jpeg",
    ], source: "https://nongthon.vietnamtourism.gov.vn/tiem-nang-va-dinh-huong-phat-trien-du-lich-sinh-thai-cong-dong-tai-thac-ngao-quan-chu-dai-tu-thai-nguyen/", credit: "Cổng du lịch nông thôn Việt Nam" },
  ],
  "den-duom": [
    { base: `${thaiNguyenCdn}ngoclinh.tnn/%c4%90i%e1%bb%83m%20%c4%91%e1%ba%bfn/%c4%90u%e1%bb%95m/`, files: [
      "img_5205_287569717.jpg", "img_5035_289886115.jpg", "img_5095_447888031.jpg", "img_5321_684331377.jpg", "img_5080_24890241.jpg", "img_5077_739198321.jpg", "img_5307_876214143.jpg",
    ], source: `${tourismPortal}/vi/denduom`, credit: "Cổng du lịch Thái Nguyên" },
  ],
};

export function getFilesDestinationImages(id: string, destinationName: string): Media[] {
  const sets = photos[id] ?? [];
  return sets.flatMap((set) => set.files.map((file) => ({
    id: `${id}-image-${file}`, type: "image" as const, url: set.base + file,
    alt: `${destinationName} — ảnh tại điểm đến`, caption: set.credit, sourceUrl: set.source,
  }))).map((image, index) => ({ ...image, order: index, isCover: index === 0 }));
}
