// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { HomeHeroSlideshow } from "./HomeHeroSlideshow";
import { createDefaultHomeHeroSlides, homeHeroCopyPresets } from "@/services/content/homeGalleryContent";

vi.mock("@/components/common/ImageWithFallback", () => ({
  ImageWithFallback: ({ src }: { src: string }) => <div data-image-src={src} />,
}));

const images = [...createDefaultHomeHeroSlides(), { id: "tea-hills", url: "/images/tea-hills.jpg", alt: "Đồi chè", translations: structuredClone(homeHeroCopyPresets[0].translations) }];

afterEach(() => { cleanup(); vi.useRealTimers(); });

describe("trình chiếu ảnh đầu trang", () => {
  it("giữ tên địa phương dài thành một cụm ở dòng riêng", () => {
    const longSlide = createDefaultHomeHeroSlides();
    longSlide[0].translations.vi.titleA = "Không gian văn hóa";
    longSlide[0].translations.vi.titleB = "Trà Tân Cương";
    render(<HomeHeroSlideshow images={longSlide} locale="vi" exploreLabel="Khám phá" planLabel="Tạo hành trình" />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.className).toContain("heroTitleSplit");
    expect(heading.querySelector("span")?.textContent).toBe("Không gian văn hóa");
    expect(heading.querySelector("em")?.textContent).toBe("Trà Tân Cương");
  });

  it("chuyển ảnh sau 5 giây, lặp lại và có thể tạm dừng", () => {
    vi.useFakeTimers();
    render(<HomeHeroSlideshow images={images} locale="vi" exploreLabel="Khám phá" planLabel="Tạo hành trình" />);
    const first = screen.getByRole("button", { name: /Xem ảnh 1/ });
    const second = screen.getByRole("button", { name: /Xem ảnh 2/ });
    const explore = screen.getByRole("link", { name: /Khám phá/ });
    expect(first.getAttribute("aria-current")).toBe("true");
    expect(explore.getAttribute("href")).toBe("#stations");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("Chạm vào Thái Nguyên");

    act(() => { vi.advanceTimersByTime(5000); });
    expect(second.getAttribute("aria-current")).toBe("true");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("Đi giữa vùng trà");
    expect(screen.getByRole("link", { name: /Khám phá/ })).toBe(explore);
    act(() => { vi.advanceTimersByTime(5000); });
    expect(first.getAttribute("aria-current")).toBe("true");

    fireEvent.click(screen.getByRole("button", { name: "Tạm dừng trình chiếu" }));
    act(() => { vi.advanceTimersByTime(10000); });
    expect(first.getAttribute("aria-current")).toBe("true");
  });
});
