"use client";

import type { GlossaryTerm } from "@/types/glossary";

type DailyPickProps = {
  term: GlossaryTerm;
  onShare: (id: number) => void;
};

export function DailyPick({ term, onShare }: DailyPickProps) {
  return (
    <section className="mb-6 rounded-xl border border-blue-500 bg-sky-100 p-5 dark:bg-blue-500/10">
      <p className="mb-3 flex items-center gap-2 text-sm font-bold text-blue-500">✨ 本日の厳選AI用語</p>
      <h2 className="text-lg font-bold">{term.title}</h2>
      <p className="mt-2 text-sm">{term.summary}</p>
      <button
        type="button"
        onClick={() => onShare(term.id)}
        className="mt-2 inline-flex items-center gap-2 self-start rounded-full bg-black px-4 py-2 text-xs font-bold text-white hover:opacity-80"
      >
        𝕏 にシェアして勉強仲間へ共有
      </button>
    </section>
  );
}
