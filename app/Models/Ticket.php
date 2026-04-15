<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Commit #49 : modèle Ticket
 *
 * @property int    $id
 * @property int    $reservation_id
 * @property string $qr_code
 */
class Ticket extends Model
{
    protected $fillable = [
        'reservation_id',
        'qr_code',
    ];

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }
}
