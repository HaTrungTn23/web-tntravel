"use client";

import Link from "next/link";
import { LogIn, LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const copy = {
  vi: { login: "Đăng nhập", logout: "Đăng xuất", account: "Tài khoản" },
  en: { login: "Sign in", logout: "Sign out", account: "Account" },
  ru: { login: "Войти", logout: "Выйти", account: "Аккаунт" },
} satisfies Record<Locale, { login: string; logout: string; account: string }>;

export function AuthNav({ email, locale }: { email: string | null; locale: Locale }) {
  const router = useRouter();
  const text = copy[locale];

  if (!email) return <Link className="auth-nav-login" href="/auth"><LogIn /> <span>{text.login}</span></Link>;

  return <div className="auth-nav-user">
    <span className="auth-nav-identity" title={email}><UserRound aria-hidden="true" /><span>{email}</span><span className="sr-only">{text.account}</span></span>
    <button type="button" title={text.logout} aria-label={text.logout} onClick={async () => {
      await createSupabaseBrowserClient()?.auth.signOut();
      router.push("/");
      router.refresh();
    }}><LogOut /></button>
  </div>;
}
