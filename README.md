# Green Card Command Center

A mobile-first workflow app for a **marriage-based Adjustment of Status (AOS)** case.
It tracks the forms, documents, timeline, and filing packet in one place, and
includes an AI assistant ("Green Card Guide") that provides **legal information
only** with cited USCIS sources.

> ⚖️ **Not legal advice.** This app is not a lawyer and never gives a final
> eligibility determination. It cites official USCIS sources, never states
> fees, and recommends an immigration attorney or accredited representative for
> anything involving risk. Verify everything against USCIS.gov before relying
> on it.

## Features

| Tab | What it does |
| --- | --- |
| **Dashboard** | Case type, profile summary, progress, missing forms/docs, risk flags, timeline stage, next 3 steps, last USCIS check |
| **Forms** | I-130, I-130A, I-485, I-864, I-765, I-131, I-693, G-1145 — purpose, status, evidence checklist, USCIS link, edition, notes, risks |
| **Documents** | 11 categories with required/status/expiry/included and related form |
| **Timeline** | Setup → decision, with reminders and related items |
| **Ask AI** | Green Card Guide chat with source cards, confidence levels, and attorney warnings |
| **Packet Builder** | Groups forms/evidence, flags missing items and source warnings, editable cover-letter draft |
| **Source Refresh** (admin) | Verify each USCIS source and mark it checked |

Mobile bottom-nav / desktop sidebar, premium card UI with badges, progress bars,
and empty states.

## Tech stack

- **Next.js 14** (App Router) + **TypeScript** + **Tailwind CSS**
- Local mock store persisted to `localStorage`, shaped to be **Supabase-ready**
- **Vitest** unit tests

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm test           # unit tests (Vitest)
npm run lint       # ESLint (next/core-web-vitals)
npm run build      # production build
```

## AI configuration

The Ask AI tab is **mock-first**: with no key configured it returns
deterministic, source-cited responses. To enable live answers, add a free
[Gemini](https://ai.google.dev/) key:

```bash
cp .env.example .env.local
# set GEMINI_API_KEY=...
```

See `.env.example` for optional Supabase variables.

## Continuous integration

`.github/workflows/ci.yml` runs lint, tests, and a production build on every
push and pull request.

## Deployment

### GitHub Pages (static demo)

`.github/workflows/static.yml` publishes a **static export** to GitHub Pages on
every push to the app branch (or via **Actions → Deploy static content to Pages
→ Run workflow**).

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub
Actions.**

The static export omits the dynamic `/api/ask` route, so on Pages the Ask AI
tab uses the built-in client-side engine (the same deterministic, source-cited
responses). For **live Gemini answers**, deploy to a Node host instead.

### Node / Vercel (live API)

Deploy the repo as a standard Next.js app (e.g. import into Vercel). Set
`GEMINI_API_KEY` in the host's environment to enable live Gemini Flash answers
through the `/api/ask` route.

## Project structure

```
app/            Pages (dashboard, forms, documents, timeline, ask, packet, admin) + /api/ask
components/     App shell (nav) and UI primitives
lib/            types, seed data, store, selectors, prompt, ask engine
tests/          Vitest unit tests
```

## Data & sources

- No fees are hardcoded anywhere. Fees are always referenced via the USCIS Fee
  Schedule (G-1055) and the USCIS Fee Calculator.
- Every source in the registry starts as **needs review** — verify URLs and
  form editions on the Source Refresh screen before real use.
