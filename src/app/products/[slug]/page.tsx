import { notFound } from "next/navigation";
import { Package } from "lucide-react";
import { DestinationCard } from "@/components/common/DestinationCard";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { craftProductContent } from "@/data/craftContent";
import { destinationRepository, productRepository } from "@/repositories";
import { getServerLocale } from "@/i18n/server";
import { translate } from "@/i18n/messages";
import { getStaticPageTranslations, localizeProduct } from "@/services/content/staticPageTranslations";
import { getDestinationsWithPublishedMedia } from "@/services/content/destinationContent";
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const source = productRepository.getBySlug(slug);
  if (!source) notFound();
  const locale = await getServerLocale();
  const translations = await getStaticPageTranslations("product", [source.id], locale);
  const product = localizeProduct(source, translations.get(source.id));
  const editorial = source.id === "tan-cuong-tea" ? craftProductContent[locale] : null;
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  const destinations = await getDestinationsWithPublishedMedia(destinationRepository.getByIds(product.destinationIds), locale);

  return <div className="page-wrap product-page">
    <header className="product-hero">
      <div><div className="eyebrow"><Package /> {t("product.kicker")}</div><h1>{editorial?.name ?? product.name}</h1><p>{editorial?.shortDescription ?? product.shortDescription}</p></div>
      <ImageWithFallback src={product.media[0]?.url ?? ""} alt={editorial?.name ?? product.media[0]?.alt ?? product.name} />
    </header>
    {editorial ? <section className="product-story"><h2>{editorial.storyTitle}</h2>{editorial.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section> : null}
    <section><div className="section-head"><h2>{t("product.destinations")}</h2></div><div className="card-grid">{destinations.map((destination) => <DestinationCard destination={destination} prelocalized key={destination.id} />)}</div></section>
  </div>;
}
