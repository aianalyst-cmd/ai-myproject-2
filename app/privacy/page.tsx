import type { Metadata } from "next";
import Link from "next/link";
import { StaticPageShell } from "@/components/site/static-page-shell";

export const metadata: Metadata = {
  title: "プライバシーポリシー | 5秒でわかるビジネスAI用語集",
  description:
    "5秒でわかるビジネスAI用語集（Butterfly Effect App）のプライバシーポリシーです。広告配信・アクセス解析・Cookieの取り扱いについて記載しています。",
};

export default function PrivacyPage() {
  return (
    <StaticPageShell
      title="プライバシーポリシー"
      description="個人情報・Cookie・広告配信に関する方針"
    >
      <div className="space-y-6 text-sm leading-7 text-slate-700 dark:text-slate-200">
        <p>
          5秒でわかるビジネスAI用語集（Butterfly Effect App）（以下、「当サイト」）は、ご利用いただく皆様のプライバシーを尊重し、取得した情報を適切に取り扱います。本ポリシーは、当サイトにおける個人情報および関連データの取扱い方針を定めるものです。
        </p>

        <section>
          <h2 className="mb-2 text-base font-bold text-slate-900 dark:text-blue-400">1. 取得する情報</h2>
          <p>
            当サイトでは、お問い合わせフォームのご利用時などに、お名前、メールアドレス、お問い合わせ内容などの情報をご提供いただく場合があります。また、サイトの利用状況把握のため、Cookieや類似技術により端末情報・閲覧履歴などの情報を取得することがあります。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-slate-900 dark:text-blue-400">2. 利用目的</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>お問い合わせへの回答および必要なご連絡のため</li>
            <li>サービスの改善、コンテンツ品質の向上のため</li>
            <li>不正利用の防止、サイト運営上の安全管理のため</li>
            <li>広告配信およびアクセス解析のため</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-slate-900 dark:text-blue-400">
            3. 広告配信（Googleアドセンス等）について
          </h2>
          <p className="mb-2">
            当サイトは、第三者配信の広告サービス（Googleアドセンスを含む）を利用する場合があります。Googleを含む第三者配信事業者は、ユーザーの当サイトや他のウェブサイトへの過去のアクセス情報に基づいて広告を配信するため、Cookieを使用することがあります。
          </p>
          <p className="mb-2">
            Googleが広告配信に使用するCookieにより、ユーザーが当サイトや他のサイトにアクセスした際の情報に基づき、適切な広告が表示されることがあります。
          </p>
          <p>
            ユーザーは、
            <a
              href="https://adssettings.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline underline-offset-2"
            >
              Googleの広告設定ページ
            </a>
            にて、パーソナライズ広告を無効にすることができます。また、
            <a
              href="https://www.aboutads.info/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline underline-offset-2"
            >
              www.aboutads.info
            </a>
            にアクセスすることで、パーソナライズド広告に使われる第三者配信事業者のCookieを無効にできる場合もあります。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-slate-900 dark:text-blue-400">4. アクセス解析ツールについて</h2>
          <p>
            当サイトでは、サイトの利用状況を把握するために、Googleアナリティクス等のアクセス解析ツールを利用する場合があります。これらのツールはCookie等を使用してデータを収集することがあり、収集されたデータは各ツール提供元のプライバシーポリシーに基づいて管理されます。解析により個人を特定する情報を取得することは意図していません。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-slate-900 dark:text-blue-400">5. Cookieの管理</h2>
          <p>
            ブラウザの設定により、Cookieの受け入れを拒否したり、保存済みのCookieを削除したりできます。ただし、Cookieを無効にした場合、当サイトの一部機能が正しく動作しない可能性があります。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-slate-900 dark:text-blue-400">6. 第三者への提供</h2>
          <p>
            法令に基づく場合、またはご本人の同意がある場合を除き、取得した個人情報を第三者に提供することはありません。なお、広告配信事業者やアクセス解析ツール提供者が、各社のサービス提供に必要な範囲で情報を取り扱うことがあります。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-slate-900 dark:text-blue-400">7. 免責・改定</h2>
          <p className="mb-2">
            当サイトからリンクやバナーなどによって他のサイトに移動された場合、移動先サイトで提供される情報・サービス等について当サイトは責任を負いません。
          </p>
          <p>
            本ポリシーの内容は、必要に応じて予告なく改定することがあります。改定後の内容は当ページに掲載した時点から効力を生じるものとします。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-slate-900 dark:text-blue-400">8. お問い合わせ</h2>
          <p>
            本ポリシーに関するお問い合わせは、当サイトの
            <Link href="/contact" className="text-blue-500 underline underline-offset-2">
              お問い合わせページ
            </Link>
            よりご連絡ください。
          </p>
        </section>

        <p className="text-xs text-slate-500 dark:text-slate-400">制定日：2026年11月16日</p>
      </div>
    </StaticPageShell>
  );
}
