"use client";

import { X } from "lucide-react";
import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

type SnackbarVariant = "error" | "success" | "info";

export interface SnackbarProps {
  open: boolean;
  message: string;
  onClose: () => void;
  variant?: SnackbarVariant;
  autoHideDurationMs?: number;
}

function getVariantClasses(variant: SnackbarVariant) {
  switch (variant) {
    case "success":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "info":
      return "border-sky-200 bg-sky-50 text-sky-800";
    case "error":
    default:
      return "border-red-200 bg-red-50 text-red-800";
  }
}

export function Snackbar({
  open,
  message,
  onClose,
  variant = "info",
  autoHideDurationMs = 4000,
}: SnackbarProps) {
  const classes = useMemo(() => getVariantClasses(variant), [variant]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || autoHideDurationMs <= 0) return;
    const t = window.setTimeout(onClose, autoHideDurationMs);
    return () => window.clearTimeout(t);
  }, [open, autoHideDurationMs, onClose]);

  if (!open) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-start sm:justify-end">
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-auto w-full max-w-md rounded-2xl border px-4 py-3 shadow-lg backdrop-blur ${classes}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 text-sm font-medium">{message}</div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white/40 text-current transition hover:bg-white/60"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

