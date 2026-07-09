"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NAV = [
  { href: "/", label: "Dashboard", icon: "🏠" },
  { href: "/forms", label: "Forms", icon: "📄" },
  { href: "/documents", label: "Documents", icon: "🗂️" },
  { href: "/timeline", label: "Timeline", icon: "🧭" },
  { href: "/ask", label: "Ask AI", icon: "💬" },
];

const SECONDARY = [
  { href: "/packet", label: "Packet Builder", icon: "📦" },
  { href: "/admin/sources", label: "Source Refresh", icon: "🔎" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-surface-bg">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-surface-line bg-white px-4 py-6 md:flex">
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">🟢</div>
          <div>
            <p className="text-sm font-semibold text-ink-900">Green Card</p>
            <p className="text-xs text-ink-500">Command Center</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                isActive(pathname, n.href) ? "bg-brand-50 text-brand-700" : "text-ink-700 hover:bg-slate-50"
              }`}
            >
              <span>{n.icon}</span>
              {n.label}
            </Link>
          ))}
          <div className="my-3 border-t border-surface-line" />
          {SECONDARY.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                isActive(pathname, n.href) ? "bg-brand-50 text-brand-700" : "text-ink-500 hover:bg-slate-50"
              }`}
            >
              <span>{n.icon}</span>
              {n.label}
            </Link>
          ))}
        </nav>
        <p className="px-2 text-[11px] leading-snug text-ink-400">
          Legal information only — not legal advice. Verify against USCIS.
        </p>
      </aside>

      {/* Main column */}
      <div className="md:pl-64">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-surface-line bg-white/90 px-4 py-3 backdrop-blur md:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">🟢</div>
            <span className="text-sm font-semibold text-ink-900">Green Card Command Center</span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-4xl px-4 pb-24 pt-5 md:pb-10 md:pt-8">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex items-stretch border-t border-surface-line bg-white md:hidden">
        {NAV.map((n) => {
          const active = isActive(pathname, n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
                active ? "text-brand-600" : "text-ink-500"
              }`}
            >
              <span className="text-lg leading-none">{n.icon}</span>
              {n.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
