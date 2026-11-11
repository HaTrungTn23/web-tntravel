import { Leaf } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { DestinationCard } from "@/components/common/DestinationCard";
import { MapView } from "@/components/map/MapView";
import { tanCuongRegionContent } from "@/data/teaContent";
import { destinationRepository, regionRepository } from "@/repositories";
import { getDestinationsWithPublishedMedia } from "@/services/content/destinationContent";

export async function TanCuongRegionPage({ locale }: { locale: Locale }) {
  const copy = tanCuongRegionContent[locale];
  const region = regionRepository.getBySlug("tan-cuong");
  if (!region) return null;
  const destinations = await getDestinationsWithPublishedMedia(destinationRepository.getByIds(region.destinationIds), locale);
  return <div className="page-wrap station-page tea-region-page">
    <header className="page-intro"><div className="eyebrow"><Leaf /> {copy.kicker}</div><h1>{copy.title}</h1><p>{copy.introduction}</p></header>
    <section className="tea-region-links tea-region-layers" aria-label={copy.kicker}>
      {copy.layers.map((layer, index) => <article key={layer.title}><span>{String(index + 1).padStart(2, "0")}</span><h2>{layer.title}</h2><p>{layer.body}</p></article>)}
    </section>
    <section className="craft-station-section"><div className="section-head"><h2>{copy.placesTitle}</h2></div>
      <div className="card-grid">{destinations.map((destination) => <DestinationCard destination={destination} prelocalized key={destination.id} />)}</div>
    </section>
    <section className="craft-station-section"><div className="section-head"><h2>{copy.seasonsTitle}</h2></div>
      <div className="tea-season-grid">{copy.seasons.map((season) => <article key={season.title}><h3>{season.title}</h3><p>{season.body}</p></article>)}</div>
    </section>
    <section className="craft-station-section"><div className="section-head"><h2>{copy.mapTitle}</h2></div><MapView destinations={destinations} /></section>
  </div>;
}
