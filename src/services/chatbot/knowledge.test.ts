import { describe, expect, it } from "vitest";
import { buildFestivalKnowledgeChunks, normalizeSearchText, rankKnowledgeLocally } from "./knowledge";
import type { KnowledgeChunk } from "./types";
import { defaultFestivalContent } from "@/services/content/festivalContent";

const chunks: KnowledgeChunk[] = [
  {
    id: "destination:tan-cuong:introduction",
    sourceType: "destination",
    sourceId: "tan-cuong",
    title: "Tân Cương: Giới thiệu",
    content: "Vùng chè nổi tiếng của Thái Nguyên.",
    href: "/destinations/tan-cuong",
    language: "vi",
  },
  {
    id: "product:com-lam",
    sourceType: "product",
    sourceId: "com-lam",
    title: "Đặc sản: Cơm lam",
    content: "Món ăn địa phương phù hợp để khám phá ẩm thực.",
    href: "/products/com-lam",
    language: "vi",
  },
];

describe("chatbot local retrieval", () => {
  it("normalizes Vietnamese diacritics for resilient search", () => {
    expect(normalizeSearchText("Chè Tân Cương")).toBe("che tan cuong");
  });

  it("keeps Cyrillic letters and Unicode numbers", () => {
    expect(normalizeSearchText("\u0422\u0445\u0430\u0439\u043d\u0433\u0443\u0435\u043d \u2014 \u0441\u0435\u043c\u044c\u044f \u2116\uff14"))
      .toBe("\u0442\u0445\u0430\u0439\u043d\u0433\u0443\u0435\u043d \u0441\u0435\u043c\u044c\u044f \uff14");
  });

  it("ranks a matching destination ahead of unrelated content", () => {
    const results = rankKnowledgeLocally("Tân Cương chè", chunks);
    expect(results[0]?.id).toBe("destination:tan-cuong:introduction");
    expect(results).toHaveLength(1);
  });

  it("indexes the Festival overview and published schedule for RAG", () => {
    const chunks = buildFestivalKnowledgeChunks(defaultFestivalContent(), "2026-11-05T03:00:00Z");
    expect(chunks).toHaveLength(4);
    expect(chunks.every((chunk) => chunk.sourceType === "event")).toBe(true);
    expect(chunks.every((chunk) => chunk.href === "/events/festival-tra-thai-nguyen-2026")).toBe(true);
    expect(chunks[0].title).toContain("Festival Chè Thái Nguyên 2026");
    expect(chunks.map((chunk) => chunk.content).join("\n")).toContain("Lễ khai mạc");
    expect(chunks.map((chunk) => chunk.content).join("\n")).toContain("Lễ bế mạc");
    expect(chunks[0].updatedAt).toBe("2026-11-05T03:00:00Z");
  });

  it("finds Festival information using the common chè wording", () => {
    const festivalChunks = buildFestivalKnowledgeChunks(defaultFestivalContent());
    const results = rankKnowledgeLocally("Festival chè Thái Nguyên 2026", festivalChunks);
    expect(results[0]?.id).toBe("event:festival-tea-2026:overview");
  });
});
