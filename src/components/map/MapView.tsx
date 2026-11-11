"use client";

import type { Destination } from "@/domain/models";
import MapCanvas from "./MapCanvas";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function MapView({ destinations, polyline = false }: { destinations: Destination[]; polyline?: boolean }) {
  const { t } = useLanguage();
  const points = destinations.filter((item) => item.location);

  return <div className="map-shell">
    <div className="map-viewport">
      {points.length
        ? <MapCanvas destinations={points} polyline={polyline} />
        : <div className="map-fallback"><b>{t("map.empty.title")}</b><span>{t("map.empty.body")}</span></div>}
    </div>
  </div>;
}
