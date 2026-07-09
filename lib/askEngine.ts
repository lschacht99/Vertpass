import { seedSources } from "./data";
import type { Confidence, AiSourceCard } from "./types";

// Shared, server-independent answer engine for the Green Card Guide.
// Used by the /api/ask route (server) AND as a client-side fallback when the
// app is deployed as a static export (e.g. GitHub Pages) with no API route.

export interface AskResponse {
  content: string;
  confidence: Confidence;
  sources: AiSourceCard[];
  source_warning: boolean;
}

// Naive form-topic detection so we can attach the right source cards.
export function detectSources(question: string): AiSourceCard[] {
  const q = question.toLowerCase();
  const matches = seedSources.filter((s) => {
    if (s.form && q.includes(s.form.toLowerCase())) return true;
    if (q.includes("fee") && (s.type === "fee" || s.type === "tool")) return true;
    if ((q.includes("policy") || q.includes("public charge")) && s.type === "policy_manual") return true;
    if (q.includes("status") && s.type === "status") return true;
    return false;
  });
  return matches.map((s) => ({ title: s.title, url: s.url, last_checked: s.last_checked }));
}

export function mockAnswer(question: string): AskResponse {
  const sources = detectSources(question);
  const hasSource = sources.length > 0;
  const feeAsked = /fee|cost|pay|price/i.test(question);

  let content: string;
  if (feeAsked) {
    content =
      "I can't state a specific fee. Fees change and must be confirmed on the official USCIS Fee Schedule (G-1055) and the USCIS Fee Calculator. Based on the facts provided and the cited USCIS source, use the Fee Calculator for your exact form combination before filing.";
  } else if (hasSource) {
    content =
      "Based on the facts provided and the cited USCIS source below, here is general information to orient you. This is legal information, not legal advice — verify the current form edition and instructions on the linked USCIS page before you rely on it. If your situation involves any risk factor, consult an immigration attorney or accredited representative.";
  } else {
    content =
      "Source verification missing: I don't have a confirmed official USCIS source for this specific question, so I can only give a general caution. Please verify directly on USCIS.gov, and consider consulting an immigration attorney or accredited representative.";
  }

  return {
    content,
    confidence: hasSource ? "medium" : "low",
    sources,
    source_warning: !hasSource,
  };
}
