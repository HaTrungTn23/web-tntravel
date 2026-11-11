"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, LogIn, Star } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { DestinationRatingState } from "@/services/ratings/destinationRatings";

const copy = {
  vi: { title: "Đánh giá điểm đến", average: "Điểm trung bình", ratings: "lượt đánh giá", demo: "Điểm minh họa", yours: "Đánh giá của bạn", choose: "Chọn {star} sao", save: "Lưu đánh giá", saving: "Đang lưu...", saved: "Đã lưu đánh giá của bạn.", login: "Đăng nhập để đánh giá", error: "Chưa thể lưu đánh giá. Vui lòng thử lại.", unavailable: "Hệ thống đánh giá đang được thiết lập." },
  en: { title: "Rate this destination", average: "Average rating", ratings: "ratings", demo: "Demo rating", yours: "Your rating", choose: "Choose {star} stars", save: "Save rating", saving: "Saving...", saved: "Your rating has been saved.", login: "Sign in to rate", error: "Could not save your rating. Try again.", unavailable: "The rating system is being set up." },
  ru: { title: "Оцените место", average: "Средняя оценка", ratings: "оценок", demo: "Демонстрационная оценка", yours: "Ваша оценка", choose: "Выбрать {star} звёзд", save: "Сохранить", saving: "Сохранение...", saved: "Ваша оценка сохранена.", login: "Войдите, чтобы оценить", error: "Не удалось сохранить оценку. Попробуйте ещё раз.", unavailable: "Система оценок настраивается." },
} satisfies Record<Locale, Record<string, string>>;

export function DestinationRating({ destinationId, slug, locale, initialState }: { destinationId: string; slug: string; locale: Locale; initialState: DestinationRatingState }) {
  const text = copy[locale];
  const [selected, setSelected] = useState(initialState.userRating ?? 0);
  const [average, setAverage] = useState(initialState.average);
  const [count, setCount] = useState(initialState.count);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!initialState.available) return <section id="danh-gia" className="destination-rating"><div className="section-title"><Star /><h2>{text.title}</h2></div><p className="rating-unavailable">{text.unavailable}</p></section>;

  async function saveRating() {
    if (!selected || busy) return;
    setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch(`/api/ratings/${encodeURIComponent(destinationId)}`, {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ rating: selected }),
      });
      const result = await response.json() as { average?: number; count?: number; error?: string };
      if (!response.ok) throw new Error(result.error || text.error);
      setAverage(Number(result.average ?? average)); setCount(Number(result.count ?? count)); setMessage(text.saved);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : text.error);
    } finally { setBusy(false); }
  }

  const loginHref = `/auth?next=${encodeURIComponent(`/destinations/${slug}#danh-gia`)}`;
  return <section id="danh-gia" className="destination-rating">
    <div className="section-title"><Star /><h2>{text.title}</h2></div>
    <div className="rating-summary">
      <strong>{average.toFixed(1)}</strong>
      <div><span>{text.average}</span><small>{count} {text.ratings}</small></div>
    </div>
    {initialState.authenticated ? <div className="rating-editor">
      <p>{text.yours}</p>
      <div className="rating-stars" role="group" aria-label={text.yours}>{[1, 2, 3, 4, 5].map((star) => <button key={star} type="button" className={star <= selected ? "active" : ""} aria-label={text.choose.replace("{star}", String(star))} aria-pressed={star === selected} onClick={() => { setSelected(star); setMessage(""); }}><Star /></button>)}</div>
      <button className="button button-primary" type="button" disabled={!selected || busy} onClick={saveRating}>{busy ? text.saving : text.save}</button>
      {message && <p className="rating-message success" role="status"><CheckCircle2 /> {message}</p>}
      {error && <p className="rating-message error" role="alert">{error}</p>}
    </div> : <div className="rating-login-callout"><Link className="button button-primary" href={loginHref}><LogIn /> {text.login}</Link></div>}
  </section>;
}
