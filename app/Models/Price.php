<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Price extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'price',
    ];

    protected $table = 'prices';

    public $timestamps = false;

    /**
     * ManyToMany : a price can be used by many shows.
     */
    public function shows(): BelongsToMany
    {
        // pivot: price_show (price_id, show_id)
        return $this->belongsToMany(Show::class, 'price_show', 'price_id', 'show_id');
    }
}
