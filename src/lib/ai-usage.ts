import type { SupabaseClient } from "@supabase/supabase-js";

export const DAILY_QUIZ_LIMIT = 10;

export function todayKey(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export async function getDailyUsageCount(
  supabase: SupabaseClient,
  userId: string,
  usageDate: string,
): Promise<number> {
  const { data, error } = await supabase
    .from("ai_usage")
    .select("count")
    .eq("user_id", userId)
    .eq("usage_date", usageDate)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  const count = data?.count;
  return typeof count === "number" && Number.isFinite(count) ? count : 0;
}

export async function incrementDailyUsage(
  supabase: SupabaseClient,
  userId: string,
  usageDate: string,
  currentCount: number,
): Promise<number> {
  const nextCount = currentCount + 1;
  const { error } = await supabase.from("ai_usage").upsert(
    {
      user_id: userId,
      usage_date: usageDate,
      count: nextCount,
    },
    { onConflict: "user_id,usage_date" },
  );

  if (error) {
    throw new Error(error.message);
  }

  return nextCount;
}
