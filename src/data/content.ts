import type { Destination, Experience, Journey, LanguageContent, Product, Region, Station } from "@/domain/models";
import { proposedDestinations, proposedJourneys } from "@/data/proposedJourneys";
import { filesDestinations } from "@/data/filesDestinations";
import { destinationLocations } from "@/data/destinationLocations";
import { villageContent } from "@/data/villageContent";
import { craftDestinationContent, craftHomeCard, craftProductContent } from "@/data/craftContent";
import { greenDestinationContent, greenHomeCard } from "@/data/greenContent";
import { historyHomeCard } from "@/data/historyContent";
import { teaDestinationContent, teaHomeCard, tanCuongRegionContent } from "@/data/teaContent";
import { getResearchedDestinationImages } from "@/data/researchedDestinationImages";

const image = (id: string, url: string, alt: string) => ({ id, type: "image" as const, url, alt });

export const experiences: Experience[] = [
  { id: "tea-culture", name: "Tìm hiểu văn hóa trà", description: "Khám phá các lớp nội dung về trà qua điểm đến và sản phẩm địa phương." },
  { id: "green-landscape", name: "Không gian xanh", description: "Quan sát cảnh quan và lưu lại cảm nhận trong hành trình cá nhân." },
  { id: "village-life", name: "Khám phá bản làng", description: "Tiếp cận câu chuyện cộng đồng qua nội dung được tuyển chọn." },
];

const baseDestinations: Destination[] = [
  {
    id: "tan-cuong", slug: "tan-cuong", name: "Tân Cương", regionId: "tan-cuong-region",
    stationIds: ["tea-culture"], interestTags: ["tea", "culture", "nature"],
    suitableFor: ["solo", "friends", "family", "student", "international"], seasons: ["spring", "summer", "autumn", "winter"],
    shortDescription: teaDestinationContent["tan-cuong"].vi.cardDescription,
    story: teaDestinationContent["tan-cuong"].vi.profile.introduction[0],
    media: [image("tan-cuong-cover", "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=1600&q=85", "Đồi chè xanh, ảnh minh họa")],
    location: destinationLocations["tan-cuong"], experienceIds: ["tea-culture", "green-landscape"], productIds: [],
    relatedDestinationIds: ["hao-dat", "khong-gian-tra"], languageContentIds: ["hao-dat-en"], dataStatus: "source-provided",
  },
  {
    id: "hao-dat", slug: "htx-hao-dat", name: "HTX Hảo Đạt", regionId: "tan-cuong-region",
    stationIds: ["tea-culture", "craft-products"], interestTags: ["tea", "culture", "local-product"],
    suitableFor: ["friends", "family", "student", "international"], seasons: ["spring", "summer", "autumn", "winter"],
    shortDescription: craftDestinationContent["hao-dat"].vi.cardDescription,
    story: craftDestinationContent["hao-dat"].vi.profile.introduction[0],
    media: [image("hao-dat-cover", "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=1600&q=85", "Lá trà và chén trà, ảnh minh họa")],
    location: destinationLocations["hao-dat"], experienceIds: ["tea-culture"], productIds: ["tan-cuong-tea"],
    relatedDestinationIds: ["tan-cuong", "khong-gian-tra"], languageContentIds: ["hao-dat-en", "hao-dat-ru"], dataStatus: "source-provided",
  },
  {
    id: "khong-gian-tra", slug: "khong-gian-van-hoa-tra-tan-cuong", name: "Không gian Văn hóa Trà Tân Cương", regionId: "tan-cuong-region",
    stationIds: ["tea-culture"], interestTags: ["tea", "culture", "history"], suitableFor: ["family", "student", "international"],
    seasons: ["spring", "summer", "autumn", "winter"], shortDescription: teaDestinationContent["khong-gian-tra"].vi.cardDescription,
    media: [image("tea-space", "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1600&q=85", "Không gian thưởng trà, ảnh minh họa")],
    location: destinationLocations["khong-gian-tra"], experienceIds: ["tea-culture"], productIds: [], relatedDestinationIds: ["tan-cuong", "hao-dat"], dataStatus: "incomplete",
  },
  {
    id: "nui-coc", slug: "ho-nui-coc", name: "Hồ Núi Cốc", stationIds: ["green-tourism"],
    interestTags: ["nature"], suitableFor: ["solo", "friends", "family"], seasons: ["spring", "summer", "autumn", "winter"],
    shortDescription: greenDestinationContent["nui-coc"].vi.cardDescription,
    media: [image("nui-coc-cover", "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85", "Mặt hồ giữa thiên nhiên, ảnh minh họa")],
    location: destinationLocations["nui-coc"], experienceIds: ["green-landscape"], productIds: [], relatedDestinationIds: ["tan-cuong"], dataStatus: "source-provided",
  },
  {
    id: "thai-hai", slug: "lang-thai-hai", name: "Làng Thái Hải", stationIds: ["village"],
    interestTags: ["village", "culture"], suitableFor: ["friends", "family", "student", "international"], seasons: ["spring", "summer", "autumn", "winter"],
    shortDescription: villageContent["thai-hai"].vi.cardDescription,
    media: [image("thai-hai-cover", "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=85", "Không gian làng quê, ảnh minh họa")],
    location: destinationLocations["thai-hai"], experienceIds: ["village-life"], productIds: [], relatedDestinationIds: [], dataStatus: "source-provided",
  },
  {
    id: "la-bang", slug: "la-bang", name: "La Bằng", stationIds: ["tea-culture"], interestTags: ["tea", "nature"],
    suitableFor: ["solo", "friends", "family"], seasons: ["spring", "summer", "autumn"], shortDescription: "Vùng trà trong tuyến khám phá nhiều vùng chè.",
    media: [image("la-bang-cover", "https://images.unsplash.com/photo-1523920290228-4f321a939b4c?auto=format&fit=crop&w=1600&q=85", "Vườn trà, ảnh minh họa")],
    location: destinationLocations["la-bang"], experienceIds: ["tea-culture"], productIds: [], relatedDestinationIds: ["tan-cuong"], dataStatus: "source-provided",
  },
  {
    id: "vo-tranh", slug: "vo-tranh", name: "Vô Tranh", stationIds: ["tea-culture"], interestTags: ["tea", "nature"],
    suitableFor: ["friends", "family", "student"], seasons: ["spring", "summer", "autumn"], shortDescription: "Vùng trà được kết nối trong chuyên đề Văn hóa trà.",
    media: [image("vo-tranh-cover", "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=1600&q=85", "Lá trà xanh, ảnh minh họa")],
    location: destinationLocations["vo-tranh"], experienceIds: ["tea-culture"], productIds: [], relatedDestinationIds: ["la-bang"], dataStatus: "incomplete",
  },
  {
    id: "ghenh-che", slug: "ho-ghenh-che", name: "Hồ Ghềnh Chè", stationIds: ["green-tourism"], interestTags: ["nature"],
    suitableFor: ["solo", "friends", "family"], seasons: ["spring", "summer", "autumn"], shortDescription: greenDestinationContent["ghenh-che"].vi.cardDescription,
    media: [image("ghenh-che-cover", "https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=1600&q=85", "Hồ nước xanh, ảnh minh họa")],
    location: destinationLocations["ghenh-che"], experienceIds: ["green-landscape"], productIds: [], relatedDestinationIds: [], dataStatus: "incomplete",
  },
  {
    id: "ban-ten", slug: "ban-ten", name: "Bản Tèn", stationIds: ["village"], interestTags: ["village", "culture", "nature"],
    suitableFor: ["friends", "student", "international"], seasons: ["spring", "summer", "autumn", "winter"], shortDescription: villageContent["ban-ten"].vi.cardDescription,
    media: [image("ban-ten-cover", "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=85", "Cảnh quan miền núi, ảnh minh họa")],
    location: destinationLocations["ban-ten"], experienceIds: ["village-life"], productIds: [], relatedDestinationIds: ["thai-hai"], dataStatus: "incomplete",
  },
  {
    id: "khuan-bang", slug: "khuan-bang", name: "Khuân Bang", stationIds: ["village"], interestTags: ["village", "culture", "nature"],
    suitableFor: ["friends", "family", "student", "international"], seasons: ["spring", "summer", "autumn", "winter"], shortDescription: villageContent["khuan-bang"].vi.cardDescription,
    media: [image("khuan-bang-cover", "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=85", "Không gian bản làng, ảnh minh họa")],
    experienceIds: ["village-life"], productIds: [], relatedDestinationIds: ["thai-hai", "ban-ten"], dataStatus: "source-provided",
  },
  ...proposedDestinations,
  ...filesDestinations,
];

export const destinations: Destination[] = baseDestinations.map((destination) => {
  const researched = getResearchedDestinationImages(destination.id, destination.name);
  return researched.length ? { ...destination, media: researched } : destination;
});

export const regions: Region[] = [{ id: "tan-cuong-region", slug: "tan-cuong", name: "Tân Cương", description: tanCuongRegionContent.vi.introduction, seasons: ["spring", "summer", "autumn", "winter"], destinationIds: ["tan-cuong", "hao-dat", "khong-gian-tra"], experienceIds: ["tea-culture", "green-landscape"], location: destinationLocations["tan-cuong"] }];

export const stations: Station[] = [
  { id: "tea-culture", slug: "van-hoa-tra", name: "Văn hóa trà", description: teaHomeCard.vi, destinationIds: ["tan-cuong", "hao-dat", "khong-gian-tra", "la-bang", "vo-tranh", "tien-yen-farmstay"], icon: "Leaf" },
  { id: "village", slug: "ban-lang", name: "Bản làng", description: "Gặp gỡ không gian sống và câu chuyện cộng đồng.", destinationIds: ["thai-hai", "ban-ten", "khuan-bang", "xom-mo-ga", "suoi-kem-homestay", "tien-yen-farmstay"], icon: "House" },
  { id: "craft-products", slug: "lang-nghe-san-pham", name: "Làng nghề & sản phẩm", description: craftHomeCard.vi, destinationIds: ["bo-dau", "hao-dat"], icon: "Package" },
  { id: "green-tourism", slug: "du-lich-xanh", name: "Suối & du lịch xanh", description: greenHomeCard.vi, destinationIds: ["ghenh-che", "nui-coc", "ho-ba-be", "khu-du-lich-sinh-thai-phuong-hoang", "sen-ho-eco-garden", "suoi-kem-homestay", "dat-ngao-quan-chu"], icon: "Waves" },
  { id: "history-festival", slug: "lich-su-le-hoi", name: "Lịch sử & lễ hội", description: historyHomeCard.vi, destinationIds: ["dai-doi-915", "lan-tin-keo", "nha-tuong-niem-atk", "khuon-tat", "chua-hang-kim-son-tu", "khu-khao-co-than-sa", "den-duom"], icon: "Landmark" },
  { id: "journey-design", slug: "thiet-ke-hanh-trinh", name: "Thiết kế hành trình", description: "Biến sở thích của bạn thành một tuyến khám phá.", destinationIds: [], icon: "Route" },
];

export const products: Product[] = [{ id: "tan-cuong-tea", slug: "tra-tan-cuong", name: craftProductContent.vi.name, shortDescription: craftProductContent.vi.shortDescription, media: [image("tea-product", "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=85", "Sản phẩm trà, ảnh minh họa")], destinationIds: ["hao-dat"], journeyIds: ["tea-lake"], dataStatus: "source-provided" }];

export const languageContents: LanguageContent[] = [
  { id: "hao-dat-en", destinationId: "hao-dat", language: "en", vocabulary: [{ source: "Trà", translated: "Tea" }, { source: "Búp chè", translated: "Tea bud" }, { source: "Hương thơm", translated: "Aroma" }], phrases: [{ source: "Mời bạn thưởng trà", translated: "Please enjoy some tea" }], challenge: "Dùng một cụm từ khi tìm hiểu sản phẩm trà." },
  { id: "hao-dat-ru", destinationId: "hao-dat", language: "ru", vocabulary: [{ source: "Trà", translated: "Чай" }, { source: "Cảm ơn", translated: "Спасибо" }], phrases: [{ source: "Xin chào", translated: "Здравствуйте" }] },
];

export const journeys: Journey[] = [
  {
    id: "tea-lake", slug: "huong-tra-va-ho-xanh", name: "Hương trà và hồ xanh", summary: "Kết nối không gian trà Tân Cương với điểm cảnh quan xanh trong hành trình hai ngày.",
    duration: "2-days", interests: ["tea", "tea-product", "nature", "culture"], audiences: ["family", "friends", "international"], seasons: ["spring", "summer", "autumn"],
    days: [{ day: 1, items: [{ destinationId: "tan-cuong", startTime: "08:30", isDemoSchedule: true }, { destinationId: "hao-dat", startTime: "14:00", isDemoSchedule: true }] }, { day: 2, items: [{ destinationId: "nui-coc", startTime: "09:00", isDemoSchedule: true }] }],
    destinationIds: ["tan-cuong", "hao-dat", "nui-coc"], image: "https://images.unsplash.com/photo-1563911892437-1feda0179e1b?auto=format&fit=crop&w=1600&q=85", priority: 1, dataStatus: "demo",
  },
  {
    id: "tea-regions", slug: "theo-dau-nhung-vung-tra", name: "Theo dấu những vùng trà", summary: "Một tuyến nội dung kết nối Tân Cương, La Bằng và Vô Tranh.",
    duration: "2-days", interests: ["tea", "nature", "village"], audiences: ["family", "friends", "student"], seasons: ["spring", "summer", "autumn"],
    days: [{ day: 1, items: [{ destinationId: "tan-cuong", isDemoSchedule: true }, { destinationId: "la-bang", isDemoSchedule: true }] }, { day: 2, items: [{ destinationId: "vo-tranh", isDemoSchedule: true }] }],
    destinationIds: ["tan-cuong", "la-bang", "vo-tranh"], image: "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=1600&q=85", priority: .8, dataStatus: "demo",
  },
  {
    id: "local-day", slug: "mot-ngay-lam-nguoi-thai-nguyen", name: "Một ngày làm người Thái Nguyên", summary: "Gợi ý trải nghiệm văn hóa, trà và bản làng trong dữ liệu minh họa.",
    duration: "1-day", interests: ["tea", "culture", "food", "village"], audiences: ["family", "student", "international"], seasons: ["spring", "summer", "autumn", "winter"],
    days: [{ day: 1, items: [{ destinationId: "khong-gian-tra", isDemoSchedule: true }, { destinationId: "thai-hai", isDemoSchedule: true }] }],
    destinationIds: ["khong-gian-tra", "thai-hai"], image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1600&q=85", priority: .7, dataStatus: "demo",
  },
  {
    id: "green-villages", slug: "sac-xanh-ban-lang", name: "Sắc xanh bản làng", summary: "Kết hợp cảnh quan xanh và điểm bản làng trong một hành trình dài hơn.",
    duration: "3-plus-days", interests: ["nature", "village", "culture"], audiences: ["friends", "family", "international"], seasons: ["spring", "autumn"],
    days: [{ day: 1, items: [{ destinationId: "ghenh-che", isDemoSchedule: true }] }, { day: 2, items: [{ destinationId: "thai-hai", isDemoSchedule: true }] }, { day: 3, items: [{ destinationId: "ban-ten", isDemoSchedule: true }] }],
    destinationIds: ["ghenh-che", "thai-hai", "ban-ten"], image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=85", priority: .5, dataStatus: "demo",
  },
  ...proposedJourneys,
];
