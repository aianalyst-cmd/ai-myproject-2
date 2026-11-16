"use client";

import { useState } from "react";

type FormState = {
  name: string;
  email: string;
  message: string;
};

const INITIAL: FormState = {
  name: "",
  email: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("すべての項目を入力してください。");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("メールアドレスの形式が正しくありません。");
      return;
    }

    setSubmitted(true);
    setForm(INITIAL);
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-6 text-center"
      >
        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-300">
          お問い合わせを受け付けました
        </p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          ご連絡ありがとうございます。内容を確認のうえ、必要に応じてご返信いたします。
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-4 rounded bg-emerald-500 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-600"
        >
          別のお問い合わせを送る
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="contact-name" className="mb-1 block text-sm font-bold">
          お名前 <span className="text-red-500">*</span>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={(event) => update("name", event.target.value)}
          className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
          required
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="mb-1 block text-sm font-bold">
          メールアドレス <span className="text-red-500">*</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(event) => update("email", event.target.value)}
          className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
          required
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1 block text-sm font-bold">
          お問い合わせ内容 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          value={form.message}
          onChange={(event) => update("message", event.target.value)}
          className="w-full resize-y rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
          required
        />
      </div>

      {error ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-300">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        className="rounded bg-blue-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-600"
      >
        送信する
      </button>
    </form>
  );
}
