"use client";
/* eslint-disable @next/next/no-img-element -- admin previews use arbitrary Supabase Storage URLs */

import { useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowUp, ImagePlus, LoaderCircle, Save, Trash2 } from "lucide-react";
import { localeNames, locales, type Locale } from "@/i18n/config";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { createGenericHomeHeroTranslations, homeHeroCopyPresets, type HomeHeroImage, type HomeGalleryContent, type ManagedHomeGalleryContent } from "@/services/content/homeGalleryContent";

type SectionId = keyof HomeGalleryContent["sections"];

export function HomeGalleryEditor({ initialContent, defaultHeroSlides }: { initialContent: ManagedHomeGalleryContent; defaultHeroSlides: HomeHeroImage[] }) {
  const [content, setContent] = useState<HomeGalleryContent>(() => ({ ...initialContent.content, heroImages: initialContent.content.heroImages.length ? initialContent.content.heroImages : defaultHeroSlides }));
  const [published, setPublished] = useState(initialContent.published);
  const [locale, setLocale] = useState<Locale>("vi");
  const [busy, setBusy] = useState(false);
  const [uploadingId, setUploadingId] = useState("");
  const [heroUploading, setHeroUploading] = useState(false);
  const [message, setMessage] = useState("");

  function updateSection(sectionId: SectionId, field: "titleA" | "titleB" | "body", value: string) {
    setContent((current) => ({ ...current, sections: { ...current.sections, [sectionId]: { ...current.sections[sectionId], [locale]: { ...current.sections[sectionId][locale], [field]: value } } } }));
  }
  function updateStationText(stationId: string, field: "title" | "description", value: string) {
    setContent((current) => ({ ...current, stations: current.stations.map((station) => station.stationId === stationId ? { ...station, translations: { ...station.translations, [locale]: { ...station.translations[locale], [field]: value } } } : station) }));
  }
  function updateStationImage(stationId: string, imageUrl: string, imageAlt?: string) {
    setContent((current) => ({ ...current, stations: current.stations.map((station) => station.stationId === stationId ? { ...station, imageUrl, imageAlt: imageAlt ?? station.imageAlt } : station) }));
  }
  function moveStation(index: number, direction: -1 | 1) {
    setContent((current) => {
      const stations = [...current.stations]; const target = index + direction;
      if (target < 0 || target >= stations.length) return current;
      [stations[index], stations[target]] = [stations[target], stations[index]];
      return { ...current, stations: stations.map((station, sortOrder) => ({ ...station, sortOrder })) };
    });
  }
  function moveHeroImage(index: number, direction: -1 | 1) {
    setContent((current) => {
      const heroImages = [...current.heroImages];
      const target = index + direction;
      if (target < 0 || target >= heroImages.length) return current;
      [heroImages[index], heroImages[target]] = [heroImages[target], heroImages[index]];
      return { ...current, heroImages };
    });
  }
  function updateHeroText(id: string, field: "kicker" | "titleA" | "titleB" | "body", value: string) {
    setContent((current) => ({ ...current, heroImages: current.heroImages.map((image) => image.id === id ? {
      ...image,
      translations: { ...image.translations, [locale]: { ...image.translations[locale], [field]: value } },
    } : image) }));
  }
  async function uploadHeroImages(files: FileList | null, replaceId?: string) {
    if (!files?.length) return;
    const client = createSupabaseBrowserClient();
    if (!client) { setMessage("Supabase chưa được cấu hình."); return; }
    const available = replaceId ? 1 : 12 - content.heroImages.length;
    if (available < 1) { setMessage("Phần tiêu đề có thể lưu tối đa 12 ảnh."); return; }
    const selected = Array.from(files).slice(0, available);
    const errors: string[] = [];
    setHeroUploading(true);
    setMessage("");
    for (const file of selected) {
      if (file.size > 6 * 1024 * 1024) { errors.push(`${file.name} vượt quá 6 MB`); continue; }
      const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const path = `hero/${crypto.randomUUID()}.${extension}`;
      try {
        const { error } = await client.storage.from("home-media").upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
        if (error) { errors.push(`${file.name}: ${error.message}`); continue; }
        const { data } = client.storage.from("home-media").getPublicUrl(path);
        const alt = file.name.replace(/\.[^.]+$/, "");
        setContent((current) => ({ ...current, heroImages: replaceId
          ? current.heroImages.map((image) => image.id === replaceId ? { ...image, url: data.publicUrl, alt } : image)
          : [...current.heroImages, { id: crypto.randomUUID(), url: data.publicUrl, alt, translations: createGenericHomeHeroTranslations() }],
        }));
      } catch { errors.push(`${file.name}: không thể tải ảnh`); }
    }
    setHeroUploading(false);
    setMessage(errors.length ? `Một số ảnh chưa được tải lên: ${errors.join("; ")}.` : `${replaceId ? "Đã thay ảnh" : "Đã thêm ảnh"}. Nhấn Lưu trang chủ để áp dụng.`);
  }
  async function uploadImage(stationId: string, file?: File) {
    if (!file) return;
    if (file.size > 6 * 1024 * 1024) { setMessage(`Ảnh ${file.name} vượt quá 6 MB.`); return; }
    const client = createSupabaseBrowserClient();
    if (!client) { setMessage("Supabase chưa được cấu hình."); return; }
    setUploadingId(stationId); setMessage("");
    const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const path = `stations/${stationId}/${crypto.randomUUID()}.${extension}`;
    const { error } = await client.storage.from("home-media").upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
    if (error) setMessage(`Không tải được ${file.name}: ${error.message}`);
    else {
      const { data } = client.storage.from("home-media").getPublicUrl(path);
      updateStationImage(stationId, data.publicUrl, file.name.replace(/\.[^.]+$/, ""));
    }
    setUploadingId("");
  }
  async function save() {
    setBusy(true); setMessage("");
    const response = await fetch("/api/admin/home-galleries", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content, published }) });
    const result = await response.json() as { error?: string; translated?: number; translationErrors?: string[] };
    if (response.ok) {
      const saved = published ? "Đã lưu và xuất bản nội dung trang chủ." : "Đã lưu bản nháp. Trang chủ tiếp tục hiển thị phiên bản đã xuất bản hoặc nội dung gốc.";
      const translation = result.translationErrors?.length
        ? ` Bản gốc đã lưu nhưng có lỗi dịch: ${result.translationErrors.join("; ")}`
        : result.translated ? ` Đã cập nhật ${result.translated} bản dịch Anh/Nga.` : " Bản dịch hiện tại đã đồng bộ.";
      setMessage(saved + translation);
    } else setMessage(result.error ?? "Không thể lưu nội dung.");
    setBusy(false);
  }

  return <div className="admin-editor">
    <div className="admin-editor-head"><div><Link href="/admin/destinations" className="admin-back"><ArrowLeft /> Quản lý nội dung</Link><p className="admin-kicker">Biên tập trang chủ</p><h1>Các khu vực khám phá</h1><p>Chỉnh tiêu đề, hình ảnh và thứ tự thẻ trên trang chủ.</p></div><div className="admin-editor-actions"><label className="admin-publish"><input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} /><span>{published ? "Xuất bản bản chỉnh sửa" : "Lưu làm bản nháp"}</span></label><button type="button" className="button button-primary" onClick={save} disabled={busy || heroUploading || Boolean(uploadingId)}>{busy ? <LoaderCircle className="spin" /> : <Save />} {busy ? "Đang lưu" : "Lưu trang chủ"}</button></div></div>
    {message && <p className="admin-message" role="status">{message}</p>}
    <nav className="admin-language-tabs" aria-label="Ngôn ngữ đang biên tập">{locales.map((item) => <button type="button" className={locale === item ? "active" : ""} onClick={() => setLocale(item)} key={item}>{localeNames[item]}</button>)}</nav>
    <section className="admin-editor-section">
      <div className="admin-editor-section-head">
        <div><p className="admin-section-number">01 · Tiêu đề đầu trang</p><h2>Ảnh và câu chuyện đi cùng nhau</h2><p>Mỗi slide gồm ảnh, dòng dẫn, tiêu đề và mô tả riêng; toàn bộ đổi cùng lúc sau 5 giây. Tách câu dẫn và tên địa phương vào hai ô tiêu đề: tên dài sẽ nằm nguyên trên dòng thứ hai. Chọn ngôn ngữ ở trên để biên tập từng bản dịch.</p></div>
        <label className="button button-secondary admin-upload"><ImagePlus /> {heroUploading ? "Đang tải ảnh" : "Thêm slide"}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple disabled={heroUploading || content.heroImages.length >= 12} onChange={(event) => { void uploadHeroImages(event.target.files); event.target.value = ""; }} /></label>
      </div>
      <div className="admin-hero-image-list">{content.heroImages.map((image, index) => <article key={image.id}>
        <div className="admin-hero-image-media"><div className="admin-hero-image-preview"><img src={image.url} alt="" /><span>Slide {index + 1}</span></div><label className="admin-hero-replace"><ImagePlus /> {heroUploading ? "Đang tải" : "Đổi ảnh"}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={heroUploading} onChange={(event) => { void uploadHeroImages(event.target.files, image.id); event.target.value = ""; }} /></label></div>
        <div className="admin-hero-image-copy">
          <label className="admin-field"><span>Mô tả ảnh</span><input maxLength={240} value={image.alt} onChange={(event) => setContent((current) => ({ ...current, heroImages: current.heroImages.map((item) => item.id === image.id ? { ...item, alt: event.target.value } : item) }))} /></label>
          <label className="admin-field"><span>Dòng dẫn ({localeNames[locale]})</span><input maxLength={120} value={image.translations[locale].kicker} onChange={(event) => updateHeroText(image.id, "kicker", event.target.value)} /></label>
          <div className="admin-hero-title-fields">
            <label className="admin-field"><span>Câu dẫn trước tên địa phương</span><input maxLength={120} value={image.translations[locale].titleA} onChange={(event) => updateHeroText(image.id, "titleA", event.target.value)} /></label>
            <label className="admin-field"><span>Tên địa phương hoặc cụm nhấn mạnh</span><input maxLength={120} value={image.translations[locale].titleB} onChange={(event) => updateHeroText(image.id, "titleB", event.target.value)} /></label>
          </div>
          <label className="admin-field"><span>Mô tả ({localeNames[locale]})</span><textarea rows={3} maxLength={500} value={image.translations[locale].body} onChange={(event) => updateHeroText(image.id, "body", event.target.value)} /></label>
          <div className="admin-hero-copy-presets"><span>Gợi ý nội dung:</span>{homeHeroCopyPresets.map((preset) => <button type="button" key={preset.id} onClick={() => setContent((current) => ({ ...current, heroImages: current.heroImages.map((item) => item.id === image.id ? { ...item, translations: structuredClone(preset.translations) } : item) }))}>{preset.label}</button>)}<small>Áp dụng cho cả ba ngôn ngữ.</small></div>
        </div>
        <div className="admin-hero-image-controls"><button type="button" aria-label={`Chuyển slide ${index + 1} lên`} disabled={index === 0} onClick={() => moveHeroImage(index, -1)}><ArrowUp /></button><button type="button" aria-label={`Chuyển slide ${index + 1} xuống`} disabled={index === content.heroImages.length - 1} onClick={() => moveHeroImage(index, 1)}><ArrowDown /></button><button type="button" className="danger" aria-label={`Xóa slide ${index + 1}`} disabled={content.heroImages.length === 1} onClick={() => setContent((current) => ({ ...current, heroImages: current.heroImages.filter((item) => item.id !== image.id) }))}><Trash2 /></button></div>
      </article>)}</div>
    </section>

    <section className="admin-editor-section"><div className="admin-editor-section-head"><div><p className="admin-section-number">02 · Tiêu đề các khu vực</p><h2>Lời dẫn cho từng khu vực</h2><p>Đang biên tập bản {localeNames[locale]}. Mỗi ngôn ngữ có nội dung riêng.</p></div></div><div className="admin-home-sections">{(["stations", "destinations"] as SectionId[]).map((sectionId) => <fieldset key={sectionId}><legend>{sectionId === "stations" ? "Chọn một trạm" : "Một điểm đến. Nhiều câu chuyện."}</legend><label className="admin-field"><span>Tiêu đề dòng đầu</span><input maxLength={120} value={content.sections[sectionId][locale].titleA} onChange={(event) => updateSection(sectionId, "titleA", event.target.value)} /></label><label className="admin-field"><span>Tiêu đề nhấn mạnh</span><input maxLength={120} value={content.sections[sectionId][locale].titleB} onChange={(event) => updateSection(sectionId, "titleB", event.target.value)} /></label><label className="admin-field"><span>Mô tả</span><textarea rows={3} maxLength={600} value={content.sections[sectionId][locale].body} onChange={(event) => updateSection(sectionId, "body", event.target.value)} /></label></fieldset>)}</div></section>

    <section className="admin-editor-section"><div className="admin-editor-section-head"><div><p className="admin-section-number">03 · Thẻ khám phá</p><h2>Các trạm trên trang chủ</h2><p>Ảnh dùng chung cho mọi ngôn ngữ. Tên và mô tả theo ngôn ngữ đang chọn ở trên. Dùng mũi tên để đổi thứ tự thẻ.</p></div></div><div className="admin-station-editor-list">{content.stations.map((station, index) => <article className="admin-station-editor" key={station.stationId}><div className="admin-station-preview">{station.imageUrl ? <img src={station.imageUrl} alt="" /> : <ImagePlus />}<label><ImagePlus /> {uploadingId === station.stationId ? "Đang tải" : "Đổi ảnh"}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={Boolean(uploadingId)} onChange={(event) => uploadImage(station.stationId, event.target.files?.[0])} /></label></div><div className="admin-station-fields"><label className="admin-field"><span>Tên thẻ</span><input maxLength={120} value={station.translations[locale].title} onChange={(event) => updateStationText(station.stationId, "title", event.target.value)} /></label><label className="admin-field"><span>Mô tả</span><textarea rows={3} maxLength={500} value={station.translations[locale].description} onChange={(event) => updateStationText(station.stationId, "description", event.target.value)} /></label><label className="admin-field"><span>Mô tả ảnh cho người dùng trình đọc màn hình</span><input maxLength={240} value={station.imageAlt} onChange={(event) => updateStationImage(station.stationId, station.imageUrl, event.target.value)} /></label></div><div className="admin-station-controls"><button type="button" aria-label="Chuyển thẻ lên" disabled={index === 0} onClick={() => moveStation(index, -1)}><ArrowUp /></button><button type="button" aria-label="Chuyển thẻ xuống" disabled={index === content.stations.length - 1} onClick={() => moveStation(index, 1)}><ArrowDown /></button><button type="button" className="danger" aria-label="Bỏ ảnh tùy chỉnh" disabled={!station.imageUrl} onClick={() => updateStationImage(station.stationId, "")}><Trash2 /></button></div></article>)}</div></section>
  </div>;
}
