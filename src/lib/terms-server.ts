import type { PostgrestError } from "@supabase/supabase-js";
import { createPublicSupabaseClient } from "@/lib/supabase/server";
import type { GlossaryTerm } from "@/types/glossary";

export type TermNeighbor = Pick<GlossaryTerm, "id" | "title" | "category">;

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

/** Server Components 向け：id で1件取得 */
export async function fetchTermById(id: number): Promise<GlossaryTerm | null> {
  if (!Number.isFinite(id)) return null;

  const { data, error } = await createPublicSupabaseClient()
    .from("terms")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    logTermsError("fetchById", error);
    throw new Error(error.message);
  }

  return normalizeTerm(data);
}

/** Server Components 向け：前後の用語（id 昇順） */
export async function fetchAdjacentTerms(
  id: number,
): Promise<{ prev: TermNeighbor | null; next: TermNeighbor | null }> {
  const client = createPublicSupabaseClient();

  const [prevRes, nextRes] = await Promise.all([
    client.from("terms").select("id,title,category").lt("id", id).order("id", { ascending: false }).limit(1),
    client.from("terms").select("id,title,category").gt("id", id).order("id", { ascending: true }).limit(1),
  ]);

  if (prevRes.error) {
    logTermsError("fetchAdjacent.prev", prevRes.error);
    throw new Error(prevRes.error.message);
  }
  if (nextRes.error) {
    logTermsError("fetchAdjacent.next", nextRes.error);
    throw new Error(nextRes.error.message);
  }

  const toNeighbor = (row: unknown): TermNeighbor | null => {
    if (!row || typeof row !== "object") return null;
    const item = row as Record<string, unknown>;
    const neighborId = typeof item.id === "number" ? item.id : Number(item.id);
    const title = asString(item.title);
    const category = asString(item.category);
    if (!Number.isFinite(neighborId) || title == null || category == null) return null;
    return { id: neighborId, title, category };
  };

  return {
    prev: toNeighbor(prevRes.data?.[0] ?? null),
    next: toNeighbor(nextRes.data?.[0] ?? null),
  };
}
