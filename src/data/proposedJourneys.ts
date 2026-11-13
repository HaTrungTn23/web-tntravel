import type { AudienceType, Destination, Journey, JourneyItem, Season } from "@/domain/models";
import { destinationLocations } from "@/data/destinationLocations";
import { villageContent } from "@/data/villageContent";
import { craftDestinationContent } from "@/data/craftContent";
import { greenDestinationContent } from "@/data/greenContent";
import { historyDestinationContent } from "@/data/historyContent";
import { festivalStories } from "@/data/cultureCatalog";

const cover = {
  tea: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=1600&q=85",
  lake: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85",
  village: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=85",
  history: "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=1600&q=85",
  mountain: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85",
};
const allAudiences: AudienceType[] = ["solo", "friends", "family", "student", "international"];
const allSeasons: Season[] = ["spring", "summer", "autumn", "winter"];
const step = (startTime: string, title: string, note: string, destinationId?: string): JourneyItem => ({ startTime, title, note, destinationId, isDemoSchedule: true });
const clone = (items: JourneyItem[]) => items.map((item) => ({ ...item }));
const teaLakeDay = [
  step("08:00", "Trung tâm → Tân Cương", "Di chuyển đến cơ sở đón khách."),
  step("08:45", "Nương chè và HTX chè Hảo Đạt ★", "Khám phá vùng nguyên liệu, tìm hiểu chế biến chè.", "hao-dat"),
  step("10:15", "Không gian thưởng trà ★", "Thưởng trà, tìm hiểu cách pha và chọn sản phẩm.", "khong-gian-tra"),
  step("11:00", "Tân Cương → hồ Núi Cốc", "Di chuyển tới cổng và bến đã chọn."),
  step("13:00", "Hồ Núi Cốc ★", "Đi thuyền theo tuyến đã xác nhận; có thể thay bằng tham quan ven hồ.", "nui-coc"),
  step("16:00", "Hồ Núi Cốc → trung tâm", "Trở về, nghỉ đêm tại trung tâm nếu tiếp tục hành trình."),
];
const museumVillageDay = [
  step("08:00", "Bảo tàng Văn hóa các dân tộc Việt Nam", "Tìm hiểu văn hóa, kiến trúc và đời sống cộng đồng.", "bao-tang-dan-toc"),
  step("10:00", "Bảo tàng → Thái Hải", "Di chuyển, làm thủ tục đón khách."),
  step("11:00", "Không gian nhà sàn Thái Hải ★", "Tham quan có hướng dẫn, tìm hiểu đời sống cộng đồng.", "thai-hai"),
  step("12:00", "Khu ẩm thực Thái Hải ★", "Ăn trưa và nghỉ theo thực đơn đã xác nhận."),
  step("13:30", "Không gian sinh hoạt cộng đồng ★", "Giao lưu; hát then, đàn tính chỉ khi đã đặt trước."),
  step("16:00", "Thái Hải → trung tâm", "Trở về."),
];
const atkDay = [
  step("07:30", "Trung tâm → Bờ Đậu", "Di chuyển."),
  step("08:15", "Hộ sản xuất bánh tại Bờ Đậu ★", "Tìm hiểu nghề, quan sát gói bánh nếu có ca sản xuất.", "bo-dau"),
  step("09:00", "Bờ Đậu → cụm ATK tại Phú Đình", "Di chuyển."),
  step("10:30", "Lán Tỉn Keo", "Tìm hiểu vai trò của ATK trong kháng chiến.", "lan-tin-keo"),
  step("13:00", "Nhà tưởng niệm Chủ tịch Hồ Chí Minh", "Tham quan, tưởng niệm theo nhu cầu.", "nha-tuong-niem-atk"),
  step("14:30", "Cây đa và khu di tích Khuôn Tát", "Nghe giới thiệu nếu đặt thuyết minh trước.", "khuon-tat"),
  step("15:30", "ATK → trung tâm", "Trở về."),
];
const laBangDay = [
  step("08:00", "Trung tâm → La Bằng", "Di chuyển."),
  step("09:30", "Nương chè và cơ sở trà ★", "Tìm hiểu vùng nguyên liệu và công việc làm chè.", "la-bang"),
  step("11:00", "Không gian thưởng trà ★", "Thưởng trà La Bằng, tìm hiểu sản phẩm."),
  step("13:45", "Khu vực suối Kẹm ★", "Đi bộ ngắn, ngắm suối; không mặc định bao gồm trekking hay tắm suối.", "suoi-kem"),
  step("15:45", "La Bằng → trung tâm", "Trở về."),
];
const phuongHoangDay = [
  step("07:30", "Trung tâm → khu du lịch Phượng Hoàng", "Di chuyển."),
  step("09:30", "Tuyến lên hang Phượng Hoàng ★", "Chỉ thực hiện khi tuyến mở và khách có thể lực phù hợp.", "hang-phuong-hoang"),
  step("13:30", "Khu vực suối Mỏ Gà", "Ngắm cảnh tại phạm vi được phép.", "suoi-mo-ga"),
  step("14:30", "Xóm Mỏ Gà ★", "Dạo làng cùng người địa phương.", "xom-mo-ga"),
  step("15:45", "Mỏ Gà → trung tâm", "Trở về."),
];
const urbanHistoryDay = [
  step("08:00", "Bảo tàng Văn hóa các dân tộc Việt Nam", "Tham quan trưng bày về đời sống và nghề truyền thống.", "bao-tang-dan-toc"),
  step("10:30", "Di tích lịch sử Đại đội 915", "Tham quan khu tưởng niệm; thuyết minh cần đặt trước.", "dai-doi-915"),
  step("13:30", "Điểm kết thúc trung tâm", "Kết thúc sớm để khách nối hành trình."),
];
const baBeDay = [
  step("08:30", "Hồ Ba Bể – Ao Tiên ★", "Đi thuyền ngắm hồ khi tuyến được phép hoạt động.", "ho-ba-be"),
  step("13:00", "Đền An Mạ – đảo Bà Góa ★", "Tham quan theo tuyến thuyền đã chốt.", "den-an-ma"),
  step("16:00", "Pác Ngòi", "Dạo làng, quan sát kiến trúc nhà sàn.", "pac-ngoi"),
  step("19:00", "Không gian giao lưu ★", "Hát then, đàn tính nếu đã đặt; nếu không, nghỉ tự do."),
];
const pacNgoiDay = [
  step("08:00", "Bản Pác Ngòi ★", "Đi bộ cùng người địa phương; xin phép trước khi vào nhà hoặc chụp ảnh.", "pac-ngoi"),
  step("10:00", "Không gian bếp ★", "Tìm hiểu một món địa phương nếu chủ nhà nhận tổ chức."),
  step("13:30", "Khu vực trong bản ★", "Chỉ ghé hộ đã đồng ý đón khách."),
  step("15:00", "Điểm ngắm cảnh gần nơi lưu trú", "Đi bộ nhẹ, không tự đi vào đường rừng hoặc bến không được phép."),
];

const destination = (id: string, slug: string, name: string, tags: Destination["interestTags"], stationIds: string[], description: string, imageUrl = cover.village): Destination => ({
  id, slug, name, stationIds, interestTags: tags, suitableFor: allAudiences, seasons: allSeasons,
  shortDescription: description,
  story: "Hồ sơ được bổ sung từ tài liệu đề xuất lộ trình. Giờ mở cửa, khả năng tiếp cận và dịch vụ cần được xác nhận trước chuyến đi.",
  media: [{ id: id + "-cover", type: "image", url: imageUrl, alt: name + ", ảnh minh họa" }],
  location: destinationLocations[id],
  experienceIds: [], productIds: [], relatedDestinationIds: [], dataStatus: "source-provided",
});

export const proposedDestinations: Destination[] = [
  destination("bao-tang-dan-toc", "bao-tang-van-hoa-cac-dan-toc-viet-nam", "Bảo tàng Văn hóa các dân tộc Việt Nam", ["culture", "history"], ["history-festival"], "Điểm trưng bày văn hóa, kiến trúc, đời sống và nghề truyền thống.", cover.history),
  destination("dai-doi-915", "di-tich-dai-doi-915", "Di tích lịch sử Đại đội 915", ["history", "culture"], ["history-festival"], historyDestinationContent["dai-doi-915"].vi.cardDescription, cover.history),
  destination("bo-dau", "lang-banh-chung-bo-dau", "Làng bánh chưng Bờ Đậu", ["food", "local-product", "culture"], ["craft-products"], craftDestinationContent["bo-dau"].vi.cardDescription),
  destination("lan-tin-keo", "lan-tin-keo", "Lán Tỉn Keo", ["history"], ["history-festival"], "Một điểm trong cụm di tích ATK Định Hóa.", cover.history),
  destination("nha-tuong-niem-atk", "nha-tuong-niem-chu-tich-ho-chi-minh-atk", "Nhà tưởng niệm Chủ tịch Hồ Chí Minh", ["history"], ["history-festival"], "Điểm tưởng niệm trong cụm ATK tại Phú Đình.", cover.history),
  destination("khuon-tat", "khu-di-tich-khuon-tat", "Khu di tích Khuôn Tát", ["history", "nature"], ["history-festival"], "Không gian di tích trong cụm ATK Định Hóa.", cover.history),
  destination("suoi-kem", "suoi-kem", "Suối Kẹm", ["nature"], ["green-tourism"], "Cảnh quan suối trong tuyến kết hợp vùng chè La Bằng.", cover.lake),
  destination("hang-phuong-hoang", "hang-phuong-hoang", "Hang Phượng Hoàng", ["nature"], ["green-tourism"], "Danh thắng hang với tuyến đi bộ cần kiểm tra điều kiện vận hành.", cover.mountain),
  destination("suoi-mo-ga", "suoi-mo-ga", "Suối Mỏ Gà", ["nature"], ["green-tourism"], "Điểm cảnh quan trong cụm Phượng Hoàng – Mỏ Gà.", cover.lake),
  destination("xom-mo-ga", "xom-mo-ga", "Xóm Mỏ Gà", ["village", "culture"], ["village"], villageContent["xom-mo-ga"].vi.cardDescription),
  destination("pac-ngoi", "ban-pac-ngoi", "Bản Pác Ngòi", ["village", "culture", "nature"], ["village"], "Bản nhà sàn và không gian sinh hoạt cộng đồng bên hồ Ba Bể."),
  destination("ho-ba-be", "ho-ba-be", "Hồ Ba Bể và Ao Tiên", ["nature"], ["green-tourism"], greenDestinationContent["ho-ba-be"].vi.cardDescription, cover.lake),
  destination("den-an-ma", "den-an-ma-dao-ba-goa", "Đền An Mạ và đảo Bà Góa", ["nature", "culture"], ["green-tourism", "history-festival"], "Điểm tham quan theo tuyến thuyền và câu chuyện địa phương.", cover.lake),
];

const route = (journey: Omit<Journey, "audiences" | "seasons" | "dataStatus" | "sourceLabel">): Journey => ({
  ...journey, audiences: allAudiences, seasons: allSeasons, dataStatus: "demo", sourceLabel: "20-lo-trinh-du-lich-thai-nguyen.md",
});

const festivalDurations: Record<string, Journey["duration"]> = {
  "long-tong-atk": "1-day",
  "cau-muoi": "half-day",
  "luc-giap": "1-day",
  "tet-nhay": "half-day",
  "ooc-po": "1-day",
};

const festivalSeasons: Record<string, Season[]> = {
  "long-tong-atk": ["spring"],
  "cau-muoi": ["spring"],
  "luc-giap": ["spring"],
  "tet-nhay": ["winter", "spring"],
  "ooc-po": ["spring"],
};

const festivalJourneys: Journey[] = festivalStories.map((festival, index) => {
  const duration = festivalDurations[festival.id] ?? "1-day";
  return {
    id: `festival-${festival.id}`,
    slug: `hanh-trinh-${festival.id}`,
    name: festival.title.vi,
    summary: `${festival.summary.vi} Địa bàn: ${festival.region.vi}.`,
    duration,
    durationLabel: duration === "half-day" ? "Nửa ngày" : "1 ngày",
    interests: ["festival", "culture"],
    audiences: allAudiences,
    seasons: festivalSeasons[festival.id] ?? ["spring"],
    days: [{
      day: 1,
      items: [
        step("08:30", festival.title.vi, `Tìm hiểu nghi lễ và hoạt động cộng đồng tại ${festival.region.vi}.`),
        step("13:30", "Khám phá không gian địa phương", `Thời điểm tham khảo: ${festival.season.vi}.`),
      ],
    }],
    destinationIds: [],
    image: `/api/culture-image/${festival.id}?index=0`,
    priority: 2.25 - index * 0.01,
    dataStatus: "source-provided",
    conditions: "Lịch tổ chức có thể thay đổi theo năm và lịch âm. Cần xác nhận với địa phương trước chuyến đi.",
    sourceLabel: festival.sourceUrl,
  };
});

export const proposedJourneys: Journey[] = [
  route({ id:"h07", code:"H07", slug:"bon-ngay-kham-pha-cac-cum-diem-thai-nguyen", name:"Bốn ngày khám phá các cụm điểm Thái Nguyên", summary:"Hành trình tổng hợp trà, hồ, ATK, bản làng và La Bằng.", duration:"3-plus-days", durationLabel:"4 ngày 3 đêm", interests:["tea","tea-product","culture","history","nature","village","food","local-product"], days:[{day:1,items:clone(teaLakeDay)},{day:2,items:clone(atkDay)},{day:3,items:clone(museumVillageDay)},{day:4,items:clone(laBangDay)}], destinationIds:["hao-dat","khong-gian-tra","nui-coc","bo-dau","lan-tin-keo","nha-tuong-niem-atk","khuon-tat","bao-tang-dan-toc","thai-hai","la-bang","suoi-kem"], image:cover.history, priority:2.02, conditions:"Tuyến có hai vùng trà; không khẳng định khác biệt hương vị khi chưa thử thực tế." }),
  route({ id:"h08", code:"H08", slug:"tu-vung-tra-den-nhip-song-ben-ho-ba-be", name:"Từ vùng trà đến nhịp sống bên hồ Ba Bể", summary:"Thêm một ngày ở Pác Ngòi để giảm nhịp di chuyển và tìm hiểu sinh hoạt địa phương.", duration:"3-plus-days", durationLabel:"4 ngày 3 đêm", interests:["village","nature","culture","tea","food","local-product"], days:[{day:1,items:[step("08:15","HTX Hảo Đạt và nương chè ★","Tìm hiểu làm chè, thưởng trà và chọn sản phẩm.","hao-dat"),step("11:30","Tân Cương → Pác Ngòi","Khung dự trù di chuyển gồm nghỉ dọc đường."),step("16:30","Homestay tại Pác Ngòi ★","Nhận phòng và nghỉ.","pac-ngoi")]},{day:2,items:clone(baBeDay)},{day:3,items:clone(pacNgoiDay)},{day:4,items:[step("08:00","Pác Ngòi ★","Tìm hiểu đời sống và sản phẩm địa phương.","pac-ngoi"),step("12:00","Pác Ngòi → trung tâm Thái Nguyên","Khung dự trù di chuyển gồm nghỉ dọc đường.")]}], destinationIds:["hao-dat","pac-ngoi","ho-ba-be","den-an-ma"], image:cover.village, priority:2.01, conditions:"Tìm hiểu bếp và thăm hộ là đề xuất chưa có nhà cung cấp; nếu không đặt được, chuyển thành thời gian tự do." }),
  route({ id:"h03", code:"H03", slug:"nhung-sac-mau-thai-nguyen", name:"Những sắc màu Thái Nguyên", summary:"Tuyến nhiều chủ đề: trà và hồ; ATK và làng bánh; bảo tàng và Thái Hải.", duration:"3-plus-days", durationLabel:"3 ngày 2 đêm", interests:["tea","culture","history","nature","village","food","local-product"], days:[{day:1,items:clone(teaLakeDay)},{day:2,items:clone(atkDay)},{day:3,items:clone(museumVillageDay)}], destinationIds:["hao-dat","khong-gian-tra","nui-coc","bo-dau","lan-tin-keo","nha-tuong-niem-atk","khuon-tat","bao-tang-dan-toc","thai-hai"], image:cover.tea, priority:2.05, conditions:"Các chủ đề có mặt trong tuyến không đồng nghĩa có thời lượng trải nghiệm ngang nhau." }),
  route({ id:"h04", code:"H04", slug:"tu-tan-cuong-den-ho-ba-be", name:"Từ Tân Cương đến hồ Ba Bể", summary:"Kết nối vùng trà với cảnh hồ và sinh hoạt cộng đồng ở Pác Ngòi.", duration:"3-plus-days", durationLabel:"3 ngày 2 đêm", interests:["nature","village","tea","culture","food","local-product"], days:[{day:1,items:[step("08:15","HTX Hảo Đạt và nương chè ★","Tìm hiểu làm chè, thưởng trà và chọn sản phẩm.","hao-dat"),step("11:30","Tân Cương → Pác Ngòi","Khung dự trù di chuyển gồm nghỉ dọc đường."),step("16:30","Homestay tại Pác Ngòi ★","Nhận phòng và nghỉ.","pac-ngoi")]},{day:2,items:clone(baBeDay)},{day:3,items:[step("08:00","Pác Ngòi ★","Tìm hiểu đời sống và sản phẩm địa phương.","pac-ngoi"),step("12:00","Pác Ngòi → trung tâm Thái Nguyên","Khung dự trù di chuyển gồm nghỉ dọc đường.")]}], destinationIds:["hao-dat","pac-ngoi","ho-ba-be","den-an-ma"], image:cover.lake, priority:2.04, conditions:"Các chặng đường dài và tuyến thuyền phải được kiểm tra thực tế; không tự ghép thêm điểm." }),
  route({ id:"h06", code:"H06", slug:"ba-ngay-giua-tra-suoi-va-nui", name:"Ba ngày giữa trà, suối và núi", summary:"Hoạt động ngoài trời ở ba cụm: Tân Cương – hồ Núi Cốc, La Bằng, Phượng Hoàng – Mỏ Gà.", duration:"3-plus-days", durationLabel:"3 ngày 2 đêm", interests:["nature","tea","village","food","local-product"], days:[{day:1,items:clone(teaLakeDay)},{day:2,items:clone(laBangDay)},{day:3,items:clone(phuongHoangDay)}], destinationIds:["hao-dat","khong-gian-tra","nui-coc","la-bang","suoi-kem","hang-phuong-hoang","suoi-mo-ga","xom-mo-ga"], image:cover.mountain, priority:2.03, conditions:"Phù hợp người chấp nhận nhiều di chuyển; thời tiết xấu cần đổi lịch hoặc chọn tuyến khác." }),
  route({ id:"h01", code:"H01", slug:"tra-ho-xanh-ban-lang", name:"Trà – hồ xanh – bản làng", summary:"Hai ngày với trà và hồ, rồi bảo tàng và cộng đồng.", duration:"2-days", durationLabel:"2 ngày 1 đêm", interests:["tea","tea-product","nature","village","culture","food","local-product"], days:[{day:1,items:clone(teaLakeDay)},{day:2,items:clone(museumVillageDay)}], destinationIds:["hao-dat","khong-gian-tra","nui-coc","bao-tang-dan-toc","thai-hai"], image:cover.lake, priority:2.08, conditions:"Chốt lưu trú, thuyền, HTX và lịch đón khách tại Thái Hải trước khi xác nhận." }),
  route({ id:"h02", code:"H02", slug:"dau-chan-lich-su-huong-vi-vung-che", name:"Dấu chân lịch sử, hương vị vùng chè", summary:"Ngày đầu về nguồn, ngày sau trải nghiệm trà và cảnh quan La Bằng.", duration:"2-days", durationLabel:"2 ngày 1 đêm", interests:["history","tea","nature","food","local-product"], days:[{day:1,items:clone(atkDay)},{day:2,items:clone(laBangDay)}], destinationIds:["bo-dau","lan-tin-keo","nha-tuong-niem-atk","khuon-tat","la-bang","suoi-kem"], image:cover.history, priority:2.07, conditions:"Phương án nghỉ tại trung tâm chưa được tối ưu bằng dữ liệu đường đi thực tế." }),
  route({ id:"h05", code:"H05", slug:"vo-nhai-va-nhung-cau-chuyen-van-hoa-lich-su", name:"Võ Nhai và những câu chuyện văn hóa – lịch sử", summary:"Ngày đầu Phượng Hoàng – Mỏ Gà; ngày sau bảo tàng và Đại đội 915.", duration:"2-days", durationLabel:"2 ngày 1 đêm", interests:["nature","culture","history","village","food"], days:[{day:1,items:clone(phuongHoangDay)},{day:2,items:clone(urbanHistoryDay)}], destinationIds:["hang-phuong-hoang","suoi-mo-ga","xom-mo-ga","bao-tang-dan-toc","dai-doi-915"], image:cover.mountain, priority:2.06, conditions:"Chọn biến thể chân núi nếu nhóm không phù hợp leo hang; ngày 2 kết thúc sớm." }),
  route({ id:"n05", code:"N05", slug:"phuong-hoang-mo-ga", name:"Phượng Hoàng – Mỏ Gà", summary:"Khám phá hang, cảnh quan và đời sống tại điểm du lịch cộng đồng.", duration:"1-day", durationLabel:"1 ngày", interests:["nature","village","culture","food"], days:[{day:1,items:clone(phuongHoangDay)}], destinationIds:["hang-phuong-hoang","suoi-mo-ga","xom-mo-ga"], image:cover.mountain, priority:2.11, conditions:"Có biến thể chân núi cho nhóm không phù hợp leo hang; phải ghi rõ phạm vi trải nghiệm." }),
  route({ id:"n06", code:"N06", slug:"van-hoa-dan-toc-va-van-hoa-tra", name:"Văn hóa dân tộc và văn hóa trà", summary:"Dành nhiều thời gian cho tìm hiểu văn hóa và thưởng trà, không có hoạt động mặt nước.", duration:"1-day", durationLabel:"1 ngày", interests:["culture","tea","tea-product","local-product"], days:[{day:1,items:[step("08:00","Bảo tàng Văn hóa các dân tộc Việt Nam","Khám phá trưng bày văn hóa.","bao-tang-dan-toc"),step("11:00","Không gian giới thiệu HTX Hảo Đạt ★","Tìm hiểu sản phẩm và câu chuyện vùng trà.","hao-dat"),step("13:30","Nương chè ★","Tìm hiểu nguyên liệu và kỹ thuật chăm sóc.","tan-cuong"),step("14:30","Khu chế biến và thưởng trà ★","Quan sát chế biến nếu có hoạt động.","khong-gian-tra")]}], destinationIds:["bao-tang-dan-toc","hao-dat","tan-cuong","khong-gian-tra"], image:cover.tea, priority:2.10, conditions:"Giờ hoạt động khu chế biến cần xác nhận; không mặc định có thu hái hoặc sản xuất." }),
  route({ id:"n07", code:"N07", slug:"huong-vi-bo-dau-tan-cuong", name:"Hương vị Bờ Đậu – Tân Cương", summary:"Khám phá hai sản phẩm theo chiều sâu: bánh chưng và trà.", duration:"1-day", durationLabel:"1 ngày", interests:["food","local-product","tea","tea-product","culture"], days:[{day:1,items:[step("08:45","Hộ làm bánh chưng Bờ Đậu ★","Tìm hiểu nguyên liệu, quan sát hoặc thử gói bánh.","bo-dau"),step("13:30","Nương chè và HTX Hảo Đạt ★","Tìm hiểu nguyên liệu và chế biến trà.","hao-dat"),step("14:30","Không gian thưởng trà ★","Tìm hiểu hương vị, cách pha và cách dùng trà.","khong-gian-tra")]}], destinationIds:["bo-dau","hao-dat","khong-gian-tra"], image:cover.tea, priority:2.09, conditions:"Phải chốt hộ đón khách ở Bờ Đậu và thực đơn; đây không phải lớp nấu ăn đang mở bán." }),
  route({ id:"n01", code:"N01", slug:"tu-vung-tra-den-ho-nui-coc", name:"Từ vùng trà đến hồ Núi Cốc", summary:"Buổi sáng khám phá trà, buổi chiều ngắm cảnh hồ.", duration:"1-day", durationLabel:"1 ngày", interests:["tea","tea-product","nature","local-product"], days:[{day:1,items:clone(teaLakeDay)}], destinationIds:["hao-dat","khong-gian-tra","nui-coc"], image:cover.lake, priority:2.15, conditions:"Cần xác nhận điểm đón, bến và chuyến thuyền; có phương án tham quan ven hồ." }),
  route({ id:"n02", code:"N02", slug:"tu-bao-tang-den-ban-lang", name:"Từ bảo tàng đến bản làng", summary:"Kết nối kiến thức từ trưng bày với trải nghiệm tại một cộng đồng đón khách.", duration:"1-day", durationLabel:"1 ngày", interests:["culture","village","food"], days:[{day:1,items:clone(museumVillageDay)}], destinationIds:["bao-tang-dan-toc","thai-hai"], image:cover.village, priority:2.14, conditions:"Giao lưu văn nghệ là hoạt động đặt riêng, không phải dịch vụ mặc định." }),
  route({ id:"n03", code:"N03", slug:"ve-nguon-atk-ghe-lang-banh-bo-dau", name:"Về nguồn ATK, ghé làng bánh Bờ Đậu", summary:"Tìm hiểu các điểm trong cụm ATK và ghé làng nghề trên hành trình.", duration:"1-day", durationLabel:"1 ngày", interests:["history","food","local-product"], days:[{day:1,items:clone(atkDay)}], destinationIds:["bo-dau","lan-tin-keo","nha-tuong-niem-atk","khuon-tat"], image:cover.history, priority:2.13, conditions:"Chốt thứ tự di tích với người hướng dẫn và tính thời gian đi bộ theo nhóm khách." }),
  route({ id:"n04", code:"N04", slug:"la-bang-tra-xanh-va-suoi-mat", name:"La Bằng: trà xanh và suối mát", summary:"Kết hợp vùng chè với đi bộ ngắm cảnh suối trong phạm vi được phép.", duration:"1-day", durationLabel:"1 ngày", interests:["tea","nature","food","local-product"], days:[{day:1,items:clone(laBangDay)}], destinationIds:["la-bang","suoi-kem"], image:cover.tea, priority:2.12, conditions:"Cơ sở trà và điểm tiếp cận suối phải xác nhận; khi mưa cần đổi nội dung tuyến." }),
  route({ id:"nd01", code:"ND01", slug:"cham-vao-huong-tra-tan-cuong", name:"Chạm vào hương trà Tân Cương", summary:"Từ nguyên liệu đến tách trà, phù hợp người muốn tìm hiểu trà và mua quà.", duration:"half-day", durationLabel:"Nửa ngày", interests:["tea","tea-product","local-product","culture"], days:[{day:1,items:[step("08:45","Nương chè do cơ sở bố trí ★","Đi bộ, tìm hiểu chăm sóc chè; hái chè khi có xác nhận.","tan-cuong"),step("09:45","HTX chè Hảo Đạt ★","Tìm hiểu chế biến và quan sát sản xuất khi phù hợp.","hao-dat"),step("10:30","Không gian thưởng trà ★","Tìm hiểu cách pha, bảo quản và lựa chọn sản phẩm.","khong-gian-tra")]}], destinationIds:["tan-cuong","hao-dat","khong-gian-tra"], image:cover.tea, priority:2.20, conditions:"Hái chè, quan sát sản xuất và pha trà phải được cơ sở xác nhận trước." }),
  route({ id:"nd02", code:"ND02", slug:"mot-buoi-o-ban-lang-thai-hai", name:"Một buổi ở bản làng Thái Hải", summary:"Tìm hiểu nhà sàn, đời sống cộng đồng và bữa ăn tại điểm đón khách.", duration:"half-day", durationLabel:"Nửa ngày", interests:["village","culture","food"], days:[{day:1,items:[step("08:45","Khu bảo tồn làng nhà sàn Thái Hải ★","Tham quan có hướng dẫn, tìm hiểu kiến trúc và đời sống.","thai-hai"),step("10:00","Không gian sinh hoạt cộng đồng ★","Trò chuyện và tham gia hoạt động do cơ sở bố trí."),step("11:00","Khu ẩm thực Thái Hải ★","Ăn trưa theo thực đơn đã xác nhận.")]}], destinationIds:["thai-hai"], image:cover.village, priority:2.19, conditions:"Không mặc định có biểu diễn văn nghệ; cần xác nhận người hướng dẫn và thực đơn." }),
  route({ id:"nd03", code:"ND03", slug:"van-hoa-dan-toc-va-ky-uc-dai-doi-915", name:"Văn hóa dân tộc và ký ức Đại đội 915", summary:"Kết hợp trưng bày văn hóa với một điểm tưởng niệm lịch sử trong đô thị.", duration:"half-day", durationLabel:"Nửa ngày", interests:["culture","history"], days:[{day:1,items:[step("08:00","Bảo tàng Văn hóa các dân tộc Việt Nam","Xem trưng bày về trang phục, nhà ở và nghề truyền thống.","bao-tang-dan-toc"),step("10:15","Di tích lịch sử Đại đội 915","Tham quan khu tưởng niệm; thuyết minh cần đặt trước.","dai-doi-915")]}], destinationIds:["bao-tang-dan-toc","dai-doi-915"], image:cover.history, priority:2.18, conditions:"Kiểm tra giờ mở cửa cả hai điểm và lịch thuyết minh." }),
  route({ id:"nd04", code:"ND04", slug:"mot-buoi-ben-ho-nui-coc", name:"Một buổi bên hồ Núi Cốc", summary:"Ưu tiên cảnh hồ, đi bộ và thời gian thư giãn với nhịp tham quan nhẹ.", duration:"half-day", durationLabel:"Nửa ngày", interests:["nature"], days:[{day:1,items:[step("09:00","Hồ Núi Cốc ★","Đi thuyền theo tuyến được xác nhận; nếu không có chuyến phù hợp, tham quan ven hồ.","nui-coc"),step("10:15","Khu tham quan ven hồ","Đi bộ ngắn, chụp ảnh và nghỉ ngắm cảnh.")]}], destinationIds:["nui-coc"], image:cover.lake, priority:2.17, conditions:"Chỉ xếp chuyến thuyền khi bến, giờ chạy và thời lượng đã được xác nhận." }),
  route({ id:"nd05", code:"ND05", slug:"tim-hieu-nghe-banh-chung-bo-dau", name:"Tìm hiểu nghề bánh chưng Bờ Đậu", summary:"Khám phá sản phẩm địa phương qua nguyên liệu, nghề làm bánh và cách thưởng thức.", duration:"half-day", durationLabel:"Nửa ngày", interests:["food","local-product","culture"], days:[{day:1,items:[step("08:45","Hộ sản xuất tại Bờ Đậu ★","Tìm hiểu nguyên liệu và các bước làm bánh.","bo-dau"),step("09:30","Không gian trải nghiệm ★","Quan sát hoặc thử gói bánh khi có người hướng dẫn."),step("10:30","Điểm thưởng thức ★","Nếm bánh chín đã chuẩn bị, tìm hiểu bảo quản.")]}], destinationIds:["bo-dau"], image:cover.village, priority:2.16, conditions:"Hộ sản xuất chưa được chốt; trải nghiệm gói bánh phải đặt trước." }),
  ...festivalJourneys,
];
