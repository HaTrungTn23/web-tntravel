import type { Locale } from "@/i18n/config";

export const festivalPath = "/events/festival-tra-thai-nguyen-2026";
export const festivalStart = "2026-10-30";
export const festivalEnd = "2026-11-07";

export type LocalText = Record<Locale, string>;
export interface FestivalSession {
  id: string;
  day: number | "all";
  time: string;
  title: LocalText;
  venue: LocalText;
  source: string;
  mapQuery?: string;
}

const local = (vi: string, en: string, ru: string): LocalText => ({ vi, en, ru });

export const festivalCopy = {
  vi: {
    label: "Sự kiện nổi bật",
    title: "Festival Trà Quốc tế Thái Nguyên 2026",
    intro: "Từ phố trà đến những vùng chè, khám phá con người và văn hóa trà Thái Nguyên trong chín ngày hội.",
    date: "30/10 - 07/11/2026",
    theme: "Thái Nguyên - Đệ nhất danh trà",
    schedule: "Lịch sự kiện",
    scheduleBody: "Chọn ngày để xem các hoạt động. Giờ hiển thị theo giờ Việt Nam (UTC+7).",
    allDays: "Diễn ra cả kỳ",
    day: "Ngày",
    noSession: "Chưa có hoạt động được xác nhận cho ngày này.",
    source: "Xem nguồn",
    directions: "Xem đường đi",
    highlight: "Trải nghiệm đáng khám phá",
    places: "Từ phố trà đến vùng chè",
    placesBody: "Kết hợp ngày hội ở trung tâm với một chuyến đi tới vùng chè.",
    routes: "Gợi ý chuyến đi",
    practical: "Trước khi đi",
    photoNote: "Ảnh tư liệu địa phương chụp trước Festival.",
    updateNote: "Lịch có thể thay đổi. Kiểm tra thông báo của ban tổ chức trước khi khởi hành.",
    official: "Thông tin Festival từ tỉnh Thái Nguyên",
    traffic: "Phương án phân luồng giao thông",
    rail: "Thông tin chuyến tàu di sản",
    viewSchedule: "Xem lịch",
    discover: "Khám phá Festival",
    ongoing: "Đang diễn ra",
    upcoming: "Sắp diễn ra",
    ended: "Nhìn lại Festival",
    visit: "Khám phá điểm đến",
    routeLink: "Xem hành trình",
  },
  en: {
    label: "Featured event", title: "Thai Nguyen International Tea Festival 2026",
    intro: "From Tea Street to the tea-growing regions, explore the people and tea culture of Thai Nguyen across nine days.",
    date: "30 Oct - 7 Nov 2026", theme: "Thai Nguyen - the home of fine tea", schedule: "Festival programme",
    scheduleBody: "Choose a date to see the activities. Times are in Vietnam time (UTC+7).",
    allDays: "Throughout the festival", day: "Day", noSession: "No confirmed activities for this date yet.",
    source: "View source", directions: "Get directions", highlight: "Experiences to explore",
    places: "From Tea Street to the tea hills", placesBody: "Pair a city festival visit with a trip to a tea-growing region.",
    routes: "Suggested trips", practical: "Before you go", photoNote: "Local archive photograph taken before the festival.",
    updateNote: "Programmes may change. Check the organiser's announcements before travelling.",
    official: "Festival information from Thai Nguyen Province", traffic: "Traffic arrangements", rail: "Heritage train information",
    viewSchedule: "View programme", discover: "Explore the festival", ongoing: "Happening now", upcoming: "Coming soon",
    ended: "Festival highlights", visit: "Explore destination", routeLink: "View itinerary",
  },
  ru: {
    label: "Главное событие", title: "Международный фестиваль чая в Тхайнгуене 2026",
    intro: "От Чайной улицы до чайных плантаций: девять дней знакомства с людьми и чайной культурой Тхайнгуена.",
    date: "30 октября - 7 ноября 2026", theme: "Тхайнгуен - край знаменитого чая", schedule: "Программа фестиваля",
    scheduleBody: "Выберите дату, чтобы посмотреть мероприятия. Время указано по Вьетнаму (UTC+7).",
    allDays: "В течение всего фестиваля", day: "День", noSession: "Подтверждённых мероприятий на эту дату пока нет.",
    source: "Источник", directions: "Маршрут", highlight: "Что посмотреть",
    places: "От Чайной улицы до чайных холмов", placesBody: "Совместите посещение фестиваля в центре с поездкой в чайный район.",
    routes: "Идеи поездок", practical: "Перед поездкой", photoNote: "Архивное фото местности, снятое до фестиваля.",
    updateNote: "Программа может измениться. Перед поездкой проверьте сообщения организаторов.",
    official: "Информация провинции Тхайнгуен", traffic: "Ограничения движения", rail: "Туристический поезд",
    viewSchedule: "Смотреть программу", discover: "Открыть фестиваль", ongoing: "Идёт сейчас", upcoming: "Скоро",
    ended: "Фестиваль в фотографиях", visit: "Открыть место", routeLink: "Смотреть маршрут",
  },
} as const;

export const festivalSessions: FestivalSession[] = [
  { id: "tea-street", day: "all", time: "30/10 - 07/11", title: local("Phố Trà, trưng bày sản phẩm và ẩm thực", "Tea Street, local products and food", "Чайная улица, местные продукты и кухня"), venue: local("Phố đi bộ trung tâm", "Central pedestrian street", "Центральная пешеходная улица"), source: "https://thainguyen.gov.vn/van-hoa-xa-hoi/pho-tra-thu-hut-du-khach-trai-nghiem-van-hoa-tra-thai-nguyen-303831", mapQuery: "Pho di bo trung tam Thai Nguyen" },
  { id: "exhibition", day: "all", time: "30/10 - 07/11", title: local("Triển lãm 195 năm thành lập tỉnh", "Exhibition: 195 years of Thai Nguyen", "Выставка к 195-летию провинции"), venue: local("Trung tâm Văn hóa tỉnh", "Provincial Cultural Centre", "Провинциальный культурный центр"), source: "https://thainguyen.gov.vn/tin-hoat-dong-cua-tinh/trien-lam-thai-nguyen-195-nam-thanh-tuu-hoi-nhap-va-phat-trien-303826" },
  { id: "opening", day: 30, time: "19:45", title: local("Lễ khai mạc và chương trình nghệ thuật", "Opening ceremony and cultural performance", "Открытие и культурная программа"), venue: local("Quảng trường Võ Nguyên Giáp", "Vo Nguyen Giap Square", "Площадь Во Нгуен Зяп"), source: "https://nari.thainguyen.gov.vn/chuyen-muc-tin-tuc/festival-tra-quoc-te-thai-nguyen-nam-2026-303578", mapQuery: "Quang truong Vo Nguyen Giap Thai Nguyen" },
  { id: "tea-parade", day: 30, time: "17:30 - 18:30", title: local("Diễu hành Rước Trà khai hội", "Opening tea parade", "Чайное шествие открытия"), venue: local("Khu trung tâm, qua Quảng trường Võ Nguyên Giáp", "City centre, via Vo Nguyen Giap Square", "Центр города, через площадь Во Нгуен Зяп"), source: "https://nari.thainguyen.gov.vn/chuyen-muc-tin-tuc/festival-tra-quoc-te-thai-nguyen-nam-2026-303578" },
  { id: "food", day: 30, time: "Chiều", title: local("Liên hoan trình diễn món ăn từ trà", "Tea-inspired food showcase", "Показ блюд с чаем"), venue: local("Phố đi bộ trung tâm", "Central pedestrian street", "Центральная пешеходная улица"), source: "https://thainguyen.gov.vn/tin-hoat-dong-cua-tinh/dac-sac-lien-hoan-trinh-dien-gioi-thieu-am-thuc-ve-tra-303781" },
  { id: "train-opening", day: 30, time: "Trong ngày", title: local("Khai trương Chuyến tàu di sản Hà Nội - Thái Nguyên", "Heritage train opening journey", "Первый рейс туристического поезда"), venue: local("Hà Nội - Ga Lưu Xá", "Hanoi - Luu Xa Station", "Ханой - станция Лууса"), source: "https://thainguyen.gov.vn/tin-anh/chuyen-tau-di-san-ha-noi-thai-nguyen-chinh-thuc-khai-truong-303810" },
  { id: "la-bang", day: 31, time: "Trong ngày", title: local("Danh trà đất Việt - Rạng rỡ La Bằng", "La Bang tea celebration", "Праздник чая в Лабанг"), venue: local("Xã La Bằng", "La Bang commune", "Община Лабанг"), source: "https://thainguyen.gov.vn/tin-hoat-dong-cua-don-vi/soi-dong-chuong-trinh-danh-tra-dat-viet-rang-ro-la-bang-303856" },
  { id: "tea-forum", day: 31, time: "Buổi sáng", title: local("Diễn đàn kinh tế Trà Quốc tế", "International tea economy forum", "Международный форум чайной экономики"), venue: local("65 Hoàng Văn Thụ", "65 Hoang Van Thu Street", "Улица Хоанг Ван Тху, 65"), source: "https://thainguyen.gov.vn/tin-hoat-dong-cua-tinh/dien-dan-kinh-te-tra-quoc-te-2026-tu-di-san-tra-den-kinh-te-tra-toan-cau-303829" },
  { id: "dai-phuc-night", day: 31, time: "Buổi tối", title: local("Đại Phúc - Hồ trên núi, trà trong mây", "Dai Phuc: lake and tea celebration", "Дайфук: озеро и чай"), venue: local("Xã Đại Phúc", "Dai Phuc commune", "Община Дайфук"), source: "https://thainguyen.gov.vn/tin-hoat-dong-cua-don-vi/813ac90ddbe35dd75c86c63a055b1265-303878" },
  { id: "tan-cuong", day: 1, time: "Buổi sáng", title: local("Tân Cương - Tinh hoa trà Việt", "Tan Cuong - the essence of Vietnamese tea", "Танкыонг - искусство вьетнамского чая"), venue: local("Không gian Văn hóa trà Tân Cương", "Tan Cuong Tea Cultural Space", "Центр чайной культуры Танкыонг"), source: "https://tancuong.thainguyen.gov.vn/chuyen-oi-so/tan-cuong-tinh-hoa-tra-viet-304070" },
  { id: "competition-la-bang", day: 1, time: "Trong ngày", title: local("World Master Tea: trải nghiệm nghề chè", "World Master Tea: tea-making experience", "World Master Tea: знакомство с чайным ремеслом"), venue: local("HTX Trà Búp Ngọc, La Bằng", "Tra Bup Ngoc cooperative, La Bang", "Кооператив Tra Bup Ngoc, Лабанг"), source: "https://thainguyen.gov.vn/tin-hoat-dong-cua-don-vi/20-thi-sinh-buoc-vao-vong-2-cuoc-thi-world-master-tea-vietnam-2026-303920" },
  { id: "concert", day: 1, time: "Buổi tối", title: local("Concert Nối vòng tay lớn", "Noi Vong Tay Lon concert", "Концерт Noi Vong Tay Lon"), venue: local("Sân vận động tỉnh", "Provincial stadium", "Провинциальный стадион"), source: "https://thainguyen.gov.vn/festival-tra" },
  { id: "competition-drinks", day: 2, time: "Buổi chiều", title: local("World Master Tea: sáng tạo đồ uống", "World Master Tea: creating tea drinks", "World Master Tea: создание чайных напитков"), venue: local("Trung tâm Văn hóa Trà ESG Valley", "ESG Valley Tea Cultural Centre", "Чайный центр ESG Valley"), source: "https://thainguyen.gov.vn/tin-hoat-dong-cua-don-vi/vong-3-cuoc-thi-world-master-tea-vietnam-2026-sang-tao-cong-thuc-pha-che-304101" },
  { id: "competition-stall", day: 3, time: "Buổi chiều", title: local("World Master Tea: vận hành gian hàng", "World Master Tea: tea stall challenge", "World Master Tea: работа чайной лавки"), venue: local("Phố đi bộ trung tâm", "Central pedestrian street", "Центральная пешеходная улица"), source: "https://thainguyen.gov.vn/tin-hoat-dong-cua-don-vi/vong-4-cuoc-thi-world-master-tea-vietnam-2026-thu-thach-kinh-doanh-304349" },
  { id: "tea-night", day: 4, time: "19:30", title: local("Đêm hội thưởng trà", "Tea-tasting festival night", "Вечер дегустации чая"), venue: local("Sân khấu Phố đi bộ trung tâm", "Central pedestrian street stage", "Сцена на центральной пешеходной улице"), source: "https://quanchu.thainguyen.gov.vn/tin-moi/thai-nguyen-sap-bung-no-voi-festival-tra-quoc-te-2026-phao-hoa-tam-cao-dan-sao-noi-tieng-va-16-hoat-dong-dac-sac-302208" },
  { id: "master-final", day: 4, time: "19:00 - 20:45", title: local("Chung kết World Master Tea Vietnam", "World Master Tea Vietnam final", "Финал World Master Tea Vietnam"), venue: local("65 Hoàng Văn Thụ", "65 Hoang Van Thu Street", "Улица Хоанг Ван Тху, 65"), source: "https://worldmastertea.com/mua-giai-2026/", mapQuery: "65 Hoang Van Thu Thai Nguyen" },
  { id: "heritage-train", day: 5, time: "Trong ngày", title: local("Chuyến tàu di sản Hà Nội - Thái Nguyên", "Hanoi - Thai Nguyen heritage train", "Туристический поезд Ханой - Тхайнгуен"), venue: local("Hà Nội - Thái Nguyên", "Hanoi - Thai Nguyen", "Ханой - Тхайнгуен"), source: "https://thainguyen.gov.vn/festival-tra/thai-nguyen-se-to-chuc-6-chuyen-tau-du-lich-ha-noi-thai-nguyen-dip-festival-tra-quoc-te-299439" },
  { id: "street-arts", day: 5, time: "Buổi tối", title: local("Biểu diễn nghệ thuật đường phố", "Street performances", "Уличные выступления"), venue: local("Phố đi bộ trung tâm", "Central pedestrian street", "Центральная пешеходная улица"), source: "https://sovhttdl.thainguyen.gov.vn/thong-tin-bao-chi-xuat-ban/cung-cap-thong-tin-cho-bao-chi-ve-ky-niem-195-nam-thanh-lap-tinh-thai-nguyen-va-khai-mac-festival-tra-quoc-te-thai-nguyen-2026-301847" },
  { id: "dong-phuc", day: 6, time: "Trong ngày", title: local("Đồng Phúc mùa vàng - Hương trà giữa tầng mây", "Dong Phuc: Shan Tuyet tea among the clouds", "Донгфук: чай Шантует среди облаков"), venue: local("Vùng chè Shan tuyết Bằng Phúc", "Bang Phuc Shan Tuyet tea region", "Чайный район Бангфук"), source: "https://thainguyen.gov.vn/festival-tra/dong-phuc-to-chuc-chuoi-hoat-dong-huong-ung-festival-tra-quoc-te-thai-nguyen-nam-2026-295779" },
  { id: "closing", day: 7, time: "Buổi tối", title: local("Lễ bế mạc Festival", "Festival closing ceremony", "Закрытие фестиваля"), venue: local("Khu vực trung tâm Thái Nguyên", "Central Thai Nguyen", "Центр Тхайнгуена"), source: "https://sovhttdl.thainguyen.gov.vn/thong-tin-bao-chi-xuat-ban/cung-cap-thong-tin-cho-bao-chi-ve-ky-niem-195-nam-thanh-lap-tinh-thai-nguyen-va-khai-mac-festival-tra-quoc-te-thai-nguyen-2026-301847" },
];

export function festivalState(now = new Date()): "upcoming" | "ongoing" | "ended" {
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  if (day < festivalStart) return "upcoming";
  if (day > festivalEnd) return "ended";
  return "ongoing";
}

export function festivalCurrentDay(now = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Ho_Chi_Minh", day: "numeric", month: "numeric" }).formatToParts(now);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);
  if (month === 10 && day >= 30) return day;
  if (month === 11 && day <= 7) return day;
  return month < 11 ? 30 : 7;
}
