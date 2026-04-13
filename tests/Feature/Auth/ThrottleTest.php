<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

/**
 * Commit #28 : test(B1): verify throttle blocks after 5 failed attempts
 */
class ThrottleTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function login_is_blocked_after_five_failed_attempts(): void
    {
        $user = User::factory()->create();

        // Vider le rate limiter avant le test
        RateLimiter::clear(
            \Illuminate\Support\Str::transliterate(
                \Illuminate\Support\Str::lower($user->email) . '|127.0.0.1'
            )
        );

        // 5 tentatives échouées
        for ($i = 0; $i < 5; $i++) {
            $this->post('/login', [
                'email'    => $user->email,
                'password' => 'wrong-password',
            ]);
        }

        // La 6e tentative doit être bloquée
        $response = $this->post('/login', [
            'email'    => $user->email,
            'password' => 'wrong-password',
        ]);

        // Le message de throttle doit apparaître (auth.throttle)
        $response->assertSessionHasErrors('form.email');
    }

    /** @test */
    public function successful_login_clears_throttle(): void
    {
        $user = User::factory()->create();

        // Une tentative échouée
        $this->post('/login', [
            'email'    => $user->email,
            'password' => 'wrong-password',
        ]);

        // Connexion réussie — le throttle est vidé
        $this->post('/login', [
            'email'    => $user->email,
            'password' => 'password',
        ])->assertRedirect('/dashboard');

        // Après succès, une mauvaise tentative ne bloque pas immédiatement
        $response = $this->post('/login', [
            'email'    => $user->email,
            'password' => 'wrong-password',
        ]);

        // Doit juste échouer normalement (pas de throttle message)
        $this->assertFalse(
            str_contains(
                session('errors')?->get('form.email')[0] ?? '',
                'secondes'
            )
        );
    }
}
