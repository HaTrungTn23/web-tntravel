import { afterEach, describe, expect, it, vi } from "vitest";
import { getGeminiRetryDelay, retryEmbeddingOnRateLimit } from "./embeddingRetry";

function quotaError(retryDelay: string) {
  return Object.assign(new Error(JSON.stringify({
    error: {
      code: 429,
      status: "RESOURCE_EXHAUSTED",
      details: [{ "@type": "type.googleapis.com/google.rpc.RetryInfo", retryDelay }],
    },
  })), { status: 429 });
}

afterEach(() => vi.useRealTimers());

describe("Gemini embedding rate-limit retry", () => {
  it("reads the precise RetryInfo delay from a Gemini SDK error", () => {
    expect(getGeminiRetryDelay(quotaError("45.457318212s"))).toBe(45_458);
    expect(getGeminiRetryDelay(Object.assign(new Error("Please retry in 12.5s."), { status: 429 }))).toBe(12_500);
  });

  it("waits for RetryInfo before retrying a failed batch", async () => {
    vi.useFakeTimers();
    const operation = vi.fn()
      .mockRejectedValueOnce(quotaError("2s"))
      .mockResolvedValueOnce([1, 2, 3]);

    const result = retryEmbeddingOnRateLimit(operation);
    await vi.advanceTimersByTimeAsync(2_999);
    expect(operation).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    await expect(result).resolves.toEqual([1, 2, 3]);
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it("does not retry unrelated failures", async () => {
    const operation = vi.fn().mockRejectedValue(new Error("Invalid API key"));
    await expect(retryEmbeddingOnRateLimit(operation)).rejects.toThrow("Invalid API key");
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it("stops after a bounded number of 429 retries", async () => {
    vi.useFakeTimers();
    const operation = vi.fn().mockRejectedValue(quotaError("1s"));
    const result = retryEmbeddingOnRateLimit(operation);
    const rejection = expect(result).rejects.toThrow("Vui lòng thử đồng bộ lại sau vài phút");
    await vi.runAllTimersAsync();
    await rejection;
    expect(operation).toHaveBeenCalledTimes(5);
  });
});
