import { createClient } from "@supabase/supabase-js";
import type { Journey, Product, Region, Station } from "@/domain/models";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import type { Locale } from "@/i18n/config";

export type StaticPageEntity = "journey" | "region" | "product" | "station";

export async function getStaticPageTranslations(
  entityType: StaticPageEntity,
  ids: string[],
  locale: Locale,
): Promise<Map<string, Record<string, unknown>>> {
  const config = getSupabasePublicConfig();
  if (locale === "vi" || !config || !ids.length) return new Map();
  try {
    const client = createClient(config.url, config.key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await client.from("content_translations")
      .select("entity_id,payload")
      .eq("entity_type", entityType)
      .eq("locale", locale)
      .eq("is_published", true)
      .in("entity_id", ids);
    if (error) throw error;
    return new Map((data ?? []).map((row) => [row.entity_id, row.payload as Record<string, unknown>]));
  } catch (error) {
    console.warn(`Could not load ${entityType} translations.`, error);
    return new Map();
  }
}

const translatedText = (value: unknown, fallback: string) => typeof value === "string" && value.trim() ? value : fallback;

export function localizeJourney(journey: Journey, payload?: Record<string, unknown>): Journey {
  if (!payload) return journey;
  const days = Array.isArray(payload.days) ? payload.days : [];
  return {
    ...journey,
    name: translatedText(payload.name, journey.name),
    summary: translatedText(payload.summary, journey.summary),
    durationLabel: journey.durationLabel ? translatedText(payload.durationLabel, journey.durationLabel) : undefined,
    conditions: journey.conditions ? translatedText(payload.conditions, journey.conditions) : undefined,
    sourceLabel: journey.sourceLabel ? translatedText(payload.sourceLabel, journey.sourceLabel) : undefined,
    days: journey.days.map((day, dayIndex) => {
      const translatedDay = days[dayIndex] as { items?: unknown } | undefined;
      const items = Array.isArray(translatedDay?.items) ? translatedDay.items : [];
      return { ...day, items: day.items.map((item, itemIndex) => {
        const translatedItem = items[itemIndex] as { title?: unknown; note?: unknown } | undefined;
        return {
          ...item,
          title: item.title ? translatedText(translatedItem?.title, item.title) : undefined,
          note: item.note ? translatedText(translatedItem?.note, item.note) : undefined,
        };
      }) };
    }),
  };
}

export function localizeRegion(region: Region, payload?: Record<string, unknown>): Region {
  return payload ? { ...region, name: translatedText(payload.name, region.name), description: region.description ? translatedText(payload.description, region.description) : undefined } : region;
}

export function localizeProduct(product: Product, payload?: Record<string, unknown>): Product {
  return payload ? { ...product, name: translatedText(payload.name, product.name), shortDescription: product.shortDescription ? translatedText(payload.shortDescription, product.shortDescription) : undefined } : product;
}

export function localizeStation(station: Station, payload?: Record<string, unknown>): Station {
  return payload ? { ...station, name: translatedText(payload.name, station.name), description: translatedText(payload.description, station.description) } : station;
}
