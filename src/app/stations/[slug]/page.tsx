import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Leaf } from "lucide-react";
import { DestinationCard } from "@/components/common/DestinationCard";
import { destinationRepository, journeyRepository, stationRepository } from "@/repositories";
import { getServerLocale } from "@/i18n/server";
import { translate } from "@/i18n/messages";
import { getStaticPageTranslations, localizeStation } from "@/services/content/staticPageTranslations";
import { CraftStationPage } from "@/components/station/CraftStationPage";
import { GreenStationPage } from "@/components/station/GreenStationPage";
import { HistoryStationPage } from "@/components/station/HistoryStationPage";
import { TeaStationPage } from "@/components/station/TeaStationPage";
export default async function StationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const source = stationRepository.getBySlug(slug); if (!source) notFound();
  const locale = await getServerLocale(); const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  if (source.id === "craft-products") return <CraftStationPage locale={locale} />;
  if (source.id === "green-tourism") return <GreenStationPage locale={locale} />;
  if (source.id === "history-festival") return <HistoryStationPage locale={locale} />;
  if (source.id === "tea-culture") return <TeaStationPage locale={locale} />;
  const translations = await getStaticPageTranslations("station", [source.id], locale);
  const station = localizeStation(source, translations.get(source.id));
  const destinations = destinationRepository.getByIds(station.destinationIds); const related = journeyRepository.getAll().filter((journey) => journey.destinationIds.some((id) => station.destinationIds.includes(id)));
  const journeyTranslations = await getStaticPageTranslations("journey", related.map((item) => item.id), locale);
  return <div className="page-wrap station-page"><header className="page-intro"><div className="eyebrow"><Leaf /> {t("station.kicker")}</div><h1>{station.name}<br /><em>{t("station.title")}</em></h1><p>{station.description}</p></header><section className="process-strip"><span>{t("station.teaRegion")}</span><ArrowRight /><span>{t("station.people")}</span><ArrowRight /><span>{t("station.processing")}</span><ArrowRight /><span>{t("station.cup")}</span></section><section><div className="section-head"><div><div className="eyebrow">{t("station.connected")}</div><h2>{t("station.connectedTitleA")}<br /><em>{t("station.connectedTitleB")}</em></h2></div></div><div className="card-grid">{destinations.map((item) => <DestinationCard destination={item} key={item.id} />)}</div></section><section className="related-journeys"><h2>{t("station.related")}</h2>{related.map((item) => <Link key={item.id} href={`/journeys/${item.slug}`}>{String(journeyTranslations.get(item.id)?.name ?? item.name)}<ArrowRight /></Link>)}</section></div>;
}
