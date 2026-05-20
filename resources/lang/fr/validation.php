<?php

return [
    'required' => 'Le champ :attribute est obligatoire.',
    'date' => 'Le champ :attribute doit être une date valide.',
    'after' => 'Le champ :attribute doit être une date après :date.',
    'integer' => 'Le champ :attribute doit être un entier.',
    'exists' => 'Le :attribute sélectionné est invalide.',

    // Custom messages for representations
    'attributes' => [
        'schedule' => 'date et heure',
        'location_id' => 'lieu',
    ],

    'custom' => [
        'schedule' => [
            'required' => '❌ La date est obligatoire. Veuillez sélectionner une date pour la représentation.',
            'date' => '❌ Format de date invalide. Utilisez le format JJ/MM/AAAA ou sélectionnez via le calendrier.',
            'after' => '❌ La date ne peut pas être dans le passé. Veuillez choisir une date d\'aujourd\'hui ou ultérieure.',
        ],
        'location_id' => [
            'integer' => '❌ Le lieu doit être un ID valide.',
            'exists' => '❌ Le lieu sélectionné n\'existe pas. Veuillez choisir un autre lieu.',
        ],
    ],
];
