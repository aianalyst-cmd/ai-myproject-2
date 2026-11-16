import type { Metadata } from "next";
import { ContactForm } from "@/components/site/contact-form";
import { StaticPageShell } from "@/components/site/static-page-shell";

export const metadata: Metadata = {
  title: "お問い合わせ | 5秒でわかるビジネスAI用語集",
  description:
    "5秒でわかるビジネスAI用語集（Butterfly Effect App）へのお問い合わせフォームです。",
};

export default function ContactPage() {
  return (
    <StaticPageShell
      title="お問い合わせ"
      description="ご質問・ご意見・掲載リクエストなどにお使いください"
    >
      <div className="mb-6 space-y-2 text-sm leading-7 text-slate-700 dark:text-slate-200">
        <p>
          当サイト「5秒でわかるビジネスAI用語集（Butterfly Effect App）」へのお問い合わせは、以下のフォームより送信してください。
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          ※ 必須項目を入力のうえ送信してください。内容によっては返信までに数日お時間をいただく場合があります。
        </p>
      </div>
      <ContactForm />
    </StaticPageShell>
  );
}
