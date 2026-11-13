import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { embedText, isGeminiConfigured } from "@/services/chatbot/gemini";
import { buildKnowledgeBase, rankKnowledgeLocally } from "@/services/chatbot/knowledge";
import type { RetrievedChunk } from "@/services/chatbot/types";

type MatchRow = {
  id: string; source_type: RetrievedChunk["sourceType"]; source_id: string; title: string; content: string;
  href: string; language: "vi"; source_note: string | null; updated_at: string | null; similarity: number;
};

const PRIMARY_SIMILARITY_THRESHOLD = 0.42;
const FALLBACK_SIMILARITY_THRESHOLD = 0.33;

const PARTY_SIZE_PATTERNS = [
  /(?:cho\s+)?gia\s+\u0111\u00ecnh\s+(?:(?:c\u00f3|g\u1ed3m)\s+)?\d+\s+(?:ng\u01b0\u1eddi|th\u00e0nh\s+vi\u00ean)/giu,
  /(?:for\s+)?(?:a\s+)?(?:family|group|party)\s+(?:of\s+)?\d+\s*(?:people|persons|members)?/giu,
  /(?:pour\s+)?(?:une?\s+)?(?:famille|groupe)\s+(?:de\s+)?\d+\s*(?:personnes|membres)?/giu,
  /(?:\u0434\u043b\u044f\s+)?\u0441\u0435\u043c\u044c(?:\u044f|\u0438|\u044e|\u0435|\u0451\u0439)\s+(?:\u0438\u0437\s+)?\d+\s*(?:\u0447\u0435\u043b\u043e\u0432\u0435\u043a(?:\u0430)?|\u043b\u044e\u0434\u0435\u0439)?/giu,
];

export function buildRetrievalQuery(query: string) {
  const focusedQuery = PARTY_SIZE_PATTERNS.reduce(
    (value, pattern) => value.replace(pattern, " "),
    query.trim(),
  )
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

  return focusedQuery.length >= 2 ? focusedQuery : query.trim();
}

function mapMatches(rows: MatchRow[]): RetrievedChunk[] {
  return rows.map((row) => ({
    id: row.id, sourceType: row.source_type, sourceId: row.source_id, title: row.title,
    content: row.content, href: row.href, language: row.language, sourceNote: row.source_note ?? undefined,
    updatedAt: row.updated_at ?? undefined, score: Number(row.similarity),
  }));
}

async function retrieveFromVectorStore(query: string): Promise<RetrievedChunk[]> {
  const config = getSupabasePublicConfig();
  if (!config || !isGeminiConfigured()) return [];
  const client = createClient(config.url, config.key, { auth: { persistSession: false, autoRefreshToken: false } });

  const match = async (queryEmbedding: number[], similarityThreshold: number) => {
    const { data, error } = await client.rpc("match_chatbot_documents", {
      query_embedding: queryEmbedding,
      match_count: 7,
      similarity_threshold: similarityThreshold,
    });
    if (error) throw error;
    return mapMatches((data ?? []) as MatchRow[]);
  };

  const primaryEmbedding = await embedText(query, "RETRIEVAL_QUERY");
  const primaryMatches = await match(primaryEmbedding, PRIMARY_SIMILARITY_THRESHOLD);
  if (primaryMatches.length) return primaryMatches;

  const focusedQuery = buildRetrievalQuery(query);
  const fallbackEmbedding = focusedQuery === query.trim()
    ? primaryEmbedding
    : await embedText(focusedQuery, "RETRIEVAL_QUERY");
  return match(fallbackEmbedding, FALLBACK_SIMILARITY_THRESHOLD);
}

export async function retrieveKnowledge(query: string) {
  const localMatches = rankKnowledgeLocally(query, await buildKnowledgeBase(), 4);
  try {
    const vectorMatches = await retrieveFromVectorStore(query);
    if (vectorMatches.length) {
      const localIds = new Set(localMatches.map((chunk) => chunk.id));
      return [...localMatches, ...vectorMatches.filter((chunk) => !localIds.has(chunk.id))].slice(0, 7);
    }
  } catch (error) {
    console.warn("Vector retrieval unavailable; using local search.", error instanceof Error ? error.message : error);
  }
  return localMatches;
}

