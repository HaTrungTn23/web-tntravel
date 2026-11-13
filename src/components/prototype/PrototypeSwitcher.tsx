"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import styles from "./prototype-switcher.module.css";

type Variant = { key: string; label: string };

export function PrototypeSwitcher({ variants, current }: { variants: Variant[]; current: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function select(direction: -1 | 1) {
    const currentIndex = Math.max(0, variants.findIndex((variant) => variant.key === current));
    const nextIndex = (currentIndex + direction + variants.length) % variants.length;
    const params = new URLSearchParams(searchParams.toString());
    params.set("variant", variants[nextIndex].key);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, [contenteditable='true']")) return;
      if (event.key === "ArrowLeft") select(-1);
      if (event.key === "ArrowRight") select(1);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  if (process.env.NODE_ENV === "production") return null;
  const active = variants.find((variant) => variant.key === current) ?? variants[0];

  return (
    <div className={styles.switcher} aria-label="Chuyển phương án prototype">
      <button type="button" onClick={() => select(-1)} aria-label="Phương án trước"><ArrowLeft aria-hidden="true" /></button>
      <span><b>{active.key}</b>{active.label}</span>
      <button type="button" onClick={() => select(1)} aria-label="Phương án sau"><ArrowRight aria-hidden="true" /></button>
    </div>
  );
}
