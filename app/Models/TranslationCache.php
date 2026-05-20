<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TranslationCache extends Model
{
    use SoftDeletes;

    protected $table = 'translation_cache';

    protected $fillable = [
        'source_hash',
        'source_text',
        'source_language',
        'translations',
        'provider',
        'usage_count',
    ];

    protected $casts = [
        'translations' => 'json',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Cherche une traduction en cache par hash
     */
    public static function findBySourceHash(string $hash): ?self
    {
        return self::where('source_hash', $hash)->first();
    }

    /**
     * Crée ou met à jour une traduction en cache
     */
    public static function storeTranslation(
        string $sourceText,
        array $translations,
        string $sourceLanguage = 'auto',
        string $provider = 'deepl'
    ): self {
        $hash = md5($sourceText . '|' . $sourceLanguage);

        return self::updateOrCreate(
            ['source_hash' => $hash],
            [
                'source_text' => $sourceText,
                'source_language' => $sourceLanguage,
                'translations' => $translations,
                'provider' => $provider,
            ]
        );
    }

    /**
     * Incrémente le compteur d'usage
     */
    public function recordUsage(): void
    {
        $this->increment('usage_count');
    }

    /**
     * Récupère une traduction spécifique
     */
    public function getTranslation(string $language): ?string
    {
        return $this->translations[$language] ?? null;
    }

    /**
     * Ajoute une traduction
     */
    public function addTranslation(string $language, string $text): void
    {
        $translations = $this->translations ?? [];
        $translations[$language] = $text;
        $this->update(['translations' => $translations]);
    }

    /**
     * Nettoie les old caches non utilisés
     */
    public static function cleanupOldCache(int $days = 30): int
    {
        return self::where('updated_at', '<', now()->subDays($days))
            ->where('usage_count', '<', 5)
            ->delete();
    }
}
