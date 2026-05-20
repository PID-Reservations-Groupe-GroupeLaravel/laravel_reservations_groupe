<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class TranslationService
{
    private string $apiUrl = 'https://api.mymemory.translated.net/get';

    /**
     * Traduit un texte vers la langue cible via MyMemory API (gratuit, sans clé).
     * Résultat mis en cache 24h pour éviter les appels API répétés.
     */
    public function translate(string $text, string $targetLang): string
    {
        $cacheKey = 'translation_' . md5($text . '_' . $targetLang);

        return Cache::remember($cacheKey, now()->addHours(24), function () use ($text, $targetLang) {
            try {
                $response = Http::timeout(10)->get($this->apiUrl, [
                    'q'        => $text,
                    'langpair' => 'auto|' . strtoupper($targetLang),
                    'de'       => 'standing-ovation@example.com',
                ]);

                if ($response->successful()) {
                    $data = $response->json();
                    if ($data['responseStatus'] === 200 && isset($data['responseData']['translatedText'])) {
                        return $data['responseData']['translatedText'];
                    }
                }
            } catch (\Exception $e) {
                \Log::warning('Translation service error: ' . $e->getMessage());
            }

            return $text;
        });
    }

    public function supportedLanguages(): array
    {
        return ['fr', 'en', 'nl'];
    }
}
