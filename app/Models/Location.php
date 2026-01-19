<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Location extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'slug',
        'designation',
        'address',
        'locality_postal_code',
        'website',
        'phone',
    ];

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'locations';

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Get the locality that owns the location
     */
    public function locality(): BelongsTo
    {
        return $this->belongsTo(Locality::class, 'locality_postal_code', 'postal_code');
    }

    /**
     * Get the shows in this location.
     */
    public function shows(): HasMany
    {
        return $this->hasMany(Show::class);
    }
}
