const MAX_RETRIES = 4;
const MAX_TOTAL_WAIT_MS = 240_000;

type ApiErrorBody = {
  error?: {
    code?: number;
    details?: Array<{ "@type"?: string; retryDelay?: string }>;
  };
};

function readErrorBody(error: unknown): ApiErrorBody | null {
  if (!(error instanceof Error)) return null;
  try {
    return JSON.parse(error.message) as ApiErrorBody;
  } catch {
    return null;
  }
}

function isRateLimited(error: unknown, body: ApiErrorBody | null) {
  const status = error && typeof error === "object" && "status" in error ? error.status : undefined;
  return status === 429 || body?.error?.code === 429;
}

function parseRetryDelay(value: string | undefined) {
  const match = value?.match(/^(\d+(?:\.\d+)?)s$/);
  if (!match) return null;
  const milliseconds = Number(match[1]) * 1000;
  return Number.isFinite(milliseconds) ? Math.ceil(milliseconds) : null;
}

export function getGeminiRetryDelay(error: unknown): number | null {
  const body = readErrorBody(error);
  if (!isRateLimited(error, body)) return null;
  const retryInfo = body?.error?.details?.find((detail) => detail["@type"]?.endsWith("google.rpc.RetryInfo"));
  const structuredDelay = parseRetryDelay(retryInfo?.retryDelay);
  if (structuredDelay !== null) return structuredDelay;
  const message = error instanceof Error ? error.message : "";
  return parseRetryDelay(message.match(/please retry in (\d+(?:\.\d+)?s)/i)?.[1]);
}

export async function retryEmbeddingOnRateLimit<T>(operation: () => Promise<T>): Promise<T> {
  let totalWaitMs = 0;
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      const body = readErrorBody(error);
      if (!isRateLimited(error, body)) throw error;
      const retryDelay = getGeminiRetryDelay(error);
      const waitMs = Math.max(retryDelay ?? Math.min(2 ** attempt * 2_000, 30_000), 1_000) + 1_000;
      if (attempt >= MAX_RETRIES || totalWaitMs + waitMs > MAX_TOTAL_WAIT_MS) {
        throw new Error("Gemini vẫn đang giới hạn lượt tạo embedding. Vui lòng thử đồng bộ lại sau vài phút.", { cause: error });
      }
      totalWaitMs += waitMs;
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }
}
