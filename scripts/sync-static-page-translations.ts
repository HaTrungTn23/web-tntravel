import nextEnv from "@next/env";
import { createHash } from "node:crypto";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import { journeyRepository, productRepository, regionRepository, stationRepository } from "../src/repositories/index";

nextEnv.loadEnvConfig(process.cwd());
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiKey = process.env.GEMINI_API_KEY;
if (!url || !serviceKey || !geminiKey) throw new Error("Thiếu cấu hình Supabase hoặc Gemini.");
const db = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
const gemini = new GoogleGenAI({ apiKey: geminiKey });
const model = process.env.GEMINI_MODEL?.trim() || "gemini-3.5-flash-lite";
const pause = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));
type EntityType = "journey" | "region" | "product" | "station";
type Entry = { id: string; payload: Record<string, unknown>; hash: string };
const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const fixPlaceNames = (value: unknown): unknown => {
  if (typeof value === "string") return value
    .replaceAll("Синьцзяна", "Танкыонга")
    .replaceAll("Синьцзян", "Танкыонг")
    .replace(/Xinjiang/gi, "Tan Cuong");
  if (Array.isArray(value)) return value.map(fixPlaceNames);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, fixPlaceNames(item)]));
  return value;
};

const journeys = journeyRepository.getAll().map((item) => ({
  id: item.id,
  name: item.name,
  summary: item.summary,
  durationLabel: item.durationLabel ?? "",
  conditions: item.conditions ?? "",
  sourceLabel: item.sourceLabel ?? "",
  days: item.days.map((day) => ({ items: day.items.map((step) => ({ title: step.title ?? "", note: step.note ?? "" })) })),
}));
const regions = regionRepository.getAll().map((item) => ({ id: item.id, name: item.name, description: item.description ?? "" }));
const products = productRepository.getAll().map((item) => ({ id: item.id, name: item.name, shortDescription: item.shortDescription ?? "" }));
const stations = stationRepository.getAll().map((item) => ({ id: item.id, name: item.name, description: item.description }));
const sources: Record<EntityType, Array<Record<string, unknown> & { id: string }>> = { journey: journeys, region: regions, product: products, station: stations };

async function translateBatch(batch: Entry[], locale: "en" | "ru") {
  const source = batch.map((item) => item.payload);
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await pause(6000);
      const response = await gemini.models.generateContent({
        model,
        contents: JSON.stringify({ items: source }),
        config: {
          systemInstruction: `Translate every user-facing Vietnamese string into ${locale === "en" ? "English" : "Russian"}. Return JSON with exactly the same keys, IDs, arrays, object structure and item order. Keep proper names, numbers and factual caveats. Tân Cương is a Vietnamese place name: Tan Cuong in English, Танкыонг in Russian. Never use Xinjiang or Синьцзян. Do not invent or summarize. Empty strings stay empty.`,
          temperature: 0.1,
          maxOutputTokens: 16384,
          responseMimeType: "application/json",
        },
      });
      const result = JSON.parse(response.text ?? "") as { items?: Array<Record<string, unknown>> } | Array<Record<string, unknown>>;
      const translatedItems = fixPlaceNames(Array.isArray(result) ? result : result.items) as Array<Record<string, unknown>> | undefined;
      if (!Array.isArray(translatedItems) || translatedItems.length !== source.length) throw new Error(`Unexpected translation structure for ${batch.map((item) => item.id).join(", ")}: ${JSON.stringify(result).slice(0, 160)}`);
      for (let index = 0; index < batch.length; index++) {
        const translated = translatedItems[index];
        if (translated?.id !== source[index].id || typeof translated.name !== "string") throw new Error("Translation item mismatch.");
        if ("days" in source[index]) {
          const sourceDays = source[index].days as Array<{ items: unknown[] }>;
          const translatedDays = translated.days as Array<{ items: unknown[] }> | undefined;
          if (!Array.isArray(translatedDays) || translatedDays.length !== sourceDays.length || translatedDays.some((day, dayIndex) => !Array.isArray(day.items) || day.items.length !== sourceDays[dayIndex].items.length)) throw new Error("Translated schedule is incomplete.");
        }
      }
      return translatedItems;
    } catch (error) {
      if (attempt === 2) throw error;
      await pause(String(error).includes("429") ? 60000 : 3000 * (attempt + 1));
    }
  }
  throw new Error("Translation failed.");
}

let translated = 0;
let skipped = 0;
for (const entityType of ["journey", "region", "product", "station"] as const) {
  const entries = sources[entityType].map((payload) => ({ id: payload.id, payload, hash: hash(payload) }));
  for (const locale of ["en", "ru"] as const) {
    const { data, error } = await db.from("content_translations")
      .select("entity_id,source_hash")
      .eq("entity_type", entityType).eq("locale", locale);
    if (error) throw error;
    const existing = new Map((data ?? []).map((row) => [row.entity_id, row.source_hash]));
    const pending = entries.filter((entry) => existing.get(entry.id) !== entry.hash);
    skipped += entries.length - pending.length;
    for (let index = 0; index < pending.length; index++) {
      const batch = pending.slice(index, index + 1);
      const translations = await translateBatch(batch, locale);
      for (let offset = 0; offset < batch.length; offset++) {
        const entry = batch[offset];
        const { error: saveError } = await db.from("content_translations").upsert({
          entity_type: entityType,
          entity_id: entry.id,
          locale,
          payload: translations[offset],
          source_hash: entry.hash,
          is_published: true,
          translated_at: new Date().toISOString(),
        });
        if (saveError) throw saveError;
        translated++;
        console.log(`Translated ${entityType} ${entry.id} ${locale}`);
      }
    }
  }
}
console.log(JSON.stringify({ translated, skipped }));
