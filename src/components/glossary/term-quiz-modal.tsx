"use client";

import { useEffect, useId, useState } from "react";
import { quizExplanation } from "@/lib/glossary";
import { getSupabase } from "@/lib/supabase/client";
import type { GlossaryTerm } from "@/types/glossary";
import type { QuizQuestion } from "@/types/quiz";

type TermQuizModalProps = {
  term: GlossaryTerm;
  open: boolean;
  onClose: () => void;
  onCorrect: (id: number) => void;
};

type QuizState =
  | { status: "loading" }
  | { status: "ready"; quiz: QuizQuestion }
  | { status: "answered"; quiz: QuizQuestion; selectedIndex: number }
  | { status: "error"; message: string };

export function TermQuizModal({ term, open, onClose, onCorrect }: TermQuizModalProps) {
  const titleId = useId();
  const [state, setState] = useState<QuizState>({ status: "loading" });

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    const controller = new AbortController();

    setState({ status: "loading" });

    async function loadQuiz() {
      try {
        const { data, error } = await getSupabase().auth.getSession();
        if (error) throw error;

        const accessToken = data.session?.access_token;
        if (!accessToken) {
          throw new Error("AIクイズを利用するにはGoogleログインが必要です");
        }

        const response = await fetch("/api/quiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            term: term.title,
            explanation: quizExplanation(term),
          }),
          signal: controller.signal,
        });

        const payload = (await response.json()) as QuizQuestion & { error?: string };
        if (!response.ok) {
          throw new Error(payload.error || "クイズの取得に失敗しました。");
        }

        if (
          typeof payload.question !== "string" ||
          !Array.isArray(payload.choices) ||
          payload.choices.length !== 3 ||
          typeof payload.correctIndex !== "number" ||
          typeof payload.explanation !== "string"
        ) {
          throw new Error("クイズ形式が不正です。");
        }

        if (!cancelled) {
          setState({
            status: "ready",
            quiz: {
              question: payload.question,
              choices: [payload.choices[0], payload.choices[1], payload.choices[2]],
              correctIndex: payload.correctIndex,
              explanation: payload.explanation,
            },
          });
        }
      } catch (error) {
        if (cancelled || controller.signal.aborted) return;
        setState({
          status: "error",
          message: error instanceof Error ? error.message : "クイズの取得に失敗しました。",
        });
      }
    }

    void loadQuiz();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [open, term]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  function selectChoice(index: number) {
    if (state.status !== "ready") return;
    const correct = index === state.quiz.correctIndex;
    if (correct) onCorrect(term.id);
    setState({ status: "answered", quiz: state.quiz, selectedIndex: index });
  }

  const quiz = state.status === "ready" || state.status === "answered" ? state.quiz : null;
  const selectedIndex = state.status === "answered" ? state.selectedIndex : null;
  const isCorrect = selectedIndex != null && quiz != null && selectedIndex === quiz.correctIndex;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="presentation">
      <button
        type="button"
        aria-label="閉じる"
        className="absolute inset-0 bg-slate-950/60"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-700 dark:bg-slate-800"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-wide text-blue-500">QUIZ</p>
            <h2 id={titleId} className="mt-1 text-lg font-bold">
              {term.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-2 py-1 text-sm text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            ✕
          </button>
        </div>

        {state.status === "loading" && (
          <p className="py-10 text-center text-sm font-medium text-slate-500">AIが問題を作成中...</p>
        )}

        {state.status === "error" && (
          <div className="space-y-4 py-4 text-center">
            <p className="text-sm text-red-500">{state.message}</p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white dark:bg-slate-100 dark:text-slate-900"
            >
              閉じる
            </button>
          </div>
        )}

        {quiz && (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed font-medium">{quiz.question}</p>
            <div className="grid gap-2">
              {quiz.choices.map((choice, index) => {
                const selected = selectedIndex === index;
                const showAnswer = selectedIndex != null;
                const correctChoice = index === quiz.correctIndex;
                let className =
                  "w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ";

                if (!showAnswer) {
                  className +=
                    "border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50 dark:border-slate-600 dark:bg-slate-900 dark:hover:border-blue-500 dark:hover:bg-blue-500/10";
                } else if (correctChoice) {
                  className += "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
                } else if (selected) {
                  className += "border-red-400 bg-red-500/10 text-red-600 dark:text-red-300";
                } else {
                  className += "border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-900";
                }

                return (
                  <button
                    key={`${choice}-${index}`}
                    type="button"
                    disabled={selectedIndex != null}
                    onClick={() => selectChoice(index)}
                    className={className}
                  >
                    <span className="mr-2 font-bold">{String.fromCharCode(65 + index)}.</span>
                    {choice}
                  </button>
                );
              })}
            </div>

            {selectedIndex != null && (
              <div
                className={`rounded-xl border p-4 text-sm ${
                  isCorrect
                    ? "border-emerald-500/40 bg-emerald-500/10"
                    : "border-amber-500/40 bg-amber-500/10"
                }`}
              >
                <p className="font-bold">{isCorrect ? "正解！🎉" : "残念...😢"}</p>
                <p className="mt-2 whitespace-pre-wrap text-slate-700 dark:text-slate-200">{quiz.explanation}</p>
                {isCorrect && (
                  <p className="mt-2 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                    この用語を理解度ゲージに反映しました。
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white dark:bg-slate-100 dark:text-slate-900"
              >
                閉じる
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
