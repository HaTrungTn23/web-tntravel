import { NextResponse } from "next/server";
import { destinationRepository } from "@/repositories";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseRating } from "@/services/ratings/destinationRatings";
import { combineDemoAndRealRatings } from "@/services/ratings/demoRating";

export async function POST(request: Request, { params }: { params: Promise<{ destinationId: string }> }) {
  const { destinationId } = await params;
  if (!destinationRepository.getById(destinationId)) {
    return NextResponse.json({ error: "Điểm đến không tồn tại." }, { status: 404 });
  }

  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Dữ liệu đánh giá không hợp lệ." }, { status: 400 }); }

  const rating = parseRating((body as { rating?: unknown } | null)?.rating);
  if (!rating) return NextResponse.json({ error: "Đánh giá phải từ 1 đến 5 sao." }, { status: 400 });

  const client = await createSupabaseServerClient();
  if (!client) return NextResponse.json({ error: "Hệ thống tài khoản chưa được cấu hình." }, { status: 503 });

  const { data: { user } } = await client.auth.getUser();
  if (!user) return NextResponse.json({ error: "Bạn cần đăng nhập để đánh giá." }, { status: 401 });

  const { error } = await client.from("destination_ratings").upsert(
    { user_id: user.id, destination_id: destinationId, rating },
    { onConflict: "user_id,destination_id" },
  );
  if (error) {
    console.error("Saving destination rating failed.", error.message);
    return NextResponse.json({ error: "Chưa thể lưu đánh giá. Vui lòng thử lại." }, { status: 500 });
  }

  const summaryResult = await client.rpc("get_destination_rating_summary", { p_destination_id: destinationId });
  if (summaryResult.error) {
    console.error("Loading destination rating summary failed.", summaryResult.error.message);
    return NextResponse.json({ error: "Đã lưu đánh giá nhưng chưa thể cập nhật điểm tổng." }, { status: 500 });
  }
  const summary = (summaryResult.data as Array<{ average_rating: number | string; rating_count: number | string }> | null)?.[0];
  const displaySummary = combineDemoAndRealRatings(destinationId, {
    average: Number(summary?.average_rating ?? rating),
    count: Number(summary?.rating_count ?? 1),
  });
  return NextResponse.json({
    rating,
    ...displaySummary,
  });
}
