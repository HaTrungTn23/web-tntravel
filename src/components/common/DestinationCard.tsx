"use client";

import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import type { Destination } from "@/domain/models";
import type { DestinationRatingSummaries } from "@/services/ratings/destinationRatings";
import { getDemoDestinationRating, getDemoDestinationCount } from "@/services/ratings/demoRating";
import { ImageWithFallback } from "./ImageWithFallback";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { localizeDestination } from "@/i18n/contentTranslations";

export function DestinationCard({ destination, prelocalized = false, rating }: { destination: Destination; prelocalized?: boolean; rating?: DestinationRatingSummaries[string] }) {
  const { locale, t } = useLanguage();
  const localized = prelocalized ? destination : localizeDestination(destination, locale);
  const cover = localized.media.find((item) => item.type === "image" && item.isCover)
    ?? localized.media.find((item) => item.type === "image");
  const average = rating ? Math.max(0, Math.min(5, rating.average)) : getDemoDestinationRating(destination.id);
  const displayCount = rating?.count ?? getDemoDestinationCount(destination.id);
  const ratingLabel = `${average.toFixed(1)} / 5 · ${displayCount} ${locale === "vi" ? "lượt đánh giá" : locale === "ru" ? "оценок" : "ratings"}`;
  return <article className="destination-card">
    <div className="card-image"><ImageWithFallback src={cover?.url ?? ""} alt={cover?.alt ?? destination.name} /></div>
    <div className="card-body">
      <h3>{localized.name}</h3>
      <p>{localized.shortDescription}</p>
      <div className="card-footer">
        <div className="destination-card-rating" role="img" aria-label={ratingLabel}>
          <span className="destination-card-stars" aria-hidden="true">{[0, 1, 2, 3, 4].map((index) => <span className="destination-card-star" key={index}>
            <Star className="destination-card-star-base" />
            <span className="destination-card-star-fill" style={{ width: `${Math.max(0, Math.min(1, average - index)) * 100}%` }}><Star /></span>
          </span>)}</span>
          <span className="destination-card-rating-text">{`${average.toFixed(1)} (${displayCount})`}</span>
        </div>
        <Link href={`/destinations/${localized.slug}`} aria-label={t("common.view", { name: localized.name })}><ArrowUpRight /></Link>
      </div>
    </div>
  </article>;
}
