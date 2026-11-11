"use client";

import { useState } from "react";
import { Languages, LoaderCircle } from "lucide-react";

export function TranslationSyncButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const sync = async () => {
    setLoading(true); setMessage("");
    try {
      const response = await fetch("/api/admin/translations/sync", { method: "POST" });
      const data = await response.json() as { error?: string; translated?: number; skipped?: number; errors?: string[] };
      if (!response.ok) throw new Error(data.error || "Không thể đồng bộ bản dịch.");
      const summary = `Đã dịch ${data.translated ?? 0} bản, giữ lại ${data.skipped ?? 0} bản còn mới.`;
      setMessage(data.errors?.length ? `${summary} ${data.errors.length} địa điểm bị lỗi.` : summary);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không thể đồng bộ bản dịch.");
    } finally { setLoading(false); }
  };
  return <div className="admin-knowledge-sync"><button type="button" className="button button-secondary" onClick={() => void sync()} disabled={loading}>{loading ? <LoaderCircle className="spin" /> : <Languages />} {loading ? "Đang dịch nội dung" : "Đồng bộ bản dịch"}</button>{message && <small role="status">{message}</small>}</div>;
}
