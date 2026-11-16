"use client";

import { AdminPanel } from "@/components/glossary/admin-panel";
import { DailyPick } from "@/components/glossary/daily-pick";
import { FavoritesSection } from "@/components/glossary/favorites-section";
import { GlossaryFilters } from "@/components/glossary/glossary-filters";
import { ProgressDashboard } from "@/components/glossary/progress-dashboard";
import { RequestForm } from "@/components/glossary/request-form";
import { SiteFooter } from "@/components/glossary/site-footer";
import { SiteHeader } from "@/components/glossary/site-header";
import { TermList } from "@/components/glossary/term-list";
import { useGlossary } from "@/hooks/use-glossary";

export function GlossaryApp() {
  const glossary = useGlossary();

  if (!glossary.ready) {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-900" />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-8 text-slate-800 transition-colors dark:bg-slate-900 dark:text-slate-50">
      <SiteHeader
        theme={glossary.theme}
        user={glossary.user}
        isAdmin={glossary.isAdmin}
        onToggleTheme={glossary.toggleTheme}
        onSignInWithGoogle={() => {
          void glossary.signInWithGoogle();
        }}
        onSignOut={() => {
          void glossary.signOut();
        }}
        onOpenAdmin={glossary.openAdminPanel}
      />

      <main className="mx-auto max-w-3xl px-4">
        {glossary.loadError && (
          <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
            用語データの取得に失敗しました: {glossary.loadError}
          </p>
        )}

        <ProgressDashboard
          percent={glossary.percent}
          total={glossary.total}
          readCount={glossary.readCount}
          message={glossary.message}
          onShare={glossary.shareProgress}
        />

        {glossary.dailyTerm && <DailyPick term={glossary.dailyTerm} onShare={glossary.shareTerm} />}

        <GlossaryFilters
          query={glossary.query}
          category={glossary.category}
          onQueryChange={glossary.setQuery}
          onCategoryChange={glossary.setCategory}
        />

        <FavoritesSection
          items={glossary.favorites}
          favoriteIds={glossary.favoriteIds}
          readIds={glossary.readIds}
          isAdmin={glossary.isAdmin}
          isLoggedIn={glossary.user != null}
          onToggleFavorite={glossary.toggleFavorite}
          onToggleRead={glossary.toggleRead}
          onMarkRead={glossary.markRead}
          onEdit={glossary.startEdit}
          onDelete={glossary.deleteTerm}
        />

        <RequestForm
          value={glossary.requestInput}
          onChange={glossary.setRequestInput}
          onSubmit={glossary.submitRequest}
        />

        <section>
          <TermList
            items={glossary.filtered}
            favoriteIds={glossary.favoriteIds}
            readIds={glossary.readIds}
            isAdmin={glossary.isAdmin}
            isLoggedIn={glossary.user != null}
            onToggleFavorite={glossary.toggleFavorite}
            onToggleRead={glossary.toggleRead}
            onMarkRead={glossary.markRead}
            onEdit={glossary.startEdit}
            onDelete={glossary.deleteTerm}
            empty={<p className="px-4 py-12 text-center text-slate-400">該当する用語が見つかりませんでした。</p>}
          />
        </section>

        {glossary.isAdmin && (
          <AdminPanel
            panelRef={glossary.adminRef}
            draft={glossary.draft}
            editing={glossary.editingId != null}
            saving={glossary.saving}
            requests={glossary.requests}
            onChange={glossary.setDraft}
            onSubmit={() => {
              void glossary.saveTerm();
            }}
            onCancel={glossary.resetDraft}
            onDeleteRequest={glossary.deleteRequest}
            onExport={glossary.exportData}
            onImport={glossary.importData}
          />
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
