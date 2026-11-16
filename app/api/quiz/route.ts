import OpenAI from "openai";
import { NextResponse } from "next/server";
import { DAILY_QUIZ_LIMIT, getDailyUsageCount, incrementDailyUsage, todayKey } from "@/lib/ai-usage";
import { createUserSupabaseClient, getBearerToken, getUserFromAccessToken } from "@/lib/supabase/server";
import type { QuizQuestion, QuizRequestBody } from "@/types/quiz";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function isQuizQuestion(value: unknown): value is QuizQuestion {
  if (!value || typeof value !== "object") return false;
  const quiz = value as Record<string, unknown>;
  return (
    typeof quiz.question === "string" &&
    Array.isArray(quiz.choices) &&
    quiz.choices.length === 3 &&
    quiz.choices.every((choice) => typeof choice === "string") &&
    typeof quiz.correctIndex === "number" &&
    Number.isInteger(quiz.correctIndex) &&
    quiz.correctIndex >= 0 &&
    quiz.correctIndex <= 2 &&
    typeof quiz.explanation === "string"
  );
}

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY が設定されていません。" }, { status: 500 });
  }

  const accessToken = getBearerToken(request);
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let user;
  try {
    user = await getUserFromAccessToken(accessToken);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: QuizRequestBody;
  try {
    body = (await request.json()) as QuizRequestBody;
  } catch {
    return NextResponse.json({ error: "リクエスト形式が不正です。" }, { status: 400 });
  }

  const term = typeof body.term === "string" ? body.term.trim() : "";
  const explanation = typeof body.explanation === "string" ? body.explanation.trim() : "";

  if (!term || !explanation) {
    return NextResponse.json({ error: "用語名と解説文が必要です。" }, { status: 400 });
  }

  const supabase = createUserSupabaseClient(accessToken);
  const usageDate = todayKey();

  let currentCount = 0;
  try {
    currentCount = await getDailyUsageCount(supabase, user.id, usageDate);
  } catch (error) {
    console.error("ai_usage fetch failed", error);
    return NextResponse.json({ error: "利用回数の確認に失敗しました。" }, { status: 500 });
  }

  if (currentCount >= DAILY_QUIZ_LIMIT) {
    return NextResponse.json(
      { error: "本日の無料枠（10回）を使い切りました" },
      { status: 429 },
    );
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: [
            "あなたはビジネスパーソン向けのAI用語クイズ作成者です。",
            "与えられた用語と解説だけを根拠に、理解度を測る実践的な3択クイズを1問作ってください。",
            "必ず次のJSONオブジェクトだけを返してください:",
            '{"question":"問題文","choices":["選択肢1","選択肢2","選択肢3"],"correctIndex":0,"explanation":"簡単な解説"}',
            "correctIndex は 0〜2 の整数で、choices の正解位置を示します。",
            "問題は用語の暗記ではなく、実務での意味や使い分けが問える内容にしてください。",
          ].join("\n"),
        },
        {
          role: "user",
          content: `用語名: ${term}\n解説文:\n${explanation}`,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "クイズの生成に失敗しました。" }, { status: 502 });
    }

    const parsed = JSON.parse(content) as unknown;
    if (!isQuizQuestion(parsed)) {
      return NextResponse.json({ error: "生成結果の形式が不正です。" }, { status: 502 });
    }

    try {
      await incrementDailyUsage(supabase, user.id, usageDate, currentCount);
    } catch (error) {
      console.error("ai_usage increment failed", error);
      return NextResponse.json({ error: "利用回数の更新に失敗しました。" }, { status: 500 });
    }

    const quiz: QuizQuestion = {
      question: parsed.question.trim(),
      choices: [parsed.choices[0].trim(), parsed.choices[1].trim(), parsed.choices[2].trim()],
      correctIndex: parsed.correctIndex,
      explanation: parsed.explanation.trim(),
    };

    return NextResponse.json(quiz);
  } catch (error) {
    console.error("quiz generation failed", error);
    return NextResponse.json({ error: "クイズの生成中にエラーが発生しました。" }, { status: 500 });
  }
}
