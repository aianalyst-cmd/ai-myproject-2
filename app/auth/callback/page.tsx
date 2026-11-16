"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("ログイン処理中...");

  useEffect(() => {
    let cancelled = false;

    async function finishAuth() {
      try {
        const supabase = getSupabase();
        const code = new URLSearchParams(window.location.search).get("code");

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else {
          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;
          if (!data.session) {
            throw new Error("セッションを取得できませんでした。");
          }
        }

        if (!cancelled) router.replace("/");
      } catch (error) {
        if (cancelled) return;
        setMessage(error instanceof Error ? error.message : "ログインに失敗しました。");
      }
    }

    void finishAuth();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-800 dark:bg-slate-900 dark:text-slate-50">
      <p className="text-sm font-medium">{message}</p>
    </main>
  );
}
