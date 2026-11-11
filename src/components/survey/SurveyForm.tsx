"use client";
import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { analyticsService } from "@/services/analytics/analytics";
import { useLanguage } from "@/components/i18n/LanguageProvider";
export function SurveyForm() {
  const { t } = useLanguage();
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setState("sending");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/survey", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) });
      if (!response.ok) throw new Error("submit failed");
      analyticsService.track("survey_submit"); setState("success");
    } catch { setState("error"); }
  };
  if (state === "success") return <div className="survey-success"><CheckCircle2 /><h2>{t("survey.success.title")}</h2><p>{t("survey.success.body")}</p></div>;
  return <form className="survey-form" onSubmit={submit}>
    <fieldset><legend>{t("survey.q1")}</legend><div className="rating">{[1,2,3,4,5].map((value) => <label key={value}><input required type="radio" name="informationEase" value={value} /><span>{value}</span></label>)}</div><div className="rating-labels"><span>{t("survey.hard")}</span><span>{t("survey.easy")}</span></div></fieldset>
    <fieldset><legend>{t("survey.q2")}</legend><div className="rating">{[1,2,3,4,5].map((value) => <label key={value}><input required type="radio" name="recommendationFit" value={value} /><span>{value}</span></label>)}</div></fieldset>
    <fieldset><legend>{t("survey.q3")}</legend><select required name="mostUseful" defaultValue=""><option value="" disabled>{t("survey.choose")}</option><option>{t("survey.option.journeys")}</option><option>{t("survey.option.map")}</option><option>{t("survey.option.destinations")}</option><option>{t("survey.option.languages")}</option><option>{t("survey.option.products")}</option></select></fieldset>
    <fieldset><legend>{t("survey.q4")}</legend><div className="choice-grid three"><label className="radio-card"><input required type="radio" name="useAgain" value="yes" />{t("survey.yes")}</label><label className="radio-card"><input type="radio" name="useAgain" value="maybe" />{t("survey.maybe")}</label><label className="radio-card"><input type="radio" name="useAgain" value="no" />{t("survey.no")}</label></div></fieldset>
    <label className="textarea-label"><span>{t("survey.q5")}</span><textarea name="comment" rows={5} maxLength={800} placeholder={t("survey.placeholder")} /></label>
    {state === "error" && <p className="form-error" role="alert">{t("survey.error")}</p>}
    <button className="button button-primary" disabled={state === "sending"}>{state === "sending" ? t("survey.sending") : <>{t("survey.submit")} <Send /></>}</button>
  </form>;
}
