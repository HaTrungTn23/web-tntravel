import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { getServerLocale } from "@/i18n/server";
import { festivalStories, localizeCultureStory } from "@/data/cultureCatalog";
import styles from "./festivals.module.css";

export const metadata: Metadata = {
  title: "Lễ hội Thái Nguyên | Nhịp sống & Văn hóa truyền thống",
  description: "Khám phá các lễ hội truyền thống đặc sắc tại Thái Nguyên: Lễ hội Đền Đuổm, Hội Lồng Tồng ATK Định Hóa, Lễ hội Chùa Hang và Nhịp hội mùa xuân xứ Trà.",
};

const copy = {
  vi: {
    kicker: "Lễ hội Thái Nguyên",
    title: "Theo nhịp mùa, gặp nhịp người",
    subtitle: "Nghi lễ trang trọng, tiếng tính tẩu vang xa và hội thi giã bánh dày quy tụ hồn cốt ngàn đời của các dân tộc Việt Bắc.",
    source: "Đọc nguồn tư liệu",
    timing: "Thời điểm tổ chức",
    region: "Địa bàn",
    featuredBadge: "LỄ HỘI TIÊU BIỂU",
    listHeading: "CÁC LỄ HỘI THEO MÙA",
  },
  en: {
    kicker: "Festivals of Thai Nguyen",
    title: "Follow the seasons, meet the heritage",
    subtitle: "Solemn rituals, melodious Dan Tinh strings and traditional competitions embodying generations of Viet Bac cultures.",
    source: "Read source",
    timing: "Season & timing",
    region: "Location",
    featuredBadge: "FEATURED FESTIVAL",
    listHeading: "SEASONAL FESTIVALS",
  },
  ru: {
    kicker: "Праздники Тхайнгуена",
    title: "В ритме сезонов и традиций",
    subtitle: "Торжественные обряды, звуки народных инструментов и древние праздники народов Вьетбака.",
    source: "Источник",
    timing: "Время проведения",
    region: "Место",
    featuredBadge: "ГЛАВНЫЙ ПРАЗДНИК",
    listHeading: "ПРАЗДНИКИ ПО СЕЗОНАМ",
  },
};

export default async function FestivalsPage() {
  const locale = await getServerLocale();
  const text = copy[locale];
  const festivals = festivalStories.map((story) => localizeCultureStory(story, locale));
  const leadFestival = festivals[0];
  const sideFestivals = festivals.slice(1);

  return (
    <div className={styles.festivalsPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroMedia}>
          <Image
            src="/images/culture/le-hoi-thai-nguyen.webp"
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
            <CalendarDays size={16} aria-hidden="true" />
            <span>{text.kicker}</span>
          </div>
          <h1>{text.title}</h1>
          <p>{text.subtitle}</p>
        </div>
      </section>

      <div className={styles.container}>
        {/* Featured Festival Showcase */}
        <section className={styles.leadSection}>
          <div className={styles.sectionHeading}>
            <span className={styles.badge}>
              <Sparkles size={14} aria-hidden="true" /> {text.featuredBadge}
            </span>
            <h2>{leadFestival.title}</h2>
          </div>

          <div className={styles.leadCard}>
            <div className={styles.galleryStrip}>
              {[0, 1, 2].map((idx) => (
                <div key={idx} className={styles.galleryItem}>
                  <Image
                    src={`/api/culture-image/${leadFestival.id}?index=${idx}`}
                    alt={`${leadFestival.title} ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className={styles.galleryImg}
                  />
                </div>
              ))}
            </div>

            <div className={styles.leadBody}>
              <div className={styles.metaRow}>
                <span>
                  <CalendarDays size={15} aria-hidden="true" />
                  <strong>{text.timing}:</strong> {leadFestival.season}
                </span>
                <span>
                  <MapPin size={15} aria-hidden="true" />
                  <strong>{text.region}:</strong> {leadFestival.region}
                </span>
              </div>
              <p className={styles.summary}>{leadFestival.summary}</p>
              {leadFestival.sourceUrl && (
                <a
                  href={leadFestival.sourceUrl}
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

        {/* Other Festivals Grid */}
        <section className={styles.gridSection}>
          <div className={styles.sectionHeading}>
            <span className={styles.badge}>{text.listHeading}</span>
            <h2>Nhịp hội đất chè theo mùa xuân</h2>
          </div>

          <div className={styles.festivalGrid}>
            {sideFestivals.map((item) => (
              <article key={item.id} className={styles.festivalCard}>
                <div className={styles.cardGallery}>
                  {[0, 1].map((idx) => (
                    <div key={idx} className={styles.cardImgWrap}>
                      <Image
                        src={`/api/culture-image/${item.id}?index=${idx}`}
                        alt={`${item.title} ${idx + 1}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className={styles.cardImg}
                      />
                    </div>
                  ))}
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardMeta}>
                    <span className={styles.seasonTag}>
                      <CalendarDays size={13} aria-hidden="true" /> {item.season}
                    </span>
                    <span className={styles.regionTag}>
                      <MapPin size={13} aria-hidden="true" /> {item.region}
                    </span>
                  </div>

                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>

                  {item.sourceUrl && (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.cardLink}
                    >
                      {text.source} <ArrowUpRight size={13} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Transition Link to Explore & Map */}
        <div className={styles.nextBanner}>
          <div>
            <small>KẾT NỐI HÀNH TRÌNH</small>
            <h3>Muốn ghé thăm trực tiếp các điểm di tích và đền chùa diễn ra lễ hội?</h3>
          </div>
          <Link href="/explore" className={styles.bannerBtn}>
            Mở Bản đồ & Điểm đến Thái Nguyên →
          </Link>
        </div>
      </div>
    </div>
  );
}

