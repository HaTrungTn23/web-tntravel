import { describe, expect, it } from "vitest";
import { isDemoGmail } from "./demoSignup";

describe("demo Gmail validation", () => {
  it("accepts Gmail addresses regardless of case and surrounding space", () => {
    expect(isDemoGmail("  Traveler.Name+demo@GMAIL.COM  ")).toBe(true);
  });

  it("rejects lookalike domains and missing local parts", () => {
    expect(isDemoGmail("traveler@gmail.com.evil.test")).toBe(false);
    expect(isDemoGmail("@gmail.com")).toBe(false);
    expect(isDemoGmail("traveler@notgmail.com")).toBe(false);
  });
});
