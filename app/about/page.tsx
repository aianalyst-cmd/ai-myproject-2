import type { Metadata } from "next";
import Link from "next/link";
import { StaticPageShell } from "@/components/site/static-page-shell";

export const metadata: Metadata = {
  title: "運営者情報・免責事項 | 5秒でわかるビジネスAI用語集",
  description:
    "5秒でわかるビジネスAI用語集（Butterfly Effect App）の運営目的、著作権、免責事項についてご案内します。",
};

export default function AboutPage() {
  return (
    <StaticPageShell
      title="運営者情報・免責事項"
      description="サイトの目的とご利用にあたっての注意事項"
    >
      <div className="space-y-6 text-sm leading-7 text-slate-700 dark:text-slate-200">
        <section>
          <h2 className="mb-2 text-base font-bold text-slate-900 dark:text-blue-400">サイト名</h2>
          <p>5秒でわかるビジネスAI用語集（Butterfly Effect App）</p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-slate-900 dark:text-blue-400">運営目的</h2>
          <p>
            当サイトは、ビジネスパーソンが実務で必要となるAI関連用語を、短時間で正確に理解できるよう解説することを目的としています。専門用語の壁を下げ、学習・業務・意思決定の効率化に役立つWebメディアを目指しています。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-slate-900 dark:text-blue-400">運営者</h2>
          <p>
            運営：Butterfly Effect App
            <br />
            お問い合わせ：当サイトの
            <Link href="/contact" className="text-blue-500 underline underline-offset-2">
              お問い合わせフォーム
            </Link>
            よりご連絡ください。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-slate-900 dark:text-blue-400">著作権について</h2>
          <p>
            当サイトに掲載されている文章・構成・デザイン・ロゴ等のコンテンツに関する著作権は、特記なき限り当サイトまたは正当な権利者に帰属します。私的利用の範囲を超える複製、転載、改変、商用利用等は、事前の許可なく行うことはできません。引用する場合は、出典として当サイト名および該当ページのURLを明示してください。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-slate-900 dark:text-blue-400">免責事項</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              当サイトの情報は一般的な解説・学習支援を目的としており、特定の製品・サービス・投資・法的助言等を推奨するものではありません。
            </li>
            <li>
              AI技術や関連サービスは急速に変化するため、掲載内容の正確性・最新性・完全性を保証するものではありません。重要な判断を行う際は、公式ドキュメント等の一次情報をご確認ください。
            </li>
            <li>
              当サイトの利用、または掲載情報に基づいて生じた損害・不利益について、当サイトおよび運営者は一切の責任を負いません。
            </li>
            <li>
              当サイトから外部サイトへリンクしている場合、リンク先の内容・安全性・プライバシー方針について当サイトは責任を負いません。
            </li>
            <li>
              予告なくコンテンツの追加・修正・削除、またはサービスの停止・終了を行うことがあります。
            </li>
          </ul>
        </section>
      </div>
    </StaticPageShell>
  );
}
