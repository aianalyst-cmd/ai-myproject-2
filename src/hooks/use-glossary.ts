"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  dailyPickIndex,
  draftFromTerm,
  emptyDraft,
  faqJsonLd,
  normalizeText,
  progressMessage,
  progressShareText,
  shareUrl,
  termInputFromDraft,
  termShareText,
} from "@/lib/glossary";
import { formatMutationError, isAdminEmail } from "@/lib/admin";
import { deleteTermById, fetchTerms, insertTerm, updateTerm } from "@/lib/terms";
import {
  fetchUserProgress,
  isIgnorableProgressError,
  upsertUserProgress,
} from "@/lib/user-progress";
import {
  STORAGE_KEYS,
  type CategoryFilter,
  type GlossaryBackup,
  type GlossaryTerm,
  type TermDraft,
} from "@/types/glossary";

function readJson(key: string): unknown {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

function readNumbers(key: string): number[] {
  const value = readJson(key);
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is number => typeof item === "number");
}

function readStrings(key: string): string[] {
  const value = readJson(key);
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function openShare(text: string) {
  const popup = window.open(shareUrl(text), "_blank", "noopener,noreferrer");
  if (popup) popup.opener = null;
}

export function useGlossary() {
  const { user, authReady, signInWithGoogle, signOut } = useAuth();
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [requests, setRequests] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [readIds, setReadIds] = useState<number[]>([]);
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [requestInput, setRequestInput] = useState("");
  const [draft, setDraft] = useState<TermDraft>(emptyDraft());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const adminRef = useRef<HTMLElement>(null);
  const isDeletingRef = useRef(false);
  const userId = user?.id ?? null;
  const isAdmin = isAdminEmail(user?.email);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const storedTheme = localStorage.getItem(STORAGE_KEYS.theme) === "light" ? "light" : "dark";
      setTheme(storedTheme);
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
      setRequests(readStrings(STORAGE_KEYS.requests));

      try {
        const nextTerms = await fetchTerms();
        if (cancelled) return;
        setTerms(nextTerms);
        setLoadError(null);
      } catch (error) {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : "用語データの取得に失敗しました。";
        console.error("[glossary] terms fetch failed:", message, error);
        setTerms([]);
        setLoadError(message);
      } finally {
        if (!cancelled) setReady(true);
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!authReady || !ready) return;

    let cancelled = false;

    async function loadProgress() {
      const validIds = new Set(terms.map((term) => term.id));

      if (!userId) {
        if (cancelled) return;
        setFavoriteIds(readNumbers(STORAGE_KEYS.favorites).filter((id) => validIds.has(id)));
        setReadIds(readNumbers(STORAGE_KEYS.read).filter((id) => validIds.has(id)));
        return;
      }

      try {
        const progress = await fetchUserProgress(userId);
        if (cancelled) return;
        setFavoriteIds(progress.favoriteIds.filter((id) => validIds.has(id)));
        setReadIds(progress.readIds.filter((id) => validIds.has(id)));
      } catch (error) {
        if (cancelled) return;
        console.error(error);
        alert(error instanceof Error ? error.message : "進捗データの読み込みに失敗しました。");
        setFavoriteIds([]);
        setReadIds([]);
      }
    }

    void loadProgress();

    return () => {
      cancelled = true;
    };
    // terms は ready 時点の一覧で絞り込み。削除後の再取得はしない（削除済み term_id の upsert を避ける）。
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally omit terms
  }, [authReady, userId, ready]);

  useEffect(() => {
    if (!ready) return;
    const validIds = new Set(terms.map((term) => term.id));
    setFavoriteIds((current) => current.filter((id) => validIds.has(id)));
    setReadIds((current) => current.filter((id) => validIds.has(id)));
  }, [ready, terms]);

  useEffect(() => {
    if (!ready) return;
    const scriptId = "seo-json-ld";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.text = faqJsonLd(terms);
  }, [ready, terms]);

  const total = terms.length;
  const readCount = readIds.length;
  const percent = total > 0 ? Math.round((readCount / total) * 100) : 0;

  const favorites = useMemo(
    () => terms.filter((item) => favoriteIds.includes(item.id)),
    [favoriteIds, terms],
  );

  const filtered = useMemo(() => {
    const normalizedQuery = normalizeText(query);
    return terms.filter((item) => {
      const matchesCategory = category === "all" || item.category === category;
      const matchesQuery =
        normalizeText(item.title).includes(normalizedQuery) ||
        normalizeText(item.summary).includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query, terms]);

  const dailyTerm = total > 0 ? terms[dailyPickIndex(total)] : null;

  function persistFavoritesLocal(next: number[]) {
    setFavoriteIds(next);
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(next));
  }

  function persistReadLocal(next: number[]) {
    setReadIds(next);
    localStorage.setItem(STORAGE_KEYS.read, JSON.stringify(next));
  }

  function persistRequests(next: string[]) {
    setRequests(next);
    localStorage.setItem(STORAGE_KEYS.requests, JSON.stringify(next));
  }

  async function syncProgress(
    termId: number,
    isFavorite: boolean,
    isUnderstood: boolean,
    existingTermIds: Iterable<number> = terms.map((term) => term.id),
  ) {
    if (!userId) return;
    if (isDeletingRef.current) return;

    const validIds = new Set(existingTermIds);
    if (!validIds.has(termId)) return;

    await upsertUserProgress(
      {
        user_id: userId,
        term_id: termId,
        is_favorite: isFavorite,
        is_understood: isUnderstood,
      },
      validIds,
    );
  }

  function handleProgressSyncError(
    error: unknown,
    rollback: () => void,
    fallbackMessage: string,
  ) {
    if (isIgnorableProgressError(error) || isDeletingRef.current) {
      return;
    }
    rollback();
    alert(error instanceof Error ? error.message : fallbackMessage);
  }

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem(STORAGE_KEYS.theme, next);
  }

  function toggleFavorite(id: number) {
    const nextFavorites = favoriteIds.includes(id)
      ? favoriteIds.filter((item) => item !== id)
      : [...favoriteIds, id];
    const isFavorite = nextFavorites.includes(id);
    const isUnderstood = readIds.includes(id);

    if (userId) {
      setFavoriteIds(nextFavorites);
      void syncProgress(id, isFavorite, isUnderstood).catch((error) => {
        handleProgressSyncError(error, () => setFavoriteIds(favoriteIds), "お気に入りの保存に失敗しました。");
      });
      return;
    }

    persistFavoritesLocal(nextFavorites);
  }

  function toggleRead(id: number) {
    const nextRead = readIds.includes(id) ? readIds.filter((item) => item !== id) : [...readIds, id];
    const isUnderstood = nextRead.includes(id);
    const isFavorite = favoriteIds.includes(id);

    if (userId) {
      setReadIds(nextRead);
      void syncProgress(id, isFavorite, isUnderstood).catch((error) => {
        handleProgressSyncError(error, () => setReadIds(readIds), "理解度の保存に失敗しました。");
      });
      return;
    }

    persistReadLocal(nextRead);
  }

  function markRead(id: number) {
    if (readIds.includes(id)) return;
    const nextRead = [...readIds, id];
    const isFavorite = favoriteIds.includes(id);

    if (userId) {
      setReadIds(nextRead);
      void syncProgress(id, isFavorite, true).catch((error) => {
        handleProgressSyncError(error, () => setReadIds(readIds), "理解度の保存に失敗しました。");
      });
      return;
    }

    persistReadLocal(nextRead);
  }

  function submitRequest() {
    const value = requestInput.trim();
    if (!value) return;
    persistRequests([...requests, value]);
    setRequestInput("");
    alert("リクエストを送信しました！");
  }

  function deleteRequest(index: number) {
    persistRequests(requests.filter((_, itemIndex) => itemIndex !== index));
  }

  function resetDraft() {
    setDraft(emptyDraft());
    setEditingId(null);
  }

  function openAdminPanel() {
    adminRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function startEdit(id: number) {
    if (!isAdmin) return;
    const item = terms.find((term) => term.id === id);
    if (!item) return;
    setEditingId(id);
    setDraft(draftFromTerm(item));
    openAdminPanel();
  }

  async function saveTerm() {
    if (!isAdmin) {
      alert("管理者のみ用語を保存できます。");
      return;
    }

    const input = termInputFromDraft(draft);
    if (!input.title || !input.summary || !input.details) {
      alert("用語名・要約・詳細は必須です。");
      return;
    }

    setSaving(true);
    try {
      if (editingId != null) {
        const updated = await updateTerm(editingId, input);
        setTerms((current) => current.map((item) => (item.id === editingId ? updated : item)));
        alert("更新しました");
      } else {
        const created = await insertTerm(input);
        setTerms((current) => [...current, created].sort((a, b) => a.id - b.id));
        alert("追加しました");
      }
      resetDraft();
    } catch (error) {
      alert(formatMutationError(error, editingId != null ? "更新" : "追加"));
    } finally {
      setSaving(false);
    }
  }

  async function deleteTerm(id: number) {
    if (!isAdmin) return;
    if (!confirm("本当に削除しますか？")) return;

    const previousTerms = terms;
    const previousFavorites = favoriteIds;
    const previousRead = readIds;
    const nextTerms = terms.filter((item) => item.id !== id);
    const nextFavorites = favoriteIds.filter((item) => item !== id);
    const nextRead = readIds.filter((item) => item !== id);

    isDeletingRef.current = true;
    setTerms(nextTerms);
    if (userId) {
      setFavoriteIds(nextFavorites);
      setReadIds(nextRead);
    } else {
      persistFavoritesLocal(nextFavorites);
      persistReadLocal(nextRead);
    }
    if (editingId === id) resetDraft();

    try {
      await deleteTermById(id);
    } catch (error) {
      setTerms(previousTerms);
      if (userId) {
        setFavoriteIds(previousFavorites);
        setReadIds(previousRead);
      } else {
        persistFavoritesLocal(previousFavorites);
        persistReadLocal(previousRead);
      }
      alert(formatMutationError(error, "削除"));
    } finally {
      isDeletingRef.current = false;
    }
  }

  function exportData() {
    const backup: GlossaryBackup = {
      requests,
      favorites: favoriteIds,
      readStatus: readIds,
      timestamp: new Date().toISOString(),
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `ai_glossary_backup_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function importData(file: File) {
    if (userId) {
      alert("ログイン中はクラウド同期を使うため、LocalStorage バックアップの復元はできません。");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(String(reader.result)) as Partial<GlossaryBackup>;
        const nextFavorites = Array.isArray(imported.favorites)
          ? imported.favorites.filter((item): item is number => typeof item === "number")
          : null;
        const nextRead = Array.isArray(imported.readStatus)
          ? imported.readStatus.filter((item): item is number => typeof item === "number")
          : null;
        const nextRequests = Array.isArray(imported.requests)
          ? imported.requests.filter((item): item is string => typeof item === "string")
          : null;

        if (nextFavorites == null && nextRead == null && nextRequests == null) {
          alert("無効なバックアップファイルです。");
          return;
        }

        if (nextFavorites) persistFavoritesLocal(nextFavorites);
        if (nextRead) persistReadLocal(nextRead);
        if (nextRequests) persistRequests(nextRequests);
        alert("お気に入り・理解度・リクエストを復元しました（用語データは Supabase 管理です）。");
      } catch {
        alert("ファイルの読み込みに失敗しました。");
      }
    };
    reader.readAsText(file);
  }

  async function handleGoogleSignIn() {
    try {
      await signInWithGoogle();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Googleログインに失敗しました。");
    }
  }

  async function handleGoogleSignOut() {
    try {
      await signOut();
      resetDraft();
    } catch (error) {
      alert(error instanceof Error ? error.message : "ログアウトに失敗しました。");
    }
  }

  function shareProgress() {
    openShare(progressShareText(percent, total, readCount));
  }

  function shareTerm(id: number) {
    const item = terms.find((term) => term.id === id);
    if (!item) return;
    openShare(termShareText(item));
  }

  return {
    ready: ready && authReady,
    loadError,
    theme,
    user,
    terms,
    requests,
    favoriteIds,
    readIds,
    category,
    query,
    isAdmin,
    requestInput,
    draft,
    editingId,
    saving,
    adminRef,
    favorites,
    filtered,
    dailyTerm,
    total,
    readCount,
    percent,
    message: progressMessage(percent),
    toggleTheme,
    signInWithGoogle: handleGoogleSignIn,
    signOut: handleGoogleSignOut,
    openAdminPanel,
    setCategory,
    setQuery,
    setRequestInput,
    setDraft,
    toggleFavorite,
    toggleRead,
    markRead,
    submitRequest,
    deleteRequest,
    startEdit,
    saveTerm,
    resetDraft,
    deleteTerm,
    exportData,
    importData,
    shareProgress,
    shareTerm,
  };
}
