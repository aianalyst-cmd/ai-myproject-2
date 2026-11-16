import type { PostgrestError } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase/client";
import type { GlossaryTerm, TermInsert } from "@/types/glossary";

/**
 * terms テーブル実在カラム:
 * id, title, category, summary, details, created_at
 */
function logTermsError(action: string, error: PostgrestError | Error | unknown) {
  if (error && typeof error === "object" && "message" in error) {
    const pg = error as PostgrestError;
    console.error(`[terms] ${action} failed:`, pg.message, {
      code: "code" in pg ? pg.code : undefined,
      details: "details" in pg ? pg.details : undefined,
      hint: "hint" in pg ? pg.hint : undefined,
    });
    return;
  }
  console.error(`[terms] ${action} failed:`, error);
}

function asString(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (value == null) return null;
  return null;
}

function normalizeTerm(value: unknown): GlossaryTerm | null {
  if (!value || typeof value !== "object") return null;
  const term = value as Record<string, unknown>;
  const id = typeof term.id === "number" ? term.id : Number(term.id);
  const title = asString(term.title);
  const category = asString(term.category);
  const summary = asString(term.summary);
  const detailsRaw = term.details;
  const details = typeof detailsRaw === "string" ? detailsRaw : detailsRaw == null ? "" : null;

  if (!Number.isFinite(id) || title == null || category == null || summary == null || details == null) {
    return null;
  }

  return {
    id,
    title,
    category,
    summary,
    details,
  };
}

/** insert / update では id・created_at を送らず、実在カラムのみ送る */
function toWriteRow(input: TermInsert) {
  return {
    title: input.title,
    category: input.category,
    summary: input.summary,
    details: input.details,
  };
}

export async function fetchTerms(): Promise<GlossaryTerm[]> {
  const { data, error } = await getSupabase()
    .from("terms")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    logTermsError("fetch", error);
    throw new Error(error.message);
  }

  return (data ?? []).map(normalizeTerm).filter((term): term is GlossaryTerm => term != null);
}

export async function insertTerm(input: TermInsert): Promise<GlossaryTerm> {
  const { data, error } = await getSupabase()
    .from("terms")
    .insert(toWriteRow(input))
    .select("*")
    .single();

  if (error) {
    logTermsError("insert", error);
    throw new Error(error.message || "用語の追加に失敗しました。");
  }

  const term = normalizeTerm(data);
  if (!term) {
    throw new Error("保存結果の形式が不正です。");
  }

  return term;
}

export async function updateTerm(id: number, input: TermInsert): Promise<GlossaryTerm> {
  const { data, error } = await getSupabase()
    .from("terms")
    .update(toWriteRow(input))
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    logTermsError("update", error);
    throw new Error(error.message || "用語の更新に失敗しました。");
  }

  if (!data) {
    throw new Error("更新対象の用語が見つからないか、更新権限がありません。");
  }

  const term = normalizeTerm(data);
  if (!term) {
    throw new Error("更新結果の形式が不正です。");
  }

  return term;
}

export async function deleteTermById(id: number): Promise<void> {
  const { data, error } = await getSupabase().from("terms").delete().eq("id", id).select("id");

  if (error) {
    logTermsError("delete", error);
    throw new Error(error.message || "用語の削除に失敗しました。");
  }

  if (!data || data.length === 0) {
    throw new Error("削除対象の用語が見つからないか、削除権限がありません。");
  }
}
