import type { JourneyPreferences, JourneyRecommendation } from "@/domain/models";
import { interestLabels } from "@/lib/labels";
import { journeyRepository } from "@/repositories";

export interface RecommendationService { recommend(preferences: JourneyPreferences): JourneyRecommendation[] }

const labels = { duration: "Đúng thời lượng", audience: "Phù hợp nhóm đi", season: "Hợp mùa đã chọn" };

export class RuleBasedRecommendationService implements RecommendationService {
  recommend(preferences: JourneyPreferences): JourneyRecommendation[] {
    const allJourneys = journeyRepository.getAll();
    const festivalJourneys = allJourneys.filter((journey) => journey.interests.includes("festival"));
    const candidates = preferences.interests.includes("festival") && festivalJourneys.length
      ? festivalJourneys
      : allJourneys;

    return candidates.map((journey) => {
      let score = journey.priority;
      const matchedReasons: string[] = [];
      if (journey.duration === preferences.duration) { score += 4; matchedReasons.push(labels.duration); }
      const matchedInterests = preferences.interests.filter((tag) => journey.interests.includes(tag));
      score += matchedInterests.length * 3;
      matchedReasons.push(...matchedInterests.map((tag) => `Hợp sở thích: ${interestLabels[tag]}`));
      if (journey.audiences.includes(preferences.audience)) { score += 2; matchedReasons.push(labels.audience); }
      if (journey.seasons.includes(preferences.season)) { score += 2; matchedReasons.push(labels.season); }
      return { journey, score, matchedReasons };
    }).sort((a, b) => b.score - a.score || a.journey.id.localeCompare(b.journey.id)).slice(0, 3);
  }
}

export const recommendationService: RecommendationService = new RuleBasedRecommendationService();
