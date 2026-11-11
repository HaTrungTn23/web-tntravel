"use client";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
export function MiniChallenge({ destinationId }: { destinationId: string }) {
  const { t } = useLanguage();
  const tasks = [t("challenge.task1"), t("challenge.task2"), t("challenge.task3")];
  const key = `tn-challenge-${destinationId}`;
  const [done, setDone] = useState<number[]>([]);
  useEffect(() => {
    const timer = window.setTimeout(() => { try { setDone(JSON.parse(localStorage.getItem(key) ?? '[]') as number[]); } catch { setDone([]); } }, 0);
    return () => window.clearTimeout(timer);
  }, [key]);
  const toggle = (index: number) => { const next = done.includes(index) ? done.filter((item) => item !== index) : [...done, index]; setDone(next); try { localStorage.setItem(key, JSON.stringify(next)); } catch {} };
  return <div className="challenge"><div><span>{t("challenge.label")}</span><h3>{t("challenge.title")}</h3></div>{tasks.map((task, index) => <label key={task}><input type="checkbox" checked={done.includes(index)} onChange={() => toggle(index)} /><CheckCircle2 /> {task}</label>)}</div>;
}
