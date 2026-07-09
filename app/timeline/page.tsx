"use client";

import { useStore } from "@/lib/store";
import { Card, StatusBadge, SectionTitle, Badge } from "@/components/ui";
import type { Status } from "@/lib/types";

const STATUS_CYCLE: Status[] = ["not_started", "in_progress", "done"];

const DOT: Record<Status, string> = {
  not_started: "bg-slate-300",
  in_progress: "bg-brand-500",
  ready: "bg-emerald-500",
  blocked: "bg-rose-500",
  done: "bg-emerald-500",
};

export default function TimelinePage() {
  const store = useStore();

  function cycle(id: string) {
    store.update({
      timeline: store.timeline.map((t) =>
        t.id === id ? { ...t, status: STATUS_CYCLE[(STATUS_CYCLE.indexOf(t.status) + 1) % STATUS_CYCLE.length] } : t,
      ),
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <SectionTitle>Timeline</SectionTitle>
        <p className="-mt-2 text-sm text-ink-500">From setup to decision. Estimates are not guarantees — verify processing times with USCIS.</p>
      </div>

      <div className="relative space-y-4 pl-6">
        <div className="absolute left-[9px] top-2 bottom-2 w-px bg-surface-line" />
        {store.timeline.map((t) => (
          <div key={t.id} className="relative">
            <span className={`absolute -left-[22px] top-4 h-3.5 w-3.5 rounded-full ring-4 ring-surface-bg ${DOT[t.status]}`} />
            <Card className="px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-ink-900">{t.title}</p>
                    <Badge tone="neutral">{t.date_or_estimate}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-ink-500">{t.notes}</p>
                  {t.reminder && <p className="mt-1 text-xs font-medium text-amber-700">⏰ {t.reminder}</p>}
                  {t.related_items.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {t.related_items.map((id) => (
                        <Badge key={id} tone="brand">
                          {id}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <StatusBadge status={t.status} />
              </div>
              <button
                onClick={() => cycle(t.id)}
                className="mt-3 rounded-lg border border-surface-line px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-slate-50"
              >
                Advance status
              </button>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
