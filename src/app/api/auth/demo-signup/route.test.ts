import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const createUser = vi.hoisted(() => vi.fn(async () => ({ data: { user: { id: "demo-user" } }, error: null })));

vi.mock("@/lib/supabase/config", () => ({ getSupabasePublicConfig: () => ({ url: "https://example.supabase.co", key: "public-test-key" }) }));
vi.mock("@supabase/supabase-js", () => ({ createClient: () => ({ auth: { admin: { createUser } } }) }));

function request(email: string, ip: string) {
  return new Request("http://localhost:3000/api/auth/demo-signup", {
    method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify({ email, password: "demo-password-123", name: "Khách du lịch" }),
  });
}

describe("demo Gmail registration", () => {
  beforeEach(() => {
    vi.stubEnv("ENABLE_DEMO_GMAIL_SIGNUP", "true");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "server-only-test-key");
    createUser.mockClear();
  });
  afterEach(() => vi.unstubAllEnvs());

  it("rejects other email domains before touching Supabase", async () => {
    const response = await POST(request("traveler@example.com", "demo-signup-invalid"));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ code: "gmail_required" });
    expect(createUser).not.toHaveBeenCalled();
  });

  it("creates a Gmail account as confirmed without sending a verification email", async () => {
    const response = await POST(request("traveler@gmail.com", "demo-signup-valid"));
    expect(response.status).toBe(201);
    expect(createUser).toHaveBeenCalledWith({
      email: "traveler@gmail.com", password: "demo-password-123", email_confirm: true,
      user_metadata: { display_name: "Khách du lịch" },
    });
  });
});
