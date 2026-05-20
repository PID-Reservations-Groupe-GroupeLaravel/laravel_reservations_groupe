<?php

return [
    'required' => 'The :attribute field is required.',
    'date' => 'The :attribute field must be a valid date.',
    'after' => 'The :attribute field must be a date after :date.',
    'integer' => 'The :attribute field must be an integer.',
    'exists' => 'The selected :attribute is invalid.',

    // Custom messages for representations
    'attributes' => [
        'schedule' => 'date and time',
        'location_id' => 'venue',
    ],

    'custom' => [
        'schedule' => [
            'required' => '❌ The date is required. Please select a date for the representation.',
            'date' => '❌ Invalid date format. Use DD/MM/YYYY format or select via the calendar.',
            'after' => '❌ The date cannot be in the past. Please choose today or a future date.',
        ],
        'location_id' => [
            'integer' => '❌ The venue must be a valid ID.',
            'exists' => '❌ The selected venue does not exist. Please choose another venue.',
        ],
    ],
];
