"use client";

import { useEffect } from "react";

export function Toast({
  message,
  onDismiss,
}: {
  message: string | null;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDismiss, 2500);
    return () => clearTimeout(t);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-foreground text-white text-sm font-medium shadow-lg shadow-black/20 animate-in fade-in slide-in-from-top-4"
      style={{ top: "calc(env(safe-area-inset-top) + 16px)" }}
    >
      {message}
    </div>
  );
}
