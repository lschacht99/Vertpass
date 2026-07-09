"use client";

// Builds a link into the Ask AI tab with a prefilled question.
export function useAskLink() {
  return (question: string) => `/ask?q=${encodeURIComponent(question)}`;
}
