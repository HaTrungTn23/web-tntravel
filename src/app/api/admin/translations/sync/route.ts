import { NextResponse } from "next/server";
import { destinationRepository } from "@/repositories";
import { getAdminSession } from "@/services/admin/auth";
import { getAdminDestinationContent } from "@/services/content/destinationContent";
import {
  buildDestinationTranslationSource,
  getCachedTranslations,
  hashTranslationSource,
  saveTranslation,
  translateDestinationContent,
  translationLocales,
} from "@/services/translation/contentTranslation";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST() {
  const session = await getAdminSession();
  if (!session.user) return NextResponse.json({ error: "Phiên đăng nhập đã hết hạn." }, { status: 401 });
  if (!session.isAdmin || !session.client) return NextResponse.json({ error: "Tài khoản không có quyền đồng bộ bản dịch." }, { status: 403 });

  let translated = 0;
  let skipped = 0;
  const errors: string[] = [];
  for (const destination of destinationRepository.getAll()) {
    try {
      const content = await getAdminDestinationContent(destination, session.client);
      const source = buildDestinationTranslationSource({ cardTitle: content.cardTitle, cardDescription: content.cardDescription, profile: content.profile, media: content.media });
      const sourceHash = hashTranslationSource(source);
      const cached = await getCachedTranslations(session.client, "destination", destination.id);
      const published = content.source === "local" ? true : content.published;
      for (const locale of translationLocales) {
        const existing = cached.get(locale);
        if (existing?.source_hash === sourceHash) {
          await saveTranslation(session.client, { entityType: "destination", entityId: destination.id, locale, payload: existing.payload, sourceHash, published, userId: session.user.id });
          skipped += 1;
          continue;
        }
        const payload = await translateDestinationContent(source, locale);
        await saveTranslation(session.client, { entityType: "destination", entityId: destination.id, locale, payload, sourceHash, published, userId: session.user.id });
        translated += 1;
      }
    } catch (error) {
      errors.push(`${destination.name}: ${error instanceof Error ? error.message : "Không thể dịch"}`);
    }
  }
  return NextResponse.json({ ok: errors.length === 0, translated, skipped, errors });
}
