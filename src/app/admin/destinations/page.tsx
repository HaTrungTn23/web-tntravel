import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CalendarDays, CircleCheck, CircleDashed, LayoutGrid, MapPin } from "lucide-react";
import { AdminSignOutButton } from "@/components/admin/AdminSignOutButton";
import { KnowledgeSyncButton } from "@/components/admin/KnowledgeSyncButton";
import { TranslationSyncButton } from "@/components/admin/TranslationSyncButton";
import { destinationRepository } from "@/repositories";
import { getAdminSession } from "@/services/admin/auth";

export default async function AdminDestinationsPage() {
  const session = await getAdminSession();
  if (!session.configured) redirect("/admin");
  if (!session.user) redirect("/admin/login");
  if (!session.isAdmin || !session.client) redirect("/admin");
  const { data, error } = await session.client.from("destination_content").select("destination_id,is_published");
  const statuses = new Map((data ?? []).map((item) => [item.destination_id, item]));
  const destinations = destinationRepository.getAll();
  const publishedCount = destinations.filter((destination) => statuses.get(destination.id)?.is_published).length;
  const draftCount = destinations.filter((destination) => statuses.get(destination.id)?.is_published === false).length;
  const originalCount = destinations.length - publishedCount - draftCount;

  return <main className="admin-page">
    <div className="admin-page-head"><div><p className="admin-kicker">Không gian biên tập</p><h1>Quản lý nội dung</h1><p>Chọn phần bạn muốn cập nhật. Nội dung điểm đến, hình ảnh và lịch sự kiện được quản lý tại đây.</p></div><AdminSignOutButton /></div>

    {error && <p className="admin-status-warning" role="status">Chưa tải được trạng thái xuất bản. Danh sách điểm đến vẫn có thể mở để biên tập.</p>}
    {!error && <section className="admin-overview" aria-label="Tổng quan điểm đến">
      <div><MapPin /><strong>{destinations.length}</strong><span>Điểm đến</span></div>
      <div><CircleCheck /><strong>{publishedCount}</strong><span>Đã xuất bản</span></div>
      <div><CircleDashed /><strong>{draftCount}</strong><span>Bản chỉnh sửa đang lưu nháp</span></div>
      <div><LayoutGrid /><strong>{originalCount}</strong><span>Đang dùng nội dung gốc</span></div>
    </section>}

    <section className="admin-quick-section" aria-labelledby="admin-other-content-title"><div className="admin-section-intro"><p className="admin-kicker">Nội dung nổi bật</p><h2 id="admin-other-content-title">Trang chủ và sự kiện</h2><p>Biên tập các khu vực giới thiệu xuất hiện trước danh sách điểm đến.</p></div><div className="admin-quick-links"><Link href="/admin/home"><span className="admin-quick-icon"><LayoutGrid /></span><span><b>Trang chủ</b><small>Tiêu đề, ảnh và thứ tự các thẻ khám phá</small></span><ArrowRight /></Link><Link href="/admin/festival"><span className="admin-quick-icon"><CalendarDays /></span><span><b>Festival Trà 2026</b><small>Ảnh giới thiệu và lịch hoạt động</small></span><ArrowRight /></Link></div></section>

    <section className="admin-quick-section" aria-labelledby="admin-destinations-title"><div className="admin-section-intro"><p className="admin-kicker">Thư viện điểm đến</p><h2 id="admin-destinations-title">Chọn một địa điểm để biên tập</h2><p>Cập nhật thẻ giới thiệu, bài viết, ảnh và video. “Nội dung gốc” vẫn hiển thị trên website cho đến khi bạn xuất bản bản chỉnh sửa.</p></div><div className="admin-destination-list">{destinations.map((destination) => {
      const status = statuses.get(destination.id);
      const state = error ? "Chưa tải trạng thái" : status ? (status.is_published ? "Đã xuất bản" : "Bản nháp") : "Nội dung gốc";
      return <Link href={`/admin/destinations/${destination.id}`} key={destination.id}><div>{status?.is_published ? <CircleCheck /> : <CircleDashed />}<span><b>{destination.name}</b><small>{state}</small></span></div><ArrowRight /></Link>;
    })}</div></section>

    <section className="admin-tools" aria-labelledby="admin-tools-title"><div><p className="admin-kicker">Công cụ hỗ trợ</p><h2 id="admin-tools-title">Đồng bộ dữ liệu</h2><p>Dùng sau khi chỉnh sửa nhiều nội dung hoặc khi cần làm mới câu trả lời của chatbot.</p></div><div className="admin-page-actions"><TranslationSyncButton /><KnowledgeSyncButton /></div></section>
  </main>;
}
