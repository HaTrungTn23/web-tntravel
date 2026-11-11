import type { AudienceType, DurationCode, InterestTag, Journey } from "@/domain/models";
import { destinationRepository, journeyRepository } from "@/repositories";
import { normalizeSearchText } from "./knowledge";
import type { ChatJourneySuggestion } from "./types";

const interestTerms: Record<InterestTag, string[]> = {
  tea: ["tra", "che", "tea", "чай", "茶", "お茶", "차"],
  culture: ["van hoa", "culture", "культур", "文化", "문화"],
  nature: ["thien nhien", "ho", "suoi", "nui", "nature", "lake", "waterfall", "природ", "озер", "водопад", "自然", "자연"],
  village: ["ban lang", "lang", "village", "деревн", "дерев", "村", "마을"],
  history: ["lich su", "di tich", "history", "historic", "истор", "历史", "歴史", "역사"],
  food: ["am thuc", "an uong", "food", "cuisine", "ед", "кухн", "美食", "料理", "음식"],
  "local-product": ["dac san", "san pham", "specialty", "local product", "сувенир", "продукт", "特产", "特産", "특산"],
};

function containsTerm(text: string, term: string) {
  const normalized = normalizeSearchText(term);
  if (/^[a-z0-9 ]+$/.test(normalized)) return (` ${text} `).includes(` ${normalized} `);
  return text.includes(normalized);
}

export function isJourneyAdviceQuestion(question: string) {
  const text = normalizeSearchText(question);
  return [
    "lich trinh", "hanh trinh", "tour", "tuyen du lich", "ke hoach chuyen di", "di dau", "nen di dau",
    "itinerary", "itineraries", "trip plan", "travel plan", "tour", "where to go", "places to visit",
    "маршрут", "маршруты", "тур", "поездк", "путешеств", "куда поехать", "мест для посещения",
    "itineraire", "circuit", "voyage", "行程", "路线", "旅行计划", "旅程", "旅行プラン", "여행 일정", "여행 코스",
  ].some((term) => containsTerm(text, term)) || /\b(?:nua ngay|mot ngay|hai ngay|ba ngay|[1-9]\s*ngay|[1-9]\s*days?|[1-9]\s*jours?)\b/.test(text);
}

function requestedDuration(text: string): DurationCode | null {
  if (/(?:nua ngay|half day|half-day|полдня|半天|半日|반나절)/.test(text)) return "half-day";
  if (/(?:\b1\s*(?:ngay|day|jour|день)(?=\s|$)|mot ngay|one day|один день|一日|一天|1日|하루)/.test(text)) return "1-day";
  if (/(?:\b2\s*(?:ngay|days?|jours?|дня)(?=\s|$)|hai ngay|two days|два дня|二日|两天|2日|이틀)/.test(text)) return "2-days";
  if (/(?:\b[3-9]\s*(?:ngay|days?|jours?|дн(?:я|ей))(?=\s|$)|ba ngay|three days|три дня|三日|三天|3日|사흘)/.test(text)) return "3-plus-days";
  return null;
}

function requestedAudience(text: string): AudienceType | null {
  if (/(?:gia dinh|tre em|family|children|семь|дет|famille|家庭|家族|가족)/.test(text)) return "family";
  if (/(?:ban be|friends|друз|amis|朋友|友達|친구)/.test(text)) return "friends";
  if (/(?:mot minh|solo|alone|один|seul|独自|一人|혼자)/.test(text)) return "solo";
  if (/(?:hoc sinh|sinh vien|student|студент|etudiant|学生|학생)/.test(text)) return "student";
  return null;
}

function scoreJourney(journey: Journey, text: string, interests: InterestTag[], audience: AudienceType | null) {
  let score = journey.priority;
  score += interests.filter((interest) => journey.interests.includes(interest)).length * 4;
  if (audience && journey.audiences.includes(audience)) score += 2;
  if (containsTerm(text, journey.name)) score += 12;
  for (const id of journey.destinationIds) {
    const destination = destinationRepository.getById(id);
    if (destination && containsTerm(text, destination.name)) score += 6;
  }
  return score;
}

export function suggestJourneys(question: string): ChatJourneySuggestion[] {
  if (!isJourneyAdviceQuestion(question)) return [];
  const text = normalizeSearchText(question);
  const duration = requestedDuration(text);
  const audience = requestedAudience(text);
  const interests = (Object.keys(interestTerms) as InterestTag[])
    .filter((interest) => interestTerms[interest].some((term) => containsTerm(text, term)));
  const journeys = journeyRepository.getAll();
  const matchingDuration = duration ? journeys.filter((journey) => journey.duration === duration) : journeys;
  return matchingDuration
    .map((journey) => ({ journey, score: scoreJourney(journey, text, interests, audience) }))
    .sort((a, b) => b.score - a.score || a.journey.id.localeCompare(b.journey.id))
    .slice(0, 3)
    .map(({ journey }) => ({ id: journey.id, title: journey.name, href: `/journeys/${journey.slug}`, days: journey.days.length, duration: journey.duration }));
}
