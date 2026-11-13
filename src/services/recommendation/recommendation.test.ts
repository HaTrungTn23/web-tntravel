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

  it("returns festival journeys when festivals are selected", () => {
    const results = new RuleBasedRecommendationService().recommend({
      duration: "1-day",
      interests: ["festival"],
      audience: "family",
      season: "spring",
    });

    expect(results).toHaveLength(3);
    expect(results.every(({ journey }) => journey.interests.includes("festival"))).toBe(true);
    expect(results[0].matchedReasons).toContain("Hợp sở thích: Lễ hội");
  });

  it("connects tea product preferences to journeys with tea-product stops", () => {
    const results = new RuleBasedRecommendationService().recommend({
      duration: "half-day",
      interests: ["tea-product"],
      audience: "friends",
      season: "autumn",
    });

    expect(results[0].journey.interests).toContain("tea-product");
    expect(results[0].journey.destinationIds).toContain("hao-dat");
  });
});
