import Link from "next/link";

type StaticPageShellProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function StaticPageShell({ title, description, children }: StaticPageShellProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-50">
      <header className="bg-slate-900 py-8 text-center text-white shadow-md">
        <div className="mx-auto max-w-3xl px-4">
          <p className="mb-2 text-xs tracking-wide text-slate-300">
            5秒でわかるビジネスAI用語集（Butterfly Effect App）
          </p>
          <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
          {description ? <p className="mt-2 text-sm text-slate-300">{description}</p> : null}
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <article className="rounded-[10px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
          {children}
        </article>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-blue-500 hover:text-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            ← トップページ（用語一覧）へ戻る
          </Link>
        </div>
      </main>
    </div>
  );
}
