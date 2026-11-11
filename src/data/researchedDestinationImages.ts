import type { Media } from "@/domain/models";

// Curated images from destination-specific articles on the provincial tourism portal.
// Keep the article URL with each image set for attribution and later review.
const researchedSources: Record<string, Array<{ sourceUrl: string; credit?: string; urls: string[] }>> = {
  "la-bang": [
    { sourceUrl: "https://mythainguyen.vn/vi/detailnews/?id=news_1826", urls: [
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/2026_02/La%20B%E1%BA%B1ng/ImageWaterMark/11_812300343_232256156.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/2026_02/La%20B%E1%BA%B1ng/ImageWaterMark/2_366290110_570286855.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/2026_02/La%20B%E1%BA%B1ng/ImageWaterMark/3_474269644_430742869.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/2026_02/La%20B%E1%BA%B1ng/ImageWaterMark/4_739265519_932393855.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/2026_02/La%20B%E1%BA%B1ng/ImageWaterMark/5_92452175_911619527.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/2026_02/La%20B%E1%BA%B1ng/ImageWaterMark/6_646441942_410058824.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/2026_02/La%20B%E1%BA%B1ng/ImageWaterMark/7_559236736_54465488.jpg",
    ] },
  ],
  "vo-tranh": [
    { sourceUrl: "https://mythainguyen.vn/vi/detailnews/?id=news_1765", urls: [
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/ngoclinh.tnn/Tin%202026/Th%C3%A1ng%206/V%C3%B4%20Tranh/ImageWaterMark/dji_20260616101310_0389_d_562532886_628776113.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/ngoclinh.tnn/Tin%202026/Th%C3%A1ng%206/V%C3%B4%20Tranh/ImageWaterMark/picture1111_924586979_833868034.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/ngoclinh.tnn/Tin%202026/Th%C3%A1ng%206/V%C3%B4%20Tranh/ImageWaterMark/img_0258_467392911_851260842.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/ngoclinh.tnn/Tin%202026/Th%C3%A1ng%206/V%C3%B4%20Tranh/ImageWaterMark/img_0018_520850748_763977353.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/ngoclinh.tnn/Tin%202026/Th%C3%A1ng%206/V%C3%B4%20Tranh/ImageWaterMark/img_0315_948269569_251457958.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/ngoclinh.tnn/Tin%202026/Th%C3%A1ng%206/V%C3%B4%20Tranh/ImageWaterMark/2aoboqe65hr6bkb1uknbqmuzozbqjzji5uzggj16_862395186_420861416.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/ngoclinh.tnn/Tin%202026/Th%C3%A1ng%206/V%C3%B4%20Tranh/ImageWaterMark/dji_20260616102253_0403_d_482682350_407355242.jpg",
    ] },
  ],
  "ghenh-che": [
    { sourceUrl: "https://mythainguyen.vn/vi/detailnews/?id=news_578", urls: [
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/sovhttdl.tnn/10_2021/01/img_20211001_155254_637691976454376878.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/sovhttdl.tnn/10_2021/01/img_6878_637691976451720715.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/sovhttdl.tnn/10_2021/01/img_20211001_155223_637691990767594129.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/sovhttdl.tnn/10_2021/01/img20210929110305_637691991172089955.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/sovhttdl.tnn/10_2021/01/img_20211004_100132_637691993410040136.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/sovhttdl.tnn/10_2021/01/img_20211001_150914_637691976453283400.jpg",
    ] },
    { sourceUrl: "https://mythainguyen.vn/vi/detailnews/?id=news_1297", urls: [
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/N%C4%82M%202024/TH%C3%81NG%205/gh%E1%BB%81nh%20ch%C3%A8/picture1_250122663.jpg",
    ] },
  ],
  "ban-ten": [
    { sourceUrl: "https://mythainguyen.vn/vi/detailnews/?id=news_1215", urls: [
      "https://dltm-cdn.vnptit3.vn/resources/portal/Images/TNN/namdan.tnn/N%C4%83m2023/T10/bten1_638324601813837054.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal/Images/TNN/namdan.tnn/N%C4%83m2023/T10/bten22_638324601814145798.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal/Images/TNN/namdan.tnn/N%C4%83m2023/T10/bten3_638324601814614411.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal/Images/TNN/namdan.tnn/N%C4%83m2023/T10/bten4a_638324601812895582.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal/Images/TNN/namdan.tnn/N%C4%83m2023/T10/bten4b_638324601815708278.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal/Images/TNN/namdan.tnn/N%C4%83m2023/T10/bten5a_638324601813208089.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal/Images/TNN/namdan.tnn/N%C4%83m2023/T10/bten5b_638324601813520529.jpg",
    ] },
  ],
  "bao-tang-dan-toc": [
    { sourceUrl: "https://mythainguyen.vn/vi/detailnews/?id=news_1670", urls: [
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/2026/T2/ImageWaterMark/picture1_967489119_375433235.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/2026/T2/ImageWaterMark/picture2_357858599_873782248.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/2026/T2/ImageWaterMark/picture3_270653393_372131262.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/2026/T2/ImageWaterMark/picture4_824643160_675295536.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/2026/T2/ImageWaterMark/picture5_587776282_337264837.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/2026/T2/ImageWaterMark/picture6_141766050_835613850.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/2026/T2/ImageWaterMark/picture7_219010138_637127137.png",
    ] },
  ],
  "dai-doi-915": [
    { sourceUrl: "https://mythainguyen.vn/vi/detailnews/?id=news_780", urls: [
      "https://dltm-cdn.vnptit3.vn/resources/portal/Images/TNN/namdan.tnn/thang5/t2/6_637877123884151097.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal/Images/TNN/namdan.tnn/thang5/t2/5_637877123883370115.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal/Images/TNN/namdan.tnn/thang5/t2/4_637877123882276256.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal/Images/TNN/namdan.tnn/thang5/t2/3_637877123796962238.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal/Images/TNN/namdan.tnn/thang5/t2/2_637877123795867969.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal/Images/TNN/namdan.tnn/thang5/t2/1_637877123794461847.jpg",
    ] },
    { sourceUrl: "https://mythainguyen.vn/vi/detailnews/?id=news_1732", urls: [
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/ngoclinh.tnn/Tin%202026/Th%C3%A1ng%204/%C4%90%C3%B4ng%20Bo/ImageWaterMark/z7766402895087_75fd8a00fc19e7f393f17c5cd1d19b06_905425163_759706820.jpg",
    ] },
  ],
  "khuon-tat": [
    { sourceUrl: "https://mythainguyen.vn/vi/detailnews/?id=news_1385", urls: [
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/N%C4%82M%202024/Tha%C3%A1ng%2011/1a_735878558.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/N%C4%82M%202024/Tha%C3%A1ng%2011/1b_237529545.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/N%C4%82M%202024/Tha%C3%A1ng%2011/1c_575560244.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/N%C4%82M%202024/Tha%C3%A1ng%2011/1d_436016258.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/N%C4%82M%202024/Tha%C3%A1ng%2011/1e_916892916.jpg",
    ] },
    { sourceUrl: "https://mythainguyen.vn/vi/detailnews/?id=news_1120", urls: [
      "https://dltm-cdn.vnptit3.vn/resources/portal/Images/TNN/namdan.tnn/N%C4%83m2023/d_638182908890592918.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal/Images/TNN/namdan.tnn/N%C4%83m2023/c_638182908809028806.jpg",
    ] },
  ],
  "nha-tuong-niem-atk": [
    { sourceUrl: "https://mythainguyen.vn/vi/detailnews/?id=news_1415", urls: [
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/2025/Th%C3%A1ng%201/picture1_431694157.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/2025/Th%C3%A1ng%201/picture2_487334910.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/2025/Th%C3%A1ng%201/picture3_20550350.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/2025/Th%C3%A1ng%201/picture4_327016596.jpg",
    ] },
    { sourceUrl: "https://mythainguyen.vn/vi/detailnews/?id=news_1663", urls: [
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/2026/T1/ImageWaterMark/1_317989275_169259009.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/2026/T1/ImageWaterMark/23_575092551_367745722.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/2026/T1/ImageWaterMark/2_871979041_510591681.jpg",
    ] },
  ],
  "hang-phuong-hoang": [
    { sourceUrl: "https://mythainguyen.vn/vi/detailnews/?id=news_1538", urls: [
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/2025/Th%C3%A1ng%206/t3/picture8_682477874.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/2025/Th%C3%A1ng%206/t3/picture7_898436942.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/2025/Th%C3%A1ng%206/t3/picture6_201601216.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/2025/Th%C3%A1ng%206/t3/picture5_787155435.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/2025/Th%C3%A1ng%206/t3/picture4_253939996.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/2025/Th%C3%A1ng%206/t3/picture3_839494215.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/2025/Th%C3%A1ng%206/t3/picture1_306278777.jpg",
    ] },
  ],
  "suoi-mo-ga": [
    { sourceUrl: "https://mythainguyen.vn/vi/detailnews/?id=news_594", urls: [
      "https://dltm-cdn.vnptit3.vn/resources/portal/Images/TNN/sovhttdl.tnn/112021/t1/1_637715290464158617.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal/Images/TNN/sovhttdl.tnn/112021/t1/2_637715290464783548.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal/Images/TNN/sovhttdl.tnn/112021/t1/3_637715290465252249.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal/Images/TNN/sovhttdl.tnn/112021/t1/4_637715290465877287.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal/Images/TNN/sovhttdl.tnn/112021/t1/5_637715290466346249.jpg",
    ] },
    { sourceUrl: "https://mythainguyen.vn/vi/detailnews/?id=news_457", urls: [
      "https://dltm-cdn.vnptit3.vn/resources/portal/Images/TNN/sovhttdl.tnn/thang42021/hangcopy_637542510990581156.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal/Images/TNN/sovhttdl.tnn/thang42021/z2421525330668_85fe82aa4ae961436bdb862a778ba43acopy_637542510993237709.jpg",
    ] },
  ],
  "ho-ba-be": [
    { sourceUrl: "https://mythainguyen.vn/vi/hobabe", credit: "Cổng du lịch Thái Nguyên", urls: [
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/ngoclinh.tnn/%c4%90i%e1%bb%83m%20%c4%91%e1%ba%bfn/H%e1%bb%93%20Ba%20B%e1%bb%83/z6911615156924_0b982d541ec686380209bd3f95cbef82_440825864.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/ngoclinh.tnn/%c4%90i%e1%bb%83m%20%c4%91%e1%ba%bfn/H%e1%bb%93%20Ba%20B%e1%bb%83/z6911615136803_4771926db0e1c8dfcd68565530e5dd6f_661205961.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/ngoclinh.tnn/%c4%90i%e1%bb%83m%20%c4%91%e1%ba%bfn/H%e1%bb%93%20Ba%20B%e1%bb%83/z6911615178927_7c4f855407a3a79e32546d5050eafb7d_496466617.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/ngoclinh.tnn/%c4%90i%e1%bb%83m%20%c4%91%e1%ba%bfn/H%e1%bb%93%20Ba%20B%e1%bb%83/z6911615127046_084a5bc053449e848cf72ef1d89bfb90_964370235.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/ngoclinh.tnn/%c4%90i%e1%bb%83m%20%c4%91%e1%ba%bfn/H%e1%bb%93%20Ba%20B%e1%bb%83/z6911615127045_fb5a1651b796e12674d696b70d3097b3_317768657.jpg",
    ] },
    { sourceUrl: "https://mythainguyen.vn/vi/detailnews/?id=news_1557", credit: "Cổng du lịch Thái Nguyên", urls: [
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/ngoclinh.tnn/Tin%202025/Ba%20B%E1%BB%83/dji_20250729064159_0055_d1_555276435.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/ngoclinh.tnn/Tin%202025/Ba%20B%E1%BB%83/20250729_155619_954759968.jpg",
    ] },
  ],
  "den-an-ma": [
    { sourceUrl: "https://mythainguyen.vn/vi/denanma", credit: "Cổng du lịch Thái Nguyên", urls: [
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/ngoclinh.tnn/%c4%90i%e1%bb%83m%20%c4%91%e1%ba%bfn/%c4%90%e1%bb%81n%20An%20M%e1%ba%a1/20250729_072644_573486126.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/ngoclinh.tnn/%c4%90i%e1%bb%83m%20%c4%91%e1%ba%bfn/%c4%90%e1%bb%81n%20An%20M%e1%ba%a1/20250729_072508_267019879.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/ngoclinh.tnn/%c4%90i%e1%bb%83m%20%c4%91%e1%ba%bfn/%c4%90%e1%bb%81n%20An%20M%e1%ba%a1/dji_20250729074532_0063_d_937619474.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/ngoclinh.tnn/%c4%90i%e1%bb%83m%20%c4%91%e1%ba%bfn/%c4%90%e1%bb%81n%20An%20M%e1%ba%a1/20250729_073121_989958254.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/ngoclinh.tnn/%c4%90i%e1%bb%83m%20%c4%91%e1%ba%bfn/%c4%90%e1%bb%81n%20An%20M%e1%ba%a1/dji_20250729081938_0082_d_322448867.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/ngoclinh.tnn/%c4%90i%e1%bb%83m%20%c4%91%e1%ba%bfn/%c4%90%e1%bb%81n%20An%20M%e1%ba%a1/dji_20250729081533_0070_d_849138643.jpg",
    ] },
    { sourceUrl: "https://mythainguyen.vn/vi/detailnews/?id=news_1561", credit: "Cổng du lịch Thái Nguyên", urls: [
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/namdan.tnn/2025/THANG%209/picture1_763080674.jpg",
    ] },
  ],
  "bo-dau": [
    { sourceUrl: "https://baothainguyen.vn/multimedia/phong-su-anh/202501/lang-nghe-banh-chung-bo-dau-hoi-ha-ngay-ap-tet-0e80d2d", credit: "Báo Thái Nguyên", urls: [
      "https://cdn.baothainguyen.vn/w2000/e7837c027f6ecd14017ffa4e5f2a0e34/012025/banh-chung-tet-3_20250124083437.jpg",
      "https://cdn.baothainguyen.vn/w2000/e7837c027f6ecd14017ffa4e5f2a0e34/012025/banh-chung-tet-5_20250124083609.jpg",
      "https://cdn.baothainguyen.vn/w2000/e7837c027f6ecd14017ffa4e5f2a0e34/012025/banh-chung-tet-4_20250124085216.jpg",
      "https://cdn.baothainguyen.vn/w2000/e7837c027f6ecd14017ffa4e5f2a0e34/012025/banh-chung-tet-6_20250124085449.jpg",
      "https://cdn.baothainguyen.vn/w2000/e7837c027f6ecd14017ffa4e5f2a0e34/012025/banh-chung-tet-7_20250124085659.jpg",
      "https://cdn.baothainguyen.vn/w2000/e7837c027f6ecd14017ffa4e5f2a0e34/012025/banh-chung-tet-8_20250124085815.jpg",
      "https://cdn.baothainguyen.vn/w2000/e7837c027f6ecd14017ffa4e5f2a0e34/012025/banh-chung-tet-9_20250124085920.jpg",
    ] },
  ],
  "khuan-bang": [
    { sourceUrl: "https://mythainguyen.vn/vi/detailnews/?id=news_1768", credit: "Cổng du lịch Thái Nguyên", urls: [
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/ngoclinh.tnn/Tin%202026/Th%C3%A1ng%206/Khu%C3%A2n%20Bang/ImageWaterMark/dji_20260510080354_02301_d_880867891_599760657.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/ngoclinh.tnn/Tin%202026/Th%C3%A1ng%206/Khu%C3%A2n%20Bang/ImageWaterMark/img_9978_397402842_372933181.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/ngoclinh.tnn/Tin%202026/Th%C3%A1ng%206/Khu%C3%A2n%20Bang/ImageWaterMark/picture11_597086895_323896374.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/ngoclinh.tnn/Tin%202026/Th%C3%A1ng%206/Khu%C3%A2n%20Bang/ImageWaterMark/1wupukapgggoshjbg0k2bg20haalpfaxyc4703c2tvegmlxuv7hpdemhjqwyq8sryi4_398600183_358762800.jpg",
    ] },
    { sourceUrl: "https://chomoi.thainguyen.gov.vn/tuyen-truyen/khuan-bang-doan-ket-xay-dung-nong-thon-moi-phat-trien-du-lich-cong-dong-72094", credit: "Cổng thông tin xã Chợ Mới", urls: [
      "https://storage-vnportal.vnpt.vn/gov-tnn/10067/FileQuanTriTinTuc/00227.00_00_05_21.Still001.jpg",
      "https://storage-vnportal.vnpt.vn/gov-tnn/10067/FileQuanTriTinTuc/00227.00_01_29_21.Still009.jpg",
      "https://storage-vnportal.vnpt.vn/gov-tnn/10067/FileQuanTriTinTuc/00227.00_01_36_24.Still010.jpg",
    ] },
  ],
  "suoi-kem": [
    { sourceUrl: "https://mythainguyen.vn/vi/detailnews/?id=news_541", credit: "Cổng du lịch Thái Nguyên", urls: [
      "https://dltm-cdn.vnptit3.vn/resources/portal/Images/TNN/sovhttdl.tnn/072021/1_637617913654826980.png",
      "https://dltm-cdn.vnptit3.vn/resources/portal/Images/TNN/sovhttdl.tnn/072021/2_637617913654983707.png",
      "https://dltm-cdn.vnptit3.vn/resources/portal/Images/TNN/sovhttdl.tnn/072021/3_637617913655296872.png",
      "https://dltm-cdn.vnptit3.vn/resources/portal/Images/TNN/sovhttdl.tnn/072021/4_637617913655452235.png",
      "https://dltm-cdn.vnptit3.vn/resources/portal/Images/TNN/sovhttdl.tnn/072021/5_637617913655764663.png",
    ] },
    { sourceUrl: "https://mythainguyen.vn/vi/detailnews/?id=news_1103", credit: "Cổng du lịch Thái Nguyên", urls: [
      "https://dltm-cdn.vnptit3.vn/resources/portal/Images/TNN/namdan.tnn/N%C4%83m2023/Thang4/1_638161114460685518.png",
      "https://dltm-cdn.vnptit3.vn/resources/portal/Images/TNN/namdan.tnn/N%C4%83m2023/Thang4/2_638161114508817451.png",
    ] },
  ],
  "xom-mo-ga": [
    { sourceUrl: "https://mythainguyen.vn/vi/detailnews/?id=news_1530", credit: "Cổng du lịch Thái Nguyên", urls: [
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/ngoclinh.tnn/Tin%202025/X%C3%B3m%20M%E1%BB%8F%20G%C3%A0/1_716042792.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/ngoclinh.tnn/Tin%202025/X%C3%B3m%20M%E1%BB%8F%20G%C3%A0/2_768381572.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/ngoclinh.tnn/Tin%202025/X%C3%B3m%20M%E1%BB%8F%20G%C3%A0/3_353935792.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/ngoclinh.tnn/Tin%202025/X%C3%B3m%20M%E1%BB%8F%20G%C3%A0/4_461915326.jpg",
      "https://dltm-cdn.vnptit3.vn/resources/portal//Images/TNN/ngoclinh.tnn/Tin%202025/X%C3%B3m%20M%E1%BB%8F%20G%C3%A0/5_211089833.jpg",
    ] },
    { sourceUrl: "https://baothainguyen.vn/van-hoa/202210/mo-ga-lam-du-lich-cong-dong-6820311/", credit: "Báo Thái Nguyên", urls: [
      "https://cdn.baothainguyen.vn/w2000/e7837c027f6ecd14017ffa4e5f2a0e34/e7837c027f6ecd140180084841ec31aa/102022/moga2.15-10-2022_20221015073310.jpg",
      "https://cdn.baothainguyen.vn/w2000/e7837c027f6ecd14017ffa4e5f2a0e34/e7837c027f6ecd140180084841ec31aa/102022/moga15-10-2022_20221015073405.jpg",
    ] },
  ],
  "pac-ngoi": [
    { sourceUrl: "https://baotintuc.vn/anh/ban-tay-ben-ho-ba-be-thanh-diem-den-hut-khach-trong-nuoc-va-quoc-te-20251209202339103.htm", credit: "Báo Tin tức/TTXVN", urls: [
      "https://media3.baotintuc.vn/images/JoZjh5xJqB3SQ3I6LtEsSoB4-F8AZxWzKfFeSkJL1uIyAhzQx5-eIlfwHD5uc2eA7G4oynylkPNqwhAozGtYqrUV3inc1dsOj8b0az_hIWs/TTDT8499.jpg.avif",
      "https://media3.baotintuc.vn/images/JoZjh5xJqB3SQ3I6LtEsSoB4-F8AZxWzKfFeSkJL1uIyAhzQx5-eIlfwHD5uc2eAVsUsORE3lXzBhzZg_IUxGLUV3inc1dsOj8b0az_hIWs/TTDT8590.jpg.avif",
      "https://media3.baotintuc.vn/images/JoZjh5xJqB3SQ3I6LtEsSoB4-F8AZxWzKfFeSkJL1uIyAhzQx5-eIlfwHD5uc2eANdjz2imof6LOVd1H_gR8DLUV3inc1dsOj8b0az_hIWs/TTDT8446.jpg.avif",
      "https://media3.baotintuc.vn/images/JoZjh5xJqB3SQ3I6LtEsSoB4-F8AZxWzKfFeSkJL1uIyAhzQx5-eIlfwHD5uc2eAl-upj0mtpz_TSPoE3Y57zLUV3inc1dsOj8b0az_hIWs/TTDT8810.jpg.avif",
      "https://media3.baotintuc.vn/images/JoZjh5xJqB3SQ3I6LtEsSoB4-F8AZxWzKfFeSkJL1uIyAhzQx5-eIlfwHD5uc2eA1WcmBZES8gjktewzowecmbUV3inc1dsOj8b0az_hIWs/TTDT8768.jpg.avif",
      "https://media3.baotintuc.vn/images/JoZjh5xJqB3SQ3I6LtEsSoB4-F8AZxWzKfFeSkJL1uIyAhzQx5-eIlfwHD5uc2eAQFdRfAcMLDS6Ry0mGtsDhrUV3inc1dsOj8b0az_hIWs/VIET7492.jpg.avif",
      "https://media3.baotintuc.vn/images/JoZjh5xJqB3SQ3I6LtEsSoB4-F8AZxWzKfFeSkJL1uIyAhzQx5-eIlfwHD5uc2eA5tgzFxOzseAViWLlcf5bPrUV3inc1dsOj8b0az_hIWs/VIET7864.jpg.avif",
    ] },
  ],
  "lan-tin-keo": [
    { sourceUrl: "https://vpcp.chinhphu.vn/hanh-trinh-ve-nguon-y-nghia-tai-atk-dinh-hoa-11517332.htm", credit: "Cục Thông tin và Truyền thông Chính phủ / Nhật Bắc", urls: [
      "https://bcp.cdnchinhphu.vn/Uploaded_VGP/buikieulien/20170220/Lan-Tin-Keo.jpg",
      "https://bcp.cdnchinhphu.vn/Uploaded_VGP/buikieulien/20170220/Di-tich-trong-lan-Tin-Keo.jpg",
    ] },
    { sourceUrl: "https://baothainguyen.vn/chinh-tri/202405/nho-ve-tin-keo-5ec01a5/", credit: "Báo Thái Nguyên", urls: [
      "https://cdn.baothainguyen.vn/w2000/e7837c027f6ecd14017ffa4e5f2a0e34/052024/2-dsc02647_20240517052631_20240519080615.jpg",
      "https://cdn.baothainguyen.vn/w2000/e7837c027f6ecd14017ffa4e5f2a0e34/052024/1-dsc02600_20240517052630_20240519080759.jpg",
    ] },
    { sourceUrl: "https://baothainguyen.vn/dat-va-nguoi-thai-nguyen/lich-su-danh-thang/201711/doi-tin-keo-367BBA5", credit: "Báo Thái Nguyên", urls: [
      "https://cdn.baothainguyen.vn/w1200/oldimage/baothainguyen/UserFiles/image/dsc1122.jpg",
    ] },
    { sourceUrl: "https://thainguyen.gov.vn/van-hoa-xa-hoi/quy-dinh-ho-tro-kinh-phi-cho-nguoi-truc-tiep-trong-coi-di-tich-da-xep-hang-tren-dia-ban-tinh-270954", credit: "Cổng thông tin tỉnh Thái Nguyên", urls: [
      "https://storage-vnportal.vnpt.vn/gov-tnn/1/FileQuanTriTinTuc/image.639167013397360995.jpg",
    ] },
    { sourceUrl: "https://www.qdnd.vn/quoc-te/doi-ngoai-quoc-phong/doan-bao-quan-doi-nhan-dan-lao-tham-di-tich-lich-su-van-hoa-tinh-thai-nguyen-745027", credit: "Báo Quân đội nhân dân", urls: [
      "https://file3.qdnd.vn/data/images/0/2023/09/30/upload_2166/30092023_th_02.jpg?dpi=150&quality=100&w=870",
      "https://file3.qdnd.vn/data/images/0/2023/09/30/upload_2166/30092023_th_03.jpg?dpi=150&quality=100&w=870",
    ] },
  ],
};

export function getResearchedDestinationImages(id: string, destinationName: string): Media[] {
  const sources = researchedSources[id] ?? [];
  return sources.flatMap(({ sourceUrl, credit, urls }) => urls.map((url) => ({
    type: "image" as const,
    url,
    alt: `${destinationName} — ảnh tại điểm đến`,
    caption: credit ?? "Cổng du lịch Thái Nguyên",
    sourceUrl,
  }))).map((image, order) => ({ ...image, id: `${id}-researched-${order + 1}`, order, isCover: order === 0 }));
}
