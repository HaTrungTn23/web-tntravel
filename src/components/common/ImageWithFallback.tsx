"use client";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
export function ImageWithFallback({ src, alt, className, priority = false }: { src: string; alt: string; className?: string; priority?: boolean }) {
  const { t } = useLanguage();
  const [failed, setFailed] = useState(false);
  if (failed) return <div className={`image-fallback ${className ?? ""}`} role="img" aria-label={alt}><ImageOff /><span>{t("common.imageUpdating")}</span></div>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} onError={() => setFailed(true)} />;
}
