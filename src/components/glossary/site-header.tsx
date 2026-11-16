"use client";

import type { AuthProfile } from "@/hooks/use-auth";

type SiteHeaderProps = {
  theme: "dark" | "light";
  user: AuthProfile | null;
  isAdmin: boolean;
  onToggleTheme: () => void;
  onSignInWithGoogle: () => void;
  onSignOut: () => void;
  onOpenAdmin?: () => void;
};

export function SiteHeader({
  theme,
  user,
  isAdmin,
  onToggleTheme,
  onSignInWithGoogle,
  onSignOut,
  onOpenAdmin,
}: SiteHeaderProps) {
  const isLight = theme === "light";

  return (
    <header className="relative mb-6 bg-slate-900 py-10 text-center text-white shadow-md">
      <div className="mx-auto max-w-3xl px-4">
        <div className="absolute top-4 right-4 flex flex-wrap items-center justify-end gap-2">
          {isAdmin && onOpenAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              className="rounded-full border border-emerald-300/40 bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-100 hover:bg-emerald-500/30"
            >
              管理者モード（用語マネージャー）
            </button>
          )}
          {user ? (
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 py-1 pr-2 pl-1">
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt={user.displayName ?? user.email ?? "ユーザー"}
                  className="h-7 w-7 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                  {(user.email ?? "?").slice(0, 1).toUpperCase()}
                </span>
              )}
              <span className="hidden max-w-[10rem] truncate text-xs sm:inline">
                {user.displayName ?? user.email}
              </span>
              <button
                type="button"
                onClick={onSignOut}
                className="rounded-full bg-white/10 px-2.5 py-1 text-[0.7rem] font-bold hover:bg-white/20"
              >
                ログアウト
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onSignInWithGoogle}
              className="rounded-full border border-white/20 bg-white px-3 py-1.5 text-xs font-bold text-slate-900 hover:bg-slate-100"
            >
              Googleでログイン
            </button>
          )}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isLight ? "ダークモードに切り替え" : "ライトモードに切り替え"}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xl"
          >
            {isLight ? "☀️" : "🌙"}
          </button>
        </div>
        <h1 className="mb-2 text-[1.75rem] font-bold">5秒でわかるビジネスAI用語集</h1>
        <p className="text-[0.95rem] text-white/90">実務に直結するAIの「肝」を最短で理解する</p>
      </div>
    </header>
  );
}
