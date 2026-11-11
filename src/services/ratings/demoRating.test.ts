import { describe, expect, it } from "vitest";
import { combineDemoAndRealRatings, getDemoDestinationCount, getDemoDestinationRating } from "./demoRating";

describe("demo and real destination ratings", () => {
  const destinationId = "tan-cuong";
  const demoCount = getDemoDestinationCount(destinationId);
  const demoAverage = getDemoDestinationRating(destinationId);

  it("keeps the demo baseline before any real votes", () => {
    expect(combineDemoAndRealRatings(destinationId, { count: 0, average: 0 })).toEqual({
      count: demoCount,
      average: demoAverage,
    });
  });

  it("adds the first real vote to the demo total and weights its score", () => {
    const summary = combineDemoAndRealRatings(destinationId, { count: 1, average: 5 });
    expect(summary.count).toBe(demoCount + 1);
    expect(summary.average).toBeCloseTo((demoAverage * demoCount + 5) / (demoCount + 1));
  });

  it("keeps the count when an existing user changes their vote", () => {
    const before = combineDemoAndRealRatings(destinationId, { count: 1, average: 5 });
    const after = combineDemoAndRealRatings(destinationId, { count: 1, average: 1 });
    expect(after.count).toBe(before.count);
    expect(after.average).toBeLessThan(before.average);
  });
});
