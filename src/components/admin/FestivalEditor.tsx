"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { locales, localeNames, type Locale } from "@/i18n/config";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { FestivalSession } from "@/data/festival2026";
import type { FestivalContent, ManagedFestivalContent } from "@/services/content/festivalContent";

export function FestivalEditor({ initialContent }: { initialContent: ManagedFestivalContent }) {
  const [content, setContent] = useState<FestivalContent>(initialContent.content);
  const [published, setPublished] = useState(initialContent.published);
  const [locale, setLocale] = useState<Locale>("vi");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  function updateSession(id: string, change: Partial<FestivalSession>) {
    setContent((current) => ({ ...current, sessions: current.sessions.map((session) => session.id === id ? { ...session, ...change } : session) }));
  }
  function updateTranslation(id: string, field: "title" | "venue", value: string) {
    setContent((current) => ({ ...current, sessions: current.sessions.map((session) => session.id === id ? { ...session, [field]: { ...session[field], [locale]: value } } : session) }));
  }
  function addSession() {
    const session: FestivalSession = { id: crypto.randomUUID(), day: 7, time: "", title: { vi: "", en: "", ru: "" }, venue: { vi: "", en: "", ru: "" }, source: "", mapQuery: "" };
    setContent((current) => ({ ...current, sessions: [...current.sessions, session] }));
  }
  function updateHighlightImage(index: number, value: string) {
    setContent((current) => ({ ...current, highlightImages: current.highlightImages.map((image, position) => position === index ? value : image) }));
  }
  async function uploadImage(file?: File, slot: "hero" | number = "hero") {
    if (!file) return;
    if (file.size > 6 * 1024 * 1024) { setMessage("Ảnh vượt quá 6 MB."); return; }
    const client = createSupabaseBrowserClient();
    if (!client) { setMessage("Supabase chưa được cấu hình."); return; }
    setBusy(true); setMessage("");
    const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const path = `festival-2026/${crypto.randomUUID()}.${extension}`;
    const { error } = await client.storage.from("home-media").upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
    if (error) setMessage(`Không tải được ảnh: ${error.message}`);
    else {
      const { data } = client.storage.from("home-media").getPublicUrl(path);
      if (slot === "hero") setContent((current) => ({ ...current, heroImage: data.publicUrl }));
      else updateHighlightImage(slot, data.publicUrl);
      setMessage("Đã tải ảnh. Lưu nội dung để cập nhật thay đổi.");
    }
    setBusy(false);
  }
  async function save() {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/admin/festival", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content, published }) });
      const result = await response.json() as { error?: string };
      setMessage(response.ok ? published ? "Đã lưu và xuất bản nội dung Festival." : "Đã lưu bản nháp. Website tiếp tục hiển thị phiên bản đã xuất bản hoặc nội dung gốc." : result.error ?? "Không thể lưu nội dung Festival.");
    } catch { setMessage("Không thể kết nối máy chủ."); }
    setBusy(false);
  }

  return <div className="admin-editor">
    <div className="admin-editor-head"><div><Link href="/admin/destinations" className="admin-back"><ArrowLeft /> Quản lý nội dung</Link><p className="admin-kicker">Biên tập sự kiện</p><h1>Festival Trà 2026</h1><p>Cập nhật lời giới thiệu, hình ảnh và lịch hoạt động theo ngày.</p></div><div className="admin-editor-actions"><label className="admin-publish"><input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} /><span>{published ? "Xuất bản bản chỉnh sửa" : "Lưu làm bản nháp"}</span></label><button type="button" className="button button-primary" onClick={save} disabled={busy}><Save /> {busy ? "Đang lưu" : "Lưu nội dung"}</button></div></div>
    {message && <p className="admin-message" role="status">{message}</p>}
    <nav className="admin-language-tabs" aria-label="Ngôn ngữ đang biên tập">{locales.map((item) => <button type="button" className={locale === item ? "active" : ""} onClick={() => setLocale(item)} key={item}>{localeNames[item]}</button>)}</nav>
    <section className="admin-editor-section"><div className="admin-editor-section-head"><div><p className="admin-section-number">01 · Giới thiệu</p><h2>Hình ảnh và lời dẫn</h2><p>Ảnh chính xuất hiện ở đầu trang sự kiện và trên thẻ giới thiệu.</p></div></div><div className="admin-fields"><label className="admin-field admin-field-wide"><span>Đường dẫn ảnh chính</span><input value={content.heroImage} onChange={(event) => setContent((current) => ({ ...current, heroImage: event.target.value }))} /></label><label className="admin-field admin-field-wide"><span>Tải ảnh chính từ máy tính</span><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={busy} onChange={(event) => uploadImage(event.target.files?.[0])} /></label><label className="admin-field admin-field-wide"><span>Lời giới thiệu ({localeNames[locale]})</span><textarea rows={3} maxLength={500} value={content.intro[locale]} onChange={(event) => setContent((current) => ({ ...current, intro: { ...current.intro, [locale]: event.target.value } }))} /></label>{content.highlightImages.map((image, index) => <div className="admin-field" key={index}><span>Ảnh trải nghiệm {index + 1}</span><input value={image} aria-label={`Đường dẫn ảnh trải nghiệm ${index + 1}`} onChange={(event) => updateHighlightImage(index, event.target.value)} /><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" aria-label={`Tải ảnh trải nghiệm ${index + 1}`} disabled={busy} onChange={(event) => uploadImage(event.target.files?.[0], index)} /></div>)}</div></section>
    <section className="admin-editor-section"><div className="admin-editor-section-head"><div><p className="admin-section-number">02 · Chương trình</p><h2>Lịch hoạt động</h2><p>Chọn ngày, thêm thời gian và địa điểm cho từng hoạt động. Nội dung tên và địa điểm cần được biên tập theo từng ngôn ngữ.</p></div><button type="button" className="button button-primary" onClick={addSession}><Plus /> Thêm hoạt động</button></div><div className="admin-festival-list">{content.sessions.map((session) => <article key={session.id} className="admin-festival-session"><div className="admin-festival-meta"><label className="admin-field"><span>Ngày</span><select value={session.day} onChange={(event) => updateSession(session.id, { day: event.target.value === "all" ? "all" : Number(event.target.value) })}><option value="all">Cả kỳ</option>{[30, 31, 1, 2, 3, 4, 5, 6, 7].map((day) => <option value={day} key={day}>{day}/{day >= 30 ? "10" : "11"}</option>)}</select></label><label className="admin-field"><span>Giờ</span><input value={session.time} onChange={(event) => updateSession(session.id, { time: event.target.value })} /></label><button type="button" className="admin-festival-remove" aria-label="Xóa hoạt động" onClick={() => setContent((current) => ({ ...current, sessions: current.sessions.filter((item) => item.id !== session.id) }))}><Trash2 size={18} /></button></div><div className="admin-fields"><label className="admin-field"><span>Tên hoạt động ({localeNames[locale]})</span><input value={session.title[locale]} onChange={(event) => updateTranslation(session.id, "title", event.target.value)} /></label><label className="admin-field"><span>Địa điểm ({localeNames[locale]})</span><input value={session.venue[locale]} onChange={(event) => updateTranslation(session.id, "venue", event.target.value)} /></label><label className="admin-field admin-field-wide"><span>Đường dẫn thông tin tham khảo</span><input value={session.source} onChange={(event) => updateSession(session.id, { source: event.target.value })} /></label><label className="admin-field admin-field-wide"><span>Từ khóa tìm địa điểm trên bản đồ</span><input value={session.mapQuery ?? ""} onChange={(event) => updateSession(session.id, { mapQuery: event.target.value })} /></label></div></article>)}</div></section>
  </div>;
}
