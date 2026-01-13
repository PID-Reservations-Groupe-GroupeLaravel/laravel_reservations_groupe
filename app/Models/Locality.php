<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Locality extends Model
{
    use HasFactory;

    protected $fillable = [
        'postal_code',
        'locality',
    ];

    protected $table = 'localities';

    // Clé primaire = postal_code (pas id)
    protected $primaryKey = 'postal_code';

    // Important : postal_code est une string, pas un int auto-increment
    public $incrementing = false;
    protected $keyType = 'string';

    public $timestamps = false;
}
