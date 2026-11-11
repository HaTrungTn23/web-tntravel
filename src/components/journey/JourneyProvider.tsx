"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface JourneyContextValue {
  destinationIds: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  contains: (id: string) => boolean;
}
const JourneyContext = createContext<JourneyContextValue | null>(null);

export function JourneyProvider({ children }: { children: React.ReactNode }) {
  const [destinationIds, setDestinationIds] = useState<string[]>([]);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try { setDestinationIds(JSON.parse(localStorage.getItem('tn-my-journey') ?? '[]') as string[]); } catch { setDestinationIds([]); }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  const update = useCallback((ids: string[]) => {
    setDestinationIds(ids);
    try { localStorage.setItem("tn-my-journey", JSON.stringify(ids)); } catch { /* in-memory fallback */ }
  }, []);
  const value = useMemo(() => ({
    destinationIds,
    add: (id: string) => update(Array.from(new Set([...destinationIds, id]))),
    remove: (id: string) => update(destinationIds.filter((item) => item !== id)),
    clear: () => update([]),
    contains: (id: string) => destinationIds.includes(id),
  }), [destinationIds, update]);
  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
}

export function useMyJourney() {
  const context = useContext(JourneyContext);
  if (!context) throw new Error("useMyJourney must be used inside JourneyProvider");
  return context;
}
