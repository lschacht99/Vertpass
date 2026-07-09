"use client";

import { useStore } from "@/lib/store";
import { Card, StatusBadge, Badge, SectionTitle, EmptyState } from "@/components/ui";
import type { DocCategory, Status } from "@/lib/types";

const CATEGORY_LABELS: Record<DocCategory, string> = {
  identity: "Identity",
  passport_visa_i94: "Passport, Visa & I-94",
  marriage: "Marriage",
  sponsor: "Sponsor / Financial",
  medical: "Medical",
  photos: "Photos",
  translations: "Translations",
  address: "Address",
  travel: "Travel",
  work: "Work",
  other: "Other",
};

const CATEGORY_ORDER: DocCategory[] = [
  "identity",
  "passport_visa_i94",
  "marriage",
  "sponsor",
  "medical",
  "photos",
  "translations",
  "address",
  "travel",
  "work",
  "other",
];

const STATUS_CYCLE: Status[] = ["not_started", "in_progress", "ready"];

export default function DocumentsPage() {
  const store = useStore();

  function cycle(id: string) {
    store.update({
      documents: store.documents.map((d) =>
        d.id === id ? { ...d, status: STATUS_CYCLE[(STATUS_CYCLE.indexOf(d.status) + 1) % STATUS_CYCLE.length] } : d,
      ),
    });
  }

  function toggleIncluded(id: string) {
    store.update({
      documents: store.documents.map((d) => (d.id === id ? { ...d, included: !d.included } : d)),
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <SectionTitle>Documents</SectionTitle>
        <p className="-mt-2 text-sm text-ink-500">Organize supporting evidence by category.</p>
      </div>

      {CATEGORY_ORDER.map((cat) => {
        const docs = store.documents.filter((d) => d.category === cat);
        if (docs.length === 0) return null;
        return (
          <div key={cat}>
            <h3 className="mb-2 text-sm font-semibold text-ink-700">{CATEGORY_LABELS[cat]}</h3>
            <div className="space-y-2">
              {docs.map((d) => (
                <Card key={d.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-ink-900">{d.name}</p>
                        {d.required ? <Badge tone="warn">Required</Badge> : <Badge tone="neutral">Optional</Badge>}
                        {d.related_form && <Badge tone="brand">{d.related_form}</Badge>}
                      </div>
                      {d.notes && <p className="mt-1 text-sm text-ink-500">{d.notes}</p>}
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-400">
                        {d.expiry && <span>Expires: {d.expiry}</span>}
                        {d.source && <span>Source: {d.source}</span>}
                      </div>
                    </div>
                    <StatusBadge status={d.status} />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => cycle(d.id)}
                      className="rounded-lg border border-surface-line px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-slate-50"
                    >
                      Advance status
                    </button>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-ink-700">
                      <input
                        type="checkbox"
                        checked={d.included}
                        onChange={() => toggleIncluded(d.id)}
                        className="h-4 w-4 rounded border-surface-line text-brand-600"
                      />
                      Include in packet
                    </label>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      {store.documents.length === 0 && <EmptyState title="No documents yet" hint="Add supporting evidence to get started." />}
    </div>
  );
}
