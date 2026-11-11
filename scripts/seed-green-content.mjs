import { createHash } from "node:crypto";
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { greenDestinationContent, greenHomeCard, greenStationContent } from "../src/data/greenContent.ts";

nextEnv.loadEnvConfig(process.cwd());
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Missing Supabase configuration.");
const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

const fallbackMedia = {
  "ghenh-che": { id: "ghenh-che-cover", url: "https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=1600&q=85", alt: "Hồ nước xanh, ảnh minh họa" },
  "nui-coc": { id: "nui-coc-cover", url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85", alt: "Mặt hồ giữa thiên nhiên, ảnh minh họa" },
  "ho-ba-be": { id: "ho-ba-be-cover", url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85", alt: "Mặt hồ và núi, ảnh minh họa" },
};

function check(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`);
  return result.data;
}
function hash(value) { return createHash("sha256").update(JSON.stringify(value)).digest("hex"); }

for (const [id, locales] of Object.entries(greenDestinationContent)) {
  const vi = locales.vi;
  const existing = check(await client.from("destination_content").select("profile").eq("destination_id", id).maybeSingle(), `Read ${id}`);
  if (existing && existing.profile?.introduction?.[0] !== vi.profile.introduction[0]) {
    console.log(`${id}: skipped because an editor has customized the content`);
    continue;
  }
  check(await client.from("destination_content").upsert({
    destination_id: id, profile: vi.profile, card_title: vi.cardTitle,
    card_description: vi.cardDescription, is_published: true,
  }), `Save ${id}`);

  let media = check(await client.from("destination_media").select("id,alt,caption").eq("destination_id", id), `Read media ${id}`);
  if (!media.length) {
    const item = fallbackMedia[id];
    check(await client.from("destination_media").insert({
      id: item.id, destination_id: id, type: "image", url: item.url,
      alt: item.alt, is_cover: true, sort_order: 0,
    }), `Save media ${id}`);
    media = [{ id: item.id, alt: item.alt, caption: null }];
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
      mediaText: media.map((item) => ({
        id: item.id,
        alt: locale === "en" ? `${translation.cardTitle}, illustrative image` : `${translation.cardTitle}, иллюстрация`,
        caption: "",
      })),
    };
    check(await client.from("content_translations").upsert({
      entity_type: "destination", entity_id: id, locale, payload,
      source_hash: hash(source), is_published: true, translated_at: new Date().toISOString(),
    }), `Save ${id}/${locale}`);
  }
  console.log(`${id}: Vietnamese, English and Russian saved; existing media preserved`);
}

const stationSource = { id: "green-tourism", ...greenStationContent.vi };
for (const locale of ["en", "ru"]) {
  check(await client.from("content_translations").upsert({
    entity_type: "station", entity_id: "green-tourism", locale,
    payload: { id: "green-tourism", name: locale === "en" ? "Streams & Green Travel" : "Ручьи и зелёный туризм", description: greenHomeCard[locale] },
    source_hash: hash(stationSource), is_published: true, translated_at: new Date().toISOString(),
  }), `Save green station/${locale}`);
}

const home = check(await client.from("site_content").select("payload").eq("content_key", "home-galleries").maybeSingle(), "Read homepage galleries");
const card = home?.payload?.stations?.find((item) => item.stationId === "green-tourism");
if (card?.translations?.vi?.description === "Theo dấu hồ, suối và cảnh quan thiên nhiên.") {
  const payload = structuredClone(home.payload);
  const target = payload.stations.find((item) => item.stationId === "green-tourism");
  for (const locale of ["vi", "en", "ru"]) target.translations[locale].description = greenHomeCard[locale];
  check(await client.from("site_content").update({ payload }).eq("content_key", "home-galleries"), "Save homepage green card");
  console.log("Homepage green card: updated copy; image preserved");
}
