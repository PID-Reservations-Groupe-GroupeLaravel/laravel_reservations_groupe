<?php
namespace Tests\Feature\Api;
use App\Models\Price;
use App\Models\Representation;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_returns_sanctum_token(): void
    {
        $user = User::factory()->create();
        $response = $this->postJson('/api/login', ['email' => $user->email, 'password' => 'password']);
        $response->assertOk()->assertJsonStructure(['token', 'user']);
        $this->assertNotEmpty($response->json('token'));
    }

    public function test_reservations_requires_auth(): void
    {
        $this->getJson('/api/reservations')->assertUnauthorized();
    }

    public function test_store_reservation_creates_db_record(): void
    {
        $user = User::factory()->create();
        $price = Price::factory()->create();
        $representation = Representation::factory()->create();
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/reservations', [
            'representation_id' => $representation->id,
            'price_id'          => $price->id,
            'quantity'          => 2,
        ]);
        $response->assertCreated();
        $this->assertDatabaseHas('reservations', ['user_id' => $user->id, 'status' => 'En attente']);
    }
}
