import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/about", label: "運営者情報・免責事項" },
  { href: "/contact", label: "お問い合わせ" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white/80 py-8 text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
      <div className="mx-auto max-w-3xl px-4">
        <nav aria-label="フッターナビゲーション" className="mb-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="underline-offset-4 transition-colors hover:text-blue-500 hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-center text-xs leading-relaxed">
          免責事項：当サイトの情報は一般的な解説を目的としており、最新の技術動向を保証するものではありません。
        </p>
        <p className="mt-2 text-center text-xs">
          © {new Date().getFullYear()} 5秒でわかるビジネスAI用語集（Butterfly Effect App）
        </p>
      </div>
    </footer>
  );
}
