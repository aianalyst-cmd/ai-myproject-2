"use client";

import Link from "next/link";
import { useState } from "react";
import { TermQuizModal } from "@/components/glossary/term-quiz-modal";
import { summaryCopyText } from "@/lib/glossary";
import type { GlossaryTerm } from "@/types/glossary";

type TermCardProps = {
  item: GlossaryTerm;
  isFavorite: boolean;
  isRead: boolean;
  isAdmin: boolean;
  isLoggedIn: boolean;
  onToggleFavorite: (id: number) => void;
  onToggleRead: (id: number) => void;
  onMarkRead: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

export function TermCard({
  item,
  isFavorite,
  isRead,
  isAdmin,
  isLoggedIn,
  onToggleFavorite,
  onToggleRead,
  onMarkRead,
  onEdit,
  onDelete,
}: TermCardProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);

  async function copySummary(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(summaryCopyText(item));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("コピー失敗");
    }
  }

  return (
    <article
      className={`relative overflow-hidden rounded-[10px] border bg-white shadow-sm transition-opacity dark:bg-slate-800 ${
        isRead ? "border-emerald-500" : "border-slate-200 dark:border-slate-700"
      }`}
    >
      {isAdmin && (
        <div className="absolute top-2 right-2 z-10 flex gap-1">
          <button
            type="button"
            onClick={() => onEdit(item.id)}
            className="rounded bg-emerald-500 px-2 py-1 text-[0.7rem] text-white"
          >
            編集
          </button>
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="rounded bg-red-500 px-2 py-1 text-[0.7rem] text-white"
          >
            削除
          </button>
        </div>
      )}

      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen((value) => !value);
          }
        }}
        className="flex cursor-pointer items-start justify-between gap-4 p-5"
      >
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-blue-500">
              {isRead ? "✅ " : ""}
              {item.title}
            </h3>
            <div className="flex items-center gap-3">
              <button
                type="button"
                title="読了チェック"
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleRead(item.id);
                }}
                className={`text-xl leading-none transition-transform hover:scale-110 ${
                  isRead ? "text-emerald-500" : "text-slate-400"
                }`}
              >
                {isRead ? "✅" : "✔"}
              </button>
              <button
                type="button"
                title="お気に入り"
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleFavorite(item.id);
                }}
                className={`text-xl leading-none transition-transform hover:scale-110 ${
                  isFavorite ? "text-amber-500" : "text-slate-400"
                }`}
              >
                {isFavorite ? "★" : "☆"}
              </button>
            </div>
          </div>
          <p className="mb-2 text-sm font-medium">{item.summary}</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[0.7rem] text-blue-500">{item.category}</span>
            <button
              type="button"
              onClick={copySummary}
              className="inline-flex items-center gap-1 rounded border border-slate-200 px-2 py-0.5 text-[0.7rem] text-slate-400 dark:border-slate-700"
            >
              {copied ? "✅ コピーしました" : "📋 要約をコピー"}
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                if (!isLoggedIn) {
                  alert("AIクイズを利用するにはGoogleログインが必要です");
                  return;
                }
                setQuizOpen(true);
              }}
              className="inline-flex items-center gap-1 rounded border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[0.7rem] font-bold text-blue-500"
            >
              クイズに挑戦
            </button>
            <Link
              href={`/terms/${item.id}`}
              onClick={(event) => event.stopPropagation()}
              className="inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[0.7rem] font-bold text-slate-600 hover:border-blue-500 hover:text-blue-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
            >
              詳細ページで読む
            </Link>
          </div>
        </div>
        <span className={`mt-1 ml-2 shrink-0 text-xs text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}>
          ▼
        </span>
      </div>

      <div className={`grid transition-[grid-template-rows] duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="border-t border-slate-200 bg-slate-100 p-5 text-sm dark:border-slate-700 dark:bg-slate-900">
            <section>
              <span className="mb-1 block font-bold text-slate-900 dark:text-blue-500">📘 詳細</span>
              <p className="whitespace-pre-wrap">{item.details}</p>
            </section>
            <div className="mt-4">
              <Link
                href={`/terms/${item.id}`}
                onClick={(event) => event.stopPropagation()}
                className="inline-flex items-center rounded bg-blue-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-600"
              >
                詳細ページで読む →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <TermQuizModal
        term={item}
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        onCorrect={onMarkRead}
      />
    </article>
  );
}
