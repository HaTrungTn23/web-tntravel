import type { Locale } from "@/i18n/config";

type LocalizedText = Record<Locale, string>;

export type CultureStory = {
  id: string;
  title: LocalizedText;
  summary: LocalizedText;
  region: LocalizedText;
  season: LocalizedText;
  sourceUrl: string;
};

export const foodStories: CultureStory[] = [
  {
    id: "banh-chung-bo-dau",
    title: { vi: "Bánh chưng Bờ Đậu", en: "Bo Dau bánh chưng", ru: "Баньтьынг Бо Дау" },
    summary: {
      vi: "Nếp thơm vùng Định Hóa, lá dong từ vùng rừng lân cận và kỹ thuật gói, luộc khéo léo tạo nên thức quà quen thuộc trên Quốc lộ 3.",
      en: "Fragrant sticky rice from Dinh Hoa, dong leaves and careful wrapping make this a familiar gift along National Highway 3.",
      ru: "Ароматный клейкий рис из Диньхоа, листья донг и искусная техника приготовления создают известный дорожный подарок.",
    },
    region: { vi: "Bờ Đậu, Phú Lương", en: "Bo Dau, Phu Luong", ru: "Бо Дау, Фулуонг" },
    season: { vi: "Quanh năm", en: "Year-round", ru: "Круглый год" },
    sourceUrl: "http://thainguyentourism.vn/vi/du-khach/Am-thuc/Banh-chung-Bo-Dau-63.html",
  },
  {
    id: "banh-ngai",
    title: { vi: "Bánh ngải của người Tày", en: "Tay mugwort cake", ru: "Полынная лепешка народа Тай" },
    summary: {
      vi: "Bánh làm từ gạo nếp, lá ngải cứu, đỗ hoặc lạc và đường phên. Món bánh thường xuất hiện vào Tết Thanh minh và rằm tháng Bảy.",
      en: "Sticky rice, mugwort, beans or peanuts and cane sugar form a cake often prepared for Thanh Minh and the seventh lunar month.",
      ru: "Клейкий рис, полынь, бобы или арахис и тростниковый сахар. Блюдо готовят к празднику Тханьминь и седьмому лунному месяцу.",
    },
    region: { vi: "Vùng người Tày", en: "Tay communities", ru: "Поселения народа Тай" },
    season: { vi: "Theo dịp lễ", en: "Festival seasons", ru: "К праздничным датам" },
    sourceUrl: "http://thainguyentourism.vn/vi/du-khach/Am-thuc/Banh-ngai-cua-nguoi-Tay-Thai-Nguyen-29.html",
  },
  {
    id: "banh-trung-kien",
    title: { vi: "Bánh trứng kiến Định Hóa", en: "Dinh Hoa ant-egg cake", ru: "Лепешка с муравьиными яйцами из Диньхоа" },
    summary: {
      vi: "Món bánh của người Tày kết hợp bột nếp, lá vả và trứng kiến đen. Nguyên liệu đặc trưng thường được tìm vào tháng 4 và tháng 5.",
      en: "A Tay specialty combining sticky-rice flour, fig leaves and black ant eggs, an ingredient gathered mainly in April and May.",
      ru: "Блюдо народа Тай из клейкой рисовой муки, листьев инжира и яиц черных муравьев, которые собирают в апреле и мае.",
    },
    region: { vi: "Định Hóa", en: "Dinh Hoa", ru: "Диньхоа" },
    season: { vi: "Tháng 4-5", en: "April-May", ru: "Апрель-май" },
    sourceUrl: "http://thainguyentourism.vn/vi/du-khach/Am-thuc/Banh-trung-kien-dac-san-cua-nui-rung-Dinh-Hoa-89.html",
  },
  {
    id: "com-lam-atk",
    title: { vi: "Cơm lam vùng ATK", en: "ATK bamboo rice", ru: "Рис в бамбуке из региона АТК" },
    summary: {
      vi: "Gạo nếp được nấu trong ống tre hoặc nứa tươi, giữ mùi thơm tự nhiên và thường dùng cùng muối lạc hoặc muối vừng.",
      en: "Sticky rice is cooked in fresh bamboo tubes, preserving its natural aroma, and is commonly served with peanut or sesame salt.",
      ru: "Клейкий рис готовят в свежих бамбуковых трубках и подают с арахисовой или кунжутной солью.",
    },
    region: { vi: "ATK Định Hóa", en: "ATK Dinh Hoa", ru: "АТК Диньхоа" },
    season: { vi: "Quanh năm", en: "Year-round", ru: "Круглый год" },
    sourceUrl: "http://thainguyentourism.vn/vi/du-khach/Am-thuc/Com-lam-mon-an-gian-di-cua-nui-rung-ATK-197.html",
  },
];

export const festivalStories: CultureStory[] = [
  {
    id: "long-tong-atk",
    title: { vi: "Lồng Tồng ATK Định Hóa", en: "Long Tong festival in ATK Dinh Hoa", ru: "Праздник Лонг Тонг в АТК Диньхоа" },
    summary: {
      vi: "Ngày hội xuống đồng kết hợp nghi lễ cầu mùa, dâng hương tưởng niệm Chủ tịch Hồ Chí Minh và nhiều trò chơi dân gian.",
      en: "A field-opening festival combining harvest prayers, remembrance of President Ho Chi Minh and traditional community games.",
      ru: "Праздник первого выхода в поле сочетает молитвы об урожае, память о Президенте Хо Ши Мине и народные игры.",
    },
    region: { vi: "Đèo De, Định Hóa", en: "De Pass, Dinh Hoa", ru: "Перевал Де, Диньхоа" },
    season: { vi: "Mồng 10 tháng Giêng âm lịch", en: "10th day of the first lunar month", ru: "10-й день первого лунного месяца" },
    sourceUrl: "http://thainguyentourism.vn/vi/du-khach/Kham-pha-diem-den/Le-hoi-Long-Tong-ATK-Dinh-Hoa-Le-hoi-lich-su-cach-mang-137.html",
  },
  {
    id: "cau-muoi",
    title: { vi: "Lễ hội Cầu Muối", en: "Cau Muoi festival", ru: "Праздник Кау Муой" },
    summary: {
      vi: "Không gian đình, đền và chùa gắn với tín ngưỡng cầu may, lễ rước kiệu và các trò chơi dân gian đầu năm.",
      en: "A temple and pagoda complex associated with New Year blessings, a palanquin procession and folk games.",
      ru: "Комплекс общинного дома, храмов и пагоды связан с новогодними пожеланиями, шествием паланкина и народными играми.",
    },
    region: { vi: "Tân Thành, Phú Bình", en: "Tan Thanh, Phu Binh", ru: "Тан Тхань, Фубинь" },
    season: { vi: "Mồng 4 tháng Giêng âm lịch", en: "4th day of the first lunar month", ru: "4-й день первого лунного месяца" },
    sourceUrl: "http://thainguyentourism.vn/vi/du-khach/Kham-pha-diem-den/Le-hoi-Dinh-Den-Chua-Cau-Muoi-59.html",
  },
  {
    id: "luc-giap",
    title: { vi: "Lễ hội đền Lục Giáp", en: "Luc Giap Temple festival", ru: "Праздник храма Лук Зяп" },
    summary: {
      vi: "Phần lễ có tế thần, dâng hương và rước cỗ. Phần hội gợi lại vật cổ truyền, hát ví, kéo co và nhiều sinh hoạt dân gian.",
      en: "Ceremonies include offerings and incense, followed by traditional wrestling, folk singing, tug of war and community activities.",
      ru: "После подношений и воскурения благовоний проходят традиционная борьба, народное пение, перетягивание каната и общинные игры.",
    },
    region: { vi: "Đắc Sơn, Phổ Yên", en: "Dac Son, Pho Yen", ru: "Дакшон, Фойен" },
    season: { vi: "Ngày 15 tháng 3 âm lịch", en: "15th day of the third lunar month", ru: "15-й день третьего лунного месяца" },
    sourceUrl: "http://thainguyentourism.vn/vi/du-khach/Kham-pha-diem-den/Le-hoi-den-Luc-Giap-144.html",
  },
  {
    id: "tet-nhay",
    title: { vi: "Tết nhảy của người Dao", en: "Dao ceremonial dancing festival", ru: "Праздник ритуальных танцев народа Зао" },
    summary: {
      vi: "Nghi lễ quan trọng trong tục thờ tổ tiên của người Dao, kết hợp múa, hát, nhạc cụ và các bước cúng được trao truyền trong dòng họ.",
      en: "An important Dao ancestor ceremony combining dance, song, instruments and ritual steps passed down within each family line.",
      ru: "Важный обряд почитания предков народа Зао, объединяющий танцы, песни, музыку и ритуалы, передаваемые внутри рода.",
    },
    region: { vi: "Cộng đồng người Dao", en: "Dao communities", ru: "Общины народа Зао" },
    season: { vi: "Theo ngày được chọn của dòng họ", en: "Dates chosen by each family line", ru: "Дата определяется внутри рода" },
    sourceUrl: "http://thainguyentourism.vn/vi/du-khach/Kham-pha-diem-den/Le-Tet-nhay-net-van-hoa-doc-dao-cua-nguoi-Dao-Thai-Nguyen-100.html",
  },
  {
    id: "ooc-po",
    title: { vi: "Lễ hội Oóc Pò", en: "Ooc Po festival", ru: "Праздник Оок По" },
    summary: {
      vi: "Lễ hội cầu mùa của người Nùng có nghi thức dâng lễ, múa kỳ lân, tung còn, hát sli, hát lượn và các trò chơi cộng đồng.",
      en: "A Nung harvest festival with offerings, qilin dancing, cloth-ball games, sli and luon singing, and community competitions.",
      ru: "Праздник урожая народа Нунг включает подношения, танец единорога, игры с мячом, пение сли и лыон и общинные состязания.",
    },
    region: { vi: "Tân Long, Văn Hán", en: "Tan Long and Van Han", ru: "Тан Лонг и Ван Хан" },
    season: { vi: "Cuối tháng 3, đầu tháng 4 âm lịch", en: "Late third to early fourth lunar month", ru: "Конец третьего и начало четвертого лунного месяца" },
    sourceUrl: "http://thainguyentourism.vn/vi/du-khach/Kham-pha-diem-den/OOC-PO-LE-HOI-DAN-GIAN-CUA-DONG-BAO-NUNG-O-THAI-NGUYEN-135.html",
  },
];

export function localizeCultureStory(story: CultureStory, locale: Locale) {
  return {
    ...story,
    title: story.title[locale],
    summary: story.summary[locale],
    region: story.region[locale],
    season: story.season[locale],
  };
}
