import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { festivalCopy, festivalSessions, type FestivalSession, type LocalText } from "@/data/festival2026";
import { locales } from "@/i18n/config";

export interface FestivalContent {
  heroImage: string;
  highlightImages: string[];
  intro: LocalText;
  sessions: FestivalSession[];
}
export interface ManagedFestivalContent { content: FestivalContent; published: boolean; source: "local" | "supabase"; updatedAt?: string }
export const festivalContentKey = "festival-tea-2026";

export function defaultFestivalContent(): FestivalContent {
  return { heroImage: "/images/festival-2026/doi-che-vo-tranh.jpg", highlightImages: ["/images/festival-2026/khong-gian-tra-tan-cuong.jpg", "/images/festival-2026/doi-che-vo-tranh.jpg", "/images/festival-2026/luong-che-vo-tranh.jpg"], intro: { vi: festivalCopy.vi.intro, en: festivalCopy.en.intro, ru: festivalCopy.ru.intro }, sessions: festivalSessions };
}

const text = (value: unknown, fallback: string, max: number) => typeof value === "string" && value.trim() ? value.trim().slice(0, max) : fallback;
const imageUrl = (value: unknown, fallback: string) => typeof value === "string" && (value.startsWith("/images/") || value.startsWith("https://")) ? value.slice(0, 2000) : fallback;

export function normalizeFestivalContent(value: unknown): FestivalContent {
  const fallback = defaultFestivalContent();
  if (!value || typeof value !== "object") return fallback;
  const row = value as Record<string, unknown>;
  const introRow = row.intro && typeof row.intro === "object" ? row.intro as Record<string, unknown> : {};
  const intro = Object.fromEntries(locales.map((locale) => [locale, text(introRow[locale], fallback.intro[locale], 500)])) as LocalText;
  const rawSessions = Array.isArray(row.sessions) ? row.sessions.slice(0, 60) : fallback.sessions;
  const sessions = rawSessions.flatMap((item, index) => {
    if (!item || typeof item !== "object") return [];
    const entry = item as Record<string, unknown>;
    const day = entry.day === "all" ? "all" : Number(entry.day);
    if (day !== "all" && ![30, 31, 1, 2, 3, 4, 5, 6, 7].includes(day)) return [];
    const titles = entry.title && typeof entry.title === "object" ? entry.title as Record<string, unknown> : {};
    const venues = entry.venue && typeof entry.venue === "object" ? entry.venue as Record<string, unknown> : {};
    const title = Object.fromEntries(locales.map((locale) => [locale, text(titles[locale], "", 180)])) as LocalText;
    const venue = Object.fromEntries(locales.map((locale) => [locale, text(venues[locale], "", 180)])) as LocalText;
    if (!title.vi) return [];
    const source = typeof entry.source === "string" && entry.source.startsWith("https://") ? entry.source.slice(0, 2000) : "";
    const mapQuery = typeof entry.mapQuery === "string" ? entry.mapQuery.slice(0, 180) : "";
    return [{ id: text(entry.id, `session-${index}`, 80), day, time: text(entry.time, "", 60), title, venue, source, mapQuery } satisfies FestivalSession];
  });
  const rawImages = Array.isArray(row.highlightImages) ? row.highlightImages : fallback.highlightImages;
  const highlightImages = fallback.highlightImages.map((defaultImage, index) => imageUrl(rawImages[index], defaultImage));
  return { heroImage: imageUrl(row.heroImage, fallback.heroImage), highlightImages, intro, sessions };
}

async function read(client: SupabaseClient, publishedOnly: boolean): Promise<ManagedFestivalContent> {
  let query = client.from("site_content").select("payload,is_published,updated_at").eq("content_key", festivalContentKey);
  if (publishedOnly) query = query.eq("is_published", true);
  const { data, error } = await query.maybeSingle();
  if (error || !data) return { content: defaultFestivalContent(), published: publishedOnly, source: "local" };
  return { content: normalizeFestivalContent(data.payload), published: Boolean(data.is_published), source: "supabase", updatedAt: data.updated_at ? String(data.updated_at) : undefined };
}

export async function getPublishedFestivalContent(): Promise<ManagedFestivalContent> {
  const config = getSupabasePublicConfig();
  if (!config) return { content: defaultFestivalContent(), published: true, source: "local" };
  try { return await read(createClient(config.url, config.key, { auth: { persistSession: false, autoRefreshToken: false } }), true); }
  catch { return { content: defaultFestivalContent(), published: true, source: "local" }; }
}

export async function getAdminFestivalContent(client: SupabaseClient): Promise<ManagedFestivalContent> {
  try { return await read(client, false); }
  catch { return { content: defaultFestivalContent(), published: false, source: "local" }; }
}
