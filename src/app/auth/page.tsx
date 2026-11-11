import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { PublicAuthForm } from "@/components/auth/PublicAuthForm";
import { getServerLocale } from "@/i18n/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUser } from "@/services/auth/session";

function safeNextPath(value: string | string[] | undefined) {
  const path = typeof value === "string" ? value : "/";
  return path.startsWith("/") && !path.startsWith("//") ? path : "/";
}

const copy = {
  vi: { kicker: "Tài khoản du khách", title: "Đăng nhập để chia sẻ trải nghiệm.", unavailable: "Tài khoản hiện chưa khả dụng.", confirmationError: "Liên kết xác nhận không hợp lệ hoặc đã hết hạn. Bạn có thể đăng nhập nếu tài khoản đã được xác nhận." },
  en: { kicker: "Traveler account", title: "Sign in to share your experience.", unavailable: "Accounts are temporarily unavailable.", confirmationError: "The confirmation link is invalid or expired. You can sign in if your account has already been confirmed." },
  ru: { kicker: "Аккаунт путешественника", title: "Войдите, чтобы поделиться впечатлениями.", unavailable: "Аккаунты временно недоступны.", confirmationError: "Ссылка подтверждения недействительна или устарела. Если аккаунт уже подтверждён, войдите в него." },
} as const;

export default async function AuthPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const nextPath = safeNextPath(params.next);
  const user = await getCurrentUser();
  if (user) redirect(nextPath);
  const locale = await getServerLocale();
  const text = copy[locale];
  const mode = params.mode === "register" ? "register" : "login";

  return <div className="public-auth-page page-wrap">
    <section className="public-auth-intro">
      <div className="eyebrow"><ShieldCheck /> {text.kicker}</div>
      <h1>{text.title}</h1>
      {params.error === "confirmation" && <p className="public-auth-confirmation-error" role="alert">{text.confirmationError}</p>}
    </section>
    {isSupabaseConfigured()
      ? <PublicAuthForm initialMode={mode} nextPath={nextPath} locale={locale} />
      : <div className="public-auth-unavailable" role="status">{text.unavailable}</div>}
  </div>;
}
