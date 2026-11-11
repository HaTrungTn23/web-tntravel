import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, MapPin } from "lucide-react";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { MapView } from "@/components/map/MapView";
import { getLocalizedLabels } from "@/lib/labels";
import { destinationRepository, journeyRepository } from "@/repositories";
import { getServerLocale } from "@/i18n/server";
import { translate } from "@/i18n/messages";
import { localizeDestination } from "@/i18n/contentTranslations";
import { getStaticPageTranslations, localizeJourney } from "@/services/content/staticPageTranslations";
import { getDestinationsWithPublishedMedia } from "@/services/content/destinationContent";
import { applyPublishedJourneyCover } from "@/services/content/journeyContent";

export async function generateStaticParams() { return journeyRepository.getAll().map((item) => ({ slug: item.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const journey = journeyRepository.getBySlug(slug);
  if (!journey) return { title: "Hành trình" };
  const locale = await getServerLocale();
  const translations = await getStaticPageTranslations("journey", [journey.id], locale);
  return { title: localizeJourney(journey, translations.get(journey.id)).name };
}

export default async function JourneyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sourceJourney = journeyRepository.getBySlug(slug);
  if (!sourceJourney) notFound();
  const locale = await getServerLocale();
  const t = (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) => translate(locale, key, values);
  const labels = getLocalizedLabels(locale);
  const [translations, publishedDestinations] = await Promise.all([
    getStaticPageTranslations("journey", [sourceJourney.id], locale),
    getDestinationsWithPublishedMedia(destinationRepository.getByIds(sourceJourney.destinationIds), locale),
  ]);
  const journey = applyPublishedJourneyCover(localizeJourney(sourceJourney, translations.get(sourceJourney.id)), publishedDestinations);
  const destinations = publishedDestinations.map((item) => localizeDestination(item, locale));
  return <>
    <section className="detail-hero journey-hero"><ImageWithFallback src={journey.image} alt={t("journey.imageAlt", { name: journey.name })} /><div className="detail-hero-overlay" /><div className="detail-hero-content"><Link href="/journeys" className="back-link light"><ArrowLeft /> {t("journey.back")}</Link><h1>{journey.code && <small>{journey.code} - </small>}{journey.name}</h1><p>{journey.summary}</p><div className="hero-facts"><span><CalendarDays /> {journey.durationLabel ?? labels.duration[journey.duration]}</span><span><MapPin /> {t("common.points", { count: destinations.length })}</span></div></div></section>
    <div className="detail-layout page-wrap">
      <aside className="detail-aside"><div className="eyebrow">{t("journey.signature")}</div><h2>{t("journey.experiences")}</h2><div className="tag-row">{journey.interests.map((item) => <span key={item}>{labels.interest[item]}</span>)}</div>{journey.conditions && <p>{journey.conditions}</p>}</aside>
      <div className="detail-main">
        <section><div className="section-title"><h2>{t("journey.schedule")}</h2></div><div className="timeline">{journey.days.map((day) => <div className="timeline-day" key={day.day}><div className="day-label">{t("journey.day", { day: day.day })}</div>{day.items.map((item, index) => { const destination = item.destinationId ? destinations.find((place) => place.id === item.destinationId) : undefined; return <article className="timeline-item" key={`${day.day}-${index}-${item.destinationId ?? item.title}`}><div className="timeline-dot">{index + 1}</div><div><span className="timeline-time"><Clock3 /> {item.startTime ?? t("common.flexible")} - {t("common.suggestedSchedule")}</span><h3>{item.title ?? destination?.name}</h3><p>{item.note ?? destination?.shortDescription}</p>{destination && <Link href={`/destinations/${destination.slug}`}>{t("journey.destinationLink")} <ArrowRight /></Link>}</div></article>; })}</div>)}</div></section>
        <section><div className="section-title"><h2>{t("journey.map")}</h2></div><MapView destinations={destinations} polyline /></section>
      </div>
    </div>
  </>;
}
