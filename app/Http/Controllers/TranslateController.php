<?php

namespace App\Http\Controllers;

use App\Services\TranslationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TranslateController extends Controller
{
    public function __construct(private TranslationService $translator) {}

    /**
     * POST /api/translate
     * Traduit n'importe quel texte
     */
    public function translate(Request $request): JsonResponse
    {
        $request->validate([
            'text'        => 'required|string|max:5000',
            'target_lang' => 'required|string|size:2',
        ]);

        $text = $request->input('text');
        $lang = $request->input('target_lang');

        $supported = $this->translator->supportedLanguages();
        if (!in_array($lang, $supported)) {
            return response()->json([
                'message' => 'Langue non supportée. Langues disponibles : ' . implode(', ', $supported),
            ], 422);
        }

        $translated = $this->translator->translate($text, $lang);

        return response()->json([
            'original_text'   => $text,
            'translated_text' => $translated,
            'target_lang'     => $lang,
        ]);
    }
}
