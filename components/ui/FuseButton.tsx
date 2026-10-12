"use client";

import React, { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";

export interface FuseButtonProps {
  label: string;
  fuseLabel?: string;
  duration?: number; // durasi dalam ms, default 1600
  durationSeconds?: number; // alias durasi dalam detik
  onConfirm?: () => void | Promise<void>;
  onComplete?: () => void | Promise<void>;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "warning" | "success";
  className?: string;
  icon?: React.ReactNode;
  doneIcon?: React.ReactNode;
  disabled?: boolean;
}

export function FuseButton({
  label,
  fuseLabel = "Tersalin!",
  duration,
  durationSeconds,
  onConfirm,
  onComplete,
  variant = "secondary",
  className = "",
  icon,
  doneIcon = <Check className="h-3.5 w-3.5 text-emerald-600" />,
  disabled = false,
}: FuseButtonProps) {
  const [isFusing, setIsFusing] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animRef = useRef<number | null>(null);

  const effectiveAction = onConfirm || onComplete || (() => {});
  const effectiveDuration =
    durationSeconds !== undefined
      ? durationSeconds * 1000
      : duration !== undefined
      ? duration
      : 1600;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (disabled) return;

    if (effectiveDuration <= 2000 && !durationSeconds) {
      // Immediate action with temporary fuse confirmation (e.g. copy)
      effectiveAction();
      setIsFusing(true);
      setProgress(100);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsFusing(false);
        setProgress(0);
      }, effectiveDuration);
      return;
    }

    // Delayed destructive fuse with cancel window
    if (!isFusing) {
      setIsFusing(true);
      const start = Date.now();

      const step = () => {
        const elapsed = Date.now() - start;
        const p = Math.min(100, (elapsed / effectiveDuration) * 100);
        setProgress(p);

        if (p < 100) {
          animRef.current = requestAnimationFrame(step);
        } else {
          setIsFusing(false);
          setProgress(0);
          effectiveAction();
        }
      };
      animRef.current = requestAnimationFrame(step);
    } else {
      // Cancel fuse
      if (animRef.current) cancelAnimationFrame(animRef.current);
      setIsFusing(false);
      setProgress(0);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const variantStyles = {
    primary: "bg-[#1E3F30] text-white hover:bg-[#2D5A46] border border-transparent shadow-xs",
    secondary: "bg-white text-stone-700 hover:bg-stone-50 border border-[#E5E3DC] shadow-xs",
    danger: "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 shadow-xs",
    warning: "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 shadow-xs",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 border border-transparent shadow-xs",
    ghost: "bg-transparent text-stone-600 hover:bg-stone-100 border border-transparent",
  }[variant];

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={`group relative inline-flex items-center justify-center gap-1.5 overflow-hidden rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 ${variantStyles} ${className}`}
    >
      {/* Hairline Progress Fuse */}
      {isFusing && effectiveDuration > 0 && (
        <span
          className="absolute bottom-0 left-0 h-[2px] bg-[#C9A96E] transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
      )}

      {isFusing ? (
        <span className="inline-flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-200">
          {doneIcon}
          <span>{fuseLabel}</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5">
          {icon}
          <span>{label}</span>
        </span>
      )}
    </button>
  );
}