import { describe, expect, it } from "vitest";
import { createDefaultHomeGalleryContent, createDefaultHomeHeroSlides, homeHeroCopyPresets, normalizeHomeGalleryContent } from "./homeGalleryContent";

describe("ảnh đầu trang chủ", () => {
  it("giữ ảnh mặc định khi dữ liệu cũ chưa có danh sách ảnh", () => {
    const content = normalizeHomeGalleryContent({ sections: {}, stations: [] });
    expect(content.heroImages).toEqual([]);
    expect(createDefaultHomeGalleryContent().heroImages).toEqual([]);
  });

  it("giữ đúng thứ tự ảnh và bỏ đường dẫn không hợp lệ", () => {
    const content = normalizeHomeGalleryContent({ heroImages: [
      { id: "first", url: "/images/first.jpg", alt: "Đồi chè" },
      { id: "bad", url: "javascript:alert(1)", alt: "Không hợp lệ" },
      { id: "second", url: "https://example.com/second.jpg", alt: "Hồ Núi Cốc" },
    ] });
    expect(content.heroImages.map((image) => image.id)).toEqual(["first", "second"]);
    expect(content.heroImages[0].translations.vi.titleA).toBe("Chạm vào");
    expect(content.heroImages[1].translations.en.titleA).toBe("Explore");
  });

  it("chỉ dùng ảnh Tân Cương cho tiêu đề mặc định, không kéo ảnh thẻ khác lên", () => {
    const slides = createDefaultHomeHeroSlides({ id: "cover", url: "https://example.com/tan-cuong.jpg", alt: "Tân Cương" });
    expect(slides).toHaveLength(1);
    expect(slides[0].url).toBe("https://example.com/tan-cuong.jpg");
    expect(slides[0].translations.vi.titleB).toBe("Thái Nguyên");
    expect(slides.every((slide) => slide.translations.en.body && slide.translations.ru.body)).toBe(true);
    expect(homeHeroCopyPresets.map((preset) => preset.translations.vi.titleB)).toEqual(["vùng trà", "chuyện trà"]);
  });
});
