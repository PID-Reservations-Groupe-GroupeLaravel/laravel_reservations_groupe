<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Artist extends Model
{
    use HasFactory;

    /**
     * Champs autorisés (mass assignment)
     */
    protected $fillable = [
        'firstname',
        'lastname',
    ];

    /**
     * Champs interdits (vide car on utilise $fillable)
     */
    protected $guarded = [];

    /**
     * Champs cachés lors de la sérialisation JSON
     */
    protected $hidden = [];

    /**
     * Table associée
     */
    protected $table = 'artists';

    /**
     * Pas de created_at / updated_at dans la table
     */
    public $timestamps = false;

    /**
     * Un artist peut avoir plusieurs types.
     * Pivot: artist_type (artist_id, type_id)
     */
    public function types(): BelongsToMany
    {
        return $this->belongsToMany(Type::class, 'artist_type', 'artist_id', 'type_id');
    }
}
