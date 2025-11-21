import type { ChangeEvent, FormEvent } from 'react';
import { ProductDraft } from '../types/product';

/**
 * Formulaire contrôlé qui pilote les appels POST/PUT vers l'API produits.
 * Toutes les valeurs proviennent du parent pour garder une source de vérité unique.
 */
type ProductFormProps = {
  editingId: number | null;
  formData: ProductDraft;
  isSubmitting: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export function ProductForm({
  editingId,
  formData,
  isSubmitting,
  onChange,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">{editingId ? 'Edition' : 'Création'}</p>
          <h2 className="text-xl font-semibold text-slate-900">
            {editingId ? 'Modifier un produit' : 'Ajouter un produit'}
          </h2>
        </div>
        {editingId && (
          <button
            type="button"
            className="text-sm font-semibold text-slate-500 transition hover:text-slate-800"
            onClick={onCancel}
          >
            Annuler
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
          Nom du produit
          <input
            type="text"
            name="prod_name"
            placeholder="Ex: Clavier mécanique"
            value={formData.prod_name}
            onChange={onChange}
            autoComplete="off"
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-base font-normal text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
          Prix (XOF)
          <input
            type="number"
            min="0"
            step="0.01"
            name="prod_price"
            placeholder="Ex: 129.99"
            value={formData.prod_price}
            onChange={onChange}
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-base font-normal text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20"
          />
        </label>

        <button
          className="w-full rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enregistrement...' : editingId ? 'Mettre à jour' : 'Créer'}
        </button>
      </form>
    </section>
  );
}


