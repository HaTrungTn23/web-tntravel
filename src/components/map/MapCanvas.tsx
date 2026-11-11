"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, RotateCcw } from "lucide-react";
import type { Map as LeafletMap, TileLayer } from "leaflet";
import type { Destination } from "@/domain/models";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import type { MessageKey } from "@/i18n/messages";
import { localizeDestination } from "@/i18n/contentTranslations";

type MapStatus = "loading" | "ready" | "error";
const tileSources = [
  {
    url: "https://tile.openstreetmap.de/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  {
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
] as const;

function createPopup(destination: Destination, t: (key: MessageKey, values?: Record<string, string | number>) => string) {
  const root = document.createElement("div");
  root.className = "map-popup-content";

  const title = document.createElement("strong");
  title.textContent = destination.name;
  root.append(title);

  if (destination.location?.label) {
    const label = document.createElement("span");
    label.textContent = destination.location.label;
    root.append(label);
  }
  if (destination.location?.address) {
    const address = document.createElement("small");
    address.textContent = destination.location.address;
    root.append(address);
  }
  if (destination.location?.verification === "approximate") {
    const warning = document.createElement("small");
    warning.className = "map-popup-warning";
    warning.textContent = t("map.approximate");
    root.append(warning);
  }

  const link = document.createElement("a");
  link.href = `/destinations/${destination.slug}`;
  link.textContent = t("common.viewDetails");
  root.append(link);
  return root;
}

export default function MapCanvas({ destinations, polyline }: { destinations: Destination[]; polyline: boolean }) {
  const { locale, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [status, setStatus] = useState<MapStatus>("loading");
  const [attempt, setAttempt] = useState(0);
  const firstLocation = destinations.find((item) => item.location)?.location;
  const externalMapUrl = firstLocation
    ? `https://www.openstreetmap.org/?mlat=${firstLocation.lat}&mlon=${firstLocation.lng}#map=13/${firstLocation.lat}/${firstLocation.lng}`
    : "https://www.openstreetmap.org";

  useEffect(() => {
    let cancelled = false;
    let currentMap: LeafletMap | null = null;
    let currentTileLayer: TileLayer | null = null;
    let resizeObserver: ResizeObserver | null = null;
    const loadingTimeout = window.setTimeout(() => {
      if (!cancelled) setStatus("error");
    }, 18000);
    async function initializeMap() {
      try {
        setStatus("loading");
        const leaflet = await import("leaflet");
        if (cancelled || !containerRef.current) return;
        mapRef.current?.remove();
        mapRef.current = null;
        containerRef.current.replaceChildren();

        const coordinates = destinations.flatMap((item) => item.location
          ? [[item.location.lat, item.location.lng] as [number, number]]
          : []);
        const center = coordinates[0] ?? [21.59, 105.8] as [number, number];

        currentMap = leaflet.map(containerRef.current, {
          center,
          zoom: coordinates.length > 1 ? 9 : 12,
          scrollWheelZoom: true,
          dragging: true,
          touchZoom: true,
          zoomControl: true,
        });
        mapRef.current = currentMap;

        const loadTileSource = (sourceIndex: number) => {
          if (cancelled || !currentMap) return;
          currentTileLayer?.remove();
          const source = tileSources[sourceIndex];
          let errorCount = 0;
          const layer = leaflet.tileLayer(source.url, {
            attribution: source.attribution,
            maxZoom: 19,
          });
          currentTileLayer = layer;
          layer.once("tileload", () => {
            if (cancelled || currentTileLayer !== layer) return;
            window.clearTimeout(loadingTimeout);
            setStatus("ready");
          });
          layer.on("load", () => {
            if (cancelled || currentTileLayer !== layer) return;
            window.clearTimeout(loadingTimeout);
            setStatus("ready");
          });
          layer.on("tileerror", () => {
            if (cancelled || currentTileLayer !== layer) return;
            errorCount += 1;
            if (errorCount < 2) return;
            if (sourceIndex + 1 < tileSources.length) loadTileSource(sourceIndex + 1);
            else {
              window.clearTimeout(loadingTimeout);
              setStatus("error");
            }
          });
          layer.addTo(currentMap);
        };
        loadTileSource(0);

        const flagIcon = leaflet.divIcon({
          className: "map-flag-icon",
          html: '<span class="map-flag-pole"></span><span class="map-flag-cloth"></span>',
          iconSize: [30, 36],
          iconAnchor: [8, 35],
          popupAnchor: [7, -31],
        });

        destinations.forEach((sourceDestination) => {
          const destination = localizeDestination(sourceDestination, locale);
          if (!destination.location) return;
          leaflet.marker([destination.location.lat, destination.location.lng], {
            icon: flagIcon,
            alt: destination.name,
            title: destination.name,
          }).addTo(currentMap!).bindPopup(createPopup(destination, t));
        });

        if (polyline && coordinates.length > 1) {
          leaflet.polyline(coordinates, { color: "#27784d", weight: 3, dashArray: "7 9" }).addTo(currentMap);
        }
        if (coordinates.length > 1) currentMap.fitBounds(coordinates, { padding: [38, 38], maxZoom: 12 });

        if (typeof ResizeObserver !== "undefined") {
          resizeObserver = new ResizeObserver(() => currentMap?.invalidateSize({ pan: false }));
          resizeObserver.observe(containerRef.current);
        }
        requestAnimationFrame(() => currentMap?.invalidateSize({ pan: false }));
      } catch (error) {
        console.error("Không thể khởi tạo bản đồ Leaflet", error);
        if (!cancelled) setStatus("error");
      }
    }

    initializeMap();
    return () => {
      cancelled = true;
      window.clearTimeout(loadingTimeout);
      resizeObserver?.disconnect();
      currentTileLayer?.remove();
      currentMap?.remove();
      mapRef.current = null;
    };
  }, [attempt, destinations, locale, polyline, t]);

  return <div className="map-stage" data-map-status={status}>
    <div ref={containerRef} className="leaflet-map" aria-label={t("map.aria")} />
    {status === "loading" && <div className="map-loading map-loading-overlay" role="status" aria-live="polite">
      <div className="map-loading-preview" aria-hidden="true"><span /><span /><span /></div>
      <b>{t("map.loading.title")}</b>
      <span>{t("map.loading.body")}</span>
    </div>}
    {status === "error" && <div className="map-fallback map-error" role="alert">
      <MapPin aria-hidden="true" />
      <b>{t("map.error.title")}</b>
      <span>{t("map.error.body")}</span>
      <div className="map-error-actions">
        <button type="button" className="button button-secondary" onClick={() => { setStatus("loading"); setAttempt((value) => value + 1); }}><RotateCcw /> {t("map.retry")}</button>
        <a className="button button-primary" href={externalMapUrl} target="_blank" rel="noreferrer">{t("map.open")}</a>
      </div>
    </div>}
  </div>;
}
