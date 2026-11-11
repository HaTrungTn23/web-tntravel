import { describe, expect, it } from "vitest";
import { festivalCurrentDay, festivalState } from "@/data/festival2026";
import { normalizeFestivalContent } from "./festivalContent";

describe("Festival Trà 2026", () => {
  it("chọn đúng ngày và trạng thái theo giờ Việt Nam", () => {
    expect(festivalState(new Date("2026-10-29T16:59:00Z"))).toBe("upcoming");
    expect(festivalState(new Date("2026-10-29T17:00:00Z"))).toBe("ongoing");
    expect(festivalCurrentDay(new Date("2026-11-03T17:00:00Z"))).toBe(4);
    expect(festivalState(new Date("2026-11-07T17:00:00Z"))).toBe("ended");
  });

  it("loại bỏ ngày không thuộc Festival khỏi dữ liệu quản trị", () => {
    const content = normalizeFestivalContent({ sessions: [
      { id: "valid", day: 4, time: "19:30", title: { vi: "Đêm hội", en: "Festival night", ru: "Вечер фестиваля" }, venue: { vi: "Phố đi bộ", en: "Pedestrian street", ru: "Пешеходная улица" }, source: "https://example.com" },
      { id: "invalid", day: 12, title: { vi: "Sai ngày" } },
    ] });
    expect(content.sessions).toHaveLength(1);
    expect(content.sessions[0].id).toBe("valid");
  });
});
