import { describe, expect, it } from "vitest";
import { isLocale } from "./config";
import { messages, translate } from "./messages";

describe("website translations", () => {
  it("keeps the same message keys in all three languages", () => {
    const vietnameseKeys = Object.keys(messages.vi).sort();
    expect(Object.keys(messages.en).sort()).toEqual(vietnameseKeys);
    expect(Object.keys(messages.ru).sort()).toEqual(vietnameseKeys);
  });

  it("interpolates values in localized messages", () => {
    expect(translate("en", "common.points", { count: 4 })).toBe("4 places");
    expect(translate("ru", "journey.day", { day: 2 })).toBe("День 2");
  });

  it("accepts only supported locales", () => {
    expect(isLocale("vi")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("ru")).toBe(true);
    expect(isLocale("fr")).toBe(false);
  });
});
