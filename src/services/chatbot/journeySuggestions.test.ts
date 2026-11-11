import { describe, expect, it } from "vitest";
import { journeyRepository } from "@/repositories";
import { isJourneyAdviceQuestion, suggestJourneys } from "./journeySuggestions";

describe("chatbot itinerary suggestions", () => {
  it("shows three real one-day journeys for a Vietnamese tour request", () => {
    const results = suggestJourneys("Gợi ý lịch trình 1 ngày khám phá trà Thái Nguyên cho gia đình");
    expect(results).toHaveLength(3);
    expect(results.every((item) => item.duration === "1-day")).toBe(true);
    expect(results.every((item) => journeyRepository.getBySlug(item.href.split("/").at(-1) ?? "")?.id === item.id)).toBe(true);
  });

  it("understands a Russian family travel request and duration", () => {
    const results = suggestJourneys("Посоветуйте маршрут на 1 день для семьи из 4 человек в Тай Нгуене");
    expect(results).toHaveLength(3);
    expect(results.every((item) => item.duration === "1-day")).toBe(true);
    expect(isJourneyAdviceQuestion("В моей семье 4 человека, посоветуйте несколько мест для посещения в Тай Нгуене")).toBe(true);
  });

  it("does not append itinerary buttons to a factual destination answer", () => {
    expect(suggestJourneys("Tân Cương có gì đặc biệt?")).toEqual([]);
  });
});
