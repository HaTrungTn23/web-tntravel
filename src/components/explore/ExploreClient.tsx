"use client";
import { useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import type { Destination, InterestTag } from "@/domain/models";
import type { DestinationRatingSummaries } from "@/services/ratings/destinationRatings";
import { DestinationCard } from "@/components/common/DestinationCard";
import { MapView } from "@/components/map/MapView";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { getDestinationTranslation } from "@/i18n/contentTranslations";

const filters: { key: "explore.filter.all" | "explore.filter.tea" | "explore.filter.village" | "explore.filter.nature" | "explore.filter.history"; tags: InterestTag[] }[] = [
  { key: "explore.filter.all", tags: [] }, { key: "explore.filter.tea", tags: ["tea", "culture"] },
  { key: "explore.filter.village", tags: ["village", "local-product"] }, { key: "explore.filter.nature", tags: ["nature"] }, { key: "explore.filter.history", tags: ["history"] },
];
export function ExploreClient({ destinations, ratings }: { destinations: Destination[]; ratings: DestinationRatingSummaries }) {
  const { locale, t } = useLanguage();
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState("");
  const visible = useMemo(() => destinations.filter((item) => {
    const matchesFilter = !filters[active].tags.length || filters[active].tags.some((tag) => item.interestTags.includes(tag));
    const translated = getDestinationTranslation(item, locale);
    const haystack = `${translated.name} ${translated.shortDescription} ${item.name} ${item.shortDescription}`.toLocaleLowerCase(locale);
    return matchesFilter && haystack.includes(query.toLocaleLowerCase(locale));
  }), [active, destinations, locale, query]);
  return <>
    <div className="explore-controls"><label><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("explore.search")} aria-label={t("explore.search")} /></label><div className="filter-row"><Filter />{filters.map((filter, index) => <button className={active === index ? "active" : ""} onClick={() => setActive(index)} key={filter.key}>{t(filter.key)}</button>)}</div></div>
    <MapView destinations={visible} />
    <div className="results-count">{t("explore.visible", { count: visible.length })}</div>
    {visible.length ? <div className="card-grid">{visible.map((item) => <DestinationCard destination={item} rating={ratings[item.id]} key={item.id} prelocalized />)}</div> : <div className="empty-state"><h2>{t("explore.empty.title")}</h2><p>{t("explore.empty.body")}</p></div>}
  </>;
}
