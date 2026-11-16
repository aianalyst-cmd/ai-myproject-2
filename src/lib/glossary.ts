import { CATEGORIES, SITE_URL, type GlossaryTerm, type TermDraft, type TermInsert } from "@/types/glossary";

export function emptyDraft(): TermDraft {
  return {
    title: "",
    category: CATEGORIES[0],
    summary: "",
    details: "",
  };
}

export function draftFromTerm(term: GlossaryTerm): TermDraft {
  return {
    title: term.title,
    category: term.category,
    summary: term.summary,
    details: term.details,
  };
}

export function termInputFromDraft(draft: TermDraft): TermInsert {
  return {
    title: draft.title.trim(),
    category: draft.category,
    summary: draft.summary.trim(),
    details: draft.details.trim(),
  };
}

export function normalizeText(value: string | undefined | null): string {
  if (!value) return "";
  return value.toLowerCase().replace(/[\u30a1-\u30f6]/g, (match) => {
    return String.fromCharCode(match.charCodeAt(0) - 0x60);
  });
}

export function progressMessage(percent: number): string {
  if (percent === 0) return "まずは1つ、用語をチェックしてみましょう！";
  if (percent <= 30) return "基礎を固め中！この調子で進みましょう。";
  if (percent <= 60) return "AIの全体像が見えてきましたね！実務活用まであと一歩。";
  if (percent < 100) return "かなりのAI通です！自信を持って実務に活かしましょう。";
  return "コンプリート！あなたはAI実務マスターです！";
}

export function dailyPickIndex(length: number, now = new Date()): number {
  const seed = now.getFullYear() * 1000 + (now.getMonth() + 1) * 100 + now.getDate();
  return seed % length;
}

export function categoryOptions(current: string): readonly string[] {
  if ((CATEGORIES as readonly string[]).includes(current)) return CATEGORIES;
  return [...CATEGORIES, current];
}

export function shareUrl(text: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

export function progressShareText(percent: number, total: number, readCount: number): string {
  return `私のビジネスAI実務理解度は【 ${percent} % 】に到達！\n全${total}語中、${readCount}語のAI重要ワードを習得しました。\nあなたも5秒でAI知識をコンプリートしよう ➔ ${SITE_URL}`;
}

export function termShareText(term: GlossaryTerm): string {
  return `#今日のAI用語：${term.title} を5秒で理解した！\n「${term.summary}」\nビジネスパーソン向けの5秒AI用語集サイトはこちら ➔ ${SITE_URL}`;
}

export function summaryCopyText(term: GlossaryTerm): string {
  return `【用語名】${term.title}\n【概要】${term.summary}\n（詳細・他の用語はこちら ➔ ${SITE_URL} ）`;
}

export function faqJsonLd(terms: GlossaryTerm[]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: terms.map((item) => ({
      "@type": "Question",
      name: item.title,
      acceptedAnswer: {
        "@type": "Answer",
        text: `【概要】${item.summary} 【詳細】${item.details}`,
      },
    })),
  });
}

export function quizExplanation(term: GlossaryTerm): string {
  return [`【概要】${term.summary}`, `【詳細】${term.details}`].join("\n");
}
