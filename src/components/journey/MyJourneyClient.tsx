"use client";
import Link from "next/link";
import { ArrowRight, MapPin, Route, Trash2 } from "lucide-react";
import type { Destination } from "@/domain/models";
import { useMyJourney } from "./JourneyProvider";
import { MapView } from "@/components/map/MapView";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { localizeDestination } from "@/i18n/contentTranslations";

export function MyJourneyClient({ destinations }: { destinations: Destination[] }) {
  const { locale, t } = useLanguage();
  const { destinationIds, remove, clear } = useMyJourney();
  const selected = destinationIds.flatMap((id) => destinations.find((item) => item.id === id) ?? []).map((item) => localizeDestination(item, locale));
  if (!selected.length) return <div className="empty-state large"><Route /><h2>{t("my.empty.title")}</h2><p>{t("my.empty.body")}</p><Link className="button button-primary" href="/explore">{t("my.explore")} <ArrowRight /></Link></div>;
  return <div className="my-journey-layout"><div><MapView destinations={selected} polyline /></div><div className="saved-list"><div className="saved-list-head"><b>{t("my.saved", { count: selected.length })}</b><button onClick={clear}>{t("my.clear")}</button></div>{selected.map((item, index) => <article key={item.id}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{item.name}</h3><p><MapPin /> {item.shortDescription}</p><Link href={`/destinations/${item.slug}`}>{t("my.details")}</Link></div><button aria-label={t("my.remove", { name: item.name })} onClick={() => remove(item.id)}><Trash2 /></button></article>)}<Link href="/survey" className="button button-primary">{t("my.feedback")} <ArrowRight /></Link></div></div>;
}
