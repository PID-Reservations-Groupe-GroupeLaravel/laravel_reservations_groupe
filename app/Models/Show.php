<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Show extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title',
        'description',
        'poster_url',
        'duration',
        'created_in',
        'location_id',
        'bookable',
    ];

    protected $table = 'shows';

    public $timestamps = true;

    /**
     * A show belongs to one location.
     */
    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    /**
     * A show can have many representations.
     */
    public function representations(): HasMany
    {
        return $this->hasMany(Representation::class);
    }

    // On ajoutera reviews() au bloc 3
}
