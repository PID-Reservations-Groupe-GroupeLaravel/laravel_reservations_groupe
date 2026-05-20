<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Services\TranslationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * Exemple d'intégration: ReviewController avec traductions automatiques
 *
 * Quand un utilisateur laisse un avis (commentaire), celui-ci est automatiquement
 * traduit en FR/EN/NL via DeepL (fallback Google Cloud) avec cache Redis 24h.
 */
class ReviewController_EXAMPLE extends Controller
{
    private TranslationService $translationService;

    public function __construct(TranslationService $translationService)
    {
        $this->translationService = $translationService;
    }

    /**
     * POST /api/shows/{id}/reviews
     * Créer un avis avec traductions automatiques
     *
     * Request:
     * {
     *     "rating": 5,
     *     "comment": "C'était un spectacle incroyable!",
     *     "language": "fr"  // Langue du contenu original
     * }
     */
    public function store(Request $request, int $showId): JsonResponse
    {
        $validated = $request->validate([
            'rating' => 'required|integer|between:1,5',
            'comment' => 'required|string|max:1000|min:10',
            'language' => 'string|in:fr,en,nl',
        ]);

        $sourceLanguage = $validated['language'] ?? 'fr';
        $comment = $validated['comment'];

        try {
            // 1️⃣ Traduire le contenu automatiquement
            // DeepL (prioritaire) → Google Cloud (fallback)
            // Résultat mis en cache 24h dans Redis
            $translations = $this->translationService->translateToAll(
                $comment,
                $sourceLanguage
            );

            // 2️⃣ Sauvegarder l'avis avec toutes les traductions
            $review = Review::create([
                'user_id' => auth()->id(),
                'show_id' => $showId,
                'rating' => $validated['rating'],

                // Stocker les 3 versions (FR/EN/NL)
                'comment_fr' => $translations['fr'],
                'comment_en' => $translations['en'],
                'comment_nl' => $translations['nl'],

                // Métadonnées
                'source_language' => $sourceLanguage,
                'translated_by' => 'deepl', // Ou 'google_cloud'
                'status' => 'pending', // En attente de modération
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Avis créé et traduit automatiquement',
                'review' => [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'translations' => [
                        'fr' => $review->comment_fr,
                        'en' => $review->comment_en,
                        'nl' => $review->comment_nl,
                    ],
                    'translated_by' => $review->translated_by,
                    'status' => $review->status,
                ]
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Review translation error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la traduction',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/shows/{id}/reviews
     * Récupérer les avis avec la langue préférée
     *
     * Query params:
     * - language=en (retourne les avis en anglais)
     * - show_id=1
     */
    public function index(int $showId): JsonResponse
    {
        $language = request()->get('language', 'fr');

        $reviews = Review::where('show_id', $showId)
            ->where('status', 'approved')
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($review) use ($language) {
                return [
                    'id' => $review->id,
                    'user' => [
                        'id' => $review->user->id,
                        'name' => $review->user->firstname . ' ' . $review->user->lastname,
                    ],
                    'rating' => $review->rating,
                    'comment' => $review->getComment($language), // Retourne dans la bonne langue
                    'created_at' => $review->created_at,
                    'language_displayed' => $language,
                ];
            });

        return response()->json([
            'reviews' => $reviews,
            'count' => count($reviews),
        ]);
    }

    /**
     * DELETE /api/reviews/{id}
     * Supprimer un avis et invalider le cache
     */
    public function destroy(int $reviewId): JsonResponse
    {
        $review = Review::findOrFail($reviewId);

        // Vérifier que c'est l'auteur ou un admin
        if (auth()->id() !== $review->user_id && !auth()->user()->isAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Invalider le cache pour ce commentaire
        $this->translationService->invalidateCache($review->comment_fr);

        $review->delete();

        return response()->json(['message' => 'Avis supprimé']);
    }

    /**
     * GET /api/reviews/status
     * Admin: Voir le statut des services de traduction
     */
    public function translationStatus(): JsonResponse
    {
        return response()->json([
            'providers' => $this->translationService->getProvidersStatus(),
            'cache_driver' => config('translation.cache.driver'),
            'cache_ttl' => config('translation.cache.ttl'),
        ]);
    }
}
