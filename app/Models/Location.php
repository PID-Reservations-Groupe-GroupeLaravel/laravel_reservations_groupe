<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Location extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'designation',
        'address',
        'locality_postal_code',
        'website',
        'phone',
    ];

    protected $table = 'locations';

    public $timestamps = false;

    public function locality(): BelongsTo
    {
        return $this->belongsTo(Locality::class, 'locality_postal_code', 'postal_code');
    }

    public function shows(): HasMany
    {
        return $this->hasMany(Show::class);
    }

    // On ajoutera representations() au bloc 2
}
