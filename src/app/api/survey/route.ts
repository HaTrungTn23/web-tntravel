import { NextResponse } from "next/server";
export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    if (!body.informationEase || !body.recommendationFit || !body.mostUseful || !body.useAgain) return NextResponse.json({ error: "Thiếu trường bắt buộc" }, { status: 400 });
    return NextResponse.json({ ok: true, mode: "demo" }, { status: 201 });
  } catch { return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 }); }
}
