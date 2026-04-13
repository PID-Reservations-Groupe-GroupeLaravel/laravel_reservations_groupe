<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;

/**
 * Commit #23 : Logger chaque connexion dans login_history.
 *
 * Enregistrement dans bootstrap/app.php :
 *   ->withEvents(discover: [__DIR__.'/../app/Listeners'])
 * Ou via EventServiceProvider (si présent).
 */
class LogSuccessfulLogin
{
    /**
     * Handle the event.
     */
    public function handle(Login $event): void
    {
        DB::table('login_history')->insert([
            'user_id'    => $event->user->id,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
            'success'    => true,
            'logged_at'  => now(),
        ]);
    }
}
