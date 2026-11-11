import { createHash } from "node:crypto";
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { craftDestinationContent, craftHomeCard, craftProductContent, craftStationContent } from "../src/data/craftContent.ts";

nextEnv.loadEnvConfig(process.cwd());
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Missing Supabase configuration.");
const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const mediaFallback = {
  "bo-dau": { id: "bo-dau-cover", url: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1600&q=85", alt: "Bánh truyền thống, ảnh minh họa" },
  "hao-dat": { id: "hao-dat-cover", url: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=1600&q=85", alt: "Lá trà và chén trà, ảnh minh họa" },
};

function check(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`);
  return result.data;
}

function hash(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

for (const [id, locales] of Object.entries(craftDestinationContent)) {
  const vi = locales.vi;
  const existing = check(await client.from("destination_content").select("profile,card_description").eq("destination_id", id).maybeSingle(), `Read ${id}`);
  if (existing && id === "hao-dat" && !existing.profile?.introduction?.[0]?.startsWith("HTX chè Hảo Đạt là một điểm phù hợp")
      && existing.profile?.introduction?.[0] !== vi.profile.introduction[0]) {
    console.log(`${id}: skipped because an editor has customized the content`);
    continue;
  }
  if (existing && id === "bo-dau" && existing.profile?.introduction?.[0] !== vi.profile.introduction[0]) {
    console.log(`${id}: skipped because an editor has customized the content`);
    continue;
  }

  check(await client.from("destination_content").upsert({
    destination_id: id, profile: vi.profile, card_title: vi.cardTitle,
    card_description: vi.cardDescription, is_published: true,
  }), `Save ${id}`);

  let media = check(await client.from("destination_media").select("id,alt,caption").eq("destination_id", id), `Read media ${id}`);
  if (!media.length) {
    const item = mediaFallback[id];
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
    const translated = locales[locale];
    const payload = {
      cardTitle: translated.cardTitle, cardDescription: translated.cardDescription,
      profile: translated.profile,
      mediaText: media.map((item) => ({
        id: item.id,
        alt: locale === "en" ? `${translated.cardTitle}, photograph` : `${translated.cardTitle}, фотография`,
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

for (const [entityType, entityId, locales] of [
  ["station", "craft-products", craftStationContent],
  ["product", "tan-cuong-tea", craftProductContent],
]) {
  const source = { id: entityId, ...locales.vi };
  for (const locale of ["en", "ru"]) {
    const payload = { id: entityId, ...locales[locale] };
    check(await client.from("content_translations").upsert({
      entity_type: entityType, entity_id: entityId, locale, payload,
      source_hash: hash(source), is_published: true, translated_at: new Date().toISOString(),
    }), `Save ${entityId}/${locale}`);
  }
  console.log(`${entityId}: English and Russian translations saved`);
}

const home = check(await client.from("site_content").select("payload").eq("content_key", "home-galleries").maybeSingle(), "Read homepage galleries");
const craftCard = home?.payload?.stations?.find((station) => station.stationId === "craft-products");
if (craftCard?.translations?.vi?.description === "Khám phá sản phẩm địa phương qua nơi tạo ra chúng.") {
  const payload = structuredClone(home.payload);
  const card = payload.stations.find((station) => station.stationId === "craft-products");
  for (const locale of ["vi", "en", "ru"]) card.translations[locale].description = craftHomeCard[locale];
  check(await client.from("site_content").update({ payload }).eq("content_key", "home-galleries"), "Save homepage craft card");
  console.log("Homepage craft card: updated copy; image preserved");
}
