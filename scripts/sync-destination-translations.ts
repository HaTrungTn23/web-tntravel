import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { destinationRepository } from "../src/repositories/index";
import { getAdminDestinationContent } from "../src/services/content/destinationContent";
import {
  buildDestinationTranslationSource,
  getCachedTranslations,
  hashTranslationSource,
  translateDestinationContent,
  translationLocales,
} from "../src/services/translation/contentTranslation";

nextEnv.loadEnvConfig(process.cwd());
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Thiếu cấu hình Supabase.");
const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const limit = Number(process.argv.find((arg) => arg.startsWith("--limit="))?.split("=")[1] ?? Infinity);
let translated = 0;
let skipped = 0;
let failed = 0;
const pause = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

for (const destination of destinationRepository.getAll()) {
  const content = await getAdminDestinationContent(destination, client);
  const source = buildDestinationTranslationSource(content);
  const sourceHash = hashTranslationSource(source);
  const cached = await getCachedTranslations(client, "destination", destination.id);
  for (const locale of translationLocales) {
    if (cached.get(locale)?.source_hash === sourceHash) { skipped++; continue; }
    if (translated >= limit) break;
    try {
      let payload: Awaited<ReturnType<typeof translateDestinationContent>> | undefined;
      for (let attempt = 0; attempt < 3; attempt++) {
        await pause(6000);
        try { payload = await translateDestinationContent(source, locale); break; }
        catch (error) {
          if (attempt === 2) throw error;
          await pause(String(error).includes("429") ? 60000 : 3000);
        }
      }
      if (!payload) throw new Error("Gemini did not return a translation.");
      const { error } = await client.from("content_translations").upsert({
        entity_type: "destination",
        entity_id: destination.id,
        locale,
        payload,
        source_hash: sourceHash,
        is_published: content.source === "local" || content.published,
        translated_at: new Date().toISOString(),
      });
      if (error) throw error;
      translated++;
      console.log(`Translated ${destination.id} ${locale}`);
    } catch (error) {
      failed++;
      console.error(`Failed ${destination.id} ${locale}: ${String(error).includes("429") ? "Gemini rate limit" : error instanceof Error ? error.message.slice(0, 180) : String(error).slice(0, 180)}`);
    }
  }
  if (translated >= limit) break;
}
console.log(JSON.stringify({ translated, skipped, failed }));
if (failed) process.exitCode = 1;
