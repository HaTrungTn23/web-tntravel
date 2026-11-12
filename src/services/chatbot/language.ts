import type { ChatLanguage } from "@/services/chatbot/types";

const LANGUAGE_WORDS: Partial<Record<ChatLanguage, ReadonlySet<string>>> = {
  vi: new Set([
    "ai", "bao", "bạn", "biet", "biết", "có", "cho", "chè", "chào", "của", "đâu", "được",
    "gi", "gì", "giới", "hãy", "không", "là", "mình", "nao", "nào", "những", "nguyên",
    "o", "ở", "pham", "phẩm", "san", "sản", "tại", "thái", "toi", "tôi", "trà", "về",
  ]),
  en: new Set([
    "about", "are", "available", "can", "could", "do", "does", "english", "for", "hello",
    "how", "in", "is", "me", "of", "please", "products", "recommend", "show", "tea", "tell",
    "the", "there", "what", "when", "where", "which", "why", "you",
  ]),
  fr: new Set([
    "bonjour", "dans", "de", "des", "disponible", "disponibles", "du", "est", "les", "où",
    "pouvez", "produit", "produits", "quel", "quelle", "quelles", "quels", "quoi", "recommandez",
    "sont", "thé", "une", "vous",
  ]),
};

const SCRIPT_PATTERNS: Array<[ChatLanguage, RegExp]> = [
  ["ru", /[\u0400-\u052f]/u],
  ["ko", /[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af]/u],
  ["ja", /[\u3040-\u30ff\u31f0-\u31ff]/u],
  ["zh", /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/u],
];

/**
 * Detects the language of the latest question. The UI language remains the
 * fallback for short or ambiguous input such as a place or product name.
 */
export function detectChatLanguage(question: string, fallback: ChatLanguage): ChatLanguage {
  for (const [language, pattern] of SCRIPT_PATTERNS) {
    if (pattern.test(question)) return language;
  }

  const tokens = question.toLocaleLowerCase().match(/[\p{L}]+/gu) ?? [];
  let best: { language: ChatLanguage; score: number } | undefined;
  let tied = false;

  for (const [language, words] of Object.entries(LANGUAGE_WORDS) as Array<[ChatLanguage, ReadonlySet<string>]>) {
    const score = tokens.reduce((total, token) => total + Number(words.has(token)), 0);
    if (!best || score > best.score) {
      best = { language, score };
      tied = false;
    } else if (score === best.score) {
      tied = true;
    }
  }

  return best && best.score > 0 && !tied ? best.language : fallback;
}
