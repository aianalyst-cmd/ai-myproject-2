"use client";

type ProgressDashboardProps = {
  percent: number;
  total: number;
  readCount: number;
  message: string;
  onShare: () => void;
};

export function ProgressDashboard({ percent, total, readCount, message, onShare }: ProgressDashboardProps) {
  return (
    <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[0.95rem] font-bold">
          現在のAI実務理解度: {percent}% (全{total}語中 {readCount}語クリア)
        </p>
        <button
          type="button"
          onClick={onShare}
          className="inline-flex items-center gap-1.5 rounded-full bg-black px-3 py-1.5 text-xs font-bold text-white hover:opacity-80"
        >
          𝕏 成果をシェア
        </button>
      </div>
      <div className="mb-3 h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div className="h-full bg-emerald-500 transition-[width] duration-500" style={{ width: `${percent}%` }} />
      </div>
      <p className="min-h-5 text-sm font-bold text-slate-900 dark:text-blue-500">{message}</p>
    </section>
  );
}
