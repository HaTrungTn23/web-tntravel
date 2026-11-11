"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AdminLoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    const client = createSupabaseBrowserClient();
    if (!client) { setError("Supabase chưa được cấu hình."); setBusy(false); return; }
    const normalizedIdentifier = identifier.trim().toLowerCase();
    const email = normalizedIdentifier === "admin" ? "admin@webtn.invalid" : normalizedIdentifier;
    const result = await client.auth.signInWithPassword({ email, password });
    if (result.error) { setError("Tên đăng nhập hoặc mật khẩu chưa đúng."); setBusy(false); return; }
    router.replace("/admin/destinations"); router.refresh();
  }

  return <form className="admin-login-form" onSubmit={submit}>
    <div className="admin-form-icon"><LockKeyhole /></div>
    <div><label htmlFor="admin-identifier">Tên đăng nhập</label><input id="admin-identifier" type="text" autoComplete="username" required value={identifier} onChange={(event) => setIdentifier(event.target.value)} /></div>
    <div><label htmlFor="admin-password">Mật khẩu</label><input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></div>
    {error && <p className="admin-form-error" role="alert">{error}</p>}
    <button className="button button-primary" disabled={busy}>{busy ? "Đang đăng nhập" : <>Đăng nhập <ArrowRight /></>}</button>
  </form>;
}
