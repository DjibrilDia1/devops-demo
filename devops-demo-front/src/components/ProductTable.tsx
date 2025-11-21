import { Product } from '../types/product';

/**
 * Tableau réactif qui reflète l'état renvoyé par l'API Laravel.
 * Il expose des callbacks pour déclencher les actions d'édition / suppression.
 */
type ProductTableProps = {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
  formatPrice: (price: number) => string;
};

export function ProductTable({
  products,
  isLoading,
  error,
  successMessage,
  onEdit,
  onDelete,
  formatPrice,
}: ProductTableProps) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">Inventaire</p>
          <h2 className="text-xl font-semibold text-slate-900">Produits</h2>
        </div>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-600">{products.length}</span>
      </div>

      {error && <p className="mb-3 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>}
      {successMessage && (
        <p className="mb-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{successMessage}</p>
      )}

      {isLoading ? (
        <p className="text-sm text-slate-500">Chargement en cours...</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-slate-500">Aucun produit pour le moment. Ajoutez-en un !</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left">Nom</th>
                  <th className="px-4 py-3 text-left">Prix (XOF)</th>
                  <th className="px-4 py-3 text-left">Créé le</th>
                  <th className="px-4 py-3 text-right" aria-label="actions">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {products.map((product) => (
                  <tr key={product.id} className="transition hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-medium">{product.prod_name}</td>
                    <td className="px-4 py-3">{formatPrice(product.prod_price)}</td>
                    <td className="px-4 py-3">{new Date(product.created_at).toLocaleDateString('fr-FR')}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(product)}
                          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:bg-brand-50"
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                          onClick={() => onDelete(product.id)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}


