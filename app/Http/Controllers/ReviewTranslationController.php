<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Services\TranslationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewTranslationController extends Controller
{
    public function __construct(private TranslationService $translator) {}

    /**
     * GET /api/reviews/{id}/translate?lang=fr
     */
    public function translate(Request $request, int $id): JsonResponse
    {
        $review = Review::with('user')->find($id);

        if (!$review) {
            return response()->json(['message' => 'Avis introuvable'], 404);
        }

        $lang = $request->query('lang', 'en');
        $supported = $this->translator->supportedLanguages();

        if (!in_array($lang, $supported)) {
            return response()->json([
                'message'   => 'Langue non supportee. Langues disponibles : ' . implode(', ', $supported),
            ], 422);
        }

        if (empty($review->comment)) {
            return response()->json([
                'id'                  => $review->id,
                'original_comment'    => '',
                'translated_comment'  => '',
                'target_lang'         => $lang,
            ]);
        }

        $translated = $this->translator->translate($review->comment, $lang);

        return response()->json([
            'id'                  => $review->id,
            'original_comment'    => $review->comment,
            'translated_comment'  => $translated,
            'target_lang'         => $lang,
            'score'               => $review->score,
            'author'              => $review->user?->name,
        ]);
    }
}
