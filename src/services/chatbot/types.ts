export const CHAT_LANGUAGES = ["vi", "en", "fr", "zh", "ja", "ko", "ru"] as const;

export type ChatLanguage = (typeof CHAT_LANGUAGES)[number];
export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface KnowledgeChunk {
  id: string;
  sourceType: "destination" | "journey" | "product" | "region" | "station" | "event";
  sourceId: string;
  title: string;
  content: string;
  href: string;
  language: "vi";
  sourceNote?: string;
  updatedAt?: string;
}

export interface RetrievedChunk extends KnowledgeChunk {
  score: number;
}

export interface ChatSource {
  id: string;
  title: string;
  href: string;
  excerpt: string;
}

export interface ChatJourneySuggestion {
  id: string;
  title: string;
  href: string;
  days: number;
  duration: "half-day" | "1-day" | "2-days" | "3-plus-days";
}

export interface ChatResponse {
  answer: string;
  sources: ChatSource[];
  journeys: ChatJourneySuggestion[];
  suggestions: string[];
  mode: "gemini-rag" | "local-search" | "no-match";
  language: ChatLanguage;
}

