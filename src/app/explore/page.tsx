import { Compass } from "lucide-react";
import { ExploreClient } from "@/components/explore/ExploreClient";
import { destinationRepository } from "@/repositories";
import { getServerLocale } from "@/i18n/server";
import { translate } from "@/i18n/messages";
import { getDestinationRatingSummaries } from "@/services/ratings/destinationRatings";
import { getDestinationsWithPublishedMedia } from "@/services/content/destinationContent";

export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  const locale = await getServerLocale();
  const [destinations, ratings] = await Promise.all([
    getDestinationsWithPublishedMedia(destinationRepository.getAll(), locale),
    getDestinationRatingSummaries(),
  ]);
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  return <div className="page-wrap explore-page">
    <header className="page-intro">
      <div className="eyebrow"><Compass /> {t("explore.kicker")}</div>
      <h1>{t("explore.titleA")}<br /><em>{t("explore.titleB")}</em></h1>
      <p>{t("explore.body")}</p>
    </header>
    <ExploreClient destinations={destinations} ratings={ratings} />
  </div>;
}
