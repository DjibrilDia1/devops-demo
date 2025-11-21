/**
 * Bannière supérieure qui affiche le contexte de l'écran et expose
 * une action "Rafraîchir" connectée directement à l'appel API du parent.
 */
type PageHeaderProps = {
  onRefresh: () => void;
  isLoading: boolean;
};

export function PageHeader({ onRefresh, isLoading }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-6 rounded-2xl bg-white p-6 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">Gestion des produits</p>
        <h1 className="mt-2 text-3xl font-semibold">Catalogue Produit </h1>
        <p className="mt-1 text-slate-500">Créez, mettez à jour et supprimez vos produits.</p>
      </div>
      <button
        type="button"
        onClick={onRefresh}
        disabled={isLoading}
        className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-500 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Rafraîchir
      </button>
    </header>
  );
}


