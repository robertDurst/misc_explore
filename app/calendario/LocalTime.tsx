"use client";
import { useEffect, useState } from "react";

export default function LocalTime({ iso }: { iso: string }) {
  const [local, setLocal] = useState<string | null>(null);
  useEffect(() => {
    try {
      const d = new Date(iso);
      const fmt = new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      setLocal(fmt.format(d));
    } catch {
      setLocal(null);
    }
  }, [iso]);
  if (!local) return null;
  return <span className="local-time"> · → {local} tu hora</span>;
}
