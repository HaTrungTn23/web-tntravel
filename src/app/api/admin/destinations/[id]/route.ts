import { NextResponse } from "next/server";
import type { Media } from "@/domain/models";
import type { DestinationProfile } from "@/data/destinationProfiles";
import { getYouTubeId } from "@/lib/youtube";
import { destinationRepository } from "@/repositories";
import { getAdminSession } from "@/services/admin/auth";
import {
  buildDestinationTranslationSource,
  getCachedTranslations,
  hashTranslationSource,
  saveTranslation,
  translateDestinationContent,
  translationLocales,
} from "@/services/translation/contentTranslation";

const stringArray = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0).map((item) => item.trim()).slice(0, 30) : [];
const text = (value: unknown, fallback = "") => typeof value === "string" ? value.trim() : fallback;

function sanitizeProfile(value: unknown): DestinationProfile | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, unknown>;
  const profile = {
    tagline: text(source.tagline), introduction: stringArray(source.introduction), reasons: stringArray(source.reasons),
    highlights: stringArray(source.highlights), activities: stringArray(source.activities), localCulture: stringArray(source.localCulture),
    bestTime: stringArray(source.bestTime), audience: stringArray(source.audience), locationAndConnections: stringArray(source.locationAndConnections),
    sourceNote: text(source.sourceNote, "Nội dung do ban biên tập cập nhật."),
  };
  return profile.tagline && profile.introduction.length ? profile : null;
}

function sanitizeMedia(value: unknown): Media[] {
  if (!Array.isArray(value)) return [];
  let coverAssigned = false;
  const media = value.slice(0, 40).flatMap((item, index) => {
    if (!item || typeof item !== "object") return [];
    const source = item as Record<string, unknown>;
    const type = source.type === "youtube" ? "youtube" : "image";
    const url = text(source.url);
    if (!url || (type === "youtube" && !getYouTubeId(url))) return [];
    const isCover = type === "image" && Boolean(source.isCover) && !coverAssigned;
    if (isCover) coverAssigned = true;
    return [{ id: text(source.id, crypto.randomUUID()), type, url, alt: text(source.alt), thumbnailUrl: text(source.thumbnailUrl) || undefined, caption: text(source.caption) || undefined, isCover, order: index } satisfies Media];
  });
  if (!coverAssigned) { const firstImage = media.find((item) => item.type === "image"); if (firstImage) firstImage.isCover = true; }
  return media;
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const destination = destinationRepository.getById(id);
  if (!destination) return NextResponse.json({ error: "Không tìm thấy địa điểm." }, { status: 404 });
  const session = await getAdminSession();
  if (!session.configured || !session.client) return NextResponse.json({ error: "Supabase chưa được cấu hình." }, { status: 503 });
  if (!session.user) return NextResponse.json({ error: "Phiên đăng nhập đã hết hạn." }, { status: 401 });
  if (!session.isAdmin) return NextResponse.json({ error: "Tài khoản không có quyền biên tập." }, { status: 403 });
  const body = await request.json() as Record<string, unknown>;
  const profile = sanitizeProfile(body.profile);
  if (!profile) return NextResponse.json({ error: "Cần có tiêu đề ngắn và nội dung giới thiệu." }, { status: 400 });
  const media = sanitizeMedia(body.media);
  const published = Boolean(body.published);
  const cardTitle = text(body.cardTitle, destination.name).slice(0, 120);
  const cardDescription = text(body.cardDescription, destination.shortDescription).slice(0, 500);

  const { error: contentError } = await session.client.from("destination_content").upsert({ destination_id: id, profile, card_title: cardTitle, card_description: cardDescription, is_published: published, updated_by: session.user.id });
  if (contentError) return NextResponse.json({ error: contentError.message }, { status: 400 });
  const { error: deleteError } = await session.client.from("destination_media").delete().eq("destination_id", id);
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 400 });
  if (media.length) {
    const { error: mediaError } = await session.client.from("destination_media").insert(media.map((item, index) => ({ id: item.id, destination_id: id, type: item.type, url: item.url, thumbnail_url: item.thumbnailUrl ?? null, alt: item.alt, caption: item.caption ?? null, is_cover: Boolean(item.isCover), sort_order: index })));
    if (mediaError) return NextResponse.json({ error: mediaError.message }, { status: 400 });
  }
  const source = buildDestinationTranslationSource({ cardTitle, cardDescription, profile, media });
  const sourceHash = hashTranslationSource(source);
  let translated = 0;
  const translationErrors: string[] = [];
  try {
    const cached = await getCachedTranslations(session.client, "destination", id);
    for (const locale of translationLocales) {
      try {
        const existing = cached.get(locale);
        const payload = existing?.source_hash === sourceHash
          ? existing.payload
          : await translateDestinationContent(source, locale);
        await saveTranslation(session.client, {
          entityType: "destination", entityId: id, locale, payload, sourceHash,
          published, userId: session.user.id,
        });
        if (existing?.source_hash !== sourceHash) translated += 1;
      } catch (error) {
        translationErrors.push(`${locale}: ${error instanceof Error ? error.message : "Không thể dịch"}`);
      }
    }
  } catch (error) {
    translationErrors.push(error instanceof Error ? error.message : "Không thể truy cập kho bản dịch");
  }
  return NextResponse.json({ ok: true, published, translated, translationErrors });
}
