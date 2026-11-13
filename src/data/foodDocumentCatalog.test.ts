import { describe, expect, it } from "vitest";
import { foodDocuments } from "./foodDocumentCatalog";

describe("foodDocumentCatalog", () => {
  it("contains every food document from the dataset snapshot", () => {
    expect(foodDocuments).toHaveLength(34);
    expect(new Set(foodDocuments.map((document) => document.id)).size).toBe(34);
  });

  it("keeps all entries usable in the catalogue", () => {
    for (const document of foodDocuments) {
      expect(document.title.length).toBeGreaterThan(0);
      expect(document.excerpt.length).toBeGreaterThan(0);
      expect(document.sourceUrl).toMatch(/^https?:\/\//);
      expect(document.wordCount).toBeGreaterThan(0);
    }
  });

  it("includes specialties, venues and local stories", () => {
    expect(new Set(foodDocuments.map((document) => document.kind))).toEqual(
      new Set(["specialty", "venue", "story"]),
    );
  });
});
