"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, Badge, SectionTitle } from "@/components/ui";
import { NOT_LEGAL_ADVICE_NOTICE, ATTORNEY_WARNING } from "@/lib/prompt";
import type { AiMessage, Confidence } from "@/lib/types";

const QUICK = [
  { label: "Ask about a form", q: "What is Form I-485 and what do I need for it?" },
  { label: "Explain missing docs", q: "Which documents am I missing for my marriage-based AOS packet?" },
  { label: "What's my next step?", q: "What is my next step in the adjustment of status process?" },
  { label: "Check my risks", q: "What risk factors should I review before filing?" },
  { label: "Explain a source", q: "Explain what the USCIS Policy Manual is and when to use it." },
];

const CONFIDENCE_TONE: Record<Confidence, "good" | "warn" | "danger"> = {
  high: "good",
  medium: "warn",
  low: "danger",
};

function AskInner() {
  const params = useSearchParams();
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const prefilled = useRef(false);

  useEffect(() => {
    const q = params.get("q");
    if (q && !prefilled.current) {
      prefilled.current = true;
      void send(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    const userMsg: AiMessage = { id: crypto.randomUUID(), role: "user", content: q, created_at: new Date().toISOString() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      const aiMsg: AiMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.content ?? "Something went wrong.",
        confidence: data.confidence,
        sources: data.sources,
        source_warning: data.source_warning,
        created_at: new Date().toISOString(),
      };
      setMessages((m) => [...m, aiMsg]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "I couldn't reach the assistant. Please try again.",
          confidence: "low",
          source_warning: true,
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <SectionTitle>Ask AI — Green Card Guide</SectionTitle>
        <p className="-mt-2 text-sm text-ink-500">{NOT_LEGAL_ADVICE_NOTICE}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {QUICK.map((qa) => (
          <button
            key={qa.label}
            onClick={() => send(qa.q)}
            className="rounded-full border border-surface-line bg-white px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-slate-50"
          >
            {qa.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {messages.length === 0 && !loading && (
          <Card className="px-5 py-6 text-center">
            <p className="text-sm font-medium text-ink-700">Ask a question to get started</p>
            <p className="mt-1 text-xs text-ink-500">
              I give legal information with cited USCIS sources — never a final eligibility decision.
            </p>
          </Card>
        )}

        {messages.map((m) =>
          m.role === "user" ? (
            <div key={m.id} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-brand-500 px-4 py-2.5 text-sm text-white">{m.content}</div>
            </div>
          ) : (
            <div key={m.id} className="flex justify-start">
              <div className="max-w-[92%] space-y-3">
                <Card className="px-4 py-3">
                  <p className="whitespace-pre-wrap text-sm text-ink-800">{m.content}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {m.confidence && <Badge tone={CONFIDENCE_TONE[m.confidence]}>Confidence: {m.confidence}</Badge>}
                    {m.source_warning && <Badge tone="danger">Source verification missing</Badge>}
                  </div>
                </Card>

                {m.sources && m.sources.length > 0 && (
                  <div className="space-y-2">
                    {m.sources.map((s, i) => (
                      <a
                        key={i}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-xl border border-surface-line bg-white px-3 py-2 hover:bg-slate-50"
                      >
                        <p className="text-sm font-medium text-brand-700">{s.title} ↗</p>
                        <p className="text-xs text-ink-400">Last checked: {s.last_checked}</p>
                      </a>
                    ))}
                  </div>
                )}

                <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">{ATTORNEY_WARNING}</p>
              </div>
            </div>
          ),
        )}

        {loading && (
          <div className="flex justify-start">
            <Card className="px-4 py-3">
              <p className="text-sm text-ink-400">Green Card Guide is thinking…</p>
            </Card>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        className="sticky bottom-20 flex gap-2 md:bottom-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about forms, documents, or next steps…"
          className="flex-1 rounded-xl border border-surface-line bg-white px-4 py-3 text-sm shadow-card outline-none focus:border-brand-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-brand-500 px-4 py-3 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default function AskPage() {
  return (
    <Suspense fallback={<div className="text-sm text-ink-500">Loading…</div>}>
      <AskInner />
    </Suspense>
  );
}
