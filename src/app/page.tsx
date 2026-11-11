import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { DestinationRail } from "@/components/home/DestinationRail";
import { HomeTracker } from "@/components/home/HomeTracker";
import { HomeHeroSlideshow } from "@/components/home/HomeHeroSlideshow";
import { JourneySelector } from "@/components/home/JourneySelector";
import { StationGrid } from "@/components/home/StationGrid";
import { MapView } from "@/components/map/MapView";
import { getServerLocale } from "@/i18n/server";
import { translate } from "@/i18n/messages";
import { destinationRepository } from "@/repositories";
import { getDestinationsWithPublishedMedia } from "@/services/content/destinationContent";
import { createDefaultHomeHeroSlides, getPublishedHomeGalleryContent, resolveHomeStationCards } from "@/services/content/homeGalleryContent";
import { getDestinationRatingSummaries } from "@/services/ratings/destinationRatings";
import { festivalState } from "@/data/festival2026";
import { getPublishedFestivalContent } from "@/services/content/festivalContent";
import styles from "./home.module.css";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const locale = await getServerLocale();
  const t = (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) => translate(locale, key, values);
  const [connected, managedHomeGallery, ratings, managedFestival] = await Promise.all([
    getDestinationsWithPublishedMedia(destinationRepository.getAll(), locale),
    getPublishedHomeGalleryContent(),
    getDestinationRatingSummaries(),
    getPublishedFestivalContent(),
  ]);
  const localized = connected;
  const galleryContent = managedHomeGallery.content;
  const stationSection = galleryContent.sections.stations[locale];
  const destinationSection = galleryContent.sections.destinations[locale];
  const stationCards = resolveHomeStationCards(galleryContent, locale);
  const heroDestination = localized.find((destination) => destination.id === "tan-cuong") ?? localized[0];
  const heroCover = heroDestination?.media.find((item) => item.type === "image" && item.isCover)
    ?? heroDestination?.media.find((item) => item.type === "image");
  const heroImages = galleryContent.heroImages.length ? galleryContent.heroImages : createDefaultHomeHeroSlides(heroCover ? { id: heroCover.id, url: heroCover.url, alt: heroCover.alt || t("home.hero.imageAlt") } : undefined);

  return <div className={styles.home}>
    <HomeTracker />

    <HomeHeroSlideshow images={heroImages} locale={locale} exploreLabel={t("nav.explore")} planLabel={t("home.hero.plan")} />

    <section id="stations" className={`${styles.section} ${styles.stations}`}>
      <div className={styles.sectionHeader}>
        <div>
          <h2>{stationSection.titleA} <em>{stationSection.titleB}</em></h2>
          <p>{stationSection.body}</p>
        </div>
      </div>
      <StationGrid destinations={connected} stations={stationCards} festivalStatus={festivalState()} festivalContent={managedFestival.content} />
    </section>

    <section id="destinations" className={`${styles.section} ${styles.destinations}`}>
      <div className={styles.sectionHeader}>
        <div>
          <h2>{destinationSection.titleA} <em>{destinationSection.titleB}</em></h2>
          <p>{destinationSection.body.replaceAll("{count}", String(connected.length))}</p>
        </div>
      </div>
      <DestinationRail destinations={connected} ratings={ratings} />
    </section>

    <section className={styles.mapSection}>
      <div className={styles.mapInner}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>{t("home.map.titleA")} <em>{t("home.map.titleB")}</em></h2>
            <p>{t("home.map.summary")}</p>
          </div>
          <Link className="text-link" href="/explore">{t("home.map.open")} <ArrowRight /></Link>
        </div>
        <div className={styles.mapLayout}>
          <MapView destinations={connected} />
          <aside className={styles.mapIndex}>
            <div className={styles.mapIndexHead}>
              <b>{t("home.map.nearby")}</b>
              <span>{t("common.points", { count: connected.length })}</span>
            </div>
            <nav aria-label={t("home.map.nearby")}>
              {localized.slice(0, 6).map((destination) => <Link href={`/destinations/${destination.slug}`} key={destination.id}>
                <MapPin />
                <span><b>{destination.name}</b><small>{locale === "vi" ? destination.location?.label ?? destination.shortDescription : destination.shortDescription}</small></span>
                <ArrowRight />
              </Link>)}
            </nav>
            <Link className={styles.mapIndexAll} href="/explore">{t("home.map.all")} <ArrowRight /></Link>
          </aside>
        </div>
      </div>
    </section>

    <section id="journey-selector" className={`${styles.section} ${styles.planner}`}>
      <JourneySelector />
    </section>

  </div>;
}
