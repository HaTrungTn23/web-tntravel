"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays, MapPin, TrainFront } from "lucide-react";
import type { Destination } from "@/domain/models";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { MapView } from "@/components/map/MapView";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { festivalCopy, type LocalText } from "@/data/festival2026";
import type { FestivalContent } from "@/services/content/festivalContent";
import styles from "./festival.module.css";

const local = (vi: string, en: string, ru: string): LocalText => ({ vi, en, ru });
const highlights = [
  { image: "/images/festival-2026/khong-gian-tra-tan-cuong.jpg", title: local("Thưởng trà và gặp người làm chè", "Taste tea and meet tea makers", "Дегустация и встреча с чаеводами"), body: local("Ghé Phố Trà hoặc hẹn trước một cơ sở ở Tân Cương để tìm hiểu từ búp chè đến chén trà.", "Visit Tea Street or arrange a visit to a Tan Cuong tea maker, from tea leaf to cup.", "Посетите Чайную улицу или заранее договоритесь о встрече с производителями чая в Танкыонге.") },
  { image: "/images/festival-2026/doi-che-vo-tranh.jpg", title: local("Đi giữa những vùng chè", "Explore the tea hills", "Прогулка по чайным холмам"), body: local("Chọn Tân Cương, La Bằng hoặc Vô Tranh cho một buổi khám phá cảnh quan và câu chuyện vùng trà.", "Choose Tan Cuong, La Bang or Vo Tranh for a visit to the tea landscape.", "Выберите Танкыонг, Лабанг или Вотрань для знакомства с чайными пейзажами.") },
  { image: "/images/festival-2026/luong-che-vo-tranh.jpg", title: local("Ẩm thực từ trà", "Tea-inspired food", "Блюда с чаем"), body: local("Khám phá cách trà xuất hiện trong món ăn tại Phố Trà và các hoạt động ẩm thực của Festival.", "Discover tea-inspired dishes at Tea Street and the festival's food events.", "Попробуйте блюда с чаем на Чайной улице и гастрономических мероприятиях фестиваля.") },
];
const tripIdeas = [
  { duration: local("Nửa ngày", "Half-day", "Полдня"), title: local("Phố Trà và triển lãm", "Tea Street and exhibition", "Чайная улица и выставка"), body: local("Một vòng trung tâm nhẹ nhàng, phù hợp gia đình và nhóm ít thời gian.", "A relaxed city-centre visit for families and travellers with limited time.", "Неспешная прогулка по центру для семей и гостей с ограниченным временем."), href: "/explore" },
  { duration: local("Một ngày", "One day", "Один день"), title: local("Tân Cương rồi trở về phố", "Tan Cuong and an evening in town", "Танкыонг и вечер в городе"), body: local("Sáng khám phá vùng chè, chiều về trung tâm và chọn một chương trình đúng lịch.", "Explore tea country in the morning and return to town for a scheduled event.", "Утром посетите чайный район, вечером вернитесь на мероприятие в центре."), href: "/journeys/cham-vao-huong-tra-tan-cuong" },
  { duration: local("Hai ngày", "Two days", "Два дня"), title: local("Festival và hồ Núi Cốc", "Festival and Nui Coc Lake", "Фестиваль и озеро Нуикок"), body: local("Ngày đầu dành cho Phố Trà, ngày sau đi vùng chè hoặc ngắm cảnh bên hồ.", "Spend the first day at Tea Street, then visit tea country or the lake.", "Первый день проведите на Чайной улице, второй - среди чайных холмов или у озера."), href: "/journeys/huong-tra-va-ho-xanh" },
];
const timeLabels: Record<string, LocalText> = {
  "Chiều": local("Buổi chiều", "Afternoon", "Во второй половине дня"),
  "Buổi chiều": local("Buổi chiều", "Afternoon", "Во второй половине дня"),
  "Buổi sáng": local("Buổi sáng", "Morning", "Утром"),
  "Trong ngày": local("Trong ngày", "During the day", "В течение дня"),
  "Buổi tối": local("Buổi tối", "Evening", "Вечером"),
};

export function FestivalPageContent({ initialDay, status, destinations, content }: { initialDay: number; status: "upcoming" | "ongoing" | "ended"; destinations: Destination[]; content: FestivalContent }) {
  const { locale } = useLanguage();
  const copy = festivalCopy[locale];
  const [day, setDay] = useState(initialDay);
  const days = [30, 31, 1, 2, 3, 4, 5, 6, 7];
  const selected = content.sessions.filter((item) => item.day === day).sort((a, b) => {
    const start = (value: string) => /^\d{1,2}:\d{2}/.test(value) ? Number(value.slice(0, 2)) * 60 + Number(value.slice(3, 5)) : 9999;
    return start(a.time) - start(b.time);
  });
  const entireFestival = content.sessions.filter((item) => item.day === "all");
  const sourceLink = (url: string) => url ? <a href={url} target="_blank" rel="noopener noreferrer">{copy.source} <ArrowUpRight size={15} /></a> : null;

  return <div className={styles.page}>
    <section className={styles.hero}>
      <div className={styles.heroImage}><ImageWithFallback src={content.heroImage} alt={copy.photoNote} priority /></div>
      <div className={styles.heroShade} />
      <div className={styles.heroContent}>
        <span className={styles.heroLabel}>{copy.label} / {copy[status]}</span>
        <h1>{copy.title}</h1>
        <p>{content.intro[locale]}</p>
        <div className={styles.heroActions}>
          <a className="button button-light" href="#festival-schedule">{copy.viewSchedule} <ArrowRight size={18} /></a>
          <a className="button button-glass" href="#festival-places">{copy.visit} <MapPin size={18} /></a>
        </div>
      </div>
    </section>

    <div className={styles.infoStrip}><span><CalendarDays size={18} /> {copy.date}</span><span>{copy.theme}</span></div>

    <section id="festival-schedule" className={styles.section}>
      <div className={styles.sectionHead}><h2>{copy.schedule}</h2><p>{copy.scheduleBody}</p></div>
      <div className={styles.datePicker} role="group" aria-label={copy.schedule}>
        {days.map((value) => <button key={value} type="button" className={value === day ? styles.activeDay : ""} aria-pressed={value === day} onClick={() => setDay(value)}><small>{value >= 30 ? "10/2026" : "11/2026"}</small><b>{value}</b></button>)}
      </div>
      <div className={styles.scheduleLayout}>
        <div className={styles.scheduleList} aria-live="polite">
          <h3>{copy.day} {day}/{day >= 30 ? "10" : "11"}</h3>
          {selected.length ? selected.map((session) => <article key={session.id} className={styles.scheduleItem}>
            <time>{timeLabels[session.time]?.[locale] ?? session.time}</time><div><h4>{session.title[locale]}</h4><p><MapPin size={15} /> {session.venue[locale]}</p><div className={styles.itemActions}>{sourceLink(session.source)}{session.mapQuery && <a href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(session.mapQuery)}`} target="_blank" rel="noopener noreferrer">{copy.directions} <ArrowUpRight size={15} /></a>}</div></div>
          </article>) : <p className={styles.empty}>{copy.noSession}</p>}
        </div>
        <aside className={styles.allDays}><h3>{copy.allDays}</h3>{entireFestival.map((session) => <div key={session.id}><h4>{session.title[locale]}</h4><p>{session.venue[locale]}</p>{sourceLink(session.source)}</div>)}</aside>
      </div>
      <p className={styles.scheduleNote}>{copy.updateNote}</p>
    </section>

    <section className={`${styles.section} ${styles.highlights}`}>
      <div className={styles.sectionHead}><h2>{copy.highlight}</h2></div>
      <div className={styles.highlightGrid}>{highlights.map((highlight, index) => <article key={highlight.title.vi}>
        <div className={styles.highlightImage}><ImageWithFallback src={content.highlightImages[index] || highlight.image} alt={copy.photoNote} /></div>
        <h3>{highlight.title[locale]}</h3><p>{highlight.body[locale]}</p>
      </article>)}</div>
    </section>

    <section id="festival-places" className={`${styles.section} ${styles.places}`}>
      <div className={styles.sectionHead}><h2>{copy.places}</h2><p>{copy.placesBody}</p></div>
      <div className={styles.mapWrap}><MapView destinations={destinations} /></div>
      <div className={styles.placeLinks}>{destinations.map((destination) => <Link href={`/destinations/${destination.slug}`} key={destination.id}>{destination.name}<ArrowUpRight size={16} /></Link>)}</div>
    </section>

    <section className={`${styles.section} ${styles.trips}`}><div className={styles.sectionHead}><h2>{copy.routes}</h2></div>
      <div className={styles.tripGrid}>{tripIdeas.map((trip) => <Link href={trip.href} key={trip.title.vi}><small>{trip.duration[locale]}</small><h3>{trip.title[locale]}</h3><p>{trip.body[locale]}</p><span>{copy.routeLink} <ArrowRight size={17} /></span></Link>)}</div>
    </section>

    <section className={`${styles.section} ${styles.practical}`}><div className={styles.sectionHead}><h2>{copy.practical}</h2></div>
      <div className={styles.practicalLinks}>
        <a href="https://thainguyen.gov.vn/festival-tra" target="_blank" rel="noopener noreferrer"><span><CalendarDays size={20} />{copy.official}</span><ArrowUpRight size={18} /></a>
        <a href="https://thainguyen.gov.vn/tin-hoat-dong-cua-tinh/to-chuc-giao-thong-phuc-vu-chuong-trinh-khai-mac-festival-tra-quoc-te-thai-nguyen-nam-2026-tai-quang-truong-vo-nguyen-giap-302445" target="_blank" rel="noopener noreferrer"><span><MapPin size={20} />{copy.traffic}</span><ArrowUpRight size={18} /></a>
        <a href="https://thainguyen.gov.vn/festival-tra/thai-nguyen-se-to-chuc-6-chuyen-tau-du-lich-ha-noi-thai-nguyen-dip-festival-tra-quoc-te-299439" target="_blank" rel="noopener noreferrer"><span><TrainFront size={20} />{copy.rail}</span><ArrowUpRight size={18} /></a>
      </div>
    </section>
  </div>;
}
