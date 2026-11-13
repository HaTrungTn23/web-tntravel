import { describe, expect, it } from "vitest";
import { buildChatSystemInstruction } from "./gemini";

describe("buildChatSystemInstruction", () => {
  it("requires every user-visible field from Vietnamese sources to use the answer language", () => {
    const instruction = buildChatSystemInstruction({ language: "ru", featuredJourneyCount: 3 });

    expect(instruction).toContain("Translate source titles and descriptions into Russian");
    expect(instruction).toContain("answer and suggestions");
    expect(instruction).toContain("Keep only proper nouns, brand names, URLs, and source markers");
  });
});
