<?php

namespace App\Services\TranslationProviders;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GoogleCloudTranslationProvider implements TranslationProviderInterface
{
    private ?string $apiKey;
    private string $apiUrl = 'https://translation.googleapis.com/language/translate/v2';

    public function __construct()
    {
        $this->apiKey = env('GOOGLE_TRANSLATION_API_KEY');
    }

    /**
     * Traduit un texte via Google Cloud Translate
     */
    public function translate(string $text, string $targetLang, ?string $sourceLang = null): string
    {
        if (!$this->isAvailable()) {
            throw new \Exception('Google Cloud Translation API key not configured');
        }

        try {
            $payload = [
                'q' => $text,
                'target_language' => $this->mapLanguageCode($targetLang),
                'key' => $this->apiKey,
            ];

            if ($sourceLang && $sourceLang !== 'auto') {
                $payload['source_language'] = $this->mapLanguageCode($sourceLang);
            }

            $response = Http::timeout(15)
                ->withoutVerifying()  // Contourner erreur SSL en local
                ->post($this->apiUrl, $payload)
                ->throw();

            $data = $response->json();

            if (isset($data['data']['translations'][0]['translatedText'])) {
                return $data['data']['translations'][0]['translatedText'];
            }

            throw new \Exception('Invalid Google Cloud Translation response');
        } catch (\Exception $e) {
            Log::warning('Google Cloud Translation error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Détecte la langue (Google Cloud n'a pas d'endpoint dédié, on utilise une traduction courte)
     */
    public function detectLanguage(string $text): string
    {
        if (!$this->isAvailable()) {
            return 'auto';
        }

        try {
            $response = Http::timeout(15)
                ->withoutVerifying()  // Contourner erreur SSL en local
                ->post('https://translation.googleapis.com/language/translate/v2/detect', [
                    'q' => substr($text, 0, 100), // Limiter pour la détection
                    'key' => $this->apiKey,
                ])
                ->throw();

            $data = $response->json();
            return strtolower($data['detections'][0][0]['language'] ?? 'auto');
        } catch (\Exception $e) {
            Log::warning('Google Cloud language detection error: ' . $e->getMessage());
            return 'auto';
        }
    }

    public function getName(): string
    {
        return 'Google Cloud Translate';
    }

    public function isAvailable(): bool
    {
        return !empty($this->apiKey);
    }

    private function mapLanguageCode(string $lang): string
    {
        // Google Cloud utilise les codes ISO 639-1 standard
        return strtolower($lang);
    }
}
