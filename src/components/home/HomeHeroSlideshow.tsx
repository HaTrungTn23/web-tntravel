"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Pause, Play, Route } from "lucide-react";
import type { HomeHeroImage } from "@/services/content/homeGalleryContent";
import type { Locale } from "@/i18n/config";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import styles from "@/app/home.module.css";

const labels = {
  vi: { group: "Điều khiển ảnh đầu trang", pause: "Tạm dừng trình chiếu", play: "Tiếp tục trình chiếu", view: "Xem ảnh" },
  en: { group: "Header slideshow controls", pause: "Pause slideshow", play: "Resume slideshow", view: "View image" },
  ru: { group: "Управление фотографиями", pause: "Остановить показ", play: "Продолжить показ", view: "Показать фото" },
} satisfies Record<Locale, { group: string; pause: string; play: string; view: string }>;

export function HomeHeroSlideshow({ images, locale, exploreLabel, planLabel }: { images: HomeHeroImage[]; locale: Locale; exploreLabel: string; planLabel: string }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (images.length < 2 || paused) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive((current) => (current + 1) % images.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [active, images.length, paused]);

  if (!images.length) return null;
  const copy = labels[locale];
  const activeImage = images[active] ?? images[0];
  const slideText = activeImage.translations[locale];
  const splitTitle = (slideText.titleA.length + slideText.titleB.length) > 28;
  const compactTitle = Math.max(slideText.titleA.length, slideText.titleB.length) > 17;
  const veryLongTitle = Math.max(slideText.titleA.length, slideText.titleB.length) > 24;

  return <section className={styles.hero}>
    <div className={styles.heroMedia} aria-hidden="true">
      {images.map((image, index) => <div className={`${styles.heroSlide} ${index === active ? styles.heroSlideActive : ""}`} key={image.id}>
        <ImageWithFallback src={image.url} alt="" priority={index === 0} />
      </div>)}
    </div>
    <div className={styles.heroOverlay} />
    <div className={styles.heroContent}>
      <div className={styles.heroCopy} key={activeImage.id}>
        <p className={styles.heroKicker}>{slideText.kicker}</p>
        <h1 className={`${splitTitle ? styles.heroTitleSplit : ""} ${compactTitle ? styles.heroTitleCompact : ""} ${veryLongTitle ? styles.heroTitleVeryLong : ""}`}><span>{slideText.titleA}</span>{" "}<em>{slideText.titleB}</em></h1>
        <p className={styles.heroBody}>{slideText.body}</p>
      </div>
      <div className={styles.heroActions}>
        <a className="button button-light" href="#stations">{exploreLabel} <ArrowRight /></a>
        <a className="button button-glass" href="#journey-selector"><Route /> {planLabel}</a>
      </div>
    </div>
    {images.length > 1 && <div className={styles.heroSlideshowControls} role="group" aria-label={copy.group}>
      <div className={styles.heroSlideDots}>{images.map((image, index) => <button type="button" key={image.id} className={index === active ? styles.heroDotActive : ""} onClick={() => setActive(index)} aria-label={`${copy.view} ${index + 1}: ${image.alt}`} aria-current={index === active ? "true" : undefined} />)}</div>
      <button type="button" className={styles.heroPauseButton} onClick={() => setPaused((current) => !current)} aria-label={paused ? copy.play : copy.pause}>{paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}</button>
    </div>}
  </section>;
}
