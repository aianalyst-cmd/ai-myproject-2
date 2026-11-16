export const CATEGORIES = ["基本", "業務効率化", "データ分析"] as const;

export type Category = (typeof CATEGORIES)[number];

export type CategoryFilter = "all" | Category;

export const SITE_URL = "https://ai-glossary-a.vercel.app/";

export const STORAGE_KEYS = {
  theme: "ai_glossary_theme",
  requests: "ai_requests_v1",
  favorites: "ai_favorites_v1",
  read: "ai_read_status_v1",
} as const;

export type GlossaryTerm = {
  id: number;
  title: string;
  category: string;
  summary: string;
  details: string;
};

export type TermDraft = {
  title: string;
  category: string;
  summary: string;
  details: string;
};

export type GlossaryBackup = {
  requests: string[];
  favorites: number[];
  readStatus: number[];
  timestamp: string;
};

export type TermInsert = Omit<GlossaryTerm, "id">;
