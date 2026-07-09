import { NextRequest, NextResponse } from "next/server";
import { GREEN_CARD_GUIDE_SYSTEM_PROMPT } from "@/lib/prompt";
import { seedSources } from "@/lib/data";
import type { Confidence, AiSourceCard } from "@/lib/types";

// AI endpoint for the Green Card Guide.
//
// Mock-first: with no GEMINI_API_KEY configured, we return a deterministic,
// source-cited mock response so the UX is fully functional offline. When
// GEMINI_API_KEY is set, we call Gemini Flash (free tier) with the system
// prompt and the relevant USCIS source registry entries injected as context,
// so the model can cite real "last checked" dates instead of inventing them.

interface AskBody {
  question: string;
}

interface AskResponse {
  content: string;
  confidence: Confidence;
  sources: AiSourceCard[];
  source_warning: boolean;
}

// Naive form-topic detection so we can attach the right source cards.
function detectSources(question: string): AiSourceCard[] {
  const q = question.toLowerCase();
  const matches = seedSources.filter((s) => {
    if (s.form && q.includes(s.form.toLowerCase())) return true;
    if (q.includes("fee") && s.type === "fee") return true;
    if (q.includes("fee") && s.type === "tool") return true;
    if ((q.includes("policy") || q.includes("public charge")) && s.type === "policy_manual") return true;
    if (q.includes("status") && s.type === "status") return true;
    return false;
  });
  return matches.map((s) => ({ title: s.title, url: s.url, last_checked: s.last_checked }));
}

function mockAnswer(question: string): AskResponse {
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

async function geminiAnswer(question: string, apiKey: string): Promise<AskResponse> {
  const cards = detectSources(question);
  const sourceContext = seedSources
    .map((s) => `- ${s.title} (${s.url}), last checked ${s.last_checked}${s.form ? `, form ${s.form}` : ""}`)
    .join("\n");

  const body = {
    system_instruction: {
      parts: [
        {
          text: `${GREEN_CARD_GUIDE_SYSTEM_PROMPT}\n\nAvailable USCIS source registry (only cite from these; if none fit, say "source verification missing"):\n${sourceContext}`,
        },
      ],
    },
    contents: [{ role: "user", parts: [{ text: question }] }],
    generationConfig: { temperature: 0.2, maxOutputTokens: 500 },
  };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) },
  );

  if (!res.ok) {
    // Fall back to the mock so the UX never hard-fails.
    return mockAnswer(question);
  }

  const data = await res.json();
  const text: string =
    data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ?? "";

  if (!text.trim()) return mockAnswer(question);

  return {
    content: text.trim(),
    confidence: cards.length > 0 ? "medium" : "low",
    sources: cards,
    source_warning: cards.length === 0,
  };
}

export async function POST(req: NextRequest) {
  let body: AskBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const question = (body.question ?? "").trim();
  if (!question) return NextResponse.json({ error: "Question is required" }, { status: 400 });

  const apiKey = process.env.GEMINI_API_KEY;
  const answer = apiKey ? await geminiAnswer(question, apiKey) : mockAnswer(question);
  return NextResponse.json(answer);
}
