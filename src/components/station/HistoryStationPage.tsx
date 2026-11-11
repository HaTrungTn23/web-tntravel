import Link from "next/link";
import { ArrowRight, Landmark } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { DestinationCard } from "@/components/common/DestinationCard";
import { MapView } from "@/components/map/MapView";
import { historyStationContent } from "@/data/historyContent";
import { destinationRepository, journeyRepository, stationRepository } from "@/repositories";
import { getDestinationsWithPublishedMedia } from "@/services/content/destinationContent";
import { getStaticPageTranslations, localizeJourney } from "@/services/content/staticPageTranslations";

export async function HistoryStationPage({ locale }: { locale: Locale }) {
  const copy = historyStationContent[locale];
  const station = stationRepository.getBySlug("lich-su-le-hoi");
  if (!station) return null;
  const destinations = await getDestinationsWithPublishedMedia(destinationRepository.getByIds(station.destinationIds), locale);
  const related = journeyRepository.getAll()
    .filter((journey) => journey.destinationIds.some((id) => station.destinationIds.includes(id)))
    .slice(0, 4);
  const translations = await getStaticPageTranslations("journey", related.map((journey) => journey.id), locale);

  return <div className="page-wrap station-page history-station-page">
    <header className="page-intro">
      <div className="eyebrow"><Landmark /> {copy.kicker}</div>
      <h1>{copy.title}</h1>
      <p>{copy.introduction}</p>
    </header>
    <section className="craft-story-grid" aria-label={copy.kicker}>
      {copy.layers.map((layer, index) => <article key={layer.title}>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <h2>{layer.title}</h2>
        <p>{layer.body}</p>
      </article>)}
    </section>
    <section className="craft-station-section">
      <div className="section-head"><h2>{copy.spacesTitle}</h2></div>
      <div className="history-space-grid">{copy.spaces.map((space) => <article key={space.title}>
        <h3>{space.title}</h3><p>{space.body}</p>
      </article>)}</div>
    </section>
    <section className="craft-station-section">
      <div className="section-head"><h2>{copy.placesTitle}</h2></div>
      <div className="card-grid">{destinations.map((destination) => <DestinationCard destination={destination} prelocalized key={destination.id} />)}</div>
    </section>
    <section className="craft-station-section">
      <div className="section-head"><h2>{copy.festivalsTitle}</h2></div>
      <div className="history-festival-grid">{copy.festivals.map((festival) => <article key={festival.title}>
        <span>{festival.season}</span><h3>{festival.title}</h3><p>{festival.body}</p>
      </article>)}</div>
    </section>
    <section className="craft-station-section">
      <div className="section-head"><h2>{copy.activitiesTitle}</h2></div>
      <div className="history-activities">{copy.activities.map((activity) => <span key={activity}>{activity}</span>)}</div>
    </section>
    <section className="craft-station-section"><div className="section-head"><h2>{copy.mapTitle}</h2></div><MapView destinations={destinations} /></section>
    {related.length ? <section className="related-journeys"><h2>{copy.journeysTitle}</h2>
      {related.map((journey) => <Link key={journey.id} href={`/journeys/${journey.slug}`}>{localizeJourney(journey, translations.get(journey.id)).name}<ArrowRight /></Link>)}
    </section> : null}
  </div>;
}
