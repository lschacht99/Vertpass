import { describe, it, expect } from "vitest";
import {
  progressPercent,
  missingForms,
  missingDocuments,
  currentStage,
  nextThreeSteps,
} from "@/lib/selectors";
import {
  seedForms,
  seedDocuments,
  seedTimeline,
  seedUserProfile,
  seedCaseProfile,
  seedRiskFlags,
  seedSources,
} from "@/lib/data";
import type { AppState } from "@/lib/store";

const state: AppState = {
  userProfile: seedUserProfile,
  caseProfile: seedCaseProfile,
  forms: seedForms,
  documents: seedDocuments,
  timeline: seedTimeline,
  risks: seedRiskFlags,
  sources: seedSources,
};

describe("selectors", () => {
  it("computes progress as a 0-100 percentage", () => {
    const pct = progressPercent(seedForms, seedDocuments);
    expect(pct).toBeGreaterThanOrEqual(0);
    expect(pct).toBeLessThanOrEqual(100);
  });

  it("progress is 100 when everything is ready", () => {
    const forms = seedForms.map((f) => ({ ...f, status: "ready" as const }));
    const docs = seedDocuments.map((d) => ({ ...d, status: "ready" as const }));
    expect(progressPercent(forms, docs)).toBe(100);
  });

  it("excludes optional forms from missing forms", () => {
    const missing = missingForms(seedForms);
    expect(missing.every((f) => !f.optional)).toBe(true);
  });

  it("only lists required documents as missing", () => {
    const missing = missingDocuments(seedDocuments);
    expect(missing.every((d) => d.required)).toBe(true);
  });

  it("returns an in-progress or upcoming current stage", () => {
    const stage = currentStage(seedTimeline);
    expect(stage).toBeTruthy();
  });

  it("returns at most three next steps", () => {
    const steps = nextThreeSteps(state);
    expect(steps.length).toBeLessThanOrEqual(3);
  });
});
