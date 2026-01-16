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
        'price_id',
        'bookable',
    ];

    protected $table = 'shows';

    public $timestamps = true;

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function price(): BelongsTo
    {
        return $this->belongsTo(Price::class);
    }

    public function representations(): HasMany
    {
        return $this->hasMany(Representation::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}
