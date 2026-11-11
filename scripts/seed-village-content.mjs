import { createHash } from "node:crypto";
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { villageContent } from "../src/data/villageContent.ts";

nextEnv.loadEnvConfig(process.cwd());

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) throw new Error("Missing Supabase URL or service role key.");

const client = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
const imageUrl = "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=85";
const mountainUrl = "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=85";
const fallbackMedia = {
  "ban-ten": { id: "ban-ten-cover", url: mountainUrl, alt: "Cảnh quan miền núi, ảnh minh họa" },
  "khuan-bang": { id: "khuan-bang-cover", url: imageUrl, alt: "Không gian bản làng, ảnh minh họa" },
  "thai-hai": { id: "thai-hai-cover", url: imageUrl, alt: "Không gian làng quê, ảnh minh họa" },
  "xom-mo-ga": { id: "xom-mo-ga-cover", url: imageUrl, alt: "Không gian bản làng, ảnh minh họa" },
};

function must(result, context) {
  if (result.error) throw new Error(`${context}: ${result.error.message}`);
  return result.data;
}

for (const [id, locales] of Object.entries(villageContent)) {
  const vi = locales.vi;
  const existing = must(await client.from("destination_content").select("profile").eq("destination_id", id).maybeSingle(), `Read ${id}`);
  if (existing && JSON.stringify(existing.profile) !== JSON.stringify(vi.profile)) {
    // JSONB key order is normalized by PostgreSQL; compare the actual field values.
    const same = Object.keys(vi.profile).every((key) => JSON.stringify(existing.profile[key]) === JSON.stringify(vi.profile[key]));
    if (!same) {
      console.log(`${id}: skipped because an editor has customized the profile`);
      continue;
    }
  }

  must(await client.from("destination_content").upsert({
    destination_id: id, profile: vi.profile, card_title: vi.cardTitle,
    card_description: vi.cardDescription, is_published: true,
  }), `Save ${id}`);

  const mediaRows = must(await client.from("destination_media").select("id,alt,caption").eq("destination_id", id), `Read media ${id}`);
  let media = mediaRows;
  if (!media.length) {
    const fallback = fallbackMedia[id];
    must(await client.from("destination_media").insert({
      id: fallback.id, destination_id: id, type: "image", url: fallback.url,
      alt: fallback.alt, is_cover: true, sort_order: 0,
    }), `Save media ${id}`);
    media = [{ id: fallback.id, alt: fallback.alt, caption: null }];
  }

  const source = {
    cardTitle: vi.cardTitle, cardDescription: vi.cardDescription, profile: vi.profile,
    mediaText: media.map((item) => ({ id: item.id, alt: item.alt, caption: item.caption ?? "" })),
  };
  const sourceHash = createHash("sha256").update(JSON.stringify(source)).digest("hex");
  for (const locale of ["en", "ru"]) {
    const translated = locales[locale];
    const payload = {
      cardTitle: translated.cardTitle, cardDescription: translated.cardDescription,
      profile: translated.profile,
      mediaText: media.map((item) => ({
        id: item.id,
        alt: locale === "en" ? `${translated.cardTitle}, illustrative image` : `${translated.cardTitle}, иллюстрация`,
        caption: "",
      })),
    };
    must(await client.from("content_translations").upsert({
      entity_type: "destination", entity_id: id, locale, payload,
      source_hash: sourceHash, is_published: true, translated_at: new Date().toISOString(),
    }), `Save ${id}/${locale}`);
  }
  console.log(`${id}: Vietnamese, English and Russian saved`);
}
