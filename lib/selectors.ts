import type { AppState } from "./store";
import type { FormItem, DocumentItem, TimelineItem, Status } from "./types";

// Pure derived-data helpers, shared by pages and covered by unit tests.

export function progressPercent(forms: FormItem[], documents: DocumentItem[]): number {
  const items = [...forms, ...documents];
  if (items.length === 0) return 0;
  const done = items.filter((i) => i.status === "ready" || i.status === "done").length;
  return Math.round((done / items.length) * 100);
}

export function missingForms(forms: FormItem[]): FormItem[] {
  return forms.filter((f) => !f.optional && f.status !== "ready" && f.status !== "done");
}

export function missingDocuments(documents: DocumentItem[]): DocumentItem[] {
  return documents.filter((d) => d.required && d.status !== "ready" && d.status !== "done");
}

export function activeRisks(state: Pick<AppState, "risks">) {
  return state.risks.filter((r) => r.active);
}

export function currentStage(timeline: TimelineItem[]): TimelineItem | undefined {
  return (
    timeline.find((t) => t.status === "in_progress") ??
    timeline.find((t) => t.status === "not_started") ??
    timeline[timeline.length - 1]
  );
}

export function nextThreeSteps(state: AppState): string[] {
  const steps: string[] = [];
  for (const f of missingForms(state.forms)) {
    steps.push(`Complete ${f.code} — ${f.title}`);
    if (steps.length >= 3) return steps;
  }
  for (const d of missingDocuments(state.documents)) {
    steps.push(`Gather document: ${d.name}`);
    if (steps.length >= 3) return steps;
  }
  const stage = currentStage(state.timeline);
  if (stage && steps.length < 3) steps.push(`Timeline: ${stage.title}`);
  return steps.slice(0, 3);
}

export const STATUS_LABELS: Record<Status, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  ready: "Ready",
  blocked: "Blocked",
  done: "Done",
};
