<?php

namespace App\Services\TranslationProviders;

interface TranslationProviderInterface
{
    /**
     * Traduit un texte vers la langue cible
     */
    public function translate(string $text, string $targetLang, ?string $sourceLang = null): string;

    /**
     * Détecte la langue du texte
     */
    public function detectLanguage(string $text): string;

    /**
     * Retourne le nom du provider
     */
    public function getName(): string;

    /**
     * Vérifie si le provider est disponible (clé API configurée, etc.)
     */
    public function isAvailable(): bool;
}
