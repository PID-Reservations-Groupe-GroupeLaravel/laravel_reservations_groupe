<?php

namespace App\Services\TranslationProviders;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DeepLTranslationProvider implements TranslationProviderInterface
{
    private ?string $apiKey;
    private string $apiUrl = 'https://api-free.deepl.com/v1'; // Free tier
    private array $dailyUsage = [];

    public function __construct()
    {
        $this->apiKey = config('services.deepl.api_key', env('DEEPL_API_KEY'));
    }

    /**
     * Traduit un texte via DeepL
     */
    public function translate(string $text, string $targetLang, ?string $sourceLang = null): string
    {
        if (!$this->isAvailable()) {
            throw new \Exception('DeepL API key not configured');
        }

        if ($this->isLimitExceeded()) {
            throw new \Exception('DeepL daily limit exceeded');
        }

        try {
            $response = Http::timeout(15)
                ->withHeaders(['Authorization' => 'DeepL-Auth-Key ' . $this->apiKey])
                ->withoutVerifying()  // Contourner erreur SSL en local
                ->post($this->apiUrl . '/translate', [
                    'text' => [$text],
                    'target_lang' => $this->mapLanguageCode($targetLang),
                    'source_lang' => $sourceLang ? $this->mapLanguageCode($sourceLang) : null,
                    'preserve_formatting' => true,
                ])
                ->throw();

            $data = $response->json();

            if (isset($data['translations'][0]['text'])) {
                $this->incrementDailyUsage();
                return $data['translations'][0]['text'];
            }

            throw new \Exception('Invalid DeepL response');
        } catch (\Exception $e) {
            Log::warning('DeepL translation error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Détecte la langue automatiquement
     * NOTE: DeepL n'a pas d'endpoint de détection dédié
     * On retourne null pour que le TranslationManager utilise le fallback (FR)
     */
    public function detectLanguage(string $text): string
    {
        // DeepL doesn't have a public language detection endpoint
        // Return 'fr' as default instead of 'auto' (which DeepL doesn't support)
        return 'fr';
    }

    public function getName(): string
    {
        return 'DeepL';
    }

    public function isAvailable(): bool
    {
        return !empty($this->apiKey);
    }

    private function mapLanguageCode(string $lang): string
    {
        $mapping = [
            'fr' => 'FR',
            'en' => 'EN-US',
            'nl' => 'NL',
            'de' => 'DE',
            'es' => 'ES',
            'it' => 'IT',
            'pt' => 'PT-BR',
            'ru' => 'RU',
            'ja' => 'JA',
            'zh' => 'ZH',
        ];

        return $mapping[strtolower($lang)] ?? strtoupper($lang);
    }

    private function isLimitExceeded(): bool
    {
        $key = 'deepl_daily_usage_' . date('Y-m-d');
        $usage = cache()->get($key, 0);

        // Free tier: 500,000 caractères par mois (~16,666 par jour)
        $dailyLimit = 16666;

        return $usage >= $dailyLimit;
    }

    private function incrementDailyUsage(int $characters = 1): void
    {
        $key = 'deepl_daily_usage_' . date('Y-m-d');
        cache()->increment($key, $characters, 86400); // TTL 24h
    }
}
