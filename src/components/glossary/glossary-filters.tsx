"use client";

import { CATEGORIES, type CategoryFilter } from "@/types/glossary";

const TABS = [{ id: "all", label: "すべて" }, ...CATEGORIES.map((category) => ({ id: category, label: category }))] as const;

type GlossaryFiltersProps = {
  query: string;
  category: CategoryFilter;
  onQueryChange: (value: string) => void;
  onCategoryChange: (category: CategoryFilter) => void;
};

export function GlossaryFilters({ query, category, onQueryChange, onCategoryChange }: GlossaryFiltersProps) {
  return (
    <section className="mb-6">
      <input
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="キーワードで検索 (例: RAG, らぐ, ラグ)..."
        className="mb-4 w-full rounded-lg border-2 border-slate-200 bg-white px-4 py-3 text-base text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
      />
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        {TABS.map((tab) => {
          const active = category === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onCategoryChange(tab.id)}
              className={`rounded-full border px-4 py-1.5 text-sm whitespace-nowrap ${
                active
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
