"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Check, Clock3, Sparkles, UsersRound } from "lucide-react";
import type { AudienceType, DurationCode, InterestTag, Season } from "@/domain/models";
import { getLocalizedLabels } from "@/lib/labels";
import { analyticsService } from "@/services/analytics/analytics";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function JourneySelector() {
  const router = useRouter();
  const { locale, t } = useLanguage();
  const labels = getLocalizedLabels(locale);
  const [duration, setDuration] = useState<DurationCode | "">("");
  const [interests, setInterests] = useState<InterestTag[]>([]);
  const [audience, setAudience] = useState<AudienceType>("family");
  const [season, setSeason] = useState<Season>("autumn");
  const [error, setError] = useState("");
  const toggle = (interest: InterestTag) => setInterests((current) => current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest]);
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!duration) { setError(t("selector.error.duration")); return; }
    if (!interests.length) { setError(t("selector.error.interests")); return; }
    setError("");
    analyticsService.track("journey_form_submit", { duration, interests, audience, season });
    const params = new URLSearchParams({ duration, interests: interests.join(","), audience, season });
    router.push(`/journeys?${params.toString()}`);
  };
  return <form className="selector-card" action="/journeys" method="get" onSubmit={submit}>
    <div className="selector-heading"><div><div className="eyebrow"><Sparkles size={14} /> {t("selector.kicker")}</div><h2>{t("selector.title")}</h2></div></div>
    <div className="selector-fields">
    <fieldset><legend><Clock3 /> {t("selector.duration")}</legend><div className="choice-grid four">{Object.entries(labels.duration).map(([value, label]) => {
      const selected = duration === value;
      return <label className={selected ? "choice active" : "choice"} key={value}>
        <input type="radio" name="duration" value={value} checked={selected} required onChange={() => { setDuration(value as DurationCode); setError(""); }} />
        {selected && <Check size={15} />}{label}
      </label>;
    })}</div></fieldset>
    <fieldset><legend><Sparkles /> {t("selector.interests")}</legend><div className="choice-grid tags">{Object.entries(labels.interest).map(([value, label]) => {
      const selected = interests.includes(value as InterestTag);
      return <label className={selected ? "choice active" : "choice"} key={value}>
        <input type="checkbox" name="interests" value={value} checked={selected} onChange={() => toggle(value as InterestTag)} />
        {selected && <Check size={15} />}{label}
      </label>;
    })}</div></fieldset>
    <div className="selector-split">
      <label><span><UsersRound /> {t("selector.audience")}</span><select name="audience" value={audience} onChange={(event) => setAudience(event.target.value as AudienceType)}>{Object.entries(labels.audience).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
      <label><span>{t("selector.season")}</span><select name="season" value={season} onChange={(event) => setSeason(event.target.value as Season)}>{Object.entries(labels.season).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
    </div>
    {error && <p className="form-error" role="alert">{error}</p>}
    <button className="button button-primary selector-submit" type="submit">{t("selector.submit")} <ArrowRight /></button>
    </div>
  </form>;
}
