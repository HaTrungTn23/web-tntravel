import { Compass } from "lucide-react";
import { ExploreClient } from "@/components/explore/ExploreClient";
import { destinationRepository } from "@/repositories";
import { getServerLocale } from "@/i18n/server";
import { translate } from "@/i18n/messages";
import { getDestinationRatingSummaries } from "@/services/ratings/destinationRatings";
import { getDestinationsWithPublishedMedia } from "@/services/content/destinationContent";
import styles from "./explore.module.css";

export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  const locale = await getServerLocale();
  const [destinations, ratings] = await Promise.all([
    getDestinationsWithPublishedMedia(destinationRepository.getAll(), locale),
    getDestinationRatingSummaries(),
  ]);
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  const sectionCopy = {
    vi: { destinations: "Điểm đến Thái Nguyên", destinationsBody: "Tìm theo chủ đề, xem vị trí trên bản đồ và mở hồ sơ chi tiết của từng nơi." },
    en: { destinations: "Thai Nguyen Destinations", destinationsBody: "Browse by theme, locate each place on the map and open its detailed profile." },
    ru: { destinations: "Места Тхайнгуена", destinationsBody: "Выбирайте тему, смотрите расположение на карте и открывайте подробное описание места." },
  }[locale];

  return <div className="explore-page">
    <div className="page-wrap">
      <header className="page-intro">
        <div className="eyebrow"><Compass /> {t("explore.kicker")}</div>
        <h1>{t("explore.titleA")}<br /><em>{t("explore.titleB")}</em></h1>
        <p>{t("explore.body")}</p>
      </header>
      <section id="diem-den" className={styles.destinations} aria-labelledby="destinations-title">
        <header className={styles.sectionHeading}>
          <h2 id="destinations-title">{sectionCopy.destinations}</h2>
          <p>{sectionCopy.destinationsBody}</p>
        </header>
        <ExploreClient destinations={destinations} ratings={ratings} />
      </section>
    </div>
  </div>;
}
