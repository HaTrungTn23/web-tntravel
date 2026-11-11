"use client";

import { useState } from "react";
import { DatabaseZap, LoaderCircle } from "lucide-react";

export function KnowledgeSyncButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const sync = async () => {
    setLoading(true); setMessage("");
    try {
      const response = await fetch("/api/admin/chatbot/sync", { method: "POST" });
      const data = await response.json() as { error?: string; indexed?: number; embedded?: number; removed?: number };
      if (!response.ok) throw new Error(data.error || "Không thể đồng bộ.");
      setMessage(`Kho có ${data.indexed ?? 0} đoạn; đã tạo lại ${data.embedded ?? 0} embedding và xóa ${data.removed ?? 0} đoạn cũ.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không thể đồng bộ kho tri thức.");
    } finally { setLoading(false); }
  };
  return <div className="admin-knowledge-sync"><button type="button" className="button button-secondary" onClick={() => void sync()} disabled={loading}>{loading ? <LoaderCircle className="spin" /> : <DatabaseZap />} {loading ? "Đang tạo embeddings" : "Đồng bộ chatbot"}</button>{message && <small role="status">{message}</small>}</div>;
}

