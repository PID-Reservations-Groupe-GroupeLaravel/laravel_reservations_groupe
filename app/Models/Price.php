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
        'description',
        'start_date',
        'end_date',
    ];

    protected $table = 'prices';

    public $timestamps = false;

    /**
     * A price can apply to many shows.
     * Pivot table: price_show (price_id, show_id)
     */
    public function shows(): BelongsToMany
    {
        return $this->belongsToMany(Show::class);
    }
}
