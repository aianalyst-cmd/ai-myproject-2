"use client";

import { TermCard } from "@/components/glossary/term-card";
import type { GlossaryTerm } from "@/types/glossary";

type TermListProps = {
  items: GlossaryTerm[];
  empty: React.ReactNode;
  favoriteIds: number[];
  readIds: number[];
  isAdmin: boolean;
  isLoggedIn: boolean;
  keyPrefix?: string;
  onToggleFavorite: (id: number) => void;
  onToggleRead: (id: number) => void;
  onMarkRead: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

export function TermList({
  items,
  empty,
  favoriteIds,
  readIds,
  isAdmin,
  isLoggedIn,
  keyPrefix = "term",
  onToggleFavorite,
  onToggleRead,
  onMarkRead,
  onEdit,
  onDelete,
}: TermListProps) {
  if (items.length === 0) return empty;

  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <TermCard
          key={`${keyPrefix}-${item.id}`}
          item={item}
          isFavorite={favoriteIds.includes(item.id)}
          isRead={readIds.includes(item.id)}
          isAdmin={isAdmin}
          isLoggedIn={isLoggedIn}
          onToggleFavorite={onToggleFavorite}
          onToggleRead={onToggleRead}
          onMarkRead={onMarkRead}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
