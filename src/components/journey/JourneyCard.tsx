"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Sparkles } from "lucide-react";
import type { JourneyRecommendation } from "@/domain/models";
import { getLocalizedLabels } from "@/lib/labels";
import { interestLabels } from "@/lib/labels";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function JourneyCard({ recommendation, rank }: { recommendation: JourneyRecommendation; rank: number }) {
  const { locale, t } = useLanguage();
  const labels = getLocalizedLabels(locale);
  const { journey, matchedReasons } = recommendation;
  const reasons = matchedReasons.map((reason) => {
    if (locale === "vi") return reason;
    const fixed: Record<string, [string, string]> = {
      "Đúng thời lượng": ["Matches your trip length", "Подходит по длительности"],
      "Phù hợp nhóm đi": ["Suitable for your group", "Подходит вашей группе"],
      "Hợp mùa đã chọn": ["Good for your chosen season", "Подходит для выбранного сезона"],
    };
    if (fixed[reason]) return fixed[reason][locale === "en" ? 0 : 1];
    const tag = Object.entries(interestLabels).find(([, label]) => reason === `Hợp sở thích: ${label}`)?.[0] as keyof typeof interestLabels | undefined;
    return tag ? `${locale === "en" ? "Matches your interest" : "Соответствует интересу"}: ${labels.interest[tag]}` : reason;
  });
  return <article className="journey-card">
    <div className="journey-card-image"><ImageWithFallback src={journey.image} alt={t("journey.imageAlt", { name: journey.name })} /><span className="rank">0{rank}</span></div>
    <div className="journey-card-body">
      <div className="journey-meta"><span><CalendarDays /> {journey.durationLabel ?? labels.duration[journey.duration]}</span><span><MapPin /> {t("common.points", { count: journey.destinationIds.length })}</span></div>
      <h2>{journey.code && <small>{journey.code} - </small>}{journey.name}</h2><p>{journey.summary}</p>
      <div className="reason-list"><Sparkles size={15} />{reasons.slice(0, 3).map((reason) => <span key={reason}>{reason}</span>)}</div>
      <Link className="button button-dark" href={`/journeys/${journey.slug}`}>{t("journey.view")} <ArrowRight /></Link>
    </div>
  </article>;
}
