import { NextResponse } from "next/server";
import { journeyRepository } from "@/repositories";
import { generateGroundedAnswer, isGeminiConfigured } from "@/services/chatbot/gemini";
import { buildJourneyKnowledgeChunk } from "@/services/chatbot/knowledge";
import { retrieveKnowledge } from "@/services/chatbot/retrieval";
import { suggestJourneys } from "@/services/chatbot/journeySuggestions";
import { CHAT_LANGUAGES, type ChatLanguage, type ChatMessage, type ChatResponse, type RetrievedChunk } from "@/services/chatbot/types";

export const runtime = "nodejs";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 20;
const buckets = new Map<string, { count: number; resetAt: number }>();

const fallbackCopy: Record<ChatLanguage, { noMatch: string; prefix: string; suggestions: string[] }> = {
  vi: { noMatch: "Mình chưa tìm thấy thông tin phù hợp. Bạn có thể hỏi tên một địa điểm, lịch trình hoặc đặc sản cụ thể.", prefix: "Mình tìm thấy một số thông tin liên quan:", suggestions: ["Gợi ý lịch trình 1 ngày", "Tìm hiểu về Tân Cương", "Đặc sản Thái Nguyên có gì?"] },
  en: { noMatch: "I could not find a relevant answer. Try asking about a specific place, itinerary or local specialty.", prefix: "Here is some related information:", suggestions: ["Suggest a one-day itinerary", "Tell me about Tan Cuong", "What local specialties are available?"] },
  fr: { noMatch: "Je n'ai pas trouvé de réponse. Demandez un lieu, un itinéraire ou une spécialité précise.", prefix: "Voici quelques informations utiles :", suggestions: ["Proposer un itinéraire d'une journée", "Présenter Tan Cuong", "Quelles sont les spécialités locales ?"] },
  zh: { noMatch: "暂时没有找到相关信息。您可以询问具体景点、行程或特产。", prefix: "以下是一些相关信息：", suggestions: ["推荐一日行程", "介绍新岗", "太原省有哪些特产？"] },
  ja: { noMatch: "関連情報が見つかりませんでした。具体的な場所、旅程、特産品について質問してください。", prefix: "関連する情報をご案内します：", suggestions: ["1日旅程を提案して", "タン・クオンについて教えて", "地元の特産品は？"] },
  ko: { noMatch: "관련 정보를 찾지 못했습니다. 특정 장소, 일정 또는 특산품을 질문해 주세요.", prefix: "관련 정보를 안내해 드립니다:", suggestions: ["당일 여행 일정을 추천해 줘", "떤끄엉을 소개해 줘", "지역 특산품은 무엇인가요?"] },
  ru: { noMatch: "Пока не удалось найти подходящую информацию. Спросите о конкретном месте, маршруте или местном продукте.", prefix: "Вот несколько подходящих материалов:", suggestions: ["Предложи маршрут на один день", "Расскажи о Танкыонге", "Какие есть местные продукты?"] },
};

const journeyIntro: Record<ChatLanguage, string> = {
  vi: "Mình đã chọn một số hành trình phù hợp để bạn xem chi tiết bên dưới.",
  en: "Here are some itineraries you can explore in detail below.",
  fr: "Voici quelques itinéraires à découvrir en détail ci-dessous.",
  zh: "下面有几条行程供您查看详情。",
  ja: "以下の旅程から詳細をご覧いただけます。",
  ko: "아래 추천 일정에서 자세한 내용을 확인해 보세요.",
  ru: "Ниже несколько маршрутов, которые можно посмотреть подробнее.",
};

function rateLimited(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = forwarded || request.headers.get("x-real-ip") || "local";
  const now = Date.now();
  for (const [id, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(id);
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) { buckets.set(key, { count: 1, resetAt: now + WINDOW_MS }); return false; }
  bucket.count += 1;
  return bucket.count > MAX_REQUESTS;
}

function sanitizeHistory(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) return [];
  return value.slice(-8).flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const source = item as Record<string, unknown>;
    if ((source.role !== "user" && source.role !== "assistant") || typeof source.content !== "string") return [];
    const content = source.content.trim().slice(0, 1600);
    return content ? [{ role: source.role, content } satisfies ChatMessage] : [];
  });
}

export async function POST(request: Request) {
  if (rateLimited(request)) return NextResponse.json({ error: "Bạn đã gửi quá nhiều câu hỏi. Vui lòng thử lại sau." }, { status: 429 });
  let body: Record<string, unknown>;
  try { body = await request.json() as Record<string, unknown>; }
  catch { return NextResponse.json({ error: "Dữ liệu yêu cầu không hợp lệ." }, { status: 400 }); }

  const question = typeof body.question === "string" ? body.question.trim().slice(0, 1200) : "";
  const language = CHAT_LANGUAGES.includes(body.language as ChatLanguage) ? body.language as ChatLanguage : "vi";
  if (question.length < 2) return NextResponse.json({ error: "Vui lòng nhập câu hỏi rõ hơn." }, { status: 400 });

  const journeys = suggestJourneys(question);
  const retrieved = await retrieveKnowledge(question);
  const featured: RetrievedChunk[] = journeys.flatMap(({ id }) => {
    const journey = journeyRepository.getAll().find((item) => item.id === id);
    return journey ? [{ ...buildJourneyKnowledgeChunk(journey), score: 1 }] : [];
  });
  const featuredIds = new Set(featured.map((chunk) => chunk.id));
  const chunks = [...featured, ...retrieved.filter((chunk) => !featuredIds.has(chunk.id))].slice(0, 7);
  const sources = chunks.slice(0, 5).map((chunk) => ({
    id: chunk.id, title: chunk.title, href: chunk.href,
    excerpt: chunk.content.replace(/\s+/g, " ").slice(0, 180) + (chunk.content.length > 180 ? "..." : ""),
  }));
  const copy = fallbackCopy[language];

  if (!isGeminiConfigured()) {
    const answer = chunks.length ? `${copy.prefix}\n\n${chunks.slice(0, 3).map((chunk, index) => `[S${index + 1}] ${chunk.title}\n${chunk.content.slice(0, 420)}`).join("\n\n")}` : journeys.length ? journeyIntro[language] : copy.noMatch;
    return NextResponse.json({ answer, sources, journeys, suggestions: copy.suggestions, mode: "local-search", language } satisfies ChatResponse);
  }

  if (!chunks.length) return NextResponse.json({ answer: journeys.length ? journeyIntro[language] : copy.noMatch, sources: [], journeys, suggestions: copy.suggestions, mode: "no-match", language } satisfies ChatResponse);
  try {
    const generated = await generateGroundedAnswer({ question, language, history: sanitizeHistory(body.history), chunks, featuredJourneyCount: featured.length });
    return NextResponse.json({ ...generated, sources, journeys, mode: "gemini-rag", language } satisfies ChatResponse);
  } catch (error) {
    console.error("Gemini chat failed.", error instanceof Error ? error.message : error);
    return NextResponse.json({
      answer: `${copy.prefix}\n\n${chunks.slice(0, 3).map((chunk, index) => `[S${index + 1}] ${chunk.title}\n${chunk.content.slice(0, 420)}`).join("\n\n")}`,
      sources, journeys, suggestions: copy.suggestions, mode: "local-search", language,
    } satisfies ChatResponse);
  }
}

