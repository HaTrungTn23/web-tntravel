"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Images, Play } from "lucide-react";
import type { Media } from "@/domain/models";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function DestinationMediaSection({ media, destinationName }: { media: Media[]; destinationName: string }) {
  const { t } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointerId: number; startX: number; scrollLeft: number } | null>(null);
  const images = media.filter((item) => item.type === "image");
  const videos = media.flatMap((item) => item.type === "youtube" && getYouTubeEmbedUrl(item.url) ? [{ ...item, embedUrl: getYouTubeEmbedUrl(item.url)! }] : []);
  if (!images.length && !videos.length) return null;

  function scroll(direction: -1 | 1) { trackRef.current?.scrollBy({ left: direction * Math.max(320, trackRef.current.clientWidth * .78), behavior: "smooth" }); }
  function pointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const track = trackRef.current; if (!track) return;
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, scrollLeft: track.scrollLeft };
    track.setPointerCapture(event.pointerId); track.dataset.dragging = "true";
  }
  function pointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current; const track = trackRef.current;
    if (!drag || !track || drag.pointerId !== event.pointerId) return;
    track.scrollLeft = drag.scrollLeft - (event.clientX - drag.startX);
  }
  function pointerEnd(event: React.PointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    if (track?.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    if (track) delete track.dataset.dragging;
    dragRef.current = null;
  }

  return <div className="destination-media-section">
    {images.length > 0 && <div className="destination-gallery"><div className="gallery-head"><div><Images /><span>{t("media.images", { count: images.length })}</span></div>{images.length > 1 && <div className="gallery-controls"><button type="button" aria-label={t("media.previous")} onClick={() => scroll(-1)}><ChevronLeft /></button><button type="button" aria-label={t("media.next")} onClick={() => scroll(1)}><ChevronRight /></button></div>}</div><div className="gallery-track" ref={trackRef} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={pointerEnd}>{images.map((item, index) => <figure key={item.id}><div className="gallery-image"><ImageWithFallback src={item.url} alt={item.alt || t("media.imageAlt", { name: destinationName, index: index + 1 })} /></div>{item.caption && <figcaption>{item.sourceUrl ? <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">{item.caption}</a> : item.caption}</figcaption>}</figure>)}</div></div>}
    {videos.length > 0 && <div className="destination-videos"><div className="video-section-head"><Play /><b>{t("media.video")}</b></div><div className={`video-grid ${videos.length === 1 ? "single" : ""}`}>{videos.map((item) => <figure key={item.id}><div className="video-frame"><iframe src={item.embedUrl} title={item.alt || t("media.videoTitle", { name: destinationName })} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>{item.caption && <figcaption>{item.caption}</figcaption>}</figure>)}</div></div>}
  </div>;
}
