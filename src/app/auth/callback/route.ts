import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function safeNextPath(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const nextPath = safeNextPath(url.searchParams.get("next"));
  const client = await createSupabaseServerClient();

  if (code && client) {
    const { error } = await client.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(nextPath, url.origin));
  }

  const errorUrl = new URL("/auth", url.origin);
  errorUrl.searchParams.set("error", "confirmation");
  errorUrl.searchParams.set("next", nextPath);
  return NextResponse.redirect(errorUrl);
}
