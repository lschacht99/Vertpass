"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import {
  progressPercent,
  missingForms,
  missingDocuments,
  activeRisks,
  currentStage,
  nextThreeSteps,
} from "@/lib/selectors";
import { Card, CardHeader, Progress, Badge, StatusBadge, AttorneyNotice, EmptyState } from "@/components/ui";
import { ATTORNEY_WARNING } from "@/lib/prompt";

export default function DashboardPage() {
  const store = useStore();
  const pct = progressPercent(store.forms, store.documents);
  const mForms = missingForms(store.forms);
  const mDocs = missingDocuments(store.documents);
  const risks = activeRisks(store);
  const stage = currentStage(store.timeline);
  const next3 = nextThreeSteps(store);
  const highRisk = risks.some((r) => r.severity === "high");

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-ink-500">Welcome back</p>
        <h1 className="text-2xl font-semibold text-ink-900">{store.userProfile.full_name}</h1>
      </div>

      {highRisk && <AttorneyNotice text={ATTORNEY_WARNING} />}

      <Card>
        <CardHeader
          title={store.caseProfile.case_type}
          subtitle={store.caseProfile.status_summary}
          right={<Badge tone="brand">Married to {store.caseProfile.married_to}</Badge>}
        />
        <div className="grid gap-4 px-5 pb-5 pt-4 sm:grid-cols-3">
          <Info label="Country of birth" value={store.userProfile.country_of_birth} />
          <Info label="Entered U.S." value={store.caseProfile.entered_us} />
          <Info label="Last USCIS check" value={store.caseProfile.last_uscis_check} />
        </div>
      </Card>

      <Card>
        <CardHeader title="Overall progress" subtitle={`${pct}% of forms & documents ready`} />
        <div className="px-5 pb-5 pt-4">
          <Progress value={pct} />
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <CardHeader title="Next 3 steps" subtitle="Keep momentum" />
          <div className="px-5 pb-5 pt-4">
            {next3.length === 0 ? (
              <EmptyState title="You're all caught up" hint="No outstanding forms or documents." />
            ) : (
              <ol className="space-y-2">
                {next3.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-ink-700">
                    <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Timeline stage"
            subtitle="Where you are now"
            right={stage && <StatusBadge status={stage.status} />}
          />
          <div className="px-5 pb-5 pt-4">
            {stage ? (
              <div>
                <p className="text-sm font-medium text-ink-900">{stage.title}</p>
                <p className="mt-1 text-sm text-ink-500">{stage.notes}</p>
                <Link href="/timeline" className="mt-3 inline-block text-sm font-medium text-brand-600">
                  View full timeline →
                </Link>
              </div>
            ) : (
              <EmptyState title="No timeline yet" />
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <CardHeader title="Missing forms" right={<Badge tone={mForms.length ? "warn" : "good"}>{mForms.length}</Badge>} />
          <div className="px-5 pb-5 pt-4">
            {mForms.length === 0 ? (
              <EmptyState title="No missing forms" />
            ) : (
              <ul className="space-y-2">
                {mForms.map((f) => (
                  <li key={f.id} className="flex items-center justify-between text-sm">
                    <Link href="/forms" className="font-medium text-ink-700 hover:text-brand-600">
                      {f.code} — {f.title}
                    </Link>
                    <StatusBadge status={f.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Missing documents" right={<Badge tone={mDocs.length ? "warn" : "good"}>{mDocs.length}</Badge>} />
          <div className="px-5 pb-5 pt-4">
            {mDocs.length === 0 ? (
              <EmptyState title="No missing documents" />
            ) : (
              <ul className="space-y-2">
                {mDocs.map((d) => (
                  <li key={d.id} className="flex items-center justify-between text-sm">
                    <Link href="/documents" className="font-medium text-ink-700 hover:text-brand-600">
                      {d.name}
                    </Link>
                    <StatusBadge status={d.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Risk flags" subtitle="Review carefully" right={<Badge tone={risks.length ? "danger" : "good"}>{risks.length}</Badge>} />
        <div className="space-y-3 px-5 pb-5 pt-4">
          {risks.length === 0 ? (
            <EmptyState title="No active risk flags" />
          ) : (
            risks.map((r) => (
              <div key={r.id} className="rounded-xl border border-surface-line px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-ink-900">{r.title}</p>
                  <Badge tone={r.severity === "high" ? "danger" : r.severity === "watch" ? "warn" : "neutral"}>
                    {r.severity}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-ink-500">{r.detail}</p>
              </div>
            ))
          )}
          {risks.length > 0 && <AttorneyNotice text={ATTORNEY_WARNING} />}
        </div>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-ink-900">{value}</p>
    </div>
  );
}
