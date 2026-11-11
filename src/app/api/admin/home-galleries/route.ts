import { NextResponse } from "next/server";
import { getAdminSession } from "@/services/admin/auth";
import { getHomeGalleryContentKey, normalizeHomeGalleryContent } from "@/services/content/homeGalleryContent";
import {
  getCachedTranslations,
  hashTranslationSource,
  saveTranslation,
  translateHomeContent,
  translationLocales,
  type HomeTranslationPayload,
} from "@/services/translation/contentTranslation";

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session.configured || !session.client) return NextResponse.json({ error: "Supabase chưa được cấu hình." }, { status: 503 });
  if (!session.user) return NextResponse.json({ error: "Phiên đăng nhập đã hết hạn." }, { status: 401 });
  if (!session.isAdmin) return NextResponse.json({ error: "Tài khoản không có quyền biên tập." }, { status: 403 });
  const body = await request.json() as Record<string, unknown>;
  const payload = normalizeHomeGalleryContent(body.content);
  const published = Boolean(body.published);
  const contentKey = getHomeGalleryContentKey();
  const source: HomeTranslationPayload = {
    sections: {
      stations: payload.sections.stations.vi,
      destinations: payload.sections.destinations.vi,
    },
    stations: payload.stations.map((station) => ({
      stationId: station.stationId,
      title: station.translations.vi.title,
      description: station.translations.vi.description,
    })),
  };
  const sourceHash = hashTranslationSource(source);
  let translated = 0;
  const translationErrors: string[] = [];
  try {
    const cached = await getCachedTranslations(session.client, "site_content", contentKey);
    for (const locale of translationLocales) {
      try {
        const existing = cached.get(locale);
        const translatedPayload = existing?.source_hash === sourceHash
          ? existing.payload as HomeTranslationPayload
          : await translateHomeContent(source, locale);
        payload.sections.stations[locale] = translatedPayload.sections.stations;
        payload.sections.destinations[locale] = translatedPayload.sections.destinations;
        const stations = new Map(translatedPayload.stations.map((station) => [station.stationId, station]));
        payload.stations = payload.stations.map((station) => {
          const localized = stations.get(station.stationId);
          return localized ? {
            ...station,
            translations: { ...station.translations, [locale]: { title: localized.title, description: localized.description } },
          } : station;
        });
        await saveTranslation(session.client, {
          entityType: "site_content", entityId: contentKey, locale, payload: translatedPayload,
          sourceHash, published, userId: session.user.id,
        });
        if (existing?.source_hash !== sourceHash) translated += 1;
      } catch (error) {
        translationErrors.push(`${locale}: ${error instanceof Error ? error.message : "Không thể dịch"}`);
      }
    }
  } catch (error) {
    translationErrors.push(error instanceof Error ? error.message : "Không thể truy cập kho bản dịch");
  }
  const { error } = await session.client.from("site_content").upsert({
    content_key: contentKey,
    payload,
    is_published: published,
    updated_by: session.user.id,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, published, translated, translationErrors });
}
