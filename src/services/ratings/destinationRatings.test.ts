import { describe, expect, it } from "vitest";
import { parseRating } from "./destinationRatings";

describe("destination rating validation", () => {
  it.each([1, 2, 3, 4, 5])("accepts %i stars", (rating) => {
    expect(parseRating(rating)).toBe(rating);
  });

  it.each([0, 6, 2.5, "5", null, undefined])("rejects invalid rating %s", (rating) => {
    expect(parseRating(rating)).toBeNull();
  });
});
