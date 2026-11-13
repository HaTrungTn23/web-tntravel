import { describe, expect, it } from "vitest";
import { foodArticles, getFoodArticle, splitArticleParagraphs } from "./foodArticles";

describe("foodArticles", () => {
  it("contains full content and an image entry for every food article", () => {
    expect(foodArticles).toHaveLength(34);
    expect(foodArticles.every((article) => article.text.length > 100)).toBe(true);
    expect(foodArticles.filter((article) => article.imageUrl).length).toBeGreaterThanOrEqual(33);
  });

  it("finds an article by its internal id", () => {
    expect(getFoodArticle("tn-001")?.title).toContain("Bánh chưng Bờ Đậu");
    expect(getFoodArticle("missing")).toBeUndefined();
  });

  it("breaks long source text into readable paragraphs", () => {
    const article = getFoodArticle("tn-013");
    expect(article).toBeDefined();
    const paragraphs = splitArticleParagraphs(article!.text);
    expect(paragraphs.length).toBeGreaterThan(2);
    expect(Math.max(...paragraphs.map((paragraph) => paragraph.length))).toBeLessThan(900);
  });
});
