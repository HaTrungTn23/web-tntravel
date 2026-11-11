import "server-only";

import { createHash } from "node:crypto";
import { GoogleGenAI } from "@google/genai";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { DestinationProfile } from "@/data/destinationProfiles";
import type { Media } from "@/domain/models";
import type { Locale } from "@/i18n/config";

export type TranslationLocale = Exclude<Locale, "vi">;
export const translationLocales: TranslationLocale[] = ["en", "ru"];

export interface DestinationTranslationPayload {
  cardTitle: string;
  cardDescription: string;
  profile: DestinationProfile;
  mediaText: Array<{ id: string; alt: string; caption: string }>;
}

export interface HomeTranslationPayload {
  sections: {
    stations: { titleA: string; titleB: string; body: string };
    destinations: { titleA: string; titleB: string; body: string };
  };
  stations: Array<{ stationId: string; title: string; description: string }>;
}

type TranslationRow = {
  locale: TranslationLocale;
  payload: unknown;
  source_hash: string;
};

const languageName: Record<TranslationLocale, string> = { en: "English", ru: "Russian" };

export function hashTranslationSource(source: unknown) {
  return createHash("sha256").update(JSON.stringify(source)).digest("hex");
}

export function buildDestinationTranslationSource(input: {
  cardTitle: string;
  cardDescription: string;
  profile: DestinationProfile;
  media: Media[];
}): DestinationTranslationPayload {
  return {
    cardTitle: input.cardTitle,
    cardDescription: input.cardDescription,
    profile: input.profile,
    mediaText: input.media.map((item) => ({ id: item.id, alt: item.alt, caption: item.caption ?? "" })),
  };
}

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) throw new Error("GEMINI_API_KEY chưa được cấu hình.");
  return new GoogleGenAI({ apiKey });
}

function asText(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function asTextArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) return fallback;
  return value.map((item) => item.trim());
}

function normalizeDestinationTranslation(value: unknown, source: DestinationTranslationPayload): DestinationTranslationPayload {
  const row = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const rawProfile = row.profile && typeof row.profile === "object" ? row.profile as Record<string, unknown> : {};
  const mediaRows = Array.isArray(row.mediaText) ? row.mediaText : [];
  const mediaMap = new Map(mediaRows.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const media = item as Record<string, unknown>;
    return typeof media.id === "string" ? [[media.id, media] as const] : [];
  }));
  return {
    cardTitle: asText(row.cardTitle, source.cardTitle),
    cardDescription: asText(row.cardDescription, source.cardDescription),
    profile: {
      tagline: asText(rawProfile.tagline, source.profile.tagline),
      introduction: asTextArray(rawProfile.introduction, source.profile.introduction),
      reasons: asTextArray(rawProfile.reasons, source.profile.reasons),
      highlights: asTextArray(rawProfile.highlights, source.profile.highlights),
      activities: asTextArray(rawProfile.activities, source.profile.activities),
      localCulture: asTextArray(rawProfile.localCulture, source.profile.localCulture ?? []),
      bestTime: asTextArray(rawProfile.bestTime, source.profile.bestTime),
      audience: asTextArray(rawProfile.audience, source.profile.audience),
      locationAndConnections: asTextArray(rawProfile.locationAndConnections, source.profile.locationAndConnections),
      sourceNote: asText(rawProfile.sourceNote, source.profile.sourceNote),
    },
    mediaText: source.mediaText.map((item) => {
      const translated = mediaMap.get(item.id);
      return {
        id: item.id,
        alt: asText(translated?.alt, item.alt),
        caption: asText(translated?.caption, item.caption),
      };
    }),
  };
}

function normalizeHomeTranslation(value: unknown, source: HomeTranslationPayload): HomeTranslationPayload {
  const row = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const rawSections = row.sections && typeof row.sections === "object" ? row.sections as Record<string, unknown> : {};
  const section = (id: "stations" | "destinations") => {
    const raw = rawSections[id] && typeof rawSections[id] === "object" ? rawSections[id] as Record<string, unknown> : {};
    return {
      titleA: asText(raw.titleA, source.sections[id].titleA),
      titleB: asText(raw.titleB, source.sections[id].titleB),
      body: asText(raw.body, source.sections[id].body),
    };
  };
  const rows = Array.isArray(row.stations) ? row.stations : [];
  const stationMap = new Map(rows.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const station = item as Record<string, unknown>;
    return typeof station.stationId === "string" ? [[station.stationId, station] as const] : [];
  }));
  return {
    sections: { stations: section("stations"), destinations: section("destinations") },
    stations: source.stations.map((item) => {
      const translated = stationMap.get(item.stationId);
      return {
        stationId: item.stationId,
        title: asText(translated?.title, item.title),
        description: asText(translated?.description, item.description),
      };
    }),
  };
}

async function translateJson(source: unknown, locale: TranslationLocale, subject: string) {
  const response = await getClient().models.generateContent({
    model: process.env.GEMINI_MODEL?.trim() || "gemini-3.5-flash-lite",
    contents: JSON.stringify(source),
    config: {
      systemInstruction: [
        `Translate the supplied Vietnamese ${subject} into ${languageName[locale]}.`,
        "Return only JSON with exactly the same keys, arrays, object structure, IDs and item order.",
        "Translate every user-facing string. Never translate IDs. Preserve factual meaning, proper names, numbers and verification caveats.",
        "Tân Cương is a Vietnamese place name. Use Tan Cuong in English and Танкыонг in Russian; never translate it as Xinjiang or Синьцзян.",
        "Do not add, remove, summarize or invent information.",
      ].join("\n"),
      temperature: 0.1,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    },
  });
  const text = response.text?.trim();
  if (!text) throw new Error(`Gemini không trả về bản dịch ${locale}.`);
  return JSON.parse(text) as unknown;
}

export async function translateDestinationContent(source: DestinationTranslationPayload, locale: TranslationLocale) {
  return normalizeDestinationTranslation(await translateJson(source, locale, "destination content"), source);
}

export async function translateHomeContent(source: HomeTranslationPayload, locale: TranslationLocale) {
  return normalizeHomeTranslation(await translateJson(source, locale, "homepage gallery content"), source);
}

export async function getCachedTranslations(
  client: SupabaseClient,
  entityType: "destination" | "site_content",
  entityId: string,
) {
  const { data, error } = await client
    .from("content_translations")
    .select("locale,payload,source_hash")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .in("locale", translationLocales);
  if (error) throw error;
  return new Map(((data ?? []) as TranslationRow[]).map((row) => [row.locale, row]));
}

export async function saveTranslation(
  client: SupabaseClient,
  input: {
    entityType: "destination" | "site_content";
    entityId: string;
    locale: TranslationLocale;
    payload: unknown;
    sourceHash: string;
    published: boolean;
    userId: string;
  },
) {
  const { error } = await client.from("content_translations").upsert({
    entity_type: input.entityType,
    entity_id: input.entityId,
    locale: input.locale,
    payload: input.payload,
    source_hash: input.sourceHash,
    is_published: input.published,
    translated_at: new Date().toISOString(),
    updated_by: input.userId,
  });
  if (error) throw error;
}
