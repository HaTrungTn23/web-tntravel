import type { Destination } from "@/domain/models";
import type { DestinationProfile } from "@/data/destinationProfiles";
import type { Locale } from "@/i18n/config";
import { destinationLocations } from "@/data/destinationLocations";
import { getFilesDestinationImages } from "@/data/filesDestinationImages";

type Editorial = { title: string; description: string; profile: DestinationProfile };
type Entry = { vi: Editorial; en: Editorial; ru: Editorial };

const profile = (
  tagline: string, introduction: string, reasons: string[], highlights: string[],
  activities: string[], localCulture: string[], bestTime: string[], audience: string[], locationAndConnections: string[],
): DestinationProfile => ({ tagline, introduction: [introduction], reasons, highlights, activities, localCulture, bestTime, audience, locationAndConnections, sourceNote: "" });

// Biên tập từ tám hồ sơ trong images/location/files. Không công bố giá, giờ mở cửa
// hoặc tọa độ cơ sở khi tài liệu không xác định được chính xác.
export const filesDestinationContent: Record<string, Entry> = {
  "chua-hang-kim-son-tu": {
    vi: { title: "Chùa Hang – Kim Sơn Tự", description: "Ngôi chùa trong hang núi đá, gắn với giai thoại thời Lý, văn bia và lễ hội đầu xuân.", profile: profile(
      "Ngôi chùa trong lòng núi đá", "Chùa Hang, tên chữ Kim Sơn Tự, là ngôi chùa trong hang núi đá gần trung tâm Thái Nguyên. Không gian tín ngưỡng nơi đây gắn với giai thoại thời Lý và những bút tích trên vách đá.",
      ["Kiến trúc nương theo thế núi và lòng hang tạo nên không gian thờ tự riêng biệt.", "Giai thoại thời Lý và văn bia mở ra nhiều lớp câu chuyện lịch sử.", "Dễ kết hợp trong một hành trình văn hóa gần trung tâm."],
      ["Tương truyền chuyện dựng chùa liên quan vua Lý Thánh Tông và Nguyên phi Ỷ Lan.", "Những bút tích trên vách đá và lễ hội đầu xuân nối tiếp câu chuyện của di tích qua nhiều thời kỳ."],
      ["Tham quan hang và kiến trúc chùa với thái độ trang nghiêm.", "Quan sát văn bia, tượng thờ và cảnh quan núi đá.", "Tìm hiểu lễ hội Chùa Hang vào dịp tháng Giêng âm lịch."],
      ["Đây là không gian sinh hoạt tín ngưỡng; nên giữ yên lặng và chọn trang phục phù hợp."],
      ["Có thể tham quan quanh năm; dịp lễ hội đầu xuân thường đông khách."], ["Gia đình, người quan tâm lịch sử, văn hóa và du lịch tâm linh."],
      ["Khu vực Chùa Hang, Thái Nguyên.", "Có thể kết hợp Bảo tàng Văn hóa các dân tộc Việt Nam và Đền Đuổm."]), },
    en: { title: "Chua Hang – Kim Son Tu Pagoda", description: "A pagoda inside a limestone cave, linked to Ly-era legends, inscriptions and a spring festival.", profile: profile(
      "A pagoda within the mountain", "Chua Hang, also known as Kim Son Tu, is a pagoda inside a limestone cave near central Thai Nguyen. Ly-era legends and inscriptions on the rock walls add layers of history to this place of worship.",
      ["Its architecture follows the natural contours of the cave.", "Legends and inscriptions reveal several historical layers.", "It fits easily into a cultural trip near the city."],
      ["Local tradition links the pagoda to King Ly Thanh Tong and Lady Y Lan.", "Rock inscriptions and the spring festival carry the site's story across generations."],
      ["Visit the cave and pagoda respectfully.", "Observe the inscriptions and limestone setting.", "Learn about the festival in the first lunar month."],
      ["This is an active religious site; dress appropriately and keep the atmosphere quiet."], ["Open to exploration throughout the year; the spring festival period is busier."], ["Families and visitors interested in history, culture and spiritual heritage."], ["In the Chua Hang area of Thai Nguyen.", "Combine with the Museum of the Cultures of Vietnam's Ethnic Groups or Duom Temple."]), },
    ru: { title: "Пагода Чуаханг — Кимшонты", description: "Пагода в известняковой пещере, связанная с легендами эпохи Ли, надписями и весенним праздником.", profile: profile(
      "Пагода внутри горы", "Чуаханг, также известная как Кимшонты, расположена в известняковой пещере недалеко от центра Тхайнгуена. Легенды эпохи Ли и надписи на скалах рассказывают об истории этого места поклонения.",
      ["Архитектура следует естественной форме пещеры.", "Легенды и надписи раскрывают разные исторические слои.", "Место удобно включить в культурную поездку из города."],
      ["Местное предание связывает пагоду с королём Ли Тхань Тонгом и И Лан.", "Надписи и весенний праздник сохраняют память о святыне."],
      ["Осмотреть пещеру и пагоду с уважением.", "Увидеть надписи и известняковые скалы.", "Узнать о празднике в первом месяце лунного календаря."],
      ["Это действующее религиозное место: нужна подобающая одежда и тишина."], ["Посещать можно круглый год; во время весеннего праздника бывает многолюдно."], ["Семьи и любители истории, культуры и духовного наследия."], ["Район Чуаханг, Тхайнгуен.", "Можно совместить с Музеем культур народов Вьетнама и храмом Дуом."]), },
  },
  "khu-du-lich-sinh-thai-phuong-hoang": {
    vi: { title: "Khu du lịch sinh thái Phượng Hoàng", description: "Quần thể hang Phượng Hoàng và suối Mỏ Gà giữa núi rừng Võ Nhai.", profile: profile(
      "Hang đá, suối mát và rừng xanh Võ Nhai", "Khu du lịch sinh thái Phượng Hoàng là điểm khám phá quần thể hang Phượng Hoàng – suối Mỏ Gà ở Võ Nhai. Hang đá, dòng suối và cảnh quan rừng tạo thành chuyến đi thiên nhiên nhiều sắc thái.",
      ["Khám phá hang động và cảnh quan núi đá.", "Nghỉ bên dòng suối Mỏ Gà trong mùa nóng.", "Kết nối câu chuyện thiên nhiên với khảo cổ Thần Sa."],
      ["Hang Phượng Hoàng và suối Mỏ Gà là hai phần của cùng một quần thể danh thắng.", "Vùng núi này gắn với Khu dự trữ thiên nhiên Thần Sa – Phượng Hoàng."],
      ["Tham quan các đoạn hang mở cho khách.", "Nghỉ ngơi và ngắm suối tại khu vực được phép.", "Tìm hiểu cảnh quan, hệ sinh thái và văn hóa Võ Nhai."],
      ["Có thể tìm hiểu món ăn địa phương tại những cơ sở phục vụ trong khu vực."], ["Đi quanh năm; mùa hè thích hợp để cảm nhận không khí mát, nhưng cần tránh suối khi mưa lớn."], ["Gia đình, nhóm bạn và người yêu thiên nhiên, hang động."], ["Võ Nhai, Thái Nguyên.", "Kết hợp Hang Phượng Hoàng, suối Mỏ Gà và khu khảo cổ Thần Sa."]), },
    en: { title: "Phuong Hoang Ecotourism Area", description: "Phuong Hoang Cave and Mo Ga Stream amid the mountains of Vo Nhai.", profile: profile(
      "Caves, cool water and Vo Nhai forest", "The Phuong Hoang Ecotourism Area brings together Phuong Hoang Cave and Mo Ga Stream in Vo Nhai. Limestone caves, flowing water and forest scenery create a varied nature outing.",
      ["Explore caves and limestone scenery.", "Rest near Mo Ga Stream in warm weather.", "Connect nature with the archaeological story of Than Sa."],
      ["The cave and stream belong to the same scenic complex.", "The area is associated with the Than Sa–Phuong Hoang nature reserve."],
      ["Explore cave sections open to visitors.", "Enjoy the stream from permitted areas.", "Learn about Vo Nhai's landscape and ecology."],
      ["Local food may be available at visitor facilities in the area."], ["Suitable year-round; summer is especially refreshing, but avoid the stream after heavy rain."], ["Families, friends and nature or cave enthusiasts."], ["Vo Nhai, Thai Nguyen.", "Combine with Phuong Hoang Cave, Mo Ga Stream and the Than Sa archaeological area."]), },
    ru: { title: "Экотуристическая зона Фыонгхоанг", description: "Пещера Фыонгхоанг и ручей Мога среди гор района Воняй.", profile: profile(
      "Пещеры, прохладный ручей и лес", "Экотуристическая зона Фыонгхоанг объединяет пещеру Фыонгхоанг и ручей Мога в районе Воняй. Известняковые скалы, вода и лес создают разнообразный природный маршрут.",
      ["Исследовать пещеры и скалы.", "Отдохнуть у ручья Мога в жару.", "Дополнить природную поездку историей раскопок Тханьша."],
      ["Пещера и ручей входят в единый живописный комплекс.", "Район связан с природным резерватом Тханьша — Фыонгхоанг."],
      ["Осмотреть открытые для гостей части пещеры.", "Отдыхать у ручья в разрешённых местах.", "Узнать о природе и культуре Воняя."],
      ["В местных заведениях можно познакомиться с региональной кухней."], ["Поездка возможна круглый год; летом особенно прохладно, но после сильного дождя к ручью подходить не стоит."], ["Семьи, друзья и любители природы и пещер."], ["Воняй, Тхайнгуен.", "Сочетается с пещерой Фыонгхоанг, ручьём Мога и археологическим районом Тханьша."]), },
  },
  "khu-khao-co-than-sa": {
    vi: { title: "Khu khảo cổ Thần Sa", description: "Câu chuyện tiền sử qua Mái đá Ngườm và kỹ nghệ Ngườm giữa núi rừng Võ Nhai.", profile: profile(
      "Dấu tích tiền sử giữa núi đá Võ Nhai", "Thần Sa là khu vực khảo cổ tiền sử quan trọng, nổi bật với di chỉ Mái đá Ngườm và kỹ nghệ Ngườm. Những nghiên cứu tại đây giúp hình dung đời sống con người từ hàng chục nghìn năm trước.",
      ["Tìm hiểu một lát cắt sâu của thời tiền sử.", "Hiểu cách khảo cổ học nghiên cứu công cụ đá và lớp trầm tích.", "Kết hợp kiến thức lịch sử với cảnh quan núi rừng Võ Nhai."],
      ["Mái đá Ngườm là địa điểm tiêu biểu gắn với tên gọi kỹ nghệ Ngườm.", "Các đợt nghiên cứu tiếp tục làm rõ dấu tích cư trú và công cụ đá."],
      ["Đọc tư liệu hoặc tham gia chương trình diễn giải về khảo cổ.", "Quan sát cảnh quan từ khu vực được phép tiếp cận.", "Kết hợp tham quan Phượng Hoàng – Mỏ Gà."],
      ["Đây là khu vực di sản cần được tôn trọng; không tự ý nhặt hiện vật hay tác động vào di chỉ."], ["Có thể tìm hiểu qua tư liệu quanh năm; chuyến đi thực địa nên theo hướng dẫn của đơn vị quản lý."], ["Học sinh, người yêu lịch sử và khảo cổ học."], ["Khu vực Thần Sa, Võ Nhai, Thái Nguyên.", "Kết hợp khu du lịch sinh thái Phượng Hoàng và suối Mỏ Gà."]), },
    en: { title: "Than Sa Archaeological Area", description: "A prehistoric story told through Nguom Rock Shelter and its stone-tool tradition.", profile: profile(
      "Prehistory among Vo Nhai's limestone hills", "Than Sa is an important prehistoric archaeological area. Nguom Rock Shelter and the Nguom stone-tool tradition offer a window into human life tens of thousands of years ago.",
      ["Discover a deep chapter of prehistory.", "See how archaeologists study stone tools and layers of soil.", "Pair heritage learning with Vo Nhai's mountain scenery."],
      ["Nguom Rock Shelter gives its name to the Nguom tradition.", "Research continues to illuminate traces of settlement and toolmaking."],
      ["Explore archaeological interpretation and reading materials.", "View the landscape from permitted areas.", "Combine with Phuong Hoang and Mo Ga."],
      ["Respect the protected site; do not remove objects or disturb archaeological features."], ["The story can be explored year-round; field visits should follow guidance from the site authorities."], ["Students and visitors interested in history and archaeology."], ["Than Sa area, Vo Nhai, Thai Nguyen.", "Combine with Phuong Hoang Ecotourism Area and Mo Ga Stream."]), },
    ru: { title: "Археологический район Тханьша", description: "История доисторической эпохи через стоянку Нгыом и её каменные орудия.", profile: profile(
      "Следы древности среди скал Воняя", "Тханьша — важный археологический район. Стоянка под скальным навесом Нгыом и традиция каменных орудий помогают представить жизнь людей десятки тысяч лет назад.",
      ["Узнать о глубокой древности региона.", "Понять, как археологи изучают орудия и культурные слои.", "Совместить историю с горными пейзажами Воняя."],
      ["Стоянка Нгыом дала название археологической традиции.", "Исследования продолжают раскрывать следы древнего обитания."],
      ["Познакомиться с материалами об археологии.", "Смотреть на ландшафт с разрешённых площадок.", "Продолжить маршрут к Фыонгхоангу и ручью Мога."],
      ["Не следует забирать предметы или нарушать сохранность археологического объекта."], ["Изучать историю можно круглый год; выезд к памятнику следует согласовывать с ответственными службами."], ["Школьники и любители истории и археологии."], ["Район Тханьша, Воняй, Тхайнгуен.", "Сочетается с экотуристической зоной Фыонгхоанг и ручьём Мога."]), },
  },
  "sen-ho-eco-garden": {
    vi: { title: "Sen Hồ Eco Garden", description: "Không gian hồ sen và vườn xanh để nghỉ chậm, dùng bữa trong hành trình Tân Cương.", profile: profile(
      "Một khoảng nghỉ bên hồ sen", "Sen Hồ Eco Garden là không gian sinh thái với hồ sen, cầu tre và vườn cây trong khu vực Tân Cương. Điểm dừng phù hợp cho một bữa ăn và thời gian nghỉ giữa hành trình khám phá vùng chè.",
      ["Hồ sen và cầu tre tạo góc nhìn khác với đồi chè.", "Không gian xanh phù hợp nghỉ ngơi cùng gia đình.", "Dễ kết hợp với các điểm tham quan Tân Cương."],
      ["Điểm hấp dẫn ở đây là nhịp đi chậm: dạo hồ, ngắm sen, ngồi bên vườn và dành thời gian cho bữa cơm quê."],
      ["Dạo quanh hồ và chụp ảnh tại khu vực đón khách.", "Dùng bữa theo thực đơn của cơ sở.", "Nghỉ ngơi trong vườn hoặc lựa chọn lưu trú nếu có dịch vụ phù hợp."],
      ["Ẩm thực đồng quê và trà Thái Nguyên là gợi ý phù hợp cho một điểm dừng ở vùng chè."], ["Mùa sen nở tạo điểm nhấn cho cảnh quan; các mùa khác vẫn phù hợp nghỉ ngơi ngoài trời khi thời tiết dễ chịu."], ["Gia đình có trẻ nhỏ, nhóm bạn và người muốn nghỉ chậm."], ["Khu vực Tân Cương, Thái Nguyên.", "Có thể kết hợp đồi chè Tân Cương, Không gian Văn hóa Trà và hồ Núi Cốc."]), },
    en: { title: "Sen Ho Eco Garden", description: "A lotus lake and garden for a slow break and a meal on a Tan Cuong journey.", profile: profile(
      "A pause beside a lotus lake", "Sen Ho Eco Garden offers a lotus lake, bamboo walkways and greenery in the Tan Cuong area. It is a pleasant stop for a meal and a relaxed break between tea-country visits.",
      ["The lotus lake offers a different view from the tea hills.", "Green space suits a family break.", "It connects easily with Tan Cuong attractions."],
      ["Its appeal lies in slowing down: walking by the lake, enjoying the lotus and sharing a countryside-style meal."],
      ["Walk around visitor areas and photograph the lake.", "Enjoy a meal from the venue's menu.", "Rest in the garden or explore available accommodation."],
      ["Countryside dishes and Thai Nguyen tea suit this tea-country stop."], ["Lotus blooms add colour in season; other months can suit outdoor relaxation in pleasant weather."], ["Families, groups of friends and slow-travel visitors."], ["Tan Cuong area, Thai Nguyen.", "Combine with the Tan Cuong tea hills, Tea Culture Space and Nui Coc Lake."]), },
    ru: { title: "Сенхо Эко Гарден", description: "Лотосовое озеро и сад для неспешного отдыха и обеда на маршруте по Танкыонгу.", profile: profile(
      "Пауза у лотосового озера", "Сенхо Эко Гарден — зелёная зона с лотосовым озером и бамбуковыми мостиками в районе Танкыонг. Здесь удобно пообедать и отдохнуть между поездками по чайному краю.",
      ["Лотосовое озеро дополняет пейзажи чайных холмов.", "Сад подходит для семейного отдыха.", "Место легко совместить с достопримечательностями Танкыонга."],
      ["Главное здесь — неторопливый ритм: прогулка у воды, цветы лотоса и обед в сельском стиле."],
      ["Прогуляться и сфотографировать озеро.", "Пообедать по меню заведения.", "Отдохнуть в саду или выбрать доступное размещение."],
      ["Местная кухня и чай Тхайнгуена хорошо дополняют поездку по чайному краю."], ["Во время цветения лотосов пейзаж особенно выразителен; в другие сезоны место подходит для отдыха в хорошую погоду."], ["Семьи, друзья и любители спокойных путешествий."], ["Район Танкыонг, Тхайнгуен.", "Можно совместить с чайными холмами, Пространством чайной культуры и озером Нуикок."]), },
  },
  "suoi-kem-homestay": {
    vi: { title: "Suối Kẹm Homestay", description: "Nghỉ bên dòng Suối Kẹm, gần đồi chè La Bằng dưới chân Tam Đảo.", profile: profile(
      "Ở lại bên suối và vùng chè La Bằng", "Suối Kẹm Homestay là điểm lưu trú tại xóm Tân Sơn, La Bằng, gắn với cảnh quan Suối Kẹm và những đồi chè dưới chân Tam Đảo. Điểm đến phù hợp để chuyển từ chuyến tham quan ngắn sang một đêm nghỉ giữa thiên nhiên.",
      ["Ở gần dòng suối và vùng chè trong cùng một hành trình.", "Có thời gian cảm nhận nhịp sống chậm ở Tân Sơn.", "Phù hợp làm điểm nghỉ cho tuyến khám phá sườn đông Tam Đảo."],
      ["Suối Kẹm là cảnh quan tự nhiên; Suối Kẹm Homestay là cơ sở lưu trú riêng, tạo điều kiện ở lại lâu hơn trong vùng La Bằng."],
      ["Nghỉ bên suối tại khu vực an toàn.", "Dạo vùng chè La Bằng và tìm hiểu nghề làm trà.", "Lưu trú, dùng bữa theo dịch vụ hiện có của cơ sở."],
      ["Trà La Bằng và bữa ăn địa phương có thể là điểm nhấn của đêm nghỉ."], ["Mùa hè hợp nghỉ mát; những ngày mưa lớn không nên xuống suối."], ["Gia đình, nhóm bạn và người thích nghỉ dưỡng gần thiên nhiên."], ["Xóm Tân Sơn, La Bằng, Thái Nguyên.", "Kết hợp Suối Kẹm, vùng chè La Bằng và Đát Ngao – Quân Chu."]), },
    en: { title: "Suoi Kem Homestay", description: "A streamside stay near La Bang's tea hills at the foot of Tam Dao.", profile: profile(
      "Stay by the stream and La Bang tea country", "Suoi Kem Homestay is an accommodation site in Tan Son hamlet, La Bang, close to Kem Stream and tea hills at the foot of Tam Dao. It turns a short outing into a slower overnight visit.",
      ["The stream and tea country are close together.", "A stay offers time to enjoy Tan Son at a slower pace.", "It can anchor a route along eastern Tam Dao."],
      ["Kem Stream is a natural attraction; Suoi Kem Homestay is a separate place to stay in the La Bang area."],
      ["Relax by the stream in safe areas.", "Walk through La Bang tea country and learn about tea making.", "Stay and dine according to the venue's current services."],
      ["La Bang tea and a local meal can be highlights of the stay."], ["Summer suits a cool break; avoid entering the stream during heavy rain."], ["Families, friends and visitors seeking a nature stay."], ["Tan Son hamlet, La Bang, Thai Nguyen.", "Combine with Kem Stream, La Bang tea country and Dat Ngao–Quan Chu."]), },
    ru: { title: "Суойкем Хоумстей", description: "Проживание у ручья рядом с чайными холмами Лабанга у подножия Тамдао.", profile: profile(
      "Ночёвка у ручья и чайного края", "Суойкем Хоумстей находится в деревне Таншон района Лабанг, рядом с ручьём Кем и чайными холмами у подножия Тамдао. Здесь короткая прогулка может превратиться в спокойную поездку с ночёвкой.",
      ["Ручей и чайные холмы находятся рядом.", "Ночёвка помогает почувствовать размеренный ритм Таншона.", "Это удобная остановка на восточном склоне Тамдао."],
      ["Ручей Кем — природный объект; Суойкем Хоумстей — отдельное место для проживания в районе Лабанг."],
      ["Отдохнуть у ручья в безопасных местах.", "Прогуляться среди чайных холмов и узнать о производстве чая.", "Остановиться и пообедать согласно текущим услугам заведения."],
      ["Чай Лабанг и местная кухня дополняют отдых."], ["Летом здесь приятно спасаться от жары; во время сильного дождя в ручей заходить нельзя."], ["Семьи, друзья и любители отдыха на природе."], ["Деревня Таншон, Лабанг, Тхайнгуен.", "Сочетается с ручьём Кем, чайным районом Лабанг и Датнгао — Куанчу."]), },
  },
  "tien-yen-farmstay": {
    vi: { title: "Tiến Yên Farmstay", description: "Trải nghiệm hành trình từ búp chè đến chén trà và nghỉ giữa đồi Tân Cương.", profile: profile(
      "Sống cùng trà giữa đồi Tân Cương", "Tiến Yên Farmstay là mô hình du lịch cộng đồng gắn với HTX Trà và Du lịch cộng đồng Tiến Yên. Giữa vùng chè Tân Cương, nơi đây kết hợp không gian đồi chè, câu chuyện người làm nghề, bữa ăn và lưu trú.",
      ["Theo dõi hành trình từ cây chè đến chén trà.", "Gặp người làm nghề và thưởng trà trong không gian đồi chè.", "Có thể nghỉ lại để cảm nhận vùng trà chậm hơn."],
      ["Mô hình kết nối sản xuất trà với du lịch cộng đồng, giúp câu chuyện nghề chè được kể qua chính người làm nghề."],
      ["Dạo đồi chè và tìm hiểu cây chè.", "Thử hoạt động hái búp hoặc sao chè khi HTX có tổ chức.", "Thưởng trà, dùng bữa và nghỉ lại theo chương trình của cơ sở."],
      ["Các món dùng nguyên liệu trà và sản phẩm trà địa phương là điểm nhấn của trải nghiệm."], ["Có thể ghé quanh năm; hoạt động nông nghiệp phụ thuộc mùa vụ và lịch của HTX."], ["Gia đình, học sinh, người yêu trà và khách muốn trải nghiệm nông nghiệp."], ["Vùng Tân Cương, Thái Nguyên.", "Kết hợp đồi chè Tân Cương, Không gian Văn hóa Trà và HTX Hảo Đạt."]), },
    en: { title: "Tien Yen Farmstay", description: "Follow tea from bud to cup and stay among the Tan Cuong hills.", profile: profile(
      "Live with tea among Tan Cuong's hills", "Tien Yen Farmstay is a community tourism model linked to the Tien Yen Tea and Community Tourism Cooperative. It brings together tea hills, growers' stories, meals and accommodation in Tan Cuong.",
      ["Follow tea from plant to cup.", "Meet tea makers and taste tea among the hills.", "Stay longer to experience the tea region at a slower pace."],
      ["The model connects tea production with community tourism, with growers telling their own stories."],
      ["Walk among the tea hills.", "Try picking or processing tea when the cooperative schedules an activity.", "Taste tea, dine and stay according to the venue's programme."],
      ["Tea-inspired dishes and local tea products are highlights."], ["A visit is possible year-round; farming activities depend on the season and the cooperative's schedule."], ["Families, students, tea lovers and visitors interested in farming."], ["Tan Cuong area, Thai Nguyen.", "Combine with the tea hills, Tea Culture Space and Hao Dat Cooperative."]), },
    ru: { title: "Тьенйен Фармстей", description: "Путь чайного листа от почки до чашки и отдых среди холмов Танкыонга.", profile: profile(
      "Жизнь среди чайных холмов", "Тьенйен Фармстей — модель общинного туризма, связанная с чайным кооперативом Тьенйен. Здесь, в Танкыонге, сочетаются плантации, истории чаеводов, местная кухня и проживание.",
      ["Проследить путь чая от куста до чашки.", "Познакомиться с чаеводами и попробовать чай.", "Остаться на ночь и открыть чайный край без спешки."],
      ["Кооператив соединяет производство чая с туризмом, а сами мастера рассказывают о своей работе."],
      ["Прогуляться по чайным холмам.", "Попробовать сбор или обработку чая, если кооператив проводит такую программу.", "Продегустировать чай, пообедать и остаться на ночь."],
      ["Блюда с чаем и местные чайные продукты дополняют впечатления."], ["Приезжать можно круглый год; сельскохозяйственные занятия зависят от сезона и графика кооператива."], ["Семьи, школьники, любители чая и сельского туризма."], ["Район Танкыонг, Тхайнгуен.", "Сочетается с чайными холмами, Пространством чайной культуры и кооперативом Хаодат."]), },
  },
  "dat-ngao-quan-chu": {
    vi: { title: "Đát Ngao – Quân Chu", description: "Thác nước và cảnh rừng ở sườn đông Tam Đảo, gắn với câu chuyện vùng Quân Chu.", profile: profile(
      "Dòng thác dưới chân Tam Đảo", "Thác Đát Ngao nằm ở khu vực Quân Chu dưới chân dãy Tam Đảo. Dòng thác và rừng xanh tạo nên điểm dừng dã ngoại; vùng đất quanh đó còn gắn với đời sống cộng đồng và ký ức lịch sử.",
      ["Cảnh thác và rừng phù hợp một chuyến đi ngoài trời.", "Có thể kết hợp nghỉ chậm với khám phá văn hóa vùng Quân Chu.", "Tạo tuyến thiên nhiên với La Bằng và Suối Kẹm."],
      ["Bên cạnh cảnh quan thác, khu vực Quân Chu còn có câu chuyện về cộng đồng người Dao và những địa điểm lịch sử, tâm linh dưới chân Tam Đảo."],
      ["Ngắm thác và đi dạo tại khu vực được phép.", "Nghỉ ngơi, dã ngoại theo điều kiện thời tiết.", "Tìm hiểu bản làng và các điểm văn hóa khi có đơn vị địa phương đón khách."],
      ["Bữa ăn địa phương có thể kết hợp với chuyến dã ngoại tại cơ sở phục vụ trong khu vực."], ["Mùa hè phù hợp ngắm thác; tránh xuống nước khi mưa lớn, nước đục hoặc chảy mạnh."], ["Nhóm bạn, gia đình thích dã ngoại và người yêu thiên nhiên."], ["Khu vực Quân Chu, Thái Nguyên.", "Kết hợp Suối Kẹm Homestay, La Bằng và hồ Núi Cốc."]), },
    en: { title: "Dat Ngao – Quan Chu", description: "A waterfall and forest on eastern Tam Dao, tied to the stories of Quan Chu.", profile: profile(
      "A waterfall at the foot of Tam Dao", "Dat Ngao Waterfall lies in the Quan Chu area below the Tam Dao range. Water and forest make it an outdoor stop, while nearby communities and heritage add another layer to the journey.",
      ["Waterfall and forest scenery suit an outdoor outing.", "A visit can connect nature with Quan Chu's local culture.", "It extends a route through La Bang and Kem Stream."],
      ["Beyond the waterfall, Quan Chu has stories of Dao communities and heritage sites below Tam Dao."],
      ["View the waterfall and walk in permitted areas.", "Rest or picnic when weather permits.", "Explore local culture through hosts who welcome visitors."],
      ["Local meals may be available at visitor facilities in the area."], ["Summer suits waterfall views; do not enter the water after heavy rain or when the current is strong."], ["Friends, families and nature enthusiasts."], ["Quan Chu area, Thai Nguyen.", "Combine with Suoi Kem Homestay, La Bang and Nui Coc Lake."]), },
    ru: { title: "Датнгао — Куанчу", description: "Водопад и лес на восточном склоне Тамдао, связанные с историей Куанчу.", profile: profile(
      "Водопад у подножия Тамдао", "Водопад Датнгао находится в районе Куанчу у подножия гор Тамдао. Вода и лес делают его местом для прогулки, а жизнь местных общин добавляет маршруту культурный слой.",
      ["Водопад и лес подходят для поездки на природу.", "Природный отдых можно совместить с культурой Куанчу.", "Место дополняет маршрут через Лабанг и ручей Кем."],
      ["Помимо водопада, район Куанчу хранит истории общин дао и памятных мест у подножия Тамдао."],
      ["Посмотреть на водопад и пройтись по разрешённым дорожкам.", "Отдохнуть на природе в подходящую погоду.", "Узнать о местной культуре у принимающих гостей жителей."],
      ["Местные блюда можно попробовать в заведениях района."], ["Летом приятно смотреть на водопад; после сильного дождя или при сильном течении заходить в воду нельзя."], ["Друзья, семьи и любители природы."], ["Район Куанчу, Тхайнгуен.", "Сочетается с Суойкем Хоумстей, Лабангом и озером Нуикок."]), },
  },
  "den-duom": {
    vi: { title: "Đền Đuổm", description: "Ngôi đền thờ Dương Tự Minh dưới chân núi Đuổm, nổi bật với lễ hội đầu xuân.", profile: profile(
      "Ngôi đền của vị tướng người Tày", "Đền Đuổm dưới chân núi Đuổm thờ Dương Tự Minh, nhân vật gắn với lịch sử vùng Phú Lương thời Lý. Quần thể đền và lễ hội đầu xuân là điểm nhấn văn hóa, tín ngưỡng của địa phương.",
      ["Tìm hiểu câu chuyện Dương Tự Minh và văn hóa người Tày.", "Tham quan không gian đền dưới chân núi.", "Cảm nhận không khí lễ hội đầu xuân."],
      ["Quần thể gồm các cấp đền, gắn với đời sống tín ngưỡng địa phương.", "Lễ hội Đền Đuổm diễn ra vào tháng Giêng âm lịch và mang nhiều nét văn hóa vùng Phú Lương."],
      ["Tham quan, dâng hương trang nghiêm.", "Tìm hiểu câu chuyện lịch sử và kiến trúc đền.", "Dự lễ hội khi chương trình năm đó được tổ chức."],
      ["Các nghi lễ và sinh hoạt hội thể hiện văn hóa địa phương; du khách nên tôn trọng không gian thờ tự."], ["Có thể ghé quanh năm; dịp đầu xuân là thời điểm lễ hội và thường đông người."], ["Gia đình, học sinh và người quan tâm lịch sử, văn hóa, tín ngưỡng."], ["Khu vực Phú Lương, Thái Nguyên.", "Có thể kết hợp Chùa Hang và các điểm văn hóa trên tuyến phía bắc."]), },
    en: { title: "Duom Temple", description: "A temple dedicated to Duong Tu Minh below Mount Duom, known for its spring festival.", profile: profile(
      "The temple of a Tay leader", "Duom Temple stands below Mount Duom and honours Duong Tu Minh, a figure associated with the Ly-era history of Phu Luong. Its temple complex and spring festival are important expressions of local culture and belief.",
      ["Learn about Duong Tu Minh and Tay cultural heritage.", "Visit the temple complex below the mountain.", "Experience the atmosphere of the spring festival."],
      ["The temple's different levels are tied to local religious life.", "The festival in the first lunar month reflects Phu Luong's traditions."],
      ["Visit or offer incense respectfully.", "Learn about the site's history and architecture.", "Attend the festival when the year's programme is held."],
      ["Ceremonies and festival activities reflect local culture; respect the worship space."], ["A visit is possible year-round; early spring brings the festival and larger crowds."], ["Families, students and visitors interested in history, culture and spiritual heritage."], ["Phu Luong area, Thai Nguyen.", "Combine with Chua Hang and other cultural stops to the north."]), },
    ru: { title: "Храм Дуом", description: "Храм в честь Зыонг Ты Миня у горы Дуом, известный весенним праздником.", profile: profile(
      "Храм тайского военачальника", "Храм Дуом у подножия одноимённой горы посвящён Зыонг Ты Миню, герою истории Фулонга эпохи Ли. Храмовый комплекс и весенний праздник отражают культуру и верования местных жителей.",
      ["Узнать о Зыонг Ты Мине и культуре народа тай.", "Осмотреть храмовый комплекс у горы.", "Почувствовать атмосферу весеннего праздника."],
      ["Несколько уровней храма связаны с местными религиозными традициями.", "Праздник в первом месяце лунного календаря отражает культуру Фулонга."],
      ["Посетить храм и возжечь благовония с уважением.", "Узнать об истории и архитектуре.", "Прийти на праздник, когда он проводится."],
      ["Обряды и праздник отражают местную культуру; важно уважать пространство поклонения."], ["Посещать можно круглый год; ранней весной проходит праздник и бывает многолюдно."], ["Семьи, школьники и интересующиеся историей, культурой и традициями."], ["Район Фулонг, Тхайнгуен.", "Можно совместить с пагодой Чуаханг и другими культурными местами северного маршрута."]), },
  },
};

type DestinationMeta = Pick<Destination, "interestTags" | "stationIds" | "suitableFor" | "seasons" | "relatedDestinationIds"> & { locationId?: string };
const metadata: Record<string, DestinationMeta> = {
  "chua-hang-kim-son-tu": { interestTags: ["history", "culture"], stationIds: ["history-festival"], suitableFor: ["solo", "friends", "family", "student", "international"], seasons: ["spring", "summer", "autumn", "winter"], relatedDestinationIds: ["den-duom", "bao-tang-dan-toc"] },
  "khu-du-lich-sinh-thai-phuong-hoang": { interestTags: ["nature", "culture"], stationIds: ["green-tourism"], suitableFor: ["friends", "family", "student"], seasons: ["spring", "summer", "autumn", "winter"], relatedDestinationIds: ["hang-phuong-hoang", "suoi-mo-ga", "khu-khao-co-than-sa"], locationId: "hang-phuong-hoang" },
  "khu-khao-co-than-sa": { interestTags: ["history", "culture", "nature"], stationIds: ["history-festival"], suitableFor: ["friends", "student", "international"], seasons: ["spring", "summer", "autumn", "winter"], relatedDestinationIds: ["khu-du-lich-sinh-thai-phuong-hoang", "bao-tang-dan-toc"] },
  "sen-ho-eco-garden": { interestTags: ["nature", "food"], stationIds: ["green-tourism"], suitableFor: ["friends", "family"], seasons: ["spring", "summer", "autumn"], relatedDestinationIds: ["tan-cuong", "nui-coc"] },
  "suoi-kem-homestay": { interestTags: ["nature", "tea", "village"], stationIds: ["green-tourism", "village"], suitableFor: ["friends", "family"], seasons: ["spring", "summer", "autumn", "winter"], relatedDestinationIds: ["suoi-kem", "la-bang", "dat-ngao-quan-chu"] },
  "tien-yen-farmstay": { interestTags: ["tea", "culture", "village", "food"], stationIds: ["tea-culture", "village"], suitableFor: ["friends", "family", "student", "international"], seasons: ["spring", "summer", "autumn", "winter"], relatedDestinationIds: ["tan-cuong", "khong-gian-tra", "hao-dat"] },
  "dat-ngao-quan-chu": { interestTags: ["nature", "culture"], stationIds: ["green-tourism"], suitableFor: ["friends", "family"], seasons: ["spring", "summer", "autumn"], relatedDestinationIds: ["suoi-kem-homestay", "la-bang", "nui-coc"] },
  "den-duom": { interestTags: ["history", "culture"], stationIds: ["history-festival"], suitableFor: ["solo", "friends", "family", "student", "international"], seasons: ["spring", "summer", "autumn", "winter"], relatedDestinationIds: ["chua-hang-kim-son-tu", "bao-tang-dan-toc"] },
};

export const filesDestinations: Destination[] = Object.entries(filesDestinationContent).map(([id, localized]) => {
  const meta = metadata[id];
  return {
    id, slug: id, name: localized.vi.title, shortDescription: localized.vi.description,
    story: localized.vi.profile.introduction[0], stationIds: meta.stationIds,
    interestTags: meta.interestTags, suitableFor: meta.suitableFor, seasons: meta.seasons,
    media: getFilesDestinationImages(id, localized.vi.title),
    location: meta.locationId ? destinationLocations[meta.locationId] : undefined,
    experienceIds: [], productIds: [], relatedDestinationIds: meta.relatedDestinationIds,
    dataStatus: "source-provided",
  };
});

export function getFilesDestinationContent(id: string, locale: Locale): Editorial | null {
  return filesDestinationContent[id]?.[locale] ?? null;
}
