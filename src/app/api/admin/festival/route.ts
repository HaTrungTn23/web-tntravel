import { NextResponse } from "next/server";
import { getAdminSession } from "@/services/admin/auth";
import { festivalContentKey, normalizeFestivalContent } from "@/services/content/festivalContent";

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session.configured || !session.client) return NextResponse.json({ error: "Supabase chưa được cấu hình." }, { status: 503 });
  if (!session.user) return NextResponse.json({ error: "Phiên đăng nhập đã hết hạn." }, { status: 401 });
  if (!session.isAdmin) return NextResponse.json({ error: "Tài khoản không có quyền biên tập." }, { status: 403 });
  const body = await request.json() as Record<string, unknown>;
  const content = normalizeFestivalContent(body.content);
  const published = Boolean(body.published);
  const { error } = await session.client.from("site_content").upsert({ content_key: festivalContentKey, payload: content, is_published: published, updated_by: session.user.id });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
