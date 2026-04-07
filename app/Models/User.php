<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'login',
        'firstname',
        'lastname',
        'name',
        'email',
        'password',
        'langue',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_user', 'user_id', 'role_id');
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function hasRole(string $roleName): bool
    {
        return $this->roles()->where('role', $roleName)->exists();
    }

    public function isAdmin(): bool      { return $this->hasRole('admin'); }
    public function isMembre(): bool     { return $this->hasRole('membre'); }
    public function isProducteur(): bool { return $this->hasRole('producteur'); }
    public function isCritique(): bool   { return $this->hasRole('critique'); }
    public function isAffilie(): bool    { return $this->hasRole('affilie'); }
}
