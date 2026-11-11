import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { DestinationCard } from "@/components/common/DestinationCard";
import { MapView } from "@/components/map/MapView";
import { teaStationContent } from "@/data/teaContent";
import { destinationRepository, journeyRepository, stationRepository } from "@/repositories";
import { getDestinationsWithPublishedMedia } from "@/services/content/destinationContent";
import { getStaticPageTranslations, localizeJourney } from "@/services/content/staticPageTranslations";

export async function TeaStationPage({ locale }: { locale: Locale }) {
  const copy = teaStationContent[locale];
  const station = stationRepository.getBySlug("van-hoa-tra");
  if (!station) return null;
  const destinations = await getDestinationsWithPublishedMedia(destinationRepository.getByIds(station.destinationIds), locale);
  const related = journeyRepository.getAll()
    .filter((journey) => journey.destinationIds.some((id) => station.destinationIds.includes(id)))
    .slice(0, 4);
  const translations = await getStaticPageTranslations("journey", related.map((journey) => journey.id), locale);

  return <div className="page-wrap station-page tea-station-page">
    <header className="page-intro"><div className="eyebrow"><Leaf /> {copy.kicker}</div><h1>{copy.title}</h1><p>{copy.introduction}</p></header>
    <section className="craft-story-grid" aria-label={copy.title}>
      {copy.layers.map((layer, index) => <article key={layer.title}><span>{String(index + 1).padStart(2, "0")}</span><h2>{layer.title}</h2><p>{layer.body}</p></article>)}
    </section>
    <section className="craft-station-section"><div className="section-head"><h2>{copy.regionsTitle}</h2></div>
      <div className="tea-region-links">{copy.regions.map((region) => <Link key={region.id} href={region.id === "tan-cuong" ? "/regions/tan-cuong" : `/destinations/${region.id}`}>
        <h3>{region.title}</h3><p>{region.body}</p><ArrowRight aria-hidden="true" />
      </Link>)}</div>
    </section>
    <section className="craft-station-section"><div className="section-head"><h2>{copy.processTitle}</h2></div>
      <ol className="tea-process-list">{copy.process.map((step) => <li key={step}>{step}</li>)}</ol>
    </section>
    <section className="craft-station-section"><div className="section-head"><h2>{copy.placesTitle}</h2></div>
      <div className="card-grid">{destinations.map((destination) => <DestinationCard destination={destination} prelocalized key={destination.id} />)}</div>
    </section>
    <section className="craft-station-section"><div className="section-head"><h2>{copy.mapTitle}</h2></div><MapView destinations={destinations} /></section>
    {related.length ? <section className="related-journeys"><h2>{copy.journeysTitle}</h2>
      {related.map((journey) => <Link key={journey.id} href={`/journeys/${journey.slug}`}>{localizeJourney(journey, translations.get(journey.id)).name}<ArrowRight /></Link>)}
    </section> : null}
  </div>;
}
