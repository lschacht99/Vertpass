"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { packetGroups } from "@/lib/data";
import { Card, CardHeader, Badge, SectionTitle, AttorneyNotice } from "@/components/ui";
import { activeRisks } from "@/lib/selectors";
import { ATTORNEY_WARNING } from "@/lib/prompt";

export default function PacketPage() {
  const store = useStore();

  const itemLabel = (id: string) => {
    const f = store.forms.find((x) => x.id === id);
    if (f) return { label: `${f.code} — ${f.title}`, ready: f.status === "ready" || f.status === "done" };
    const d = store.documents.find((x) => x.id === id);
    if (d) return { label: d.name, ready: d.status === "ready" || d.status === "done" };
    return { label: id, ready: false };
  };

  const risks = activeRisks(store);
  const sourceWarnings = store.sources.filter((s) => s.needs_review);

  const coverLetterDefault = useMemo(
    () =>
      `Re: Concurrent Filing — ${store.caseProfile.case_type}\nApplicant: ${store.userProfile.full_name}\n\nTo the U.S. Citizenship and Immigration Services,\n\nEnclosed please find the concurrently-filed petition and application for adjustment of status, along with supporting evidence and required forms. The enclosed items are listed in the packet checklist.\n\nPlease verify current fees via the USCIS Fee Schedule (G-1055) and the USCIS Fee Calculator, and confirm that each enclosed form is the current edition per the USCIS instructions before filing.\n\nRespectfully submitted,\n${store.userProfile.full_name}`,
    [store.caseProfile.case_type, store.userProfile.full_name],
  );

  const [cover, setCover] = useState(coverLetterDefault);

  const missing = store.forms
    .filter((f) => !f.optional && f.status !== "ready" && f.status !== "done")
    .map((f) => `${f.code} — ${f.title}`)
    .concat(
      store.documents.filter((d) => d.required && d.status !== "ready" && d.status !== "done").map((d) => d.name),
    );

  return (
    <div className="space-y-5">
      <div>
        <SectionTitle>Packet Builder</SectionTitle>
        <p className="-mt-2 text-sm text-ink-500">Assemble your filing packet. Verify fees and editions with USCIS before sending.</p>
      </div>

      {sourceWarnings.length > 0 && (
        <Card>
          <CardHeader title="Source warnings" right={<Badge tone="warn">{sourceWarnings.length} need review</Badge>} />
          <div className="px-5 pb-5 pt-3 text-sm text-ink-700">
            Some USCIS sources have not been verified recently. Confirm editions and instructions on the{" "}
            <a href="/admin/sources" className="font-medium text-brand-600">
              Source Refresh
            </a>{" "}
            screen before filing.
          </div>
        </Card>
      )}

      {missing.length > 0 && <AttorneyNotice text={`Packet not complete — ${missing.length} required item(s) still missing. ${ATTORNEY_WARNING}`} />}

      <div className="space-y-3">
        {packetGroups.map((g) => (
          <Card key={g.id} className="px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-ink-900">
                {g.title} {g.optional && <Badge tone="neutral">Optional</Badge>}
              </p>
            </div>
            {g.item_ids.length > 0 && (
              <ul className="mt-2 space-y-1">
                {g.item_ids.map((id) => {
                  const { label, ready } = itemLabel(id);
                  return (
                    <li key={id} className="flex items-center justify-between text-sm text-ink-700">
                      <span>{label}</span>
                      <Badge tone={ready ? "good" : "warn"}>{ready ? "Ready" : "Missing"}</Badge>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="Cover letter draft" subtitle="Editable draft for your review — not a claim of legal correctness." />
        <div className="px-5 pb-5 pt-3">
          <textarea
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            rows={12}
            className="w-full rounded-xl border border-surface-line bg-white p-3 text-sm text-ink-800 outline-none focus:border-brand-500"
          />
          <p className="mt-2 text-xs text-ink-400">
            Remember to verify fees, form editions, and USCIS filing instructions before you send this packet.
          </p>
        </div>
      </Card>

      <Card>
        <CardHeader title="Final checklist" />
        <div className="px-5 pb-5 pt-3 text-sm text-ink-700">
          <ul className="list-disc space-y-1 pl-5">
            <li>All required forms marked ready</li>
            <li>All required documents included</li>
            <li>Certified translations attached where needed</li>
            <li>Fees confirmed via G-1055 / Fee Calculator</li>
            <li>Form editions confirmed current on USCIS.gov</li>
            <li>Medical (I-693) sealed and included per current guidance</li>
            <li>Risk factors reviewed with an attorney if applicable</li>
          </ul>
          {risks.length > 0 && <div className="mt-3"><AttorneyNotice text={ATTORNEY_WARNING} /></div>}
        </div>
      </Card>
    </div>
  );
}
