"use client";

import { useState } from "react";
import { ArrowRight, LockKeyhole, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { publicAuthErrorMessage } from "@/services/auth/publicAuthErrors";
import { isDemoGmail } from "@/services/auth/demoSignup";

type Mode = "login" | "register";

const copy = {
  vi: {
    login: "Đăng nhập", register: "Đăng ký", name: "Tên hiển thị", email: "Email", password: "Mật khẩu",
    confirm: "Nhập lại mật khẩu", loginAction: "Đăng nhập", registerAction: "Tạo tài khoản",
    loggingIn: "Đang đăng nhập...", registering: "Đang tạo tài khoản...", mismatch: "Hai mật khẩu chưa trùng nhau.",
    shortPassword: "Mật khẩu cần có ít nhất 8 ký tự.", genericError: "Chưa thể thực hiện yêu cầu. Vui lòng thử lại.",
    registerSuccess: "Đăng ký thành công!",
  },
  en: {
    login: "Sign in", register: "Create account", name: "Display name", email: "Email", password: "Password",
    confirm: "Confirm password", loginAction: "Sign in", registerAction: "Create account",
    loggingIn: "Signing in...", registering: "Creating account...", mismatch: "The passwords do not match.",
    shortPassword: "Use at least 8 characters for your password.", genericError: "We could not complete that request. Try again.",
    registerSuccess: "Registration successful!",
  },
  ru: {
    login: "Войти", register: "Регистрация", name: "Отображаемое имя", email: "Эл. почта", password: "Пароль",
    confirm: "Повторите пароль", loginAction: "Войти", registerAction: "Создать аккаунт",
    loggingIn: "Выполняется вход...", registering: "Создание аккаунта...", mismatch: "Пароли не совпадают.",
    shortPassword: "Пароль должен содержать не менее 8 символов.", genericError: "Не удалось выполнить запрос. Попробуйте ещё раз.",
    registerSuccess: "Регистрация прошла успешно!",
  },
} satisfies Record<Locale, Record<string, string>>;

export function PublicAuthForm({ initialMode, nextPath, locale }: { initialMode: Mode; nextPath: string; locale: Locale }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  const text = copy[locale];

  function switchMode(value: Mode) {
    setMode(value); setError(""); setSuccess("");
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setSuccess("");
    if (mode === "register" && !isDemoGmail(email)) { setError(publicAuthErrorMessage({ code: "gmail_required" }, mode, locale)); return; }
    if (password.length < 8) { setError(text.shortPassword); return; }
    if (mode === "register" && password !== confirmation) { setError(text.mismatch); return; }
    const client = createSupabaseBrowserClient();
    if (!client) { setError(text.genericError); return; }
    setBusy(true);

    try {
      if (mode === "login") {
        const result = await client.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
        if (result.error) { setError(publicAuthErrorMessage(result.error, mode, locale)); return; }
        router.replace(nextPath); router.refresh();
        return;
      }

      const response = await fetch("/api/auth/demo-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "1" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password, name: name.trim() }),
      });
      const payload = await response.json() as { code?: string };
      if (!response.ok) { setError(publicAuthErrorMessage({ code: payload.code, status: response.status }, mode, locale)); return; }
      setPassword("");
      setConfirmation("");
      setName("");
      setMode("login");
      setSuccess(text.registerSuccess);
    } catch (cause) {
      setError(publicAuthErrorMessage(cause instanceof Error ? cause : {}, mode, locale));
    } finally {
      setBusy(false);
    }
  }

  return <div className="public-auth-box">
    <div className="public-auth-tabs" role="tablist" aria-label={`${text.login} / ${text.register}`}>
      <button type="button" role="tab" aria-selected={mode === "login"} className={mode === "login" ? "active" : ""} onClick={() => switchMode("login")}><LockKeyhole /> {text.login}</button>
      <button type="button" role="tab" aria-selected={mode === "register"} className={mode === "register" ? "active" : ""} onClick={() => switchMode("register")}><UserPlus /> {text.register}</button>
    </div>
    <form className="public-auth-form" onSubmit={submit}>
      {mode === "register" && <label><span>{text.name}</span><input type="text" autoComplete="name" maxLength={80} value={name} onChange={(event) => setName(event.target.value)} /></label>}
      <label><span>{text.email}</span><input type="email" inputMode="email" autoComplete="email" pattern={mode === "register" ? ".+@gmail[.]com" : undefined} title={mode === "register" ? "@gmail.com" : undefined} required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
      <label><span>{text.password}</span><input type="password" minLength={8} maxLength={72} autoComplete={mode === "login" ? "current-password" : "new-password"} required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
      {mode === "register" && <label><span>{text.confirm}</span><input type="password" minLength={8} maxLength={72} autoComplete="new-password" required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} /></label>}
      {error && <p className="public-auth-message error" role="alert">{error}</p>}
      {success && <p className="public-auth-message success" role="status">{success}</p>}
      <button className="button button-primary" disabled={busy}>{busy ? (mode === "login" ? text.loggingIn : text.registering) : <>{mode === "login" ? text.loginAction : text.registerAction}<ArrowRight /></>}</button>
    </form>
  </div>;
}
