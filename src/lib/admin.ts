export const ADMIN_EMAIL = "aianalyst.note@gmail.com";

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

export function formatMutationError(error: unknown, action: "追加" | "更新" | "削除"): string {
  const message = error instanceof Error ? error.message : String(error);
  const lower = message.toLowerCase();

  if (lower.includes("permission") || lower.includes("row-level security") || lower.includes("rls") || lower.includes("401") || lower.includes("403")) {
    return `${action}に失敗しました（権限エラー）。管理者アカウントでログインしているか、Supabase の権限設定を確認してください。\n詳細: ${message}`;
  }

  return `${action}に失敗しました。\n詳細: ${message}`;
}
