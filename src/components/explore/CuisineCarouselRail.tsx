"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import styles from "./cuisine-rail.module.css";

export type CuisineRailItem = {
  id: string;
  title: string;
  summary: string;
  region: string;
  season: string;
  sourceUrl?: string;
  image?: string;
};

export function CuisineCarouselRail({
  items,
  sourceLabel = "Đọc tư liệu",
}: {
  items: CuisineRailItem[];
  sourceLabel?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Step by ~1 card or half viewport
    const step = track.clientWidth > 900 ? track.clientWidth * 0.75 : track.clientWidth * 0.85;
    track.scrollBy({ left: direction * step, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <div className={styles.railShell}>
      <button
        type="button"
        className={`${styles.railArrow} ${styles.railArrowPrev}`}
        onClick={() => move(-1)}
        aria-label="Xem các món ăn trước"
      >
        <ArrowLeft size={18} aria-hidden="true" />
      </button>

      <div ref={trackRef} className={styles.railTrack} tabIndex={0} aria-label="Danh sách món ngon đặc sản">
        {items.map((item, index) => {
          const imgSrc = item.image || `/api/culture-image/${item.id}?index=0`;
          return (
            <article key={item.id} className={styles.card}>
              <div className={styles.cardMedia}>
                <Image
                  src={imgSrc}
                  alt={item.title}
                  fill
                  sizes="(max-width: 680px) 85vw, (max-width: 1100px) 45vw, 280px"
                  className={styles.cardImg}
                />
                <div className={styles.cardMediaOverlay} />
                <span className={styles.cardIndex}>{String(index + 1).padStart(2, "0")}</span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.cardMeta}>
                  <span className={styles.regionTag}>
                    <MapPin size={12} aria-hidden="true" />
                    {item.region}
                  </span>
                  <span className={styles.seasonTag}>
                    <CalendarDays size={12} aria-hidden="true" />
                    {item.season}
                  </span>
                </div>

                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardSummary}>{item.summary}</p>

                {item.sourceUrl && (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.cardLink}
                  >
                    <span>{sourceLabel}</span>
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <button
        type="button"
        className={`${styles.railArrow} ${styles.railArrowNext}`}
        onClick={() => move(1)}
        aria-label="Xem các món ăn tiếp theo"
      >
        <ArrowRight size={18} aria-hidden="true" />
      </button>
    </div>
  );
}
