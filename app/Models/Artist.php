<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Artist extends Model
{
    use HasFactory;

    protected $fillable = [
        'firstname',
        'lastname',
    ];

    protected $table = 'artists';

    public $timestamps = false;

    /**
     * An artist can have many types.
     * Pivot table: artist_type (artist_id, type_id)
     */
    public function types(): BelongsToMany
    {
        return $this->belongsToMany(Type::class);
    }
}
