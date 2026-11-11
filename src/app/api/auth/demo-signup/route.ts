import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { isDemoGmail } from "@/services/auth/demoSignup";

export const runtime = "nodejs";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_SIGNUPS = 5;
const attempts = new Map<string, { count: number; resetAt: number }>();

function limited(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip") || "local";
  const now = Date.now();
  for (const [key, bucket] of attempts) if (bucket.resetAt <= now) attempts.delete(key);
  const bucket = attempts.get(ip);
  if (!bucket) { attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS }); return false; }
  bucket.count += 1;
  return bucket.count > MAX_SIGNUPS;
}

export async function POST(request: Request) {
  const enabled = process.env.ENABLE_DEMO_GMAIL_SIGNUP === "true"
    || (process.env.NODE_ENV === "development" && process.env.ENABLE_DEMO_GMAIL_SIGNUP !== "false");
  if (!enabled) return Response.json({ code: "demo_signup_unavailable" }, { status: 503 });
  const config = getSupabasePublicConfig();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!config || !serviceRoleKey) return Response.json({ code: "demo_signup_unavailable" }, { status: 503 });

  let body: { email?: unknown; password?: unknown; name?: unknown };
  try {
    const raw = await request.text();
    if (raw.length > 2048) return Response.json({ code: "validation_failed" }, { status: 400 });
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return Response.json({ code: "validation_failed" }, { status: 400 });
    body = parsed;
  } catch { return Response.json({ code: "validation_failed" }, { status: 400 }); }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
  if (!isDemoGmail(email)) return Response.json({ code: "gmail_required" }, { status: 400 });
  if (password.length < 8 || password.length > 72) return Response.json({ code: "weak_password" }, { status: 400 });
  if (limited(request)) return Response.json({ code: "over_request_rate_limit" }, { status: 429 });

  try {
    const admin = createClient(config.url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { error } = await admin.auth.admin.createUser({
      email, password, email_confirm: true,
      user_metadata: { display_name: name },
    });
    if (error) return Response.json({ code: error.code || "signup_failed" }, { status: error.status || 500 });
    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ code: "signup_failed" }, { status: 500 });
  }
}
