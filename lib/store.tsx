"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type {
  UserProfile,
  CaseProfile,
  FormItem,
  DocumentItem,
  TimelineItem,
  RiskFlag,
  SourceReference,
} from "./types";
import {
  seedUserProfile,
  seedCaseProfile,
  seedForms,
  seedDocuments,
  seedTimeline,
  seedRiskFlags,
  seedSources,
} from "./data";

// Single-user local store. Persists to localStorage and is shaped so a
// Supabase-backed implementation can replace it without changing consumers.
// When NEXT_PUBLIC_SUPABASE_URL is present, a real client can be wired here.

export interface AppState {
  userProfile: UserProfile;
  caseProfile: CaseProfile;
  forms: FormItem[];
  documents: DocumentItem[];
  timeline: TimelineItem[];
  risks: RiskFlag[];
  sources: SourceReference[];
}

const STORAGE_KEY = "vertpass_state_v1";

function initialState(): AppState {
  return {
    userProfile: seedUserProfile,
    caseProfile: seedCaseProfile,
    forms: seedForms,
    documents: seedDocuments,
    timeline: seedTimeline,
    risks: seedRiskFlags,
    sources: seedSources,
  };
}

interface StoreContextValue extends AppState {
  update: (partial: Partial<AppState>) => void;
  reset: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState(), ...JSON.parse(raw) });
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore quota errors */
    }
  }, [state, hydrated]);

  const value = useMemo<StoreContextValue>(
    () => ({
      ...state,
      update: (partial) => setState((s) => ({ ...s, ...partial })),
      reset: () => setState(initialState()),
    }),
    [state],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
