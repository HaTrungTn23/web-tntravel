"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, House, Landmark, Leaf, Package, Route, Waves } from "lucide-react";
import type { Destination } from "@/domain/models";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import type { ResolvedHomeStationCard } from "@/services/content/homeGalleryContent";
import { festivalCopy, festivalPath } from "@/data/festival2026";
import type { FestivalContent } from "@/services/content/festivalContent";

const icons = { Leaf, House, Package, Waves, Landmark, Route };
export function StationGrid({ destinations, stations, festivalStatus, festivalContent }: { destinations: Destination[]; stations: ResolvedHomeStationCard[]; festivalStatus: "upcoming" | "ongoing" | "ended"; festivalContent: FestivalContent }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { t, locale } = useLanguage();
  const festival = festivalCopy[locale];
  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: direction * Math.max(316, track.clientWidth * .74), behavior: reduceMotion ? "auto" : "smooth" });
  };
  const festivalCard = <Link href={festivalPath} className="station-card festival-station-card" key="festival-2026">
    <div className="station-visual">
      <ImageWithFallback src={festivalContent.heroImage} alt={festival.photoNote} />
      <div className="station-visual-shade" />
      <div className="station-top"><span>{festival.discover}</span><ArrowUpRight /></div>
    </div>
    <div className="station-content">
      <span className="festival-station-status">{festival[festivalStatus]} · {festival.date}</span>
      <h3>{festival.title}</h3>
      <p>{festivalContent.intro[locale]}</p>
    </div>
  </Link>;

  return <div className="station-rail">
    <button className="station-arrow station-arrow-previous" type="button" onClick={() => move(-1)} aria-label={t("home.stations.previous")}><ArrowLeft /></button>
    <div ref={trackRef} className="station-grid" tabIndex={0} aria-label={t("home.stations.list")}>
      {festivalStatus !== "ended" && festivalCard}
      {stations.map((station, index) => {
    const Icon = icons[station.icon as keyof typeof icons] ?? Leaf;
    const linkedDestination = destinations.find((destination) => station.destinationIds.includes(destination.id) || destination.stationIds.includes(station.id));
    const fallbackDestination = destinations[index % Math.max(destinations.length, 1)];
    const imageSource = linkedDestination ?? fallbackDestination;
    const cover = imageSource?.media.find((item) => item.type === "image" && item.isCover)
      ?? imageSource?.media.find((item) => item.type === "image");
    return <Link href={station.slug === "van-hoa-tra" || station.id === "craft-products" || station.id === "green-tourism" || station.id === "history-festival" ? `/stations/${station.slug}` : `/explore?station=${station.id}`} className="station-card" key={station.id}>
      <div className="station-visual">
        <ImageWithFallback src={station.imageUrl || cover?.url || ""} alt={station.imageAlt || cover?.alt || station.title} />
        <div className="station-visual-shade" />
        <div className="station-top"><span>{t("station.explore")}</span><ArrowUpRight /></div>
      </div>
      <div className="station-content"><Icon size={29} /><h3>{station.title}</h3><p>{station.description}</p></div>
    </Link>;
    })}
      {festivalStatus === "ended" && festivalCard}
    </div>
    <button className="station-arrow station-arrow-next" type="button" onClick={() => move(1)} aria-label={t("home.stations.next")}><ArrowRight /></button>
  </div>;
}
