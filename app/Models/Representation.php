<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

    /**
     * A representation belongs to a show.
     */
    public function show(): BelongsTo
    {
        return $this->belongsTo(Show::class);
    }

    /**
     * A representation belongs to a location.
     */
    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }
}
