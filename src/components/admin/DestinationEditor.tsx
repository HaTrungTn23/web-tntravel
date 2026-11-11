"use client";
/* eslint-disable @next/next/no-img-element -- admin previews use arbitrary Supabase Storage URLs */

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowUp, Check, ImagePlus, LoaderCircle, Play, Save, Star, Trash2 } from "lucide-react";
import type { Media } from "@/domain/models";
import type { DestinationProfile } from "@/data/destinationProfiles";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getYouTubeId } from "@/lib/youtube";
import type { ManagedDestinationContent } from "@/services/content/destinationContent";

type DestinationIdentity = { id: string; name: string; slug: string };
type ArrayField = "introduction" | "reasons" | "highlights" | "activities" | "localCulture" | "bestTime" | "audience" | "locationAndConnections";
const arrayFields: Array<{ key: ArrayField; label: string; hint: string }> = [
  { key: "introduction", label: "Giới thiệu", hint: "Mỗi đoạn một dòng" },
  { key: "reasons", label: "Vì sao nên khám phá", hint: "Mỗi lý do một dòng" },
  { key: "highlights", label: "Câu chuyện / đặc trưng nổi bật", hint: "Mỗi đoạn một dòng" },
  { key: "activities", label: "Các hoạt động tham quan, khám phá", hint: "Mỗi hoạt động một dòng" },
  { key: "localCulture", label: "Ẩm thực / sản phẩm / văn hóa", hint: "Có thể để trống nếu không phù hợp" },
  { key: "bestTime", label: "Thời điểm phù hợp", hint: "Mỗi gợi ý một dòng" },
  { key: "audience", label: "Phù hợp với ai", hint: "Mỗi nhóm khách một dòng" },
  { key: "locationAndConnections", label: "Vị trí và điểm kết hợp", hint: "Mỗi thông tin một dòng" },
];

export function DestinationEditor({ destination, initialContent }: { destination: DestinationIdentity; initialContent: ManagedDestinationContent }) {
  const [profile, setProfile] = useState<DestinationProfile>(initialContent.profile);
  const [media, setMedia] = useState<Media[]>(initialContent.media);
  const [cardTitle, setCardTitle] = useState(initialContent.cardTitle);
  const [cardDescription, setCardDescription] = useState(initialContent.cardDescription);
  const [published, setPublished] = useState(initialContent.published);
  const [videoUrl, setVideoUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const imageCount = useMemo(() => media.filter((item) => item.type === "image").length, [media]);
  const videoCount = media.length - imageCount;

  function setArrayField(key: ArrayField, value: string) {
    setProfile((current) => ({ ...current, [key]: value.split("\n").map((line) => line.trim()).filter(Boolean) }));
  }
  function moveMedia(index: number, direction: -1 | 1) {
    setMedia((current) => { const next = [...current]; const target = index + direction; if (target < 0 || target >= next.length) return current; [next[index], next[target]] = [next[target], next[index]]; return next; });
  }
  function setCover(id: string) {
    setMedia((current) => current.map((item) => ({ ...item, isCover: item.type === "image" && item.id === id })));
  }
  function addVideo() {
    const id = getYouTubeId(videoUrl);
    if (!id) { setMessage("URL YouTube chưa hợp lệ."); return; }
    setMedia((current) => [...current, { id: crypto.randomUUID(), type: "youtube", url: videoUrl.trim(), thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, alt: `Video về ${destination.name}`, caption: "", order: current.length }]);
    setVideoUrl(""); setMessage("");
  }
  async function uploadImages(files: FileList | null) {
    if (!files?.length) return;
    const client = createSupabaseBrowserClient();
    if (!client) { setMessage("Supabase chưa được cấu hình."); return; }
    setUploading(true); setMessage(""); const additions: Media[] = [];
    for (const file of Array.from(files)) {
      if (file.size > 6 * 1024 * 1024) { setMessage(`Ảnh ${file.name} vượt quá 6 MB.`); continue; }
      const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const path = `${destination.id}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
      const { error } = await client.storage.from("destination-media").upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
      if (error) { setMessage(`Không tải được ${file.name}: ${error.message}`); continue; }
      const { data } = client.storage.from("destination-media").getPublicUrl(path);
      additions.push({ id: crypto.randomUUID(), type: "image", url: data.publicUrl, alt: file.name.replace(/\.[^.]+$/, ""), caption: "", isCover: imageCount === 0 && additions.length === 0, order: media.length + additions.length });
    }
    if (additions.length) setMedia((current) => [...current, ...additions]);
    setUploading(false);
  }
  async function save() {
    setBusy(true); setMessage("");
    const response = await fetch(`/api/admin/destinations/${destination.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profile, media, cardTitle, cardDescription, published }) });
    const result = await response.json() as { error?: string; translated?: number; translationErrors?: string[] };
    if (response.ok) {
      const saved = published ? "Đã lưu và xuất bản bản chỉnh sửa." : "Đã lưu bản nháp. Website tiếp tục hiển thị phiên bản đã xuất bản hoặc nội dung gốc.";
      const translation = result.translationErrors?.length
        ? ` Bản gốc đã lưu nhưng có lỗi dịch: ${result.translationErrors.join("; ")}`
        : result.translated ? ` Đã cập nhật ${result.translated} bản dịch Anh/Nga.` : " Bản dịch hiện tại đã đồng bộ.";
      setMessage(saved + translation);
    } else setMessage(result.error ?? "Không thể lưu nội dung.");
    setBusy(false);
  }

  return <div className="admin-editor">
    <div className="admin-editor-head"><div><Link href="/admin/destinations" className="admin-back"><ArrowLeft /> Danh sách địa điểm</Link><p className="admin-kicker">Biên tập điểm đến</p><h1>{destination.name}</h1><p>Biên tập thẻ giới thiệu, bài viết và thư viện hình ảnh trong cùng một nơi.</p></div><div className="admin-editor-actions"><label className="admin-publish"><input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} /><span>{published ? "Xuất bản bản chỉnh sửa" : "Lưu làm bản nháp"}</span></label><button type="button" className="button button-primary" onClick={save} disabled={busy}>{busy ? <LoaderCircle className="spin" /> : <Save />} {busy ? "Đang lưu" : "Lưu nội dung"}</button></div></div>

    {message && <p className="admin-message" role="status">{message}</p>}
    <nav className="admin-editor-jump" aria-label="Các phần của điểm đến"><a href="#admin-card">Thẻ giới thiệu</a><a href="#admin-article">Bài viết</a><a href="#admin-media">Ảnh và video</a></nav>
    <section className="admin-editor-section" id="admin-card"><div className="admin-editor-section-head"><div><p className="admin-section-number">01 · Thẻ giới thiệu</p><h2>Ấn tượng đầu tiên</h2><p>Tên và mô tả xuất hiện trên thẻ trong mục “Một điểm đến. Nhiều câu chuyện.” Ảnh bìa chọn ở phần thư viện bên dưới.</p></div></div><div className="admin-fields"><label className="admin-field"><span>Tên trên thẻ</span><input value={cardTitle} maxLength={120} onChange={(event) => setCardTitle(event.target.value)} /></label><label className="admin-field admin-field-wide"><span>Mô tả ngắn</span><textarea rows={3} value={cardDescription} maxLength={500} onChange={(event) => setCardDescription(event.target.value)} /></label></div></section>
    <section className="admin-editor-section" id="admin-article"><div className="admin-editor-section-head"><div><p className="admin-section-number">02 · Bài viết</p><h2>Câu chuyện của điểm đến</h2><p>Mỗi dòng trong các ô nội dung sẽ trở thành một đoạn hoặc một ý riêng trên trang chi tiết.</p></div></div><div className="admin-fields"><label className="admin-field admin-field-wide"><span>Tiêu đề ngắn</span><input value={profile.tagline} onChange={(event) => setProfile((current) => ({ ...current, tagline: event.target.value }))} /></label>{arrayFields.map((field) => <label className="admin-field" key={field.key}><span>{field.label}</span><small>{field.hint}</small><textarea rows={field.key === "introduction" || field.key === "highlights" ? 5 : 4} value={(profile[field.key] ?? []).join("\n")} onChange={(event) => setArrayField(field.key, event.target.value)} /></label>)}<label className="admin-field admin-field-wide"><span>Ghi chú tham khảo</span><small>Dùng để lưu tài liệu nguồn phục vụ biên tập và đồng bộ chatbot.</small><textarea rows={3} value={profile.sourceNote} onChange={(event) => setProfile((current) => ({ ...current, sourceNote: event.target.value }))} /></label></div></section>

    <section className="admin-editor-section" id="admin-media"><div className="admin-editor-section-head"><div><p className="admin-section-number">03 · Thư viện</p><h2>Hình ảnh và video</h2><p>{imageCount} ảnh, {videoCount} video. Ảnh được chọn làm bìa sẽ xuất hiện trên thẻ giới thiệu; thứ tự bên dưới cũng là thứ tự trên website.</p></div><label className="button button-secondary admin-upload"><ImagePlus /> {uploading ? "Đang tải ảnh" : "Thêm ảnh"}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple disabled={uploading} onChange={(event) => uploadImages(event.target.files)} /></label></div><div className="admin-video-add"><Play /><input value={videoUrl} onChange={(event) => setVideoUrl(event.target.value)} placeholder="Dán URL YouTube" aria-label="Đường dẫn video YouTube" /><button type="button" onClick={addVideo}>Thêm video</button></div>{media.length ? <div className="admin-media-list">{media.map((item, index) => <article key={item.id}><div className="admin-media-preview">{item.type === "image" ? <img src={item.url} alt="" /> : <><img src={item.thumbnailUrl} alt="" /><Play /></>}</div><div className="admin-media-fields"><b>{item.type === "image" ? "Hình ảnh" : "YouTube"}</b><input value={item.alt} placeholder="Mô tả ảnh" aria-label={`Mô tả media ${index + 1}`} onChange={(event) => setMedia((current) => current.map((entry) => entry.id === item.id ? { ...entry, alt: event.target.value } : entry))} /><input value={item.caption ?? ""} placeholder="Chú thích (không bắt buộc)" aria-label={`Chú thích media ${index + 1}`} onChange={(event) => setMedia((current) => current.map((entry) => entry.id === item.id ? { ...entry, caption: event.target.value } : entry))} /></div><div className="admin-media-controls">{item.type === "image" && <button type="button" className={item.isCover ? "active" : ""} aria-label="Chọn làm ảnh bìa" onClick={() => setCover(item.id)}>{item.isCover ? <Check /> : <Star />}</button>}<button type="button" aria-label="Chuyển lên" disabled={index === 0} onClick={() => moveMedia(index, -1)}><ArrowUp /></button><button type="button" aria-label="Chuyển xuống" disabled={index === media.length - 1} onClick={() => moveMedia(index, 1)}><ArrowDown /></button><button type="button" className="danger" aria-label="Xóa media" onClick={() => setMedia((current) => current.filter((entry) => entry.id !== item.id))}><Trash2 /></button></div></article>)}</div> : <div className="admin-empty-media"><ImagePlus /><b>Chưa có hình ảnh hoặc video</b><span>Thêm ảnh từ máy tính hoặc dán URL YouTube.</span></div>}</section>
  </div>;
}
