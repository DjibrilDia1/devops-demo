<?php

namespace App\Http\Controllers;

use App\Models\Produit as ProduitModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Contrôleur HTTP qui expose l'API CRUD des produits.
 * Chaque méthode correspond à une route définie dans routes/api.php.
 */
class ProduitController extends Controller
{
    /**
     * Crée un nouveau produit (POST /api/produits).
     * Retourne les données fraîchement insérées afin que le front puisse se mettre à jour.
     */
    public function ajouterProduit(Request $request): JsonResponse
    {
        $payload = $this->validateProduit($request);

        $produit = ProduitModel::createProduit($payload);

        return response()->json($produit, 201);
    }

    /**
     * Met à jour un produit existant (PUT /api/produits/{id}).
     * Récupère le produit par son ID et met à jour ses données.
     */
    public function modifierProduit(Request $request, int $id): JsonResponse
    {
        $produit = ProduitModel::findOrFail($id);
        $payload = $this->validateProduit($request);

        $updated = $produit->updateProduit($payload);

        return response()->json($updated);
    }

    /**
     * Supprime un produit (DELETE /api/produits/{id}).
     * Récupère le produit par son ID et le supprime.
     */
    public function supprimerProduit(int $id): JsonResponse
    {
        $produit = ProduitModel::findOrFail($id);
        $produit->deleteProduit();

        return response()->json([
            'message' => 'Produit supprimé avec succès.',
        ]);
    }

    /**
     * Retourne la liste complète des produits (GET /api/produits).
     * Le tri décroissant sur created_at permet d'afficher les ajouts récents en premier.
     */
    public function allProducts(): JsonResponse
    {
        return response()->json(ProduitModel::listProduits());
    }

    /**
     * Valide les données envoyées par le client.
     * Centraliser cette logique évite de dupliquer les règles entre POST et PUT.
     */
    private function validateProduit(Request $request): array
    {
        return $request->validate([
            'prod_name' => ['required', 'string', 'max:255'],
            'prod_price' => ['required', 'numeric', 'min:0'],
        ]);
    }
}
