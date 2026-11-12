import { describe, expect, it } from "vitest";
import { detectChatLanguage } from "./language";

describe("detectChatLanguage", () => {
  it.each([
    ["Có những sản phẩm chè nào tại Thái Nguyên?", "vi"],
    ["What tea products are available in Thai Nguyen?", "en"],
    ["Quels produits de thé sont disponibles ?", "fr"],
    ["太原有哪些茶产品？", "zh"],
    ["タイグエンにはどんなお茶がありますか？", "ja"],
    ["타이응우옌에는 어떤 차 제품이 있나요?", "ko"],
    ["Какие чайные продукты есть в Тхайнгуене?", "ru"],
  ] as const)("detects %s", (question, expected) => {
    expect(detectChatLanguage(question, "vi")).toBe(expected);
  });

  it("uses the selected UI language for an ambiguous proper name", () => {
    expect(detectChatLanguage("Tan Cuong", "en")).toBe("en");
  });
});
