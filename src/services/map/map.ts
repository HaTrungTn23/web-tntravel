import type { GeoPoint } from "@/domain/models";
export interface MapPoint extends GeoPoint { id: string; label: string }
export interface MapProvider {
  showMarkers(points: MapPoint[]): void;
  fitBounds(points: MapPoint[]): void;
  highlight(ids: string[]): void;
  drawPolyline?(points: MapPoint[]): void;
}
export class LocalMapProvider implements MapProvider {
  showMarkers(points: MapPoint[]) { void points; }
  fitBounds(points: MapPoint[]) { void points; }
  highlight(ids: string[]) { void ids; }
  drawPolyline(points: MapPoint[]) { void points; }
}
