import { NextResponse } from "next/server";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { getAdminSession } from "@/services/admin/auth";
import { isGeminiConfigured } from "@/services/chatbot/gemini";
import { syncChatbotKnowledge } from "@/services/chatbot/knowledgeSync";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST() {
  const session = await getAdminSession();
  if (!session.user) return NextResponse.json({ error: "Phiên đăng nhập đã hết hạn." }, { status: 401 });
  if (!session.isAdmin) return NextResponse.json({ error: "Tài khoản không có quyền đồng bộ." }, { status: 403 });
  const config = getSupabasePublicConfig();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!config || !serviceRoleKey) return NextResponse.json({ error: "Thiếu cấu hình Supabase service role ở server." }, { status: 503 });
  if (!isGeminiConfigured()) return NextResponse.json({ error: "Thiếu GEMINI_API_KEY ở server." }, { status: 503 });

  try {
    return NextResponse.json({ ok: true, ...await syncChatbotKnowledge({ url: config.url, serviceRoleKey }) });
  } catch (error) {
    console.error("Knowledge sync failed.", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Không thể đồng bộ kho tri thức." }, { status: 500 });
  }
}

