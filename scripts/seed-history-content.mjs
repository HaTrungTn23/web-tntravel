import { createHash } from "node:crypto";
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { historyDestinationContent, historyHomeCard } from "../src/data/historyContent.ts";

nextEnv.loadEnvConfig(process.cwd());
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Missing Supabase configuration.");
const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const check = (result, label) => {
  if (result.error) throw new Error(`${label}: ${result.error.message}`);
  return result.data;
};
const hash = (value) => createHash("sha256").update(JSON.stringify(value)).digest("hex");

for (const [id, locales] of Object.entries(historyDestinationContent)) {
  const vi = locales.vi;
  const existing = check(await client.from("destination_content").select("profile").eq("destination_id", id).maybeSingle(), `Read ${id}`);
  if (existing && existing.profile?.introduction?.[0] !== vi.profile.introduction[0]) {
    console.log(`${id}: editor content preserved`);
    continue;
  }
  check(await client.from("destination_content").upsert({
    destination_id: id, profile: vi.profile, card_title: vi.cardTitle,
    card_description: vi.cardDescription, is_published: true,
  }), `Save ${id}`);

  let media = check(await client.from("destination_media").select("id,alt,caption").eq("destination_id", id), `Read media ${id}`);
  if (!media.length) {
    check(await client.from("destination_media").insert({
      id: "dai-doi-915-cover", destination_id: id, type: "image",
      url: "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=1600&q=85",
      alt: "Không gian lịch sử, ảnh minh họa", is_cover: true, sort_order: 0,
    }), `Save media ${id}`);
    media = [{ id: "dai-doi-915-cover", alt: "Không gian lịch sử, ảnh minh họa", caption: null }];
  }
  const source = {
    cardTitle: vi.cardTitle, cardDescription: vi.cardDescription, profile: vi.profile,
    mediaText: media.map((item) => ({ id: item.id, alt: item.alt, caption: item.caption ?? "" })),
  };
  for (const locale of ["en", "ru"]) {
    const translation = locales[locale];
    const payload = {
      cardTitle: translation.cardTitle, cardDescription: translation.cardDescription,
      profile: translation.profile,
      mediaText: media.map((item) => ({ id: item.id, alt: `${translation.cardTitle}, ${locale === "en" ? "illustrative image" : "иллюстрация"}`, caption: "" })),
    };
    check(await client.from("content_translations").upsert({
      entity_type: "destination", entity_id: id, locale, payload,
      source_hash: hash(source), is_published: true, translated_at: new Date().toISOString(),
    }), `Save ${id}/${locale}`);
  }
  console.log(`${id}: Vietnamese, English and Russian saved; existing media preserved`);
}

const home = check(await client.from("site_content").select("payload").eq("content_key", "home-galleries").maybeSingle(), "Read homepage galleries");
const card = home?.payload?.stations?.find((item) => item.stationId === "history-festival");
if (card?.translations?.vi?.description === "Kho nội dung đang chờ bổ sung dữ liệu nguồn.") {
  const payload = structuredClone(home.payload);
  const target = payload.stations.find((item) => item.stationId === "history-festival");
  for (const locale of ["vi", "en", "ru"]) target.translations[locale].description = historyHomeCard[locale];
  check(await client.from("site_content").update({ payload }).eq("content_key", "home-galleries"), "Save homepage history card");
  console.log("Homepage history card: copy updated; image preserved");
} else {
  console.log("Homepage history card: editor copy preserved");
}
