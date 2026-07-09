"use client";

import { useStore } from "@/lib/store";
import { Card, Badge, SectionTitle } from "@/components/ui";

export default function SourcesAdminPage() {
  const store = useStore();
  const today = new Date().toISOString().slice(0, 10);

  function markChecked(id: string) {
    store.update({
      sources: store.sources.map((s) => (s.id === id ? { ...s, last_checked: today, needs_review: false } : s)),
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <SectionTitle>Source Refresh</SectionTitle>
        <p className="-mt-2 text-sm text-ink-500">
          Verify each official USCIS source and mark it checked. No fees are hardcoded — fees come from G-1055 and the Fee Calculator.
        </p>
      </div>

      <div className="space-y-2">
        {store.sources.map((s) => (
          <Card key={s.id} className="px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-ink-900">{s.title}</p>
                  {s.form && <Badge tone="brand">{s.form}</Badge>}
                  {s.needs_review ? <Badge tone="warn">Needs review</Badge> : <Badge tone="good">Verified</Badge>}
                </div>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="mt-1 block truncate text-xs text-brand-600">
                  {s.url}
                </a>
                {s.notes && <p className="mt-1 text-xs text-ink-500">{s.notes}</p>}
                <p className="mt-1 text-xs text-ink-400">Last checked: {s.last_checked}</p>
              </div>
              <button
                onClick={() => markChecked(s.id)}
                className="flex-none rounded-lg border border-surface-line px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-slate-50"
              >
                Mark checked today
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
