"use client";

type RequestFormProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function RequestForm({ value, onChange, onSubmit }: RequestFormProps) {
  return (
    <section className="mb-8 flex flex-col gap-2 rounded-[10px] border border-dashed border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <p className="text-sm font-bold">解説してほしい用語はありますか？</p>
      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="例：マルチモーダル"
          className="flex-1 rounded border border-slate-200 bg-white px-2 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
        />
        <button type="submit" className="rounded bg-emerald-500 px-4 py-2 text-sm font-bold text-white">
          リクエストを送る
        </button>
      </form>
    </section>
  );
}
