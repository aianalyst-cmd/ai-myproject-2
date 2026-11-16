import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchAdjacentTerms, fetchTermById } from "@/lib/terms-server";

type TermPageProps = {
  params: Promise<{ id: string }>;
};

function parseTermId(raw: string): number | null {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

export async function generateMetadata({ params }: TermPageProps): Promise<Metadata> {
  const id = parseTermId((await params).id);
  if (id == null) {
    return { title: "用語が見つかりません | 5秒でわかるビジネスAI用語集" };
  }

  try {
    const term = await fetchTermById(id);
    if (!term) {
      return { title: "用語が見つかりません | 5秒でわかるビジネスAI用語集" };
    }

    return {
      title: `${term.title} | 5秒でわかるビジネスAI用語集`,
      description: term.summary,
    };
  } catch {
    return { title: "5秒でわかるビジネスAI用語集" };
  }
}

export default async function TermDetailPage({ params }: TermPageProps) {
  const id = parseTermId((await params).id);
  if (id == null) notFound();

  let term;
  let adjacent: Awaited<ReturnType<typeof fetchAdjacentTerms>>;

  try {
    [term, adjacent] = await Promise.all([fetchTermById(id), fetchAdjacentTerms(id)]);
  } catch {
    notFound();
  }

  if (!term) notFound();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-50">
      <header className="bg-slate-900 py-8 text-center text-white shadow-md">
        <div className="mx-auto max-w-3xl px-4">
          <p className="mb-2 text-xs tracking-wide text-slate-300">
            5秒でわかるビジネスAI用語集（Butterfly Effect App）
          </p>
          <p className="mb-3">
            <span className="rounded bg-blue-500/20 px-2.5 py-1 text-xs font-medium text-blue-200">
              {term.category}
            </span>
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{term.title}</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <article className="rounded-[10px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-bold tracking-wide text-blue-500 uppercase">要約</h2>
            <p className="text-lg leading-8 font-medium text-slate-800 dark:text-slate-100">{term.summary}</p>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold tracking-wide text-blue-500 uppercase">詳細解説</h2>
            <div className="whitespace-pre-wrap text-base leading-8 text-slate-700 dark:text-slate-200">
              {term.details || "詳細解説はまだ登録されていません。"}
            </div>
          </section>
        </article>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-blue-500 hover:text-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            ← トップページ（用語一覧）へ戻る
          </Link>
        </div>

        <nav aria-label="前後の用語" className="mt-8 grid gap-3 sm:grid-cols-2">
          {adjacent.prev ? (
            <Link
              href={`/terms/${adjacent.prev.id}`}
              className="rounded-[10px] border border-slate-200 bg-white p-4 transition-colors hover:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
            >
              <span className="mb-1 block text-xs text-slate-400">← 前の用語</span>
              <span className="block font-bold text-slate-900 dark:text-blue-400">{adjacent.prev.title}</span>
              <span className="mt-1 block text-xs text-slate-500">{adjacent.prev.category}</span>
            </Link>
          ) : (
            <div className="rounded-[10px] border border-dashed border-slate-200 p-4 text-sm text-slate-400 dark:border-slate-700">
              前の用語はありません
            </div>
          )}

          {adjacent.next ? (
            <Link
              href={`/terms/${adjacent.next.id}`}
              className="rounded-[10px] border border-slate-200 bg-white p-4 text-right transition-colors hover:border-blue-500 dark:border-slate-700 dark:bg-slate-800 sm:text-left"
            >
              <span className="mb-1 block text-xs text-slate-400">次の用語 →</span>
              <span className="block font-bold text-slate-900 dark:text-blue-400">{adjacent.next.title}</span>
              <span className="mt-1 block text-xs text-slate-500">{adjacent.next.category}</span>
            </Link>
          ) : (
            <div className="rounded-[10px] border border-dashed border-slate-200 p-4 text-right text-sm text-slate-400 dark:border-slate-700 sm:text-left">
              次の用語はありません
            </div>
          )}
        </nav>
      </main>
    </div>
  );
}
