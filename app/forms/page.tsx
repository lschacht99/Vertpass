"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Card, StatusBadge, Badge, SectionTitle, AttorneyNotice } from "@/components/ui";
import type { Status } from "@/lib/types";
import { ATTORNEY_WARNING } from "@/lib/prompt";
import { useAskLink } from "@/components/askLink";

const STATUS_CYCLE: Status[] = ["not_started", "in_progress", "ready"];

export default function FormsPage() {
  const store = useStore();
  const [open, setOpen] = useState<string | null>(store.forms[0]?.id ?? null);
  const askLink = useAskLink();

  function cycleStatus(id: string) {
    store.update({
      forms: store.forms.map((f) =>
        f.id === id ? { ...f, status: STATUS_CYCLE[(STATUS_CYCLE.indexOf(f.status) + 1) % STATUS_CYCLE.length] } : f,
      ),
    });
  }

  function toggleEvidence(formId: string, idx: number) {
    store.update({
      forms: store.forms.map((f) =>
        f.id === formId
          ? { ...f, evidence: f.evidence.map((e, i) => (i === idx ? { ...e, done: !e.done } : e)) }
          : f,
      ),
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <SectionTitle>Forms</SectionTitle>
        <p className="-mt-2 text-sm text-ink-500">Track each USCIS form for your marriage-based AOS packet.</p>
      </div>

      {store.forms.map((f) => {
        const isOpen = open === f.id;
        const linkedRisks = store.risks.filter((r) => f.risks.includes(r.id));
        return (
          <Card key={f.id} className="overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? null : f.id)}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-ink-900">{f.code}</span>
                  {f.optional && <Badge tone="neutral">Optional</Badge>}
                  {linkedRisks.length > 0 && <Badge tone="danger">Risk</Badge>}
                </div>
                <p className="mt-0.5 text-sm text-ink-500">{f.title}</p>
              </div>
              <StatusBadge status={f.status} />
            </button>

            {isOpen && (
              <div className="space-y-4 border-t border-surface-line px-5 py-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Purpose</p>
                  <p className="mt-1 text-sm text-ink-700">{f.purpose}</p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Evidence checklist</p>
                  <ul className="mt-2 space-y-1.5">
                    {f.evidence.map((e, i) => (
                      <li key={i}>
                        <label className="flex items-center gap-2 text-sm text-ink-700">
                          <input
                            type="checkbox"
                            checked={e.done}
                            onChange={() => toggleEvidence(f.id, i)}
                            className="h-4 w-4 rounded border-surface-line text-brand-600"
                          />
                          <span className={e.done ? "line-through text-ink-400" : ""}>{e.label}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Meta label="Edition" value={f.edition} />
                  <Meta label="Last checked" value={f.last_checked} />
                </div>

                {f.notes && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Notes</p>
                    <p className="mt-1 text-sm text-ink-700">{f.notes}</p>
                  </div>
                )}

                {linkedRisks.length > 0 && (
                  <div className="space-y-2">
                    {linkedRisks.map((r) => (
                      <p key={r.id} className="text-sm text-ink-700">
                        <span className="font-medium">{r.title}:</span> {r.detail}
                      </p>
                    ))}
                    <AttorneyNotice text={ATTORNEY_WARNING} />
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <a
                    href={f.uscis_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-surface-line px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-slate-50"
                  >
                    USCIS page ↗
                  </a>
                  <button
                    onClick={() => cycleStatus(f.id)}
                    className="rounded-lg border border-surface-line px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-slate-50"
                  >
                    Advance status
                  </button>
                  <a
                    href={askLink(`Explain form ${f.code} (${f.title}) and what I need for it.`)}
                    className="rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600"
                  >
                    Ask AI about {f.code}
                  </a>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
      <p className="mt-1 text-sm text-ink-700">{value}</p>
    </div>
  );
}
