<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Commit #27 : test(B1): verify logoutOtherDevices invalidates other sessions
 */
class LogoutOtherDevicesTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function destroy_others_requires_current_password(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->delete('/profile/sessions/others', [
                'password' => 'wrong-password',
            ]);

        $response->assertSessionHasErrors('password');
    }

    /** @test */
    public function destroy_others_succeeds_with_correct_password(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->delete('/profile/sessions/others', [
                'password' => 'password',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('status', 'Autres sessions déconnectées.');
    }

    /** @test */
    public function sessions_page_is_accessible_to_authenticated_users(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/profile/sessions')
            ->assertOk()
            ->assertViewIs('profile.sessions');
    }
}
