import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Station } from "@/domain/models";
import { locales, type Locale } from "@/i18n/config";
import { translate } from "@/i18n/messages";
import { stationRepository } from "@/repositories";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { craftHomeCard } from "@/data/craftContent";
import { greenHomeCard } from "@/data/greenContent";
import { historyHomeCard } from "@/data/historyContent";
import { teaHomeCard } from "@/data/teaContent";

export interface HomeGallerySectionText { titleA: string; titleB: string; body: string }
export interface HomeStationText { title: string; description: string }
export interface HomeHeroText { kicker: string; titleA: string; titleB: string; body: string }
export interface HomeHeroImage { id: string; url: string; alt: string; translations: LocalizedContent<HomeHeroText> }
export type LocalizedContent<T> = Record<Locale, T>;
export interface HomeStationCardContent {
  stationId: string;
  translations: LocalizedContent<HomeStationText>;
  imageUrl: string;
  imageAlt: string;
  sortOrder: number;
}
export interface HomeGalleryContent {
  heroImages: HomeHeroImage[];
  sections: {
    stations: LocalizedContent<HomeGallerySectionText>;
    destinations: LocalizedContent<HomeGallerySectionText>;
  };
  stations: HomeStationCardContent[];
}
export interface ManagedHomeGalleryContent {
  content: HomeGalleryContent;
  published: boolean;
  source: "local" | "supabase";
  updatedAt?: string;
}
export interface ResolvedHomeStationCard extends Station { title: string; description: string; imageUrl: string; imageAlt: string }

const contentKey = "home-galleries";
const cleanText = (value: unknown, fallback: string, max = 500) => typeof value === "string" && value.trim() ? value.trim().slice(0, max) : fallback;
const firstHeroText = Object.fromEntries(locales.map((locale) => [locale, {
  kicker: translate(locale, "home.hero.kicker"),
  titleA: translate(locale, "home.hero.titleA"),
  titleB: translate(locale, "home.hero.titleB"),
  body: translate(locale, "home.hero.body"),
}])) as LocalizedContent<HomeHeroText>;
const genericHeroText: LocalizedContent<HomeHeroText> = {
  vi: { kicker: "Thái Nguyên theo nhịp riêng", titleA: "Khám phá", titleB: "Thái Nguyên", body: "Mỗi góc nhìn mở ra một cách cảm nhận vùng đất này. Hãy chọn điểm dừng chân phù hợp với bạn." },
  en: { kicker: "Thai Nguyen at your own pace", titleA: "Explore", titleB: "Thai Nguyen", body: "Each view offers a new way to experience this place. Find the stop that feels right for you." },
  ru: { kicker: "Тхайнгуен в вашем ритме", titleA: "Откройте", titleB: "Тхайнгуен", body: "Каждый ракурс помогает по-новому почувствовать этот край. Выберите остановку по душе." },
};
const teaHillsHeroText: LocalizedContent<HomeHeroText> = {
  vi: { kicker: "Từ đồi chè đến chén trà", titleA: "Đi giữa", titleB: "vùng trà", body: "Theo những luống chè xanh, gặp người làm trà và cảm nhận hương vị được vun trồng qua nhiều thế hệ." },
  en: { kicker: "From tea hills to your cup", titleA: "Walk through", titleB: "tea country", body: "Follow the green tea rows, meet local makers and discover flavours shaped across generations." },
  ru: { kicker: "От чайных холмов до чашки", titleA: "Среди", titleB: "чайных холмов", body: "Пройдите вдоль зелёных чайных рядов, познакомьтесь с мастерами и откройте вкус, созданный поколениями." },
};
const teaCultureHeroText: LocalizedContent<HomeHeroText> = {
  vi: { kicker: "Không gian văn hóa trà", titleA: "Gặp gỡ", titleB: "chuyện trà", body: "Bắt đầu từ Tân Cương, lắng nghe câu chuyện của người làm chè và khám phá vị trí của trà trong đời sống địa phương." },
  en: { kicker: "A living tea culture", titleA: "Discover", titleB: "tea stories", body: "Start in Tan Cuong, hear the stories of tea makers and see how tea is woven into local life." },
  ru: { kicker: "Живая чайная культура", titleA: "Истории", titleB: "чая", body: "Начните с Танкыонга, послушайте рассказы чаеводов и узнайте, какое место чай занимает в местной жизни." },
};

export function createGenericHomeHeroTranslations(): LocalizedContent<HomeHeroText> {
  return structuredClone(genericHeroText);
}

export const homeHeroCopyPresets = [
  { id: "tea-hills", label: "Vùng chè", translations: teaHillsHeroText },
  { id: "tea-culture", label: "Văn hóa trà", translations: teaCultureHeroText },
] as const;

export function createDefaultHomeHeroSlides(cover?: { id: string; url: string; alt: string }): HomeHeroImage[] {
  return [
    { id: "tan-cuong-hero", url: cover?.url || "/images/hero-tea-hills.png", alt: cover?.alt || "Vùng trà Tân Cương", translations: structuredClone(firstHeroText) },
  ];
}
const localizedStationDefaults: Record<string, Partial<LocalizedContent<HomeStationText>>> = {
  "tea-culture": {
    en: { title: "Tea culture", description: teaHomeCard.en },
    ru: { title: "Культура чая", description: teaHomeCard.ru },
  },
  village: {
    en: { title: "Village life", description: "Meet local ways of life and discover the stories of each community." },
    ru: { title: "Деревенская жизнь", description: "Познакомьтесь с местным укладом жизни и историями общин." },
  },
  "craft-products": {
    en: { title: "Crafts and local products", description: craftHomeCard.en },
    ru: { title: "Ремёсла и местные продукты", description: craftHomeCard.ru },
  },
  "green-tourism": {
    en: { title: "Streams and green travel", description: greenHomeCard.en },
    ru: { title: "Водоёмы и экотуризм", description: greenHomeCard.ru },
  },
  "history-festival": {
    en: { title: "History and festivals", description: historyHomeCard.en },
    ru: { title: "История и фестивали", description: historyHomeCard.ru },
  },
  "journey-design": {
    en: { title: "Trip planner", description: "Turn your interests into a route made for exploration." },
    ru: { title: "Планирование маршрута", description: "Превратите свои интересы в маршрут для путешествия." },
  },
};

export function createDefaultHomeGalleryContent(): HomeGalleryContent {
  const sections = {
    stations: {} as LocalizedContent<HomeGallerySectionText>,
    destinations: {} as LocalizedContent<HomeGallerySectionText>,
  };
  for (const locale of locales) {
    sections.stations[locale] = {
      titleA: translate(locale, "home.stations.titleA"),
      titleB: translate(locale, "home.stations.titleB"),
      body: translate(locale, "home.stations.body"),
    };
    sections.destinations[locale] = {
      titleA: translate(locale, "home.connected.titleA"),
      titleB: translate(locale, "home.connected.titleB"),
      body: `${translate(locale, "home.connected.count")} ${translate(locale, "home.connected.hint")}`,
    };
  }
  return {
    heroImages: [],
    sections,
    stations: stationRepository.getAll().map((station, index) => ({
      stationId: station.id,
      translations: Object.fromEntries(locales.map((locale) => [locale, localizedStationDefaults[station.id]?.[locale] ?? { title: station.name, description: station.description }])) as LocalizedContent<HomeStationText>,
      imageUrl: "",
      imageAlt: station.name,
      sortOrder: index,
    })),
  };
}

export function normalizeHomeGalleryContent(value: unknown): HomeGalleryContent {
  const fallback = createDefaultHomeGalleryContent();
  if (!value || typeof value !== "object") return fallback;
  const source = value as Record<string, unknown>;
  const heroImages = (Array.isArray(source.heroImages) ? source.heroImages : []).slice(0, 12).flatMap((item, index) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Record<string, unknown>;
    const url = typeof row.url === "string" ? row.url.trim().slice(0, 2000) : "";
    if (!(url.startsWith("/images/") || url.startsWith("https://"))) return [];
    const sourceTranslations = row.translations && typeof row.translations === "object" ? row.translations as Record<string, unknown> : {};
    const fallbackText = index === 0 ? firstHeroText : genericHeroText;
    const translations = {} as LocalizedContent<HomeHeroText>;
    for (const locale of locales) {
      const localized = sourceTranslations[locale] && typeof sourceTranslations[locale] === "object" ? sourceTranslations[locale] as Record<string, unknown> : {};
      translations[locale] = {
        kicker: cleanText(localized.kicker, fallbackText[locale].kicker, 120),
        titleA: cleanText(localized.titleA, fallbackText[locale].titleA, 120),
        titleB: cleanText(localized.titleB, fallbackText[locale].titleB, 120),
        body: cleanText(localized.body, fallbackText[locale].body, 500),
      };
    }
    return [{
      id: cleanText(row.id, `hero-${index}`, 80),
      url,
      alt: cleanText(row.alt, "Phong cảnh Thái Nguyên", 240),
      translations,
    } satisfies HomeHeroImage];
  });
  const sourceSections = source.sections && typeof source.sections === "object" ? source.sections as Record<string, unknown> : {};
  const sections = structuredClone(fallback.sections);
  for (const sectionId of ["stations", "destinations"] as const) {
    const section = sourceSections[sectionId] && typeof sourceSections[sectionId] === "object" ? sourceSections[sectionId] as Record<string, unknown> : {};
    for (const locale of locales) {
      const localized = section[locale] && typeof section[locale] === "object" ? section[locale] as Record<string, unknown> : {};
      sections[sectionId][locale] = {
        titleA: cleanText(localized.titleA, fallback.sections[sectionId][locale].titleA, 120),
        titleB: cleanText(localized.titleB, fallback.sections[sectionId][locale].titleB, 120),
        body: cleanText(localized.body, fallback.sections[sectionId][locale].body, 600),
      };
    }
  }
  const sourceStations = Array.isArray(source.stations) ? source.stations : [];
  const stationRows = new Map(sourceStations.flatMap((item) => item && typeof item === "object" && typeof (item as Record<string, unknown>).stationId === "string" ? [[String((item as Record<string, unknown>).stationId), item as Record<string, unknown>] as const] : []));
  const stations = fallback.stations.map((station, index) => {
    const row = stationRows.get(station.stationId) ?? {};
    const sourceTranslations = row.translations && typeof row.translations === "object" ? row.translations as Record<string, unknown> : {};
    const translations = structuredClone(station.translations);
    const sourceVi = sourceTranslations.vi && typeof sourceTranslations.vi === "object" ? sourceTranslations.vi as Record<string, unknown> : {};
    const sourceViTitle = cleanText(sourceVi.title, station.translations.vi.title, 120);
    const sourceViDescription = cleanText(sourceVi.description, station.translations.vi.description, 500);
    for (const locale of locales) {
      const localized = sourceTranslations[locale] && typeof sourceTranslations[locale] === "object" ? sourceTranslations[locale] as Record<string, unknown> : {};
      const rawTitle = typeof localized.title === "string" ? localized.title.trim() : "";
      const rawDescription = typeof localized.description === "string" ? localized.description.trim() : "";
      translations[locale] = {
        title: cleanText(locale !== "vi" && rawTitle === sourceViTitle ? "" : rawTitle, station.translations[locale].title, 120),
        description: cleanText(locale !== "vi" && rawDescription === sourceViDescription ? "" : rawDescription, station.translations[locale].description, 500),
      };
    }
    return {
      stationId: station.stationId,
      translations,
      imageUrl: cleanText(row.imageUrl, "", 2000),
      imageAlt: cleanText(row.imageAlt, station.imageAlt, 240),
      sortOrder: Number.isFinite(Number(row.sortOrder)) ? Number(row.sortOrder) : index,
    };
  }).sort((a, b) => a.sortOrder - b.sortOrder);
  return { heroImages, sections, stations };
}

async function queryHomeGalleryContent(client: SupabaseClient, publishedOnly: boolean): Promise<ManagedHomeGalleryContent> {
  let query = client.from("site_content").select("payload,is_published,updated_at").eq("content_key", contentKey);
  if (publishedOnly) query = query.eq("is_published", true);
  const { data, error } = await query.maybeSingle();
  if (error || !data) return { content: createDefaultHomeGalleryContent(), published: publishedOnly, source: "local" };
  return {
    content: normalizeHomeGalleryContent(data.payload),
    published: Boolean(data.is_published),
    updatedAt: data.updated_at ? String(data.updated_at) : undefined,
    source: "supabase",
  };
}

export async function getPublishedHomeGalleryContent() {
  const config = getSupabasePublicConfig();
  if (!config) return { content: createDefaultHomeGalleryContent(), published: true, source: "local" as const };
  try {
    const client = createClient(config.url, config.key, { auth: { persistSession: false, autoRefreshToken: false } });
    return await queryHomeGalleryContent(client, true);
  } catch {
    return { content: createDefaultHomeGalleryContent(), published: true, source: "local" as const };
  }
}

export async function getAdminHomeGalleryContent(client: SupabaseClient) {
  try { return await queryHomeGalleryContent(client, false); }
  catch { return { content: createDefaultHomeGalleryContent(), published: false, source: "local" as const }; }
}

export function getHomeGalleryContentKey() { return contentKey; }

export function resolveHomeStationCards(content: HomeGalleryContent, locale: Locale): ResolvedHomeStationCard[] {
  const stations = new Map(stationRepository.getAll().map((station) => [station.id, station]));
  return content.stations.flatMap((card) => {
    const station = stations.get(card.stationId);
    if (!station) return [];
    const translated = card.translations[locale] ?? card.translations.vi;
    const imageAlt = locale !== "vi" && card.imageAlt === card.translations.vi.title ? translated.title : card.imageAlt;
    return [{ ...station, title: translated.title, description: translated.description, imageUrl: card.imageUrl, imageAlt }];
  });
}
