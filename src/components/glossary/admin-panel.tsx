"use client";

import { categoryOptions } from "@/lib/glossary";
import type { TermDraft } from "@/types/glossary";

type AdminPanelProps = {
  panelRef: React.RefObject<HTMLElement | null>;
  draft: TermDraft;
  editing: boolean;
  saving: boolean;
  requests: string[];
  onChange: (draft: TermDraft) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onDeleteRequest: (index: number) => void;
  onExport: () => void;
  onImport: (file: File) => void;
};

export function AdminPanel({
  panelRef,
  draft,
  editing,
  saving,
  requests,
  onChange,
  onSubmit,
  onCancel,
  onDeleteRequest,
  onExport,
  onImport,
}: AdminPanelProps) {
  const fieldClass =
    "w-full rounded border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50";

  return (
    <section
      ref={panelRef}
      className="mt-8 rounded-[10px] border-2 border-blue-500 bg-white p-6 dark:bg-slate-800"
    >
      <h2 className="mb-4 text-xl font-bold">用語マネージャー (管理者)</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <label className="mb-4 block text-sm font-bold">
          用語名
          <input
            required
            value={draft.title}
            onChange={(event) => onChange({ ...draft, title: event.target.value })}
            className={`${fieldClass} mt-1`}
          />
        </label>
        <label className="mb-4 block text-sm font-bold">
          一言要約
          <input
            required
            value={draft.summary}
            onChange={(event) => onChange({ ...draft, summary: event.target.value })}
            className={`${fieldClass} mt-1`}
          />
        </label>
        <label className="mb-4 block text-sm font-bold">
          カテゴリー
          <select
            value={draft.category}
            onChange={(event) => onChange({ ...draft, category: event.target.value })}
            className={`${fieldClass} mt-1`}
          >
            {categoryOptions(draft.category).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="mb-4 block text-sm font-bold">
          詳細
          <textarea
            required
            rows={5}
            value={draft.details}
            onChange={(event) => onChange({ ...draft, details: event.target.value })}
            className={`${fieldClass} mt-1`}
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded bg-blue-500 px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          {saving ? "保存中..." : editing ? "更新する" : "追加する"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="mt-2 w-full rounded bg-slate-500 px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
          >
            キャンセル
          </button>
        )}
      </form>

      <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-700">
        <h3 className="text-base font-bold">読者からのリクエスト一覧</h3>
        <ul className="mt-4">
          {requests.length === 0 ? (
            <li className="text-xs text-slate-400">現在リクエストはありません</li>
          ) : (
            requests.map((request, index) => (
              <li
                key={`${request}-${index}`}
                className="mb-2 flex items-center justify-between rounded bg-slate-100 px-3 py-2 text-sm dark:bg-slate-900"
              >
                <span>{request}</span>
                <button
                  type="button"
                  onClick={() => onDeleteRequest(index)}
                  className="rounded bg-red-500 px-2 py-1 text-[0.7rem] text-white"
                >
                  削除
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-700">
        <h3 className="text-base font-bold">お気に入り・理解度のバックアップ</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onExport}
            className="min-w-[150px] flex-1 rounded bg-slate-500 px-3 py-2.5 text-xs font-bold text-white"
          >
            データを保存する (エクスポート)
          </button>
          <label className="min-w-[150px] flex-1 cursor-pointer rounded bg-slate-500 px-3 py-2.5 text-center text-xs font-bold text-white">
            データを復元する (インポート)
            <input
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file) onImport(file);
              }}
            />
          </label>
        </div>
      </div>

    </section>
  );
}
