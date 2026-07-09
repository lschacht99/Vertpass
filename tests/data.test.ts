import { describe, it, expect } from "vitest";
import { seedForms, seedDocuments, seedSources, seedTimeline, seedRiskFlags, packetGroups } from "@/lib/data";

describe("seed data integrity", () => {
  it("includes all eight tracked forms", () => {
    const ids = seedForms.map((f) => f.id).sort();
    expect(ids).toEqual(["G-1145", "I-130", "I-130A", "I-131", "I-485", "I-693", "I-765", "I-864"].sort());
  });

  it("never hardcodes a dollar fee amount in any content field", () => {
    const blobs = [
      ...seedForms.map((f) => `${f.notes} ${f.purpose}`),
      ...seedDocuments.map((d) => d.notes),
      ...seedSources.map((s) => s.notes),
    ].join(" ");
    // No "$<number>" style fee amounts should ever be present.
    expect(/\$\s?\d/.test(blobs)).toBe(false);
  });

  it("marks every source as needing review until verified", () => {
    expect(seedSources.every((s) => s.needs_review)).toBe(true);
  });

  it("covers the full timeline from setup to decision", () => {
    const keys = seedTimeline.map((t) => t.key);
    expect(keys[0]).toBe("setup");
    expect(keys[keys.length - 1]).toBe("decision");
  });

  it("has a high-severity risk that triggers the attorney notice", () => {
    expect(seedRiskFlags.some((r) => r.active && r.severity === "high")).toBe(true);
  });

  it("references only known form/doc ids in packet groups", () => {
    const known = new Set([...seedForms.map((f) => f.id), ...seedDocuments.map((d) => d.id)]);
    for (const g of packetGroups) {
      for (const id of g.item_ids) expect(known.has(id)).toBe(true);
    }
  });
});
