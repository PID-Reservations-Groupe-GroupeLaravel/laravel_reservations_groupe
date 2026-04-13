<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Commit #22 : modèle LoginHistory lié à la table login_history.
 *
 * @property int         $id
 * @property int         $user_id
 * @property string|null $ip_address
 * @property string|null $user_agent
 * @property bool        $success
 * @property \Carbon\Carbon $logged_at
 */
class LoginHistory extends Model
{
    public $timestamps = false;

    protected $table = 'login_history';

    protected $fillable = [
        'user_id',
        'ip_address',
        'user_agent',
        'success',
        'logged_at',
    ];

    protected $casts = [
        'logged_at' => 'datetime',
        'success'   => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
