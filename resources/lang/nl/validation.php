<?php

return [
    'required' => 'Het veld :attribute is verplicht.',
    'date' => 'Het veld :attribute moet een geldige datum zijn.',
    'after' => 'Het veld :attribute moet een datum na :date zijn.',
    'integer' => 'Het veld :attribute moet een geheel getal zijn.',
    'exists' => 'Het geselecteerde :attribute is ongeldig.',

    // Custom messages for representations
    'attributes' => [
        'schedule' => 'datum en tijd',
        'location_id' => 'locatie',
    ],

    'custom' => [
        'schedule' => [
            'required' => '❌ De datum is verplicht. Selecteer alstublieft een datum voor de vertoning.',
            'date' => '❌ Ongeldig datumformat. Gebruik DD/MM/JJJJ-indeling of selecteer via de agenda.',
            'after' => '❌ De datum kan niet in het verleden liggen. Kies alstublieft vandaag of een toekomstige datum.',
        ],
        'location_id' => [
            'integer' => '❌ De locatie moet een geldige ID zijn.',
            'exists' => '❌ De geselecteerde locatie bestaat niet. Kies alstublieft een ander locatie.',
        ],
    ],
];
