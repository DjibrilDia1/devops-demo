import React, { useCallback, useEffect, useState } from 'react';
import { PageHeader } from './components/PageHeader';
import { ProductForm } from './components/ProductForm';
import { ProductTable } from './components/ProductTable';
import { Product, ProductDraft, RawProduct } from './types/product';

/**
 * Point d'entrée vers l'API Laravel. On expose la variable pour permettre
 * une configuration facile via REACT_APP_API_BASE_URL en environnement.
 */
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ?? 'http://localhost:8000';
/**
 * Route RESTful configurée côté Laravel (routes/api.php) pour manipuler les produits.
 */
const PRODUCTS_ENDPOINT = `${API_BASE_URL}/api/produits`;
const INITIAL_FORM_STATE: ProductDraft = {
  prod_name: '',
  prod_price: '',
};

const normalizeProducts = (data: RawProduct[]): Product[] =>
  data.map((item) => ({
    ...item,
    prod_price: Number(item.prod_price),
  }));

const formatPrice = (price: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(price);

function App() {
  /**
   * State local qui reflète les données issues du backend.
   * Chaque mutation côté UI se synchronise ensuite via les appels fetch*.
   */
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<ProductDraft>({ ...INITIAL_FORM_STATE });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Récupère la liste à partir de l'API Laravel (GET /api/produits).
   * Cette fonction est mémoïsée pour éviter de redéfinir les dépendances du useEffect.
   */
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!globalThis.fetch) {
        throw new Error('Fetch API non disponible.');
      }

      const response = await globalThis.fetch(PRODUCTS_ENDPOINT);

      if (!response.ok) {
        throw new Error("Impossible de charger les produits. Veuillez réessayer.");
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Réponse inattendue du serveur.');
      }
      setProducts(normalizeProducts(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inattendue est survenue.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // On interroge l'API dès le montage du composant pour hydrater l'interface.
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (!successMessage) {
      return;
    }
    const timer = setTimeout(() => setSuccessMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({ ...INITIAL_FORM_STATE });
    setEditingId(null);
  };

  /**
   * Création / mise à jour d'un produit via POST ou PUT vers l'API.
   * Le choix de la méthode dépend de la présence d'un identifiant en édition.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const payloadName = formData.prod_name.trim();
    const payloadPrice = Number(formData.prod_price);

    if (!payloadName) {
      setError('Le nom du produit est obligatoire.');
      return;
    }

    if (Number.isNaN(payloadPrice) || payloadPrice < 0) {
      setError('Le prix doit être un nombre positif.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (!globalThis.fetch) {
        throw new Error('Fetch API non disponible.');
      }

      const response = await globalThis.fetch(
        editingId ? `${PRODUCTS_ENDPOINT}/${editingId}` : PRODUCTS_ENDPOINT,
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prod_name: payloadName,
            prod_price: payloadPrice,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("L'opération a échoué. Merci de réessayer.");
      }

      await fetchProducts();
      setSuccessMessage(editingId ? 'Produit mis à jour.' : 'Produit créé.');
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inattendue est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      prod_name: product.prod_name,
      prod_price: String(product.prod_price),
    });
  };

  /**
   * Suppression d'un produit via DELETE /api/produits/{id}.
   * On met ensuite à jour l'état local pour garder l'UI synchronisée.
   */
  const handleDelete = async (productId: number) => {
    const confirmDelete = window.confirm('Supprimer ce produit ?');
    if (!confirmDelete) {
      return;
    }

    setError(null);
    try {
      if (!globalThis.fetch) {
        throw new Error('Fetch API non disponible.');
      }

      const response = await globalThis.fetch(`${PRODUCTS_ENDPOINT}/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('La suppression a échoué.');
      }

      setProducts((previous) => previous.filter((product) => product.id !== productId));
      setSuccessMessage('Produit supprimé.');
      if (editingId === productId) {
        resetForm();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inattendue est survenue.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <PageHeader onRefresh={fetchProducts} isLoading={isLoading} />

        <main className="grid gap-6 lg:grid-cols-[minmax(0,_360px)_1fr]">
          <ProductForm
            editingId={editingId}
            formData={formData}
            isSubmitting={isSubmitting}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />

          <ProductTable
            products={products}
            isLoading={isLoading}
            error={error}
            successMessage={successMessage}
            onEdit={handleEdit}
            onDelete={handleDelete}
            formatPrice={formatPrice}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
