import { villageContent } from "@/data/villageContent";
import { craftDestinationContent } from "@/data/craftContent";
import { greenDestinationContent } from "@/data/greenContent";
import { historyDestinationContent } from "@/data/historyContent";
import { teaDestinationContent } from "@/data/teaContent";
import { filesDestinationContent } from "@/data/filesDestinations";

export interface DestinationProfile {
  tagline: string;
  introduction: string[];
  reasons: string[];
  highlights: string[];
  activities: string[];
  localCulture?: string[];
  bestTime: string[];
  audience: string[];
  locationAndConnections: string[];
  sourceNote: string;
}

const fromDocument = "Biên soạn từ 24-diem-den.docx, cập nhật 03/10/2026. Giờ mở cửa, giá vé và dịch vụ cần được xác nhận trước chuyến đi.";
const supplemented = "Nội dung bổ sung theo dữ liệu điểm đến hiện có; thông tin vận hành cần được xác nhận trực tiếp trước chuyến đi.";

const sourceDestinationProfiles: Record<string, DestinationProfile> = {
  "tan-cuong": {
    tagline: "Miền trà xanh, nơi cảnh quan, nghề chè và văn hóa thưởng trà gặp nhau",
    introduction: ["Tân Cương là vùng chè đặc sản tiêu biểu của Thái Nguyên. Một chuyến đi trọn vẹn không chỉ dừng ở đồi chè mà còn nối lịch sử vùng trà, quy trình làm chè, cách pha, cách thưởng thức và câu chuyện của người trồng chè."],
    reasons: ["Cảnh quan đồi chè trung du dễ nhận biết và phù hợp trải nghiệm nông nghiệp.", "Văn hóa trà hiện diện trong cả việc chăm cây, thu hái, chế biến, pha và mời trà.", "Có thể kết nối Không gian Văn hóa Trà, HTX Hảo Đạt và hồ Núi Cốc trong cùng tuyến."],
    highlights: ["Câu chuyện Tân Cương là hành trình của lá trà: từ thổ nhưỡng, thời điểm hái và kỹ thuật sao chè đến hương, màu nước, vị chát và hậu vị. Con người cùng kỹ thuật làm nghề là phần quan trọng nhất của câu chuyện này."],
    activities: ["Dạo đồi chè và tìm hiểu vùng nguyên liệu.", "Thử hái chè khi cơ sở có chương trình và người hướng dẫn.", "Quan sát chế biến trong phạm vi cơ sở cho phép.", "Học pha, nếm và bảo quản trà; chọn sản phẩm có nguồn gốc rõ ràng."],
    localCulture: ["Trà Tân Cương và các sản phẩm OCOP từ chè là trọng tâm.", "Nghi thức mời trà thể hiện sự hiếu khách và nhịp sống của cư dân vùng chè."],
    bestTime: ["Có thể tham quan quanh năm.", "Xuân và thu dễ chịu cho hoạt động ngoài trời; mùa hè nên đi sớm hoặc cuối chiều; mùa đông phù hợp với trải nghiệm trong nhà và thưởng trà."],
    audience: ["Gia đình, nhóm bạn, học sinh, người yêu trà, khách quan tâm nông nghiệp và văn hóa địa phương."],
    locationAndConnections: ["Xã Tân Cương, tỉnh Thái Nguyên.", "Có thể kết hợp Không gian Văn hóa Trà, HTX Hảo Đạt, Thái Hải và hồ Núi Cốc."], sourceNote: fromDocument,
  },
  "hao-dat": {
    ...craftDestinationContent["hao-dat"].vi.profile,
  },
  "khong-gian-tra": {
    tagline: "Điểm bắt đầu để đọc câu chuyện trà Tân Cương",
    introduction: ["Không gian Văn hóa Trà Tân Cương là điểm giới thiệu lịch sử, dụng cụ, kỹ thuật và tập quán thưởng trà của vùng chè. Đây là nơi phù hợp để có kiến thức nền trước khi đi đồi chè hoặc gặp người sản xuất."],
    reasons: ["Giúp hệ thống hóa câu chuyện trà trước khi trải nghiệm thực địa.", "Phù hợp khi thời tiết không thuận lợi cho hoạt động ngoài trời.", "Nằm gần vùng chè và các cơ sở sản xuất Tân Cương."],
    highlights: ["Điểm nổi bật nằm ở mối liên hệ giữa cây chè, người làm nghề và cách trà đi vào đời sống thường ngày. Không gian trưng bày nên được xem như phần mở đầu, còn đồi chè và cơ sở sản xuất là phần tiếp nối."],
    activities: ["Xem nội dung trưng bày về vùng trà và nghề chè.", "Tìm hiểu dụng cụ, quy trình pha và cách thưởng trà.", "Trao đổi với thuyết minh viên nếu có lịch phục vụ.", "Tiếp tục tới đồi chè hoặc HTX sau khi tham quan."],
    localCulture: ["Văn hóa mời trà và cách nhận biết trà Tân Cương.", "Sản phẩm cụ thể nên mua tại cơ sở có thông tin nguồn gốc và ngày đóng gói rõ ràng."],
    bestTime: ["Phù hợp quanh năm; nên kiểm tra giờ mở cửa và lịch thuyết minh trước khi đến."],
    audience: ["Gia đình, học sinh, khách quốc tế, người lần đầu tìm hiểu trà Thái Nguyên."],
    locationAndConnections: ["Xóm Soi Vàng, Tân Cương, Thái Nguyên.", "Có thể kết hợp đồi chè Tân Cương, HTX Hảo Đạt, Thái Hải và hồ Núi Cốc."], sourceNote: supplemented,
  },
  "nui-coc": {
    ...greenDestinationContent["nui-coc"].vi.profile,
  },
  "thai-hai": {
    ...villageContent["thai-hai"].vi.profile,
  },
  "la-bang": {
    tagline: "Vùng trà dưới chân Tam Đảo, nơi chè đặc sản gặp du lịch sinh thái",
    introduction: ["La Bằng là vùng chè nổi tiếng ở sườn đông dãy Tam Đảo. Địa phương đang phát triển du lịch cộng đồng và sinh thái gắn với chè, Suối Kẹm cùng các dịch vụ tại xóm Tân Sơn."],
    reasons: ["Cảnh quan đồi chè dưới chân núi có sắc thái riêng.", "Trà đặc sản và thiên nhiên Suối Kẹm nằm gần nhau.", "Ẩm thực và lưu trú cộng đồng tạo điều kiện cho hành trình cuối tuần."],
    highlights: ["La Bằng được kể theo trục trà, suối và cộng đồng: bắt đầu ở vùng chè, gặp người làm trà, sau đó đi lên Tân Sơn và Suối Kẹm để nghỉ, dùng bữa và cảm nhận sườn đông Tam Đảo."],
    activities: ["Dạo đồi chè và tìm hiểu vùng nguyên liệu.", "Thưởng trà tại HTX hoặc cơ sở nhận khách.", "Trải nghiệm hái, chế biến khi có chương trình.", "Đi Suối Kẹm trong phạm vi an toàn và dùng bữa tại Tân Sơn."],
    localCulture: ["Trà La Bằng là sản phẩm trọng tâm.", "Khu Suối Kẹm thường có cá tầm, cá suối, gà đồi và măng; thực đơn phụ thuộc từng cơ sở."],
    bestTime: ["Xuân và thu thuận lợi cho trà và đi bộ; mùa hè hấp dẫn với suối nhưng cần theo dõi mưa lớn; mùa đông phù hợp thưởng trà và nghỉ dưỡng."],
    audience: ["Nhóm bạn, gia đình, khách yêu trà, du lịch sinh thái và nghỉ cuối tuần."],
    locationAndConnections: ["Xã La Bằng, tỉnh Thái Nguyên.", "Có thể kết hợp Suối Kẹm, các homestay Tân Sơn, Tân Cương và hồ Núi Cốc."], sourceNote: fromDocument,
  },
  "vo-tranh": {
    tagline: "Một vùng chè để đi chậm và gặp người làm nghề",
    introduction: ["Vô Tranh là vùng chè của Thái Nguyên, phù hợp với hành trình tìm hiểu nông nghiệp và sản phẩm địa phương. Trải nghiệm nên gắn với một HTX hoặc hộ sản xuất đã xác nhận đón khách, thay vì chỉ đi tới tọa độ trung tâm vùng."],
    reasons: ["Có cảnh quan chè và nhịp sống sản xuất đặc trưng của vùng trung du.", "Phù hợp nối vào chuyên đề nhiều vùng trà Thái Nguyên.", "Cho phép tiếp cận câu chuyện nghề ở quy mô hộ và hợp tác xã."],
    highlights: ["Giá trị của Vô Tranh nằm ở người trồng chè và cách mỗi cơ sở tổ chức vùng nguyên liệu, chế biến, tạo sản phẩm. Nội dung trải nghiệm cần dựa trên cơ sở tiếp đón cụ thể."],
    activities: ["Dạo vùng chè tại điểm được hướng dẫn.", "Gặp người làm chè và tìm hiểu quy trình khi đã hẹn.", "Thưởng trà và chọn sản phẩm có nguồn gốc rõ ràng."],
    localCulture: ["Trà và sản phẩm từ chè là trọng tâm; chủng loại, chứng nhận và giá bán cần kiểm tra tại cơ sở."],
    bestTime: ["Xuân, hè và thu phù hợp cảnh quan; lịch hái và chế biến phụ thuộc mùa vụ."],
    audience: ["Người yêu trà, nhóm học tập, gia đình và khách thích trải nghiệm nông nghiệp."],
    locationAndConnections: ["Vùng chè Vô Tranh, tỉnh Thái Nguyên; marker là tâm khu vực, không phải cổng đón khách.", "Có thể kết hợp Bờ Đậu, La Bằng hoặc tuyến nhiều vùng chè."], sourceNote: supplemented,
  },
  "ghenh-che": {
    ...greenDestinationContent["ghenh-che"].vi.profile,
  },
  "ban-ten": {
    ...villageContent["ban-ten"].vi.profile,
  },
  "khuan-bang": {
    ...villageContent["khuan-bang"].vi.profile,
  },
  "bao-tang-dan-toc": {
    tagline: "Điểm khởi đầu để hiểu bức tranh văn hóa 54 dân tộc Việt Nam",
    introduction: ["Bảo tàng Văn hóa các dân tộc Việt Nam là bảo tàng cấp quốc gia tại trung tâm Thái Nguyên, lưu giữ hơn 40.000 tài liệu và hiện vật gốc, với không gian trưng bày trong nhà và ngoài trời."],
    reasons: ["Cho cái nhìn rộng về sự đa dạng văn hóa Việt Nam.", "Có thể tìm hiểu trang phục, nhà ở, lao động, tín ngưỡng, nghệ thuật và nghề thủ công.", "Phù hợp làm nền kiến thức trước khi tới Thái Hải hoặc các bản cộng đồng."],
    highlights: ["Thay vì xem dàn trải, khách có thể chọn hai hoặc ba chủ đề: nhà ở và trang phục; lao động và sản xuất; nghi lễ và tín ngưỡng; âm nhạc, nghệ thuật hoặc nghề thủ công."],
    activities: ["Tham quan các phòng trưng bày.", "Khám phá không gian kiến trúc ngoài trời.", "Tham gia chương trình giáo dục hoặc hoạt động chuyên đề nếu có lịch.", "Đặt thuyết minh theo chủ đề cho nhóm học tập."],
    bestTime: ["Phù hợp quanh năm và là lựa chọn tốt trong ngày mưa. Cần kiểm tra giờ mở cửa, ngày nghỉ và quy định chụp ảnh."],
    audience: ["Học sinh, gia đình, khách quốc tế, người nghiên cứu văn hóa."],
    locationAndConnections: ["Số 1 đường Đội Cấn, khu vực trung tâm Thái Nguyên.", "Có thể kết hợp Di tích Đại đội 915, Thái Hải và Tân Cương."], sourceNote: fromDocument,
  },
  "dai-doi-915": {
    ...historyDestinationContent["dai-doi-915"].vi.profile,
  },
  "bo-dau": {
    ...craftDestinationContent["bo-dau"].vi.profile,
  },
  "lan-tin-keo": {
    tagline: "Một nơi nhỏ gắn với quyết định lớn của lịch sử",
    introduction: ["Lán Tỉn Keo là điểm cốt lõi của ATK Định Hóa. Ngày 06/12/1953, Bộ Chính trị dưới sự chủ trì của Chủ tịch Hồ Chí Minh đã thông qua kế hoạch tác chiến Đông Xuân 1953–1954 và chủ trương mở Chiến dịch Điện Biên Phủ."],
    reasons: ["Gắn với một sự kiện lịch sử cụ thể và dễ ghi nhớ.", "Không gian lán, đồi và rừng cho thấy điều kiện làm việc thời kháng chiến.", "Là điểm quan trọng trong tuyến giáo dục về ATK."],
    highlights: ["Câu chuyện có ba lớp: vì sao Định Hóa được chọn làm An toàn khu, đời sống và công việc giữa rừng, rồi cuộc họp tại Tỉn Keo cùng mối liên hệ với Chiến dịch Điện Biên Phủ."],
    activities: ["Đi bộ lên khu lán theo tuyến chỉ dẫn.", "Nghe thuyết minh lịch sử.", "Quan sát lán, cảnh quan rừng và hệ thống biển giới thiệu.", "Kết hợp nhà trưng bày trong cụm ATK."],
    localCulture: ["Ẩm thực và lưu trú nên sử dụng tại các cơ sở cộng đồng ở Phú Đình đã xác nhận."],
    bestTime: ["Có thể tham quan quanh năm; ngày mưa cần giày phù hợp và lưu ý đường dốc, trơn."],
    audience: ["Học sinh, đoàn về nguồn, người quan tâm lịch sử và gia đình."],
    locationAndConnections: ["Khu vực Tỉn Keo, Phú Đình, Thái Nguyên.", "Có thể kết hợp Nhà tưởng niệm Chủ tịch Hồ Chí Minh, Khuôn Tát và nhà trưng bày ATK."], sourceNote: fromDocument,
  },
  "nha-tuong-niem-atk": {
    tagline: "Điểm tưởng niệm trang trọng trên đỉnh đèo De",
    introduction: ["Nhà tưởng niệm Chủ tịch Hồ Chí Minh tại ATK nằm trên đỉnh đèo De, thuộc dãy Hồng. Công trình mang nét kiến trúc đình, đền truyền thống, được khánh thành năm 2005 và là điểm dâng hương quan trọng của hành trình về nguồn."],
    reasons: ["Không gian trang trọng và có tính biểu tượng trong cụm ATK.", "Vị trí cao giúp cảm nhận cảnh quan vùng căn cứ.", "Phù hợp làm điểm mở đầu trước khi đi sâu vào các di tích trong rừng."],
    highlights: ["Đây là không gian tưởng niệm và là điểm dẫn vào câu chuyện ATK. Nội dung nên ngắn gọn, tôn trọng, đồng thời giải thích vai trò của đèo De và vùng Phú Đình trong tuyến di tích."],
    activities: ["Dâng hương theo nhu cầu.", "Tham quan kiến trúc và khuôn viên.", "Nghe giới thiệu tổng quan về ATK.", "Quan sát cảnh quan trước khi nối sang các điểm khác."],
    bestTime: ["Phù hợp quanh năm; cần lưu ý bậc và độ dốc với người cao tuổi hoặc hạn chế vận động."],
    audience: ["Mọi nhóm tham quan ATK, đặc biệt đoàn về nguồn và giáo dục lịch sử."],
    locationAndConnections: ["Đỉnh đèo De, Phú Đình, Thái Nguyên.", "Có thể kết hợp Lán Tỉn Keo, Khuôn Tát và nhà trưng bày ATK."], sourceNote: fromDocument,
  },
  "khuon-tat": {
    tagline: "Di tích trong rừng kết hợp cảnh quan thác Khuôn Tát",
    introduction: ["Khuôn Tát thuộc cụm ATK Định Hóa, gắn với cây đa nơi Chủ tịch Hồ Chí Minh tập thể dục và khu lán Người từng sống, làm việc. Gần đó là thác Khuôn Tát, tạo thêm lớp trải nghiệm thiên nhiên cho tuyến lịch sử."],
    reasons: ["Kết hợp được lịch sử với cảnh quan rừng và thác.", "Không gian gần gũi giúp hình dung đời sống tại căn cứ.", "Dễ nối với Tỉn Keo và Nhà tưởng niệm trong một tuyến."],
    highlights: ["Khu di tích và thác là hai lớp trải nghiệm ở gần nhau nhưng không đồng nhất. Việc tiếp cận thác cần phụ thuộc mùa, mực nước và điều kiện an toàn."],
    activities: ["Thăm cây đa và dấu tích lịch sử.", "Nghe kể về đời sống, công việc tại ATK.", "Đi bộ ngắn trong rừng.", "Tham quan thác khi đường và thời tiết an toàn."],
    localCulture: ["Có thể đặt bữa tại cộng đồng Phú Đình; không mặc định có dịch vụ ăn uống ngay tại di tích."],
    bestTime: ["Mùa khô thuận lợi hơn cho đi bộ; mùa mưa cần thận trọng với đường trơn, dòng chảy và khu vực thác."],
    audience: ["Khách lịch sử, gia đình, học sinh và người thích kết hợp thiên nhiên nhẹ."],
    locationAndConnections: ["Khuôn Tát, Phú Đình, Thái Nguyên.", "Có thể kết hợp Lán Tỉn Keo, Nhà tưởng niệm và nhà trưng bày ATK."], sourceNote: fromDocument,
  },
  "suoi-kem": {
    tagline: "Dòng suối dưới sườn đông Tam Đảo và điểm nghỉ giữa vùng chè La Bằng",
    introduction: ["Suối Kẹm bắt nguồn từ khu vực Tam Đảo, chảy qua La Bằng với nước mát, ghềnh đá và thảm thực vật. Các cơ sở lưu trú tại Tân Sơn giúp du khách ở lại lâu hơn, kết hợp suối, vùng chè, ẩm thực và nghỉ dưỡng."],
    reasons: ["Cảnh quan suối, đá và rừng tạo trải nghiệm thiên nhiên rõ nét.", "Gần vùng chè và homestay nên dễ tổ chức hành trình nửa ngày hoặc một ngày.", "Có thể chọn đi bộ, nghỉ ngơi hoặc lưu trú tùy nhu cầu."],
    highlights: ["Giá trị chính không chỉ là tắm suối mà là sự chuyển tiếp từ đồi chè lên chân núi Tam Đảo. Các homestay đóng vai trò điểm dịch vụ bổ trợ; giá phòng, bể bơi và hoạt động nhóm phải được xác nhận theo thời điểm."],
    activities: ["Đi bộ ở khu vực được phép tiếp cận.", "Ngắm dòng suối, ghềnh đá và rừng.", "Kết hợp thưởng trà, dùng bữa hoặc lưu trú tại Tân Sơn.", "Đặt trước bể bơi, lửa trại, văn nghệ hoặc trekking nếu cơ sở có tổ chức."],
    localCulture: ["Các cơ sở quanh Suối Kẹm thường giới thiệu cá tầm, cá suối, gà đồi, lợn bản và măng rừng; menu và giá cần kiểm tra trực tiếp."],
    bestTime: ["Mùa hè hấp dẫn nhưng cần đặc biệt lưu ý mưa dông, lũ đầu nguồn và đá trơn. Xuân và thu phù hợp nghỉ dưỡng; cuối tuần nên đặt trước."],
    audience: ["Nhóm bạn, gia đình có trẻ lớn, khách thích thiên nhiên và người muốn ngủ lại La Bằng."],
    locationAndConnections: ["Xóm Tân Sơn, xã La Bằng, tỉnh Thái Nguyên.", "Có thể kết hợp vùng chè La Bằng và các homestay tại Tân Sơn."], sourceNote: fromDocument,
  },
  "hang-phuong-hoang": {
    tagline: "Hành trình leo núi và khám phá hang nhiều tầng ở Võ Nhai",
    introduction: ["Hang Phượng Hoàng nằm trong cụm danh thắng Phượng Hoàng và Mỏ Gà. Hang có không gian rộng, nhiều tầng và hệ thống nhũ đá; hành trình tới cửa hang đòi hỏi leo nhiều bậc, phù hợp với khách có thể lực tốt."],
    reasons: ["Cấu trúc hang nhiều tầng và nhũ đá tạo trải nghiệm khám phá rõ nét.", "Quá trình leo giúp cảm nhận địa hình núi đá Võ Nhai.", "Có thể kết hợp Suối Mỏ Gà ở chân núi để cân bằng vận động và nghỉ ngơi."],
    highlights: ["Hành trình nên được hiểu theo bốn chặng: chuẩn bị, leo lên cửa hang, tham quan bên trong rồi xuống núi nghỉ ở suối. Không nên xem đây là một điểm check-in dễ dàng cho mọi đối tượng."],
    activities: ["Leo tuyến bậc đá theo chỉ dẫn.", "Quan sát nhũ đá và cấu trúc không gian hang.", "Nghe giới thiệu lịch sử, truyền thuyết địa phương.", "Chụp ảnh trong phạm vi an toàn, không chạm hoặc làm hỏng nhũ đá."],
    localCulture: ["Không phải điểm ăn uống; nên chuẩn bị nước và bố trí bữa tại khu dịch vụ chân núi hoặc xóm Mỏ Gà."],
    bestTime: ["Ưu tiên ngày khô ráo. Mưa có thể làm bậc và nền hang trơn; cần kiểm tra tình trạng mở tuyến."],
    audience: ["Người có sức khỏe tốt, nhóm thích leo núi nhẹ và hang động; không mặc định phù hợp với người cao tuổi, trẻ nhỏ hoặc người có vấn đề tim mạch, khớp."],
    locationAndConnections: ["Trong cụm du lịch sinh thái Phượng Hoàng, xã Võ Nhai, tỉnh Thái Nguyên.", "Có thể kết hợp Suối Mỏ Gà và xóm Mỏ Gà."], sourceNote: fromDocument,
  },
  "suoi-mo-ga": {
    tagline: "Dòng nước mát dưới chân núi Phượng Hoàng",
    introduction: ["Suối Mỏ Gà nằm ngay chân núi Phượng Hoàng. Nước từ khu vực hang tạo thành dòng suối mát với nhiều đoạn thác nhỏ, thường được chọn làm điểm nghỉ sau khi leo hang hoặc là phương án nhẹ vận động hơn."],
    reasons: ["Vị trí chân núi thuận tiện kết hợp với Hang Phượng Hoàng.", "Dòng nước, đá và rừng tạo không gian thư giãn.", "Phù hợp cho khách không muốn leo hang nhưng vẫn muốn khám phá cụm điểm."],
    highlights: ["Suối tự nhiên và các khu bơi, bể dịch vụ là những không gian khác nhau. Hoạt động xuống nước chỉ thực hiện ở nơi được phép và khi điều kiện an toàn."],
    activities: ["Ngắm cảnh và đi bộ tại khu vực được phép.", "Nghỉ sau hành trình leo hang.", "Sử dụng dịch vụ nước hoặc bể bơi nếu đang mở và bảo đảm an toàn.", "Kết hợp ăn trưa hoặc sang xóm Mỏ Gà."],
    localCulture: ["Có thể kết nối ẩm thực tại khu du lịch với món bản địa ở xóm Mỏ Gà."],
    bestTime: ["Mùa hè hấp dẫn nhưng phải theo dõi mưa đầu nguồn. Khi nước đục, chảy mạnh hoặc có mưa lớn nên tránh khu vực sát nước."],
    audience: ["Gia đình, nhóm bạn và khách muốn trải nghiệm thiên nhiên nhẹ hơn so với leo hang."],
    locationAndConnections: ["Chân núi Phượng Hoàng, xã Võ Nhai, tỉnh Thái Nguyên.", "Có thể kết hợp Hang Phượng Hoàng và xóm Mỏ Gà."], sourceNote: fromDocument,
  },
  "xom-mo-ga": {
    ...villageContent["xom-mo-ga"].vi.profile,
  },
  "pac-ngoi": {
    tagline: "Bản Tày ven hồ với nhà sàn, ẩm thực và nhịp sống Ba Bể",
    introduction: ["Pác Ngòi là bản văn hóa du lịch cộng đồng ven hồ Ba Bể, nổi bật với nhà sàn Tày, cảnh quan núi, đồng, hồ và hệ thống homestay. Theo địa giới hiện hành năm 2026, bản thuộc xã Ba Bể, tỉnh Thái Nguyên."],
    reasons: ["Nằm sát hồ, thuận tiện kết hợp nghỉ đêm với tuyến thuyền.", "Văn hóa Tày thể hiện qua nhà sàn, ẩm thực, nghề truyền thống và âm nhạc.", "Mô hình cùng ăn, cùng ở tạo chiều sâu hơn một chuyến tham quan nhanh."],
    highlights: ["Nếu Hồ Ba Bể kể câu chuyện thiên nhiên thì Pác Ngòi kể câu chuyện con người: nếp nhà sàn, bữa cơm, chủ nhà, nghề dệt, làm bánh và cách cộng đồng làm du lịch."],
    activities: ["Dạo bản và quan sát kiến trúc nhà sàn.", "Lưu trú homestay và dùng bữa Tày.", "Tìm hiểu dệt vải, bánh truyền thống hoặc nghề địa phương khi có người hướng dẫn.", "Giao lưu Then, đàn Tính khi đặt trước và đi thuyền từ bến phù hợp."],
    localCulture: ["Ẩm thực Tày và sản phẩm thủ công là điểm nhấn; menu và giá khác nhau giữa các homestay."],
    bestTime: ["Có thể đi quanh năm; mùa lúa và thời tiết khô có cảnh quan đẹp. Mùa mưa cần kiểm tra đường và lịch thuyền."],
    audience: ["Khách quốc tế, gia đình, nhóm bạn và người yêu du lịch cộng đồng."],
    locationAndConnections: ["Pác Ngòi, xã Ba Bể, tỉnh Thái Nguyên; trước đợt sắp xếp năm 2025, khu vực thuộc tỉnh Bắc Kạn.", "Có thể kết hợp Hồ Ba Bể, Ao Tiên, Đền An Mạ và khu vực Đảo Bà Góa."], sourceNote: fromDocument,
  },
  "ho-ba-be": {
    ...greenDestinationContent["ho-ba-be"].vi.profile,
  },
  "den-an-ma": {
    tagline: "Điểm tâm linh và câu chuyện dân gian giữa lòng hồ Ba Bể",
    introduction: ["Đền An Mạ tọa lạc trên đảo An Mạ giữa hồ Ba Bể, là điểm sinh hoạt tâm linh của người dân và khách thập phương. Hồ sơ hiện tại đồng thời giới thiệu Đảo Bà Góa, một đảo nhỏ trên hồ gắn với câu chuyện dân gian về lòng nhân hậu."],
    reasons: ["Vị trí giữa hồ tạo trải nghiệm di chuyển khác với đền trên đất liền.", "Giúp hiểu thêm đời sống tín ngưỡng trong bối cảnh hồ và rừng.", "Đảo Bà Góa bổ sung lớp truyền thuyết và cảnh quan cho tuyến thuyền."],
    highlights: ["Đền An Mạ cần được giới thiệu bằng giọng tôn trọng tín ngưỡng. Với Đảo Bà Góa, câu chuyện nên ngắn gọn, dựa trên nguồn địa phương và không thêm chi tiết huyền tích chưa kiểm chứng."],
    activities: ["Cập đảo bằng thuyền theo tuyến.", "Tham quan kiến trúc, không gian đền và dâng hương theo nhu cầu.", "Nghe giới thiệu lịch sử, tín ngưỡng và truyền thuyết địa phương.", "Ngắm hoặc dừng tại khu vực Đảo Bà Góa nếu tuyến cho phép."],
    localCulture: ["Đây không phải điểm ẩm thực; ăn uống và mua sắm nên thực hiện tại bản, bến hoặc cơ sở đã xác nhận."],
    bestTime: ["Có thể đi quanh năm theo điều kiện thuyền. Dịp lễ hội có thể đông; lịch hội theo âm lịch cần cập nhật từng năm."],
    audience: ["Khách văn hóa, tâm linh, gia đình và mọi nhóm đi tuyến hồ Ba Bể."],
    locationAndConnections: ["Đảo An Mạ và khu vực hồ Ba Bể, xã Ba Bể, tỉnh Thái Nguyên theo địa giới hiện hành.", "Có thể kết hợp Hồ Ba Bể, Ao Tiên, Đảo Bà Góa và Pác Ngòi."], sourceNote: fromDocument,
  },
};

export const destinationProfiles: Record<string, DestinationProfile> = {
  ...sourceDestinationProfiles,
  "tan-cuong": teaDestinationContent["tan-cuong"].vi.profile,
  "khong-gian-tra": teaDestinationContent["khong-gian-tra"].vi.profile,
  ...Object.fromEntries(Object.entries(filesDestinationContent).map(([id, content]) => [id, content.vi.profile])),
};
