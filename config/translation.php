<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Translation Services Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration pour les services de traduction (DeepL + Google Cloud)
    | Avec cache Redis et fallback automatique
    |
    */

    'providers' => [
        'deepl' => [
            'enabled' => env('DEEPL_ENABLED', true),
            'api_key' => env('DEEPL_API_KEY'),
            'free_tier' => env('DEEPL_FREE_TIER', true),
            'daily_limit' => env('DEEPL_DAILY_LIMIT', 16666), // Caractères/jour
            'monthly_limit' => env('DEEPL_MONTHLY_LIMIT', 500000),
            'timeout' => 15,
        ],

        'google_cloud' => [
            'enabled' => env('GOOGLE_TRANSLATION_ENABLED', true),
            'api_key' => env('GOOGLE_TRANSLATION_API_KEY'),
            'project_id' => env('GOOGLE_TRANSLATION_PROJECT_ID'),
            'timeout' => 15,
        ],
    ],

    'cache' => [
        'driver' => env('TRANSLATION_CACHE_DRIVER', 'redis'), // redis, file, database, array
        'ttl' => env('TRANSLATION_CACHE_TTL', 86400), // 24 heures
        'prefix' => 'translation_',
    ],

    'supported_languages' => [
        'fr' => 'Français',
        'en' => 'English',
        'nl' => 'Nederlands',
    ],

    'auto_translate_on_create' => [
        'user_reviews' => true, // Auto-traduire les avis utilisateurs
        'show_descriptions' => false, // Les descriptions spectacles sont manuelles
        'comments' => true,
    ],

    'excluded_fields' => [
        'id', 'created_at', 'updated_at', 'user_id', 'show_id',
    ],
];
