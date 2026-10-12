"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";

export interface ToastItem {
  id: string;
  pesan: string;
  variant?: "success" | "error" | "info" | "warning";
  durasi?: number; // ms, default 3500
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

// Global Toast State Manager (imperative API)
let addToastFn: ((toast: Omit<ToastItem, "id">) => void) | null = null;

export const toast = {
  success: (pesan: string, durasi = 3000) => {
    addToastFn?.({ pesan, variant: "success", durasi });
  },
  error: (pesan: string, durasi = 4500) => {
    addToastFn?.({ pesan, variant: "error", durasi });
  },
  info: (pesan: string, durasi = 3000) => {
    addToastFn?.({ pesan, variant: "info", durasi });
  },
  warning: (pesan: string, durasi = 4000) => {
    addToastFn?.({ pesan, variant: "warning", durasi });
  },
};

export function SwipeToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    addToastFn = (newToast) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      setToasts((prev) => [...prev.slice(-3), { ...newToast, id }]);
    };
    return () => {
      addToastFn = null;
    };
  }, []);

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:bottom-6"
    >
      {toasts.map((item) => (
        <SwipeToastCard key={item.id} item={item} onDismiss={() => dismiss(item.id)} />
      ))}
    </div>
  );
}

// Declarative standalone SwipeToast component (used in WizardContainer)
export interface SwipeToastProps {
  message: string;
  variant?: "success" | "error" | "info" | "warning";
  durationMs?: number;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  onClose?: () => void;
}

export function SwipeToast({
  message,
  variant = "info",
  durationMs = 3500,
  actionLabel,
  actionHref,
  onAction,
  onClose = () => {},
}: SwipeToastProps) {
  const item: ToastItem = {
    id: "inline_toast",
    pesan: message,
    variant,
    durasi: durationMs,
    actionLabel,
    actionHref,
    onAction,
  };

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 pointer-events-none">
      <SwipeToastCard item={item} onDismiss={onClose} />
    </div>
  );
}

function SwipeToastCard({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: () => void;
}) {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const durasi = item.durasi ?? 3500;
  const startTimeRef = useRef(Date.now());
  const remainingRef = useRef(durasi);

  useEffect(() => {
    if (isPaused) return;

    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const left = remainingRef.current - elapsed;
      const p = Math.max(0, (left / durasi) * 100);
      setProgress(p);

      if (left <= 0) {
        clearInterval(interval);
        onDismiss();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isPaused, durasi, onDismiss]);

  const handleMouseEnter = () => {
    setIsPaused(true);
    const elapsed = Date.now() - startTimeRef.current;
    remainingRef.current = Math.max(0, remainingRef.current - elapsed);
  };

  const handleMouseLeave = () => {
    startTimeRef.current = Date.now();
    setIsPaused(false);
  };

  const icons = {
    success: <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />,
    warning: <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />,
    info: <Info className="h-4 w-4 text-[#1E3F30] shrink-0" />,
  };

  const borderColors = {
    success: "border-emerald-200",
    error: "border-rose-200",
    warning: "border-amber-200",
    info: "border-[#1E3F30]/20",
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`pointer-events-auto relative flex w-full max-w-md items-center justify-between gap-3 overflow-hidden rounded-2xl border bg-white/95 p-3.5 shadow-lg backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-3 fade-in ${
        borderColors[item.variant || "info"]
      }`}
    >
      {/* Hairline Timer Bar */}
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-[#1E3F30] transition-all duration-75"
        style={{ width: `${progress}%` }}
      />

      <div className="flex items-center gap-2.5 min-w-0">
        {icons[item.variant || "info"]}
        <p className="text-xs font-medium text-stone-800 leading-snug truncate">
          {item.pesan}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {item.actionHref && item.actionLabel ? (
          <Link
            href={item.actionHref}
            className="rounded-full bg-[#1E3F30] px-3 py-1 text-[11px] font-semibold text-white hover:bg-[#2D5A46] transition-colors"
          >
            {item.actionLabel}
          </Link>
        ) : item.actionLabel ? (
          <button
            type="button"
            onClick={item.onAction}
            className="rounded-full bg-[#1E3F30] px-3 py-1 text-[11px] font-semibold text-white hover:bg-[#2D5A46] transition-colors"
          >
            {item.actionLabel}
          </button>
        ) : null}
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-md p-1 text-stone-400 hover:text-stone-700 transition-colors"
          aria-label="Tutup notifikasi"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}