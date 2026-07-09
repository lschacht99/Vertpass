import React from "react";
import type { Status } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/selectors";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl bg-surface-card border border-surface-line shadow-card ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 px-5 pt-5">
      <div>
        <h3 className="text-base font-semibold text-ink-900">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-ink-500">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 text-lg font-semibold text-ink-900">{children}</h2>;
}

const STATUS_STYLES: Record<Status, string> = {
  not_started: "bg-slate-100 text-ink-500",
  in_progress: "bg-brand-50 text-brand-700",
  ready: "bg-emerald-50 text-emerald-700",
  blocked: "bg-rose-50 text-rose-700",
  done: "bg-emerald-100 text-emerald-800",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "brand" | "warn" | "danger" | "good";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-slate-100 text-ink-700",
    brand: "bg-brand-50 text-brand-700",
    warn: "bg-amber-50 text-amber-700",
    danger: "bg-rose-50 text-rose-700",
    good: "bg-emerald-50 text-emerald-700",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

export function Progress({ value }: { value: number }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
      <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-line bg-white/60 px-6 py-10 text-center">
      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg">📋</div>
      <p className="text-sm font-medium text-ink-700">{title}</p>
      {hint && <p className="mt-1 max-w-xs text-xs text-ink-500">{hint}</p>}
    </div>
  );
}

export function AttorneyNotice({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
      {text}
    </div>
  );
}
