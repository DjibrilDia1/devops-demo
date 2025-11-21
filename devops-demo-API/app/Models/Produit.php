<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Représente un enregistrement dans la table "products".
 * Propose une API orientée objet utilisée par le contrôleur Produit.
 */
class Produit extends Model
{
    /**
     * Nom explicite de la table associée.
     */
    protected $table = 'products';

    /**
     * Attributs pouvant être remplis en masse.
     */
    protected $fillable = [
        'prod_name',
        'prod_price',
    ];

    /**
     * Cast automatiques.
     */
    protected $casts = [
        'prod_price' => 'float',
    ];

    /**
     * Enregistre un produit via un payload validé par le contrôleur.
     */
    public static function createProduit(array $payload): self
    {
        return self::create($payload);
    }

    /**
     * Met à jour le produit courant.larave
     * Utilise fill() puis save() pour garantir que tous les champs sont mis à jour.
     */
    public function updateProduit(array $payload): self
    {
        $this->fill($payload);
        $this->save();

        return $this->fresh();
    }

    /**
     * Supprime le produit courant.
     */
    public function deleteProduit(): void
    {
        $this->delete();
    }

    /**
     * Retourne la liste des produits triés par création décroissante.
     */
    public static function listProduits(): Collection
    {
        return self::query()
            ->orderByDesc('created_at')
            ->get();
    }
}
