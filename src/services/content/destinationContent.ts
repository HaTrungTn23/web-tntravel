import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Destination, Media } from "@/domain/models";
import { destinationProfiles, type DestinationProfile } from "@/data/destinationProfiles";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import type { Locale } from "@/i18n/config";
import { getDestinationTranslation } from "@/i18n/contentTranslations";
import { villageContent, type VillageDestinationId } from "@/data/villageContent";
import { craftDestinationContent, type CraftDestinationId } from "@/data/craftContent";
import { greenDestinationContent, type GreenDestinationId } from "@/data/greenContent";
import { historyDestinationContent, type HistoryDestinationId } from "@/data/historyContent";
import { teaDestinationContent, type TeaDestinationId } from "@/data/teaContent";
import { getFilesDestinationContent, filesDestinationContent } from "@/data/filesDestinations";
import type { DestinationTranslationPayload } from "@/services/translation/contentTranslation";

export interface ManagedDestinationContent {
  profile: DestinationProfile;
  media: Media[];
  cardTitle: string;
  cardDescription: string;
  published: boolean;
  updatedAt?: string;
  source: "local" | "supabase";
}

function getVillageTranslation(id: string, locale: Locale) {
  const fromFiles = getFilesDestinationContent(id, locale);
  if (fromFiles) return { cardTitle: fromFiles.title, cardDescription: fromFiles.description, profile: fromFiles.profile };
  if (Object.prototype.hasOwnProperty.call(villageContent, id)) return villageContent[id as VillageDestinationId][locale];
  if (Object.prototype.hasOwnProperty.call(craftDestinationContent, id)) return craftDestinationContent[id as CraftDestinationId][locale];
  if (Object.prototype.hasOwnProperty.call(greenDestinationContent, id)) return greenDestinationContent[id as GreenDestinationId][locale];
  if (Object.prototype.hasOwnProperty.call(historyDestinationContent, id)) return historyDestinationContent[id as HistoryDestinationId][locale];
  if (Object.prototype.hasOwnProperty.call(teaDestinationContent, id)) return teaDestinationContent[id as TeaDestinationId][locale];
  return null;
}

function fallbackContent(destination: Destination, locale: Locale = "vi"): ManagedDestinationContent {
  const village = getVillageTranslation(destination.id, locale);
  const card = getDestinationTranslation(destination, locale);
  return {
    profile: village?.profile ?? destinationProfiles[destination.id],
    media: destination.media.map((item, index) => ({ ...item, order: index, isCover: index === 0 })),
    cardTitle: village?.cardTitle ?? card.name,
    cardDescription: village?.cardDescription ?? card.shortDescription,
    published: true,
    source: "local",
  };
}

function normalizeMedia(rows: Array<Record<string, unknown>>, localMedia: Media[] = []): Media[] {
  const sourceByUrl = new Map(localMedia.filter((item) => item.sourceUrl).map((item) => [item.url, item.sourceUrl]));
  return rows.map((row, index) => ({
    id: String(row.id),
    type: row.type === "youtube" ? "youtube" : "image",
    url: String(row.url ?? ""),
    alt: String(row.alt ?? ""),
    thumbnailUrl: row.thumbnail_url ? String(row.thumbnail_url) : undefined,
    caption: row.caption ? String(row.caption) : undefined,
    sourceUrl: sourceByUrl.get(String(row.url ?? "")),
    isCover: Boolean(row.is_cover),
    order: Number(row.sort_order ?? index),
  }));
}

function preferResearchedMedia(media: Media[], destination: Destination): Media[] {
  const legacyStockCover = media.length === 1 && media[0].type === "image" && /^https:\/\/images\.unsplash\.com\//.test(media[0].url);
  return legacyStockCover && destination.media.length >= 7 ? destination.media : media;
}

function applyTranslatedMedia(media: Media[], payload: DestinationTranslationPayload) {
  const translations = new Map(payload.mediaText.map((item) => [item.id, item]));
  return media.map((item) => {
    const translated = translations.get(item.id);
    return translated ? { ...item, alt: translated.alt || item.alt, caption: translated.caption || undefined } : item;
  });
}

async function getDestinationTranslationRow(client: SupabaseClient, destinationId: string, locale: Locale, publishedOnly: boolean) {
  if (locale === "vi") return null;
  let query = client.from("content_translations").select("payload").eq("entity_type", "destination").eq("entity_id", destinationId).eq("locale", locale);
  if (publishedOnly) query = query.eq("is_published", true);
  const { data, error } = await query.maybeSingle();
  return error || !data?.payload ? null : data.payload as DestinationTranslationPayload;
}

async function queryContent(client: SupabaseClient, destination: Destination, publishedOnly: boolean, locale: Locale = "vi") {
  let contentQuery = client.from("destination_content").select("profile,card_title,card_description,is_published,updated_at").eq("destination_id", destination.id);
  if (publishedOnly) contentQuery = contentQuery.eq("is_published", true);
  let { data: contentRow, error: contentError } = await contentQuery.maybeSingle();
  if (contentError) {
    let legacyQuery = client.from("destination_content").select("profile,is_published,updated_at").eq("destination_id", destination.id);
    if (publishedOnly) legacyQuery = legacyQuery.eq("is_published", true);
    const legacy = await legacyQuery.maybeSingle();
    contentError = legacy.error;
    contentRow = legacy.data ? { ...legacy.data, card_title: null, card_description: null } : null;
  }
  if (contentError || !contentRow) {
    const fallback = fallbackContent(destination, locale);
    const curated = getVillageTranslation(destination.id, locale);
    const translated = await getDestinationTranslationRow(client, destination.id, locale, publishedOnly);
    if (translated) return {
      ...fallback,
      profile: curated?.profile ?? translated.profile,
      media: applyTranslatedMedia(fallback.media, translated),
      cardTitle: curated?.cardTitle ?? translated.cardTitle,
      cardDescription: curated?.cardDescription ?? translated.cardDescription,
      published: publishedOnly,
    };
    return {
      ...fallback,
      published: publishedOnly ? fallback.published : false,
    };
  }

  const { data: mediaRows, error: mediaError } = await client
    .from("destination_media")
    .select("id,type,url,thumbnail_url,alt,caption,is_cover,sort_order")
    .eq("destination_id", destination.id)
    .order("sort_order", { ascending: true });

  const profile = contentRow.profile as unknown as DestinationProfile;
  const media = mediaError ? [] : normalizeMedia((mediaRows ?? []) as Array<Record<string, unknown>>, destination.media);
  const publishedMedia = publishedOnly ? (media.length ? preferResearchedMedia(media, destination) : destination.media) : media;
  const cardTitle = String(contentRow.card_title || destination.name);
  const cardDescription = String(contentRow.card_description || destination.shortDescription);
  const translated = await getDestinationTranslationRow(client, destination.id, locale, publishedOnly);
  const staticFallback = getDestinationTranslation({ ...destination, name: cardTitle, shortDescription: cardDescription }, locale);
  const village = getVillageTranslation(destination.id, locale);
  const sourceProfile = Object.prototype.hasOwnProperty.call(villageContent, destination.id)
    ? villageContent[destination.id as VillageDestinationId].vi.profile
    : Object.prototype.hasOwnProperty.call(craftDestinationContent, destination.id)
      ? craftDestinationContent[destination.id as CraftDestinationId].vi.profile
      : Object.prototype.hasOwnProperty.call(greenDestinationContent, destination.id)
        ? greenDestinationContent[destination.id as GreenDestinationId].vi.profile
        : Object.prototype.hasOwnProperty.call(historyDestinationContent, destination.id)
          ? historyDestinationContent[destination.id as HistoryDestinationId].vi.profile
          : Object.prototype.hasOwnProperty.call(teaDestinationContent, destination.id)
            ? teaDestinationContent[destination.id as TeaDestinationId].vi.profile
            : filesDestinationContent[destination.id]?.vi.profile ?? null;
  const useVillageProfile = village && sourceProfile && JSON.stringify(profile) === JSON.stringify(sourceProfile);
  const curated = useVillageProfile ? village : null;
  return {
    profile: curated?.profile ?? translated?.profile ?? profile,
    media: translated ? applyTranslatedMedia(publishedMedia, translated) : publishedMedia,
    cardTitle: curated?.cardTitle ?? translated?.cardTitle ?? staticFallback.name,
    cardDescription: curated?.cardDescription ?? translated?.cardDescription ?? staticFallback.shortDescription,
    published: Boolean(contentRow.is_published),
    updatedAt: contentRow.updated_at ? String(contentRow.updated_at) : undefined,
    source: "supabase" as const,
  };
}

export async function getPublishedDestinationContent(destination: Destination, locale: Locale = "vi") {
  const config = getSupabasePublicConfig();
  if (!config) return fallbackContent(destination, locale);
  try {
    const client = createClient(config.url, config.key, { auth: { persistSession: false, autoRefreshToken: false } });
    return await queryContent(client, destination, true, locale);
  } catch {
    return fallbackContent(destination, locale);
  }
}

export async function getDestinationsWithPublishedMedia(destinations: Destination[], locale: Locale = "vi") {
  const config = getSupabasePublicConfig();
  if (!config || !destinations.length) return destinations;
  try {
    const client = createClient(config.url, config.key, { auth: { persistSession: false, autoRefreshToken: false } });
    const ids = destinations.map((destination) => destination.id);
    const [{ data: contentRows, error: contentError }, { data, error }, translationResult] = await Promise.all([client
      .from("destination_content")
      .select("destination_id,card_title,card_description")
      .in("destination_id", ids)
      .eq("is_published", true), client
      .from("destination_media")
      .select("id,destination_id,type,url,thumbnail_url,alt,caption,is_cover,sort_order")
      .in("destination_id", ids)
      .order("sort_order", { ascending: true }), locale === "vi" ? Promise.resolve({ data: [], error: null }) : client
      .from("content_translations")
      .select("entity_id,payload")
      .eq("entity_type", "destination")
      .eq("locale", locale)
      .eq("is_published", true)
      .in("entity_id", ids)]);
    if (error && contentError) return destinations;
    const grouped = new Map<string, Array<Record<string, unknown>>>();
    for (const row of (data ?? []) as Array<Record<string, unknown>>) {
      const destinationId = String(row.destination_id ?? "");
      grouped.set(destinationId, [...(grouped.get(destinationId) ?? []), row]);
    }
    const cards = new Map(((contentRows ?? []) as Array<Record<string, unknown>>).map((row) => [String(row.destination_id), row]));
    const translations = new Map(((translationResult.data ?? []) as Array<Record<string, unknown>>).map((row) => [String(row.entity_id), row.payload as DestinationTranslationPayload]));
    return destinations.map((destination) => {
      const rows = grouped.get(destination.id);
      const card = cards.get(destination.id);
      const translated = translations.get(destination.id);
      const curated = card ? null : getVillageTranslation(destination.id, locale);
      const managedTitle = card?.card_title ? String(card.card_title) : destination.name;
      const managedDescription = card?.card_description ? String(card.card_description) : destination.shortDescription;
      const staticFallback = getDestinationTranslation({ ...destination, name: managedTitle, shortDescription: managedDescription }, locale);
      return {
        ...destination,
        name: curated?.cardTitle ?? translated?.cardTitle ?? staticFallback.name,
        shortDescription: curated?.cardDescription ?? translated?.cardDescription ?? staticFallback.shortDescription,
        media: translated
          ? applyTranslatedMedia(rows?.length ? preferResearchedMedia(normalizeMedia(rows, destination.media), destination) : destination.media, translated)
          : (rows?.length ? preferResearchedMedia(normalizeMedia(rows, destination.media), destination) : destination.media),
      };
    });
  } catch {
    return destinations;
  }
}

export async function getAdminDestinationContent(destination: Destination, client: SupabaseClient) {
  try {
    return await queryContent(client, destination, false);
  } catch {
    return fallbackContent(destination);
  }
}
