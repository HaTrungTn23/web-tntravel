import { describe, expect, it } from "vitest";
import { cultureImageGalleries, getCultureImage, getCultureImages } from "./cultureImageGalleries";
import { foodArticles } from "./foodArticles";
import { festivalStories } from "./cultureCatalog";

describe("cultureImageGalleries", () => {
  it("provides at least three images for every food and festival item", () => {
    const expectedIds = [...foodArticles.map((article) => article.id), ...festivalStories.map((story) => story.id)];
    expect(Object.keys(cultureImageGalleries)).toHaveLength(expectedIds.length);

    for (const id of expectedIds) {
      expect(getCultureImages(id).length, id).toBeGreaterThanOrEqual(3);
    }
  });

  it("resolves indexed images and falls back to the cover", () => {
    expect(getCultureImage("tn-001", 1)).toBe(getCultureImages("tn-001")[1]);
    expect(getCultureImage("tn-001", 99)).toBe(getCultureImages("tn-001")[0]);
    expect(getCultureImage("missing")).toBeUndefined();
  });
});
