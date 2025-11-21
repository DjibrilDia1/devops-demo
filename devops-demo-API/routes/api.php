<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProduitController;

/**
 * Regroupe toutes les routes REST liées aux produits.
 * Ces routes sont consommées par le front React via fetch().
 */
Route::prefix('produits')->group(function (): void {
    Route::get('/', [ProduitController::class, 'allProducts']);
    Route::post('/', [ProduitController::class, 'ajouterProduit']);
    Route::put('/{id}', [ProduitController::class, 'modifierProduit']);
    Route::delete('/{id}', [ProduitController::class, 'supprimerProduit']);
});


