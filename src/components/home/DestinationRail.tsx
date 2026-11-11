"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Destination } from "@/domain/models";
import type { DestinationRatingSummaries } from "@/services/ratings/destinationRatings";
import { DestinationCard } from "@/components/common/DestinationCard";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import styles from "./DestinationRail.module.css";

export function DestinationRail({ destinations, ratings }: { destinations: Destination[]; ratings: DestinationRatingSummaries }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: direction * track.clientWidth * 0.78, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return <div className={styles.shell}>
    <div className={styles.controls} aria-label={t("home.connected.controls")}>
      <button type="button" onClick={() => move(-1)} aria-label={t("home.connected.previous")}><ArrowLeft /></button>
      <button type="button" onClick={() => move(1)} aria-label={t("home.connected.next")}><ArrowRight /></button>
    </div>
    <div ref={trackRef} className={styles.track} tabIndex={0} aria-label={t("home.connected.list")}>
      {destinations.map((destination) => <DestinationCard key={destination.id} destination={destination} rating={ratings[destination.id]} prelocalized />)}
    </div>
  </div>;
}
