<?php

namespace App\Services;

use App\Services\TranslationProviders\TranslationProviderInterface;
use App\Services\TranslationProviders\DeepLTranslationProvider;
use App\Services\TranslationProviders\GoogleCloudTranslationProvider;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class TranslationManager
{
    private array $providers = [];
    private const CACHE_TTL = 86400; // 24 heures
    private const CACHE_PREFIX = 'translation_';

    public function __construct()
    {
        // Initialiser les providers dans l'ordre de priorité
        $this->providers = [
            new DeepLTranslationProvider(),
            new GoogleCloudTranslationProvider(),
        ];
    }

    /**
     * Traduit un texte vers une ou plusieurs langues cibles
     * Avec cache Redis et fallback automatique
     */
    public function translate(string $text, array $targetLanguages = ['fr', 'en', 'nl'], ?string $sourceLang = null): array
    {
        $results = [];

        foreach ($targetLanguages as $targetLang) {
            // Déterminer la langue source si elle n'est pas fournie
            if (!$sourceLang) {
                $cacheKey = $this->getCacheKey($text, 'detect');
                $sourceLang = Cache::remember($cacheKey, self::CACHE_TTL, function () use ($text) {
                    return $this->detectLanguageWithFallback($text);
                });
            }

            // Ne pas traduire si la langue source = langue cible
            if ($sourceLang === $targetLang) {
                $results[$targetLang] = $text;
                continue;
            }

            // Chercher en cache
            $cacheKey = $this->getCacheKey($text, $targetLang, $sourceLang);
            $results[$targetLang] = Cache::remember($cacheKey, self::CACHE_TTL, function () use ($text, $targetLang, $sourceLang) {
                return $this->translateWithFallback($text, $targetLang, $sourceLang);
            });
        }

        return $results;
    }

    /**
     * Traduit un texte unique vers une langue cible (version simple)
     */
    public function translateTo(string $text, string $targetLang, ?string $sourceLang = null): string
    {
        if (!$sourceLang) {
            $sourceLang = $this->detectLanguageWithFallback($text);
        }

        if ($sourceLang === $targetLang) {
            return $text;
        }

        $cacheKey = $this->getCacheKey($text, $targetLang, $sourceLang);

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($text, $targetLang, $sourceLang) {
            return $this->translateWithFallback($text, $targetLang, $sourceLang);
        });
    }

    /**
     * Détecte la langue avec fallback
     */
    public function detectLanguageWithFallback(string $text): string
    {
        foreach ($this->providers as $provider) {
            if (!$provider->isAvailable()) {
                continue;
            }

            try {
                $detected = $provider->detectLanguage($text);
                Log::info("Language detected by {$provider->getName()}: {$detected}");
                return $detected;
            } catch (\Exception $e) {
                Log::warning("Detection failed with {$provider->getName()}: {$e->getMessage()}");
                continue;
            }
        }

        // Fallback: assumer FR si on ne peut pas détecter
        Log::warning('Could not detect language, defaulting to FR');
        return 'fr';
    }

    /**
     * Traduit avec fallback entre providers
     */
    private function translateWithFallback(string $text, string $targetLang, string $sourceLang): string
    {
        foreach ($this->providers as $provider) {
            if (!$provider->isAvailable()) {
                Log::debug("{$provider->getName()} not available, skipping");
                continue;
            }

            try {
                $translated = $provider->translate($text, $targetLang, $sourceLang);
                Log::info("Translation successful with {$provider->getName()}: {$text} → {$translated}");
                return $translated;
            } catch (\Exception $e) {
                Log::warning("Translation failed with {$provider->getName()}: {$e->getMessage()}");
                continue;
            }
        }

        // Si tous les providers échouent, retourner le texte original
        Log::error("All translation providers failed for: {$text}");
        return $text;
    }

    /**
     * Génère une clé de cache
     */
    private function getCacheKey(string $text, string $targetLang, ?string $sourceLang = null): string
    {
        $hash = md5($text . '|' . $sourceLang . '|' . $targetLang);
        return self::CACHE_PREFIX . $hash;
    }

    /**
     * Invalide le cache pour un texte
     */
    public function invalidateCache(string $text): void
    {
        $languages = ['fr', 'en', 'nl', 'de', 'es', 'it', 'pt', 'ru', 'ja', 'zh'];

        foreach ($languages as $lang) {
            Cache::forget($this->getCacheKey($text, $lang));
        }

        Cache::forget($this->getCacheKey($text, 'detect'));
    }

    /**
     * Retourne les providers disponibles
     */
    public function getAvailableProviders(): array
    {
        return array_filter($this->providers, fn($p) => $p->isAvailable());
    }

    /**
     * Retourne le statut de chaque provider
     */
    public function getProvidersStatus(): array
    {
        return array_map(fn($p) => [
            'name' => $p->getName(),
            'available' => $p->isAvailable(),
        ], $this->providers);
    }

    /**
     * Pré-traduit un contenu dans toutes les langues supportées
     * Utile pour les spectacles, descriptions, etc.
     */
    public function preTranslateContent(string $content, string $sourceLanguage = 'fr'): array
    {
        $supportedLanguages = ['fr', 'en', 'nl'];
        $targetLanguages = array_filter($supportedLanguages, fn($lang) => $lang !== $sourceLanguage);

        return [
            $sourceLanguage => $content,
            ...$this->translate($content, $targetLanguages, $sourceLanguage),
        ];
    }
}
