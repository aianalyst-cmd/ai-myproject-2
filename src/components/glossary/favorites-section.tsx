"use client";

import { TermList } from "@/components/glossary/term-list";
import type { GlossaryTerm } from "@/types/glossary";

type FavoritesSectionProps = {
  items: GlossaryTerm[];
  favoriteIds: number[];
  readIds: number[];
  isAdmin: boolean;
  isLoggedIn: boolean;
  onToggleFavorite: (id: number) => void;
  onToggleRead: (id: number) => void;
  onMarkRead: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

export function FavoritesSection(props: FavoritesSectionProps) {
  return (
    <section className="mb-8 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
      <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-amber-500">⭐ マイ用語帳 (お気に入り)</h2>
      <TermList
        items={props.items}
        favoriteIds={props.favoriteIds}
        readIds={props.readIds}
        isAdmin={props.isAdmin}
        isLoggedIn={props.isLoggedIn}
        keyPrefix="fav"
        onToggleFavorite={props.onToggleFavorite}
        onToggleRead={props.onToggleRead}
        onMarkRead={props.onMarkRead}
        onEdit={props.onEdit}
        onDelete={props.onDelete}
        empty={
          <p className="px-4 py-4 text-center text-sm text-slate-400">
            お気に入りの用語はまだありません。
            <br />
            ☆マークを押して自分専用の辞書を作りましょう。
          </p>
        }
      />
    </section>
  );
}
