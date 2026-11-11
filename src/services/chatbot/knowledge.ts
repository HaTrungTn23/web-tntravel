import { createClient } from "@supabase/supabase-js";
import type { DestinationProfile } from "@/data/destinationProfiles";
import type { Journey } from "@/domain/models";
import { destinationProfiles } from "@/data/destinationProfiles";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { destinationRepository, journeyRepository, productRepository, regionRepository, stationRepository } from "@/repositories";
import type { KnowledgeChunk } from "@/services/chatbot/types";
import { festivalCopy, festivalPath, type FestivalSession } from "@/data/festival2026";
import { getPublishedFestivalContent, type FestivalContent } from "@/services/content/festivalContent";

type ManagedProfileRow = {
  destination_id: string;
  profile: DestinationProfile;
  updated_at: string | null;
};

const compact = (items: Array<string | undefined>) => items.filter((item): item is string => Boolean(item?.trim()));

async function getPublishedProfiles() {
  const rows = new Map<string, ManagedProfileRow>();
  const config = getSupabasePublicConfig();
  if (!config) return rows;
  try {
    const client = createClient(config.url, config.key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await client
      .from("destination_content")
      .select("destination_id,profile,updated_at")
      .eq("is_published", true);
    if (error) return rows;
    for (const row of (data ?? []) as ManagedProfileRow[]) rows.set(row.destination_id, row);
  } catch {
    return rows;
  }
  return rows;
}

function profileSections(profile: DestinationProfile) {
  return [
    ["Giới thiệu", profile.introduction],
    ["Vì sao nên khám phá", profile.reasons],
    ["Câu chuyện và đặc trưng", profile.highlights],
    ["Hoạt động tham quan", profile.activities],
    ["Ẩm thực, sản phẩm và văn hóa", profile.localCulture ?? []],
    ["Thời điểm phù hợp", profile.bestTime],
    ["Phù hợp với ai", profile.audience],
    ["Vị trí và điểm kết hợp", profile.locationAndConnections],
  ] as const;
}

function festivalDate(day: FestivalSession["day"]) {
  if (day === "all") return "Trong suốt Festival (30/10–07/11/2026)";
  return `${day}/${day >= 30 ? "10" : "11"}/2026`;
}

function festivalSessionLine(session: FestivalSession) {
  return `${festivalDate(session.day)}${session.time ? `, ${session.time}` : ""}: ${session.title.vi}${session.venue.vi ? ` — ${session.venue.vi}` : ""}.`;
}

export function buildFestivalKnowledgeChunks(content: FestivalContent, updatedAt?: string): KnowledgeChunk[] {
  const base = {
    sourceType: "event" as const,
    sourceId: "festival-tea-2026",
    href: festivalPath,
    language: "vi" as const,
    sourceNote: festivalCopy.vi.updateNote,
    updatedAt,
  };
  const groups = [
    ["all", 30, 31],
    [1, 2, 3],
    [4, 5, 6, 7],
  ] as Array<Array<FestivalSession["day"]>>;
  const schedule = groups.flatMap((days, index) => {
    const sessions = content.sessions.filter((session) => days.includes(session.day));
    if (!sessions.length) return [];
    return [{
      ...base,
      id: `event:festival-tea-2026:schedule-${index + 1}`,
      title: `Festival Trà Thái Nguyên 2026: lịch hoạt động ${days.map(festivalDate).join(", ")}`,
      content: sessions.map(festivalSessionLine).join("\n"),
    }];
  });
  return [{
    ...base,
    id: "event:festival-tea-2026:overview",
    title: `${festivalCopy.vi.title} (Festival Chè Thái Nguyên 2026)`,
    content: [
      content.intro.vi,
      `Thời gian: ${festivalCopy.vi.date}.`,
      `Chủ đề: ${festivalCopy.vi.theme}.`,
      `Chương trình diễn ra tại khu vực trung tâm Thái Nguyên và một số vùng chè, địa điểm liên quan trong tỉnh.`,
      festivalCopy.vi.updateNote,
    ].join("\n"),
  }, ...schedule];
}

export function buildJourneyKnowledgeChunk(journey: Journey): KnowledgeChunk {
  const schedule = journey.days.flatMap((day) => day.items.map((item) => {
    const destination = item.destinationId ? destinationRepository.getById(item.destinationId) : undefined;
    return `Ngày ${day.day}${item.startTime ? ` lúc ${item.startTime}` : ""}: ${destination?.name ?? item.title ?? "Điểm dừng"}${item.note ? `. ${item.note}` : ""}`;
  }));
  return {
    id: `journey:${journey.id}`, sourceType: "journey", sourceId: journey.id,
    title: `Lịch trình: ${journey.name}`,
    content: compact([
      journey.summary,
      `Thời lượng: ${journey.durationLabel ?? journey.duration}.`,
      `Chủ đề: ${journey.interests.join(", ")}.`,
      ...schedule,
      journey.conditions ? `Điều kiện cần xác nhận: ${journey.conditions}` : undefined,
      journey.sourceLabel ? `Nguồn: ${journey.sourceLabel}` : undefined,
    ]).join("\n"),
    href: `/journeys/${journey.slug}`, language: "vi", sourceNote: journey.sourceLabel,
  };
}

export async function buildKnowledgeBase(): Promise<KnowledgeChunk[]> {
  const [managed, festival] = await Promise.all([getPublishedProfiles(), getPublishedFestivalContent()]);
  const chunks: KnowledgeChunk[] = [];

  for (const destination of destinationRepository.getAll()) {
    const row = managed.get(destination.id);
    const profile = row?.profile ?? destinationProfiles[destination.id];
    const href = `/destinations/${destination.slug}`;
    if (profile) {
      for (const [section, paragraphs] of profileSections(profile)) {
        if (!paragraphs.length) continue;
        chunks.push({
          id: `destination:${destination.id}:${section}`,
          sourceType: "destination",
          sourceId: destination.id,
          title: `${destination.name}: ${section}`,
          content: compact([
            profile.tagline,
            destination.shortDescription,
            ...paragraphs,
            `Mùa phù hợp: ${destination.seasons.join(", ")}.`,
          ]).join("\n"),
          href,
          language: "vi",
          sourceNote: profile.sourceNote,
          updatedAt: row?.updated_at ?? undefined,
        });
      }
    } else {
      chunks.push({
        id: `destination:${destination.id}:overview`, sourceType: "destination", sourceId: destination.id,
        title: destination.name, content: compact([destination.shortDescription, destination.story]).join("\n"),
        href, language: "vi",
      });
    }
  }

  for (const journey of journeyRepository.getAll()) {
    chunks.push(buildJourneyKnowledgeChunk(journey));
  }

  for (const product of productRepository.getAll()) {
    chunks.push({
      id: `product:${product.id}`, sourceType: "product", sourceId: product.id,
      title: `Đặc sản và sản phẩm: ${product.name}`,
      content: compact([product.shortDescription, `Điểm liên quan: ${product.destinationIds.map((id) => destinationRepository.getById(id)?.name).filter(Boolean).join(", ")}.`]).join("\n"),
      href: `/products/${product.slug}`, language: "vi",
    });
  }

  for (const region of regionRepository.getAll()) {
    chunks.push({
      id: `region:${region.id}`, sourceType: "region", sourceId: region.id, title: `Khu vực: ${region.name}`,
      content: compact([region.description, `Điểm đến: ${region.destinationIds.map((id) => destinationRepository.getById(id)?.name).filter(Boolean).join(", ")}.`]).join("\n"),
      href: `/regions/${region.slug}`, language: "vi",
    });
  }

  for (const station of stationRepository.getAll()) {
    chunks.push({
      id: `station:${station.id}`, sourceType: "station", sourceId: station.id, title: `Chủ đề: ${station.name}`,
      content: compact([station.description, `Điểm đến: ${station.destinationIds.map((id) => destinationRepository.getById(id)?.name).filter(Boolean).join(", ")}.`]).join("\n"),
      href: `/stations/${station.slug}`, language: "vi",
    });
  }
  chunks.push(...buildFestivalKnowledgeChunks(festival.content, festival.updatedAt));
  return chunks;
}

export function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/(\p{Script=Latin})\p{M}+/gu, "$1")
    .normalize("NFC")
    .toLocaleLowerCase()
    .replace(/\u0111/g, "d")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function rankKnowledgeLocally(query: string, chunks: KnowledgeChunk[], limit = 6) {
  const normalizedQuery = normalizeSearchText(query);
  const tokens = [...new Set(normalizedQuery.split(" ").filter((token) => token.length > 2))];
  return chunks.map((chunk) => {
    const title = normalizeSearchText(chunk.title);
    const content = normalizeSearchText(chunk.content);
    let score = title.includes(normalizedQuery) ? 8 : 0;
    for (const token of tokens) {
      if (title.includes(token)) score += 3;
      if (content.includes(token)) score += 1;
    }
    return { ...chunk, score };
  }).filter((chunk) => chunk.score > 0).sort((a, b) => b.score - a.score).slice(0, limit);
}

