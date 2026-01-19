<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'show_id',
        'score',
        'comment',
    ];

    protected $table = 'reviews';

    // Ta migration n'a pas created_at/updated_at => on désactive
    public $timestamps = false;

    /**
     * A review belongs to one user.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * A review belongs to one show.
     */
    public function show(): BelongsTo
    {
        return $this->belongsTo(Show::class);
    }
}
