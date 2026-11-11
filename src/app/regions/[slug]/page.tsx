import { notFound } from "next/navigation";
import { DestinationCard } from "@/components/common/DestinationCard";
import { MapView } from "@/components/map/MapView";
import { destinationRepository, regionRepository } from "@/repositories";
import { getLocalizedLabels } from "@/lib/labels";
import { getServerLocale } from "@/i18n/server";
import { translate } from "@/i18n/messages";
import { getStaticPageTranslations, localizeRegion } from "@/services/content/staticPageTranslations";
import { TanCuongRegionPage } from "@/components/region/TanCuongRegionPage";
export default async function RegionPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const source = regionRepository.getBySlug(slug); if (!source) notFound(); const locale = await getServerLocale(); if (source.id === "tan-cuong-region") return <TanCuongRegionPage locale={locale} />; const translations = await getStaticPageTranslations("region", [source.id], locale); const region = localizeRegion(source, translations.get(source.id)); const t = (key: Parameters<typeof translate>[1]) => translate(locale, key); const labels = getLocalizedLabels(locale); const destinations = destinationRepository.getByIds(region.destinationIds); return <div className="page-wrap"><header className="page-intro"><div className="eyebrow">{t("region.kicker")}</div><h1>{region.name}<br /><em>{t("region.title")}</em></h1><p>{region.description}</p><div className="tag-row">{region.seasons.map((s) => <span key={s}>{labels.season[s]}</span>)}</div></header><MapView destinations={destinations} /><div className="card-grid spaced">{destinations.map((d) => <DestinationCard destination={d} key={d.id} />)}</div></div>; }
