<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

    /**
     * A location belongs to one locality.
     */
    public function locality(): BelongsTo
    {
        return $this->belongsTo(Locality::class, 'locality_postal_code', 'postal_code');
    }
}
