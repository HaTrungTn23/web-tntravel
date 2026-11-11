import { describe, expect, it, vi } from "vitest";
import { journeyRepository } from "@/repositories";
import { POST } from "./route";

vi.mock("@/services/chatbot/retrieval", () => ({ retrieveKnowledge: vi.fn(async () => []) }));
vi.mock("@/services/chatbot/gemini", () => ({ isGeminiConfigured: () => false, generateGroundedAnswer: vi.fn() }));

describe("chat itinerary response", () => {
  it("returns three clickable, existing journeys alongside advice", async () => {
    const response = await POST(new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": "chat-journey-test" },
      body: JSON.stringify({ question: "Gợi ý lịch trình 1 ngày khám phá trà", language: "vi" }),
    }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.answer).toContain("Lịch trình:");
    expect(data.journeys).toHaveLength(3);
    expect(data.journeys.every((item: { href: string }) => Boolean(journeyRepository.getBySlug(item.href.split("/").at(-1) ?? "")))).toBe(true);
  });
});
