import { getSupabase } from "@/lib/supabase/client";

export type UserProgressRow = {
  user_id: string;
  term_id: number;
  is_favorite: boolean;
  is_understood: boolean;
};

export type UserProgressState = {
  favoriteIds: number[];
  readIds: number[];
};

export class UserProgressForeignKeyError extends Error {
  readonly code = "23503";

  constructor(message: string) {
    super(message);
    this.name = "UserProgressForeignKeyError";
  }
}

function normalizeTermId(value: unknown): number | null {
  const id = typeof value === "number" ? value : Number(value);
  return Number.isFinite(id) ? id : null;
}

function isForeignKeyViolation(error: { code?: string; message?: string } | null | undefined): boolean {
  if (!error) return false;
  if (error.code === "23503") return true;
  const message = (error.message ?? "").toLowerCase();
  return message.includes("user_progress_term_id_fkey") || message.includes("foreign key constraint");
}

export function isIgnorableProgressError(error: unknown): boolean {
  if (error instanceof UserProgressForeignKeyError) return true;
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes("23503") ||
    message.includes("user_progress_term_id_fkey") ||
    message.includes("foreign key constraint")
  );
}

export async function fetchUserProgress(userId: string): Promise<UserProgressState> {
  const { data, error } = await getSupabase()
    .from("user_progress")
    .select("term_id, is_favorite, is_understood")
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  const favoriteIds: number[] = [];
  const readIds: number[] = [];

  for (const row of data ?? []) {
    const termId = normalizeTermId((row as { term_id?: unknown }).term_id);
    if (termId == null) continue;
    if ((row as { is_favorite?: unknown }).is_favorite) favoriteIds.push(termId);
    if ((row as { is_understood?: unknown }).is_understood) readIds.push(termId);
  }

  return { favoriteIds, readIds };
}

async function termExistsInDatabase(termId: number): Promise<boolean> {
  const { data, error } = await getSupabase().from("terms").select("id").eq("id", termId).maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  return data != null;
}

/**
 * user_progress への唯一の書き込み入口。
 * - existingTermIds があれば、そこに含まれない term_id は保存しない
 * - DB 上の terms に存在しない term_id は保存しない
 * - 23503（外部キー制約違反）は UserProgressForeignKeyError として返す（呼び出し側で無視する）
 */
export async function upsertUserProgress(
  row: UserProgressRow,
  existingTermIds?: Iterable<number>,
): Promise<void> {
  if (existingTermIds) {
    const validIds = new Set(existingTermIds);
    if (!validIds.has(row.term_id)) return;
  }

  const exists = await termExistsInDatabase(row.term_id);
  if (!exists) return;

  const { error } = await getSupabase().from("user_progress").upsert(row, {
    onConflict: "user_id,term_id",
  });

  if (!error) return;

  if (isForeignKeyViolation(error)) {
    throw new UserProgressForeignKeyError(error.message);
  }

  throw new Error(error.message);
}
