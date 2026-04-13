<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Commit #26 : test(B1): verify remember me sets long cookie
 */
class RememberMeTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function remember_me_creates_long_lived_session_cookie(): void
    {
        $user = User::factory()->create();

        $response = $this->post('/login', [
            'email'    => $user->email,
            'password' => 'password',
            'remember' => true,
        ]);

        $response->assertRedirect('/dashboard');

        // Le cookie "remember_web_*" doit être présent lorsque remember=true
        $cookies = $response->headers->getCookies();
        $remembers = array_filter($cookies, fn($c) => str_starts_with($c->getName(), 'remember_web_'));

        $this->assertNotEmpty($remembers, 'Le cookie remember_web_* devrait être présent.');
    }

    /** @test */
    public function login_without_remember_does_not_set_remember_cookie(): void
    {
        $user = User::factory()->create();

        $response = $this->post('/login', [
            'email'    => $user->email,
            'password' => 'password',
            'remember' => false,
        ]);

        $response->assertRedirect('/dashboard');

        $cookies = $response->headers->getCookies();
        $remembers = array_filter($cookies, fn($c) => str_starts_with($c->getName(), 'remember_web_'));

        $this->assertEmpty($remembers, 'Le cookie remember_web_* ne devrait pas être présent.');
    }
}
