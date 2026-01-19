<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Representation extends Model
{
    use HasFactory;

    protected $fillable = [
        'show_id',
        'location_id',
        'schedule',
    ];

    protected $table = 'representations';

    public $timestamps = false;

    public function show(): BelongsTo
    {
        return $this->belongsTo(Show::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    /**
     * ManyToMany with pivot data (quantity, unit_price).
     */
    public function reservations(): BelongsToMany
    {
        return $this->belongsToMany(
            Reservation::class,
            'representation_reservation',
            'representation_id',
            'reservation_id'
        )->withPivot(['quantity', 'unit_price'])
         ->withTimestamps();
    }
}
