import { describe, expect, it } from "vitest";
import { RuleBasedRecommendationService } from "./recommendation";

describe("RuleBasedRecommendationService", () => {
  const preferences = { duration: "2-days" as const, interests: ["tea", "nature"] as const, audience: "family" as const, season: "autumn" as const };
  it("returns the most relevant proposed journey first", () => {
    const results = new RuleBasedRecommendationService().recommend({ ...preferences, interests: [...preferences.interests] });
    expect(results).toHaveLength(3);
    expect(results[0].journey.slug).toBe("tra-ho-xanh-ban-lang");
    expect(results[0].matchedReasons).toContain("Đúng thời lượng");
  });
  it("is deterministic for the same input", () => {
    const service = new RuleBasedRecommendationService();
    const input = { ...preferences, interests: [...preferences.interests] };
    expect(service.recommend(input)).toEqual(service.recommend(input));
  });
});
