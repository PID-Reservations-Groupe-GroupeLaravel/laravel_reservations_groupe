<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'status',
    ];

    protected $table = 'reservations';

    // created_at personnalisé -> booking_date (updated_at reste normal)
    public $timestamps = true;
    const CREATED_AT = 'booking_date';

    /**
     * A reservation belongs to one user.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
