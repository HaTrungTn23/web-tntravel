import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { DestinationCard } from "@/components/common/DestinationCard";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { craftStationContent, craftProductContent } from "@/data/craftContent";
import { destinationRepository, journeyRepository, productRepository, stationRepository } from "@/repositories";
import { getDestinationsWithPublishedMedia } from "@/services/content/destinationContent";
import { getStaticPageTranslations, localizeJourney } from "@/services/content/staticPageTranslations";

export async function CraftStationPage({ locale }: { locale: Locale }) {
  const copy = craftStationContent[locale];
  const station = stationRepository.getBySlug("lang-nghe-san-pham");
  if (!station) return null;
  const destinations = await getDestinationsWithPublishedMedia(destinationRepository.getByIds(station.destinationIds), locale);
  const product = productRepository.getBySlug("tra-tan-cuong");
  const related = journeyRepository.getAll()
    .filter((journey) => journey.destinationIds.some((id) => station.destinationIds.includes(id)))
    .slice(0, 4);
  const translations = await getStaticPageTranslations("journey", related.map((journey) => journey.id), locale);

  return <div className="page-wrap station-page craft-station-page">
    <header className="page-intro">
      <div className="eyebrow"><Package /> {copy.kicker}</div>
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
      <div className="section-head"><h2>{copy.placesTitle}</h2></div>
      <div className="card-grid">{destinations.map((destination) => <DestinationCard destination={destination} prelocalized key={destination.id} />)}</div>
    </section>
    {product ? <section className="craft-station-section">
      <div className="section-head"><h2>{copy.productTitle}</h2></div>
      <Link className="craft-product-feature" href={`/products/${product.slug}`}>
        <ImageWithFallback src={product.media[0]?.url ?? ""} alt={craftProductContent[locale].name} />
        <div><span className="eyebrow">{copy.productTitle}</span><h3>{craftProductContent[locale].name}</h3><p>{craftProductContent[locale].shortDescription}</p><ArrowRight /></div>
      </Link>
    </section> : null}
    {related.length ? <section className="related-journeys"><h2>{copy.journeysTitle}</h2>
      {related.map((journey) => <Link key={journey.id} href={`/journeys/${journey.slug}`}>{localizeJourney(journey, translations.get(journey.id)).name}<ArrowRight /></Link>)}
    </section> : null}
  </div>;
}
