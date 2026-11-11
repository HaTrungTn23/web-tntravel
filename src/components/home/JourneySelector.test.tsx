// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { JourneySelector } from "./JourneySelector";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

describe("JourneySelector", () => {
  beforeEach(() => push.mockClear());
  afterEach(() => cleanup());

  it("does not preselect a duration", () => {
    render(<JourneySelector />);

    expect((screen.getByLabelText("Nửa ngày") as HTMLInputElement).checked).toBe(false);
    expect((screen.getByLabelText("1 ngày") as HTMLInputElement).checked).toBe(false);
    expect((screen.getByLabelText("2 ngày") as HTMLInputElement).checked).toBe(false);
    expect((screen.getByLabelText("3+ ngày") as HTMLInputElement).checked).toBe(false);
    expect((screen.getByLabelText("Trà") as HTMLInputElement).checked).toBe(false);
    expect((screen.getByLabelText("Thiên nhiên") as HTMLInputElement).checked).toBe(false);
    expect((screen.getByLabelText("Văn hóa") as HTMLInputElement).checked).toBe(false);
  });

  it("updates preferences and navigates to matching results", () => {
    render(<JourneySelector />);

    fireEvent.click(screen.getByLabelText("1 ngày"));
    fireEvent.click(screen.getByLabelText("Văn hóa"));
    fireEvent.change(screen.getByLabelText("Bạn đi cùng ai?"), { target: { value: "friends" } });
    fireEvent.change(screen.getByLabelText("Mùa bạn muốn đi"), { target: { value: "spring" } });
    fireEvent.click(screen.getByRole("button", { name: "Xem tuyến gợi ý" }));

    expect(push).toHaveBeenCalledWith(
      "/journeys?duration=1-day&interests=culture&audience=friends&season=spring",
    );
  });
});
