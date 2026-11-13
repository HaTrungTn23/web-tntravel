import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Sparkles, UtensilsCrossed } from "lucide-react";
import type { Metadata } from "next";
import { getServerLocale } from "@/i18n/server";
import { foodStories, localizeCultureStory } from "@/data/cultureCatalog";
import { FoodCatalogExplorer } from "@/components/explore/FoodCatalogExplorer";
import { CuisineCarouselRail } from "@/components/explore/CuisineCarouselRail";
import styles from "./cuisine.module.css";

export const metadata: Metadata = {
  title: "Ẩm thực Thái Nguyên | Món ngon & Hương vị vùng trà",
  description: "Khám phá bản đồ ẩm thực Thái Nguyên: bánh chưng Bờ Đậu, cơm lam Định Hóa, trám đen Hà Châu, nem chua bờ Đậu và đặc sản vùng cao.",
};

const copy = {
  vi: {
    kicker: "Ẩm thực Thái Nguyên",
    title: "Đi qua vùng đất bằng vị giác",
    subtitle: "Mỗi món ăn mang trọn câu chuyện về nguyên liệu đồng bãi, nghề truyền thống và tình cảm của con người xứ Trà.",
    source: "Đọc tư liệu",
    exploreCatalog: "Khám phá kho tàng món ngon",
    specialties: "Tuyển chọn đặc sản nổi bật",
    railSubtitle: "Cuộn ngang để khám phá các thức quà đặc sản tiêu biểu qua từng huyện thị.",
  },
  en: {
    kicker: "Flavours of Thai Nguyen",
    title: "Explore the land through taste",
    subtitle: "Every dish carries the narrative of local ingredients, craft traditions and warm hospitality of the tea land.",
    source: "Read source",
    exploreCatalog: "Explore local food catalog",
    specialties: "Featured culinary highlights",
    railSubtitle: "Scroll horizontally to discover signature dishes across districts.",
  },
  ru: {
    kicker: "Кухня Тхайнгуена",
    title: "Познайте край через вкусы",
    subtitle: "Каждое блюдо раскрывает историю местных традиций, продуктов и тепла чайной земли.",
    source: "Источник",
    exploreCatalog: "Каталог блюд",
    specialties: "Избранные блюда",
    railSubtitle: "Прокрутите горизонтально, чтобы увидеть фирменные блюда районов.",
  },
};

export default async function CuisinePage() {
  const locale = await getServerLocale();
  const text = copy[locale];

  // Base localized food stories
  const baseFoods = foodStories.map((story) => ({
    ...localizeCultureStory(story, locale),
    image: story.id === "banh-chung-bo-dau" ? "/images/culture/am-thuc-thai-nguyen.webp" : undefined,
  }));

  // Add rich specialties from foodDocuments to form a generous 8-card horizontal rail
  const extraItems = [
    {
      id: "nem-chua-dai-tu",
      title: "Nem chua Đại Từ",
      summary: "Khác với nem chua nhiều nơi ăn ngay, nem chua Đại Từ nướng trên than hoa hoặc lăn qua chảo tạo nên vị bùi ngậy, thơm nồng lá ổi.",
      region: "Đại Từ",
      season: "Quanh năm",
      sourceUrl: "http://thainguyentourism.vn/vi/du-khach/Am-thuc/Nem-chua-Dai-Tu-4.html",
      image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "tram-den-ha-chau",
      title: "Trám đen Hà Châu",
      summary: "Trám bùi vùng phù sa ven sông Cầu, chế biến thành trám om, xôi trám hay kho thịt, để lại vị thơm béo đậm đà khó quên.",
      region: "Hà Châu, Phú Bình",
      season: "Tháng 7 - 8 âm lịch",
      sourceUrl: "http://thainguyentourism.vn/vi/du-khach/Kham-pha-diem-den/Tram-bui-Ha-Chau-vi-ngot-bui-khong-the-nguoi-quen-83.html",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "tom-cuon-thu-lam",
      title: "Tôm cuốn Thù Lâm",
      summary: "Món ăn cổ truyền thanh tao với tôm sông, thịt nướng, trứng tráng, giò lụa cuộn cùng hành hoa tươi xanh của cư dân ven sông Phổ Yên.",
      region: "Tiên Phong, Phổ Yên",
      season: "Quanh năm",
      sourceUrl: "http://thainguyentourism.vn/vi/du-khach/Am-thuc/Tom-cuon-Thua-Lam-111.html",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "banh-cooc-mo",
      title: "Bánh coóc mò sừng bò",
      summary: "Thức bánh chóp nhọn của đồng bào Tày, Nùng gói bằng nếp nương thuần khiết, chấm mật mía hoặc đường cát thơm dịu.",
      region: "Võ Nhai & Định Hóa",
      season: "Ngày hội & Tết",
      sourceUrl: "http://thainguyentourism.vn/vi/du-khach/Kham-pha-diem-den/Banh-cooc-mo-Thai-Nguyen-doc-dao-va-hap-dan-219.html",
      image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const allRailItems = [
    ...baseFoods,
    ...extraItems,
  ];

  const leadFood = baseFoods[0];

  return (
    <div className={styles.cuisinePage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroMedia}>
          <Image
            src="/images/culture/am-thuc-thai-nguyen.webp"
            alt={text.title}
            fill
            priority
            sizes="100vw"
            className={styles.heroImage}
          />
          <div className={styles.heroOverlay} />
        </div>
        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>
            <UtensilsCrossed size={15} aria-hidden="true" />
            <span>{text.kicker}</span>
          </div>
          <h1>{text.title}</h1>
          <p>{text.subtitle}</p>
        </div>
      </section>

      <div className={styles.container}>
        {/* Spotlight Lead Specialty */}
        <section className={styles.featuredSection}>
          <div className={styles.sectionHeading}>
            <span className={styles.badge}>
              <Sparkles size={13} aria-hidden="true" /> ĐẶC SẢN TIÊU BIỂU
            </span>
            <h2>{leadFood.title}</h2>
          </div>

          <div className={styles.leadCard}>
            <div className={styles.leadMedia}>
              <Image
                src="/images/culture/am-thuc-thai-nguyen.webp"
                alt={leadFood.title}
                fill
                sizes="(max-width: 900px) 100vw, 55vw"
                className={styles.leadImg}
              />
            </div>
            <div className={styles.leadBody}>
              <div className={styles.metaRow}>
                <span>
                  <MapPin size={14} aria-hidden="true" /> {leadFood.region}
                </span>
                <span>
                  <CalendarDays size={14} aria-hidden="true" /> {leadFood.season}
                </span>
              </div>
              <h3>Hương vị làng nghề Quốc lộ 3</h3>
              <p>{leadFood.summary}</p>
              {leadFood.sourceUrl && (
                <a
                  href={leadFood.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.sourceBtn}
                >
                  {text.source} <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Horizontal Carousel Rail: 4 cards visible at desktop with arrows */}
        <section className={styles.railSection}>
          <div className={styles.sectionHeading}>
            <span className={styles.badge}>MÓN NGON XỨ TRÀ</span>
            <h2>{text.specialties}</h2>
            <p className={styles.sectionDesc}>{text.railSubtitle}</p>
          </div>

          <CuisineCarouselRail items={allRailItems} sourceLabel={text.source} />
        </section>

        {/* Food Document Catalog Explorer */}
        <section className={styles.catalogSection}>
          <div className={styles.sectionHeading}>
            <span className={styles.badge}>TRA CỨU & KHÁM PHÁ</span>
            <h2>{text.exploreCatalog}</h2>
          </div>
          <FoodCatalogExplorer locale={locale} />
        </section>

        {/* Link to Festival */}
        <div className={styles.nextBanner}>
          <div>
            <small>TIẾP TỤC HÀNH TRÌNH</small>
            <h3>Hòa mình vào không khí văn hóa và nhịp hội theo mùa</h3>
          </div>
          <Link href="/festivals" className={styles.bannerBtn}>
            Khám phá Lễ hội Thái Nguyên →
          </Link>
        </div>
      </div>
    </div>
  );
}
