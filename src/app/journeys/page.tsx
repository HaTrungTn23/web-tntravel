import Link from "next/link";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { JourneyCard } from "@/components/journey/JourneyCard";
import type { AudienceType, DurationCode, InterestTag, Season } from "@/domain/models";
import { getLocalizedLabels } from "@/lib/labels";
import { recommendationService } from "@/services/recommendation/recommendation";
import { getServerLocale } from "@/i18n/server";
import { translate } from "@/i18n/messages";
import { getStaticPageTranslations, localizeJourney } from "@/services/content/staticPageTranslations";
import { destinationRepository } from "@/repositories";
import { getDestinationsWithPublishedMedia } from "@/services/content/destinationContent";
import { applyPublishedJourneyCover } from "@/services/content/journeyContent";

const allowedDurations: DurationCode[] = ["half-day", "1-day", "2-days", "3-plus-days"];
const allowedInterests: InterestTag[] = ["tea", "culture", "nature", "village", "history", "food", "local-product"];
const allowedAudiences: AudienceType[] = ["solo", "friends", "family", "student", "international"];
const allowedSeasons: Season[] = ["spring", "summer", "autumn", "winter"];

export default async function JourneyResultsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const locale = await getServerLocale();
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  const labels = getLocalizedLabels(locale);
  const params = await searchParams;
  const rawDuration = typeof params.duration === "string" ? params.duration : "";
  if (!allowedDurations.includes(rawDuration as DurationCode)) {
    return <div className="page-wrap results-page">
      <Link href="/#journey-selector" className="back-link"><ArrowLeft /> {t("journeys.back")}</Link>
      <div className="empty-state large"><SlidersHorizontal /><h1>{t("journeys.emptySelection.title")}</h1><p>{t("journeys.emptySelection.body")}</p><Link className="button button-primary" href="/#journey-selector">{t("journeys.emptySelection.cta")}</Link></div>
    </div>;
  }
  const rawAudience = typeof params.audience === "string" ? params.audience : "family";
  const rawSeason = typeof params.season === "string" ? params.season : "autumn";
  const rawInterests = Array.isArray(params.interests)
    ? params.interests
    : typeof params.interests === "string"
      ? params.interests.split(",")
      : [];
  const preferences = {
    duration: rawDuration as DurationCode,
    audience: (allowedAudiences.includes(rawAudience as AudienceType) ? rawAudience : "family") as AudienceType,
    season: (allowedSeasons.includes(rawSeason as Season) ? rawSeason : "autumn") as Season,
    interests: rawInterests.filter((item): item is InterestTag => allowedInterests.includes(item as InterestTag)),
  };
  const sourceResults = recommendationService.recommend(preferences);
  const destinationIds = [...new Set(sourceResults.flatMap((item) => item.journey.destinationIds))];
  const [translations, publishedDestinations] = await Promise.all([
    getStaticPageTranslations("journey", sourceResults.map((item) => item.journey.id), locale),
    getDestinationsWithPublishedMedia(destinationRepository.getByIds(destinationIds), locale),
  ]);
  const results = sourceResults.map((item) => ({
    ...item,
    journey: applyPublishedJourneyCover(localizeJourney(item.journey, translations.get(item.journey.id)), publishedDestinations),
  }));
  return <div className="page-wrap results-page">
    <Link href="/#journey-selector" className="back-link"><ArrowLeft /> {t("journeys.change")}</Link>
    <header className="page-intro centered"><div className="eyebrow"><SlidersHorizontal /> {t("journeys.ranked")}</div><h1>{t("journeys.titleA")}<br /><em>{t("journeys.titleB")}</em></h1><div className="preference-summary"><span>{labels.duration[preferences.duration]}</span>{preferences.interests.map((item) => <span key={item}>{labels.interest[item]}</span>)}<span>{labels.audience[preferences.audience]}</span><span>{labels.season[preferences.season]}</span></div></header>
    {results.length ? <div className="journey-list">{results.map((item, index) => <JourneyCard key={item.journey.id} recommendation={item} rank={index + 1} />)}</div> : <div className="empty-state"><h2>{t("journeys.empty.title")}</h2><p>{t("journeys.empty.body")}</p></div>}
  </div>;
}
