import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { embedTexts } from "@/services/chatbot/gemini";
import { retryEmbeddingOnRateLimit } from "@/services/chatbot/embeddingRetry";
import { buildKnowledgeBase } from "@/services/chatbot/knowledge";

export type KnowledgeSyncResult = { indexed: number; embedded: number; removed: number };

export function chatbotContentHash(title: string, content: string) {
  return createHash("sha256").update(`${title}\n${content}`).digest("hex");
}

export async function syncChatbotKnowledge(config: { url: string; serviceRoleKey: string }): Promise<KnowledgeSyncResult> {
  const chunks = await buildKnowledgeBase();
  const admin = createClient(config.url, config.serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: existing, error: listError } = await admin.from("chatbot_documents").select("id,source_key,content_hash");
  if (listError) throw listError;

  const existingHashes = new Map((existing ?? []).map((row) => [String(row.source_key), String(row.content_hash)]));
  const prepared = chunks.map((chunk) => ({ chunk, contentHash: chatbotContentHash(chunk.title, chunk.content) }));
  const changed = prepared.filter(({ chunk, contentHash }) => existingHashes.get(chunk.id) !== contentHash);
  const vectors: number[][] = [];
  const batchSize = 20;
  for (let index = 0; index < changed.length; index += batchSize) {
    const batch = changed.slice(index, index + batchSize);
    vectors.push(...await retryEmbeddingOnRateLimit(() => embedTexts(batch.map(({ chunk }) => `${chunk.title}\n${chunk.content}`))));
  }

  const rows = changed.map(({ chunk, contentHash }, index) => ({
    source_key: chunk.id, source_type: chunk.sourceType, source_id: chunk.sourceId,
    title: chunk.title, content: chunk.content, href: chunk.href, language: chunk.language,
    source_note: chunk.sourceNote ?? null, source_updated_at: chunk.updatedAt ?? null,
    content_hash: contentHash, embedding: JSON.stringify(vectors[index]), is_published: true,
    updated_at: new Date().toISOString(),
  }));
  for (let index = 0; index < rows.length; index += 100) {
    const { error } = await admin.from("chatbot_documents").upsert(rows.slice(index, index + 100), { onConflict: "source_key" });
    if (error) throw error;
  }

  const keys = new Set(prepared.map(({ chunk }) => chunk.id));
  const staleIds = (existing ?? []).filter((row) => !keys.has(String(row.source_key))).map((row) => row.id);
  for (let index = 0; index < staleIds.length; index += 100) {
    const { error } = await admin.from("chatbot_documents").delete().in("id", staleIds.slice(index, index + 100));
    if (error) throw error;
  }
  return { indexed: chunks.length, embedded: changed.length, removed: staleIds.length };
}
