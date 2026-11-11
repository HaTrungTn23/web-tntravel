"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Bot, ExternalLink, MessageCircle, Send, Sparkles, User, X } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import type { Locale } from "@/i18n/config";
import type { ChatJourneySuggestion, ChatMessage, ChatResponse, ChatSource } from "@/services/chatbot/types";

type UiMessage = ChatMessage & { sources?: ChatSource[]; journeys?: ChatJourneySuggestion[]; mode?: ChatResponse["mode"] };

const welcome: Record<Locale, string> = {
  vi: "Bạn muốn khám phá Thái Nguyên theo cách nào? Mình có thể gợi ý điểm đến, lịch trình và đặc sản địa phương.",
  en: "How would you like to explore Thai Nguyen? I can suggest places, itineraries and local specialties.",
  ru: "Как вы хотите познакомиться с Тхайнгуеном? Я помогу выбрать места, маршруты и местные продукты.",
};

const starterPrompts: Record<Locale, string[]> = {
  vi: ["Gợi ý lịch trình 1 ngày", "Tân Cương có gì thú vị?", "Tìm hiểu đặc sản địa phương"],
  en: ["Suggest a one-day itinerary", "What is special about Tan Cuong?", "Show local specialties"],
  ru: ["Предложи маршрут на один день", "Чем интересен Танкыонг?", "Расскажи о местных продуктах"],
};

const chatUi: Record<Locale, Record<string, string>> = {
  vi: { title: "Trợ lý Thái Nguyên", close: "Đóng trợ lý", sources: "Nguồn tham khảo", journeys: "Hành trình gợi ý", viewJourney: "Xem chi tiết", halfDay: "Nửa ngày", day: "ngày", thinking: "Đang tìm trong dữ liệu", retry: "Thử lại", question: "Câu hỏi của bạn", placeholder: "Hỏi về lịch trình, địa điểm, đặc sản...", send: "Gửi câu hỏi", open: "Mở trợ lý du lịch", toggle: "Hỏi trợ lý", error: "Không thể nhận câu trả lời." },
  en: { title: "Thai Nguyen assistant", close: "Close assistant", sources: "Sources", journeys: "Suggested itineraries", viewJourney: "View details", halfDay: "Half day", day: "days", thinking: "Searching the knowledge base", retry: "Try again", question: "Your question", placeholder: "Ask about itineraries, places or specialties...", send: "Send question", open: "Open travel assistant", toggle: "Ask assistant", error: "Could not receive an answer." },
  ru: { title: "Помощник по Тхайнгуену", close: "Закрыть помощника", sources: "Источники", journeys: "Рекомендуемые маршруты", viewJourney: "Подробнее", halfDay: "Полдня", day: "дн.", thinking: "Поиск в базе знаний", retry: "Повторить", question: "Ваш вопрос", placeholder: "Спросите о маршрутах, местах или продуктах...", send: "Отправить вопрос", open: "Открыть помощника", toggle: "Задать вопрос", error: "Не удалось получить ответ." },
};

export function TravelChatbot() {
  const pathname = usePathname();
  const { locale } = useLanguage();
  const language = locale;
  const ui = chatUi[locale];
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<UiMessage[]>([{ role: "assistant", content: welcome[locale] }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const resetLanguage = window.setTimeout(() => setMessages([{ role: "assistant", content: welcome[locale] }]), 0);

    return () => {
      window.clearTimeout(resetLanguage);
      requestRef.current?.abort();
    };
  }, [locale]);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  if (pathname.startsWith("/admin")) return null;

  const send = async (question: string) => {
    const clean = question.trim();
    if (!clean || loading) return;
    const nextMessages: UiMessage[] = [...messages, { role: "user", content: clean }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    try {
      const response = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "1" }, signal: controller.signal,
        body: JSON.stringify({ question: clean, language, history: nextMessages.slice(-8).map(({ role, content }) => ({ role, content })) }),
      });
      const data = await response.json() as ChatResponse & { error?: string };
      if (!response.ok) throw new Error(data.error || ui.error);
      setMessages((current) => [...current, { role: "assistant", content: data.answer, sources: data.sources, journeys: data.journeys, mode: data.mode }]);
    } catch (cause) {
      if ((cause as Error).name !== "AbortError") setError(cause instanceof Error ? cause.message : ui.error);
    } finally {
      if (requestRef.current === controller) { requestRef.current = null; setLoading(false); }
    }
  };

  const submit = (event: FormEvent) => { event.preventDefault(); void send(input); };
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void send(input); }
  };

  return <div className="travel-chat" data-open={open}>
    {open && <section className="travel-chat-panel" aria-label={ui.title}>
      <header className="travel-chat-head">
        <div className="travel-chat-identity"><span><Sparkles size={18} /></span><div><b>{ui.title}</b></div></div>
        <button type="button" onClick={() => setOpen(false)} aria-label={ui.close}><X /></button>
      </header>

      <div className="travel-chat-messages" ref={messagesRef} aria-live="polite">
        {messages.map((message, index) => <article className={`travel-chat-message ${message.role}`} key={`${message.role}-${index}`}>
          <span className="travel-chat-avatar" aria-hidden="true">{message.role === "assistant" ? <Bot /> : <User />}</span>
          <div>
            <p>{message.content}</p>
            {message.journeys?.length ? <div className="travel-chat-journeys"><b>{ui.journeys}</b><div>{message.journeys.map((journey) => <Link href={journey.href} key={journey.id} onClick={() => setOpen(false)}><span><strong>{journey.title}</strong><small>{journey.duration === "half-day" ? ui.halfDay : `${journey.days} ${ui.day}`}</small></span><span className="travel-chat-journey-action">{ui.viewJourney}<ArrowUpRight aria-hidden="true" /></span></Link>)}</div></div> : null}
            {message.sources?.length ? <details className="travel-chat-sources"><summary>{ui.sources} ({message.sources.length})</summary><div>{message.sources.map((source) => <Link href={source.href} key={source.id} onClick={() => setOpen(false)}><span><b>{source.title}</b><small>{source.excerpt}</small></span><ExternalLink aria-hidden="true" /></Link>)}</div></details> : null}
          </div>
        </article>)}
        {loading && <div className="travel-chat-thinking" role="status"><span /><span /><span /><b>{ui.thinking}</b></div>}
        {error && <div className="travel-chat-error" role="alert">{error}<button type="button" onClick={() => void send(messages.at(-1)?.content ?? "")}>{ui.retry}</button></div>}
      </div>

      {messages.length === 1 && <div className="travel-chat-prompts">{starterPrompts[language].map((prompt) => <button type="button" key={prompt} onClick={() => void send(prompt)}>{prompt}</button>)}</div>}

      <form className="travel-chat-form" onSubmit={submit}>
        <label htmlFor="travel-chat-input">{ui.question}</label>
        <div><textarea ref={inputRef} id="travel-chat-input" value={input} maxLength={1200} rows={2} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeyDown} placeholder={ui.placeholder} disabled={loading} /><button type="submit" disabled={loading || input.trim().length < 2} aria-label={ui.send}><Send /></button></div>
      </form>
    </section>}
    <button className="travel-chat-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? ui.close : ui.open}>{open ? <X /> : <MessageCircle />}<span>{open ? ui.close : ui.toggle}</span></button>
  </div>;
}
