<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

class TranslationService
{
    private TranslationManager $manager;

    public function __construct(TranslationManager $manager)
    {
        $this->manager = $manager;
    }

    /**
     * Traduit un texte vers la langue cible
     * Utilise DeepL en priorité, fallback Google Cloud
     * Résultat mis en cache 24h avec Redis
     */
    public function translate(string $text, string $targetLang): string
    {
        return $this->manager->translateTo($text, $targetLang);
    }

    /**
     * Traduit un texte dans toutes les langues supportées
     */
    public function translateToAll(string $text, ?string $sourceLang = null): array
    {
        return $this->manager->translate($text, $this->supportedLanguages(), $sourceLang);
    }

    /**
     * Détecte la langue d'un texte
     */
    public function detectLanguage(string $text): string
    {
        return $this->manager->detectLanguageWithFallback($text);
    }

    /**
     * Invalide le cache pour un texte
     */
    public function invalidateCache(string $text): void
    {
        $this->manager->invalidateCache($text);
    }

    /**
     * Retourne les langues supportées
     */
    public function supportedLanguages(): array
    {
        return ['fr', 'en', 'nl'];
    }

    /**
     * Retourne le statut des providers
     */
    public function getProvidersStatus(): array
    {
        return $this->manager->getProvidersStatus();
    }
}
