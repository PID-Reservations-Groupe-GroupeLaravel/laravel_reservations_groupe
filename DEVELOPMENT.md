# 🛠️ Guide de Développement - Laravel Réservations Groupe

## Architecture Générale

Cette application suit le pattern **MVC (Model-View-Controller)** avec des concepts avancés:
- **Models** - Beauté Eloquent pour la data
- **Controllers** - Logique métier HTTP
- **Views** - Templates Blade
- **Services** - Logique métier réutilisable
- **Requests** - Validations centralisées

---

## 📁 Anatomie d'une Fonctionnalité

Pour ajouter une nouvelle fonctionnalité (ex: Notification), créer:

```
app/
├── Models/Notification.php           # Modèle
├── Http/
│   ├── Controllers/NotificationController.php
│   └── Requests/
│       ├── StoreNotificationRequest.php
│       └── UpdateNotificationRequest.php
├── Services/NotificationService.php   # Logique métier
└── Events/NotificationSent.php        # Events (si async)

database/
├── migrations/2026_04_04_create_notifications_table.php
└── seeders/NotificationSeeder.php

resources/views/notifications/
├── index.blade.php
├── show.blade.php
├── create.blade.php
└── edit.blade.php

routes/web.php  # Ajouter les routes

tests/
├── Unit/Services/NotificationServiceTest.php
└── Feature/NotificationControllerTest.php
```

---

## 🗄️ Base de Données

### Créer une Migration

```bash
php artisan make:migration create_notifications_table
```

```php
// database/migrations/2026_04_04_create_notifications_table.php
Schema::create('notifications', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->string('title');
    $table->text('message');
    $table->boolean('read')->default(false);
    $table->timestamps();
    
    $table->index('user_id');
    $table->index('read');
});
```

### Exécuter Migrations

```bash
# Migrer
php artisan migrate

# Rollback
php artisan migrate:rollback

# Reset complet
php artisan migrate:refresh --seed
```

---

## 🔌 Models & Relations

### Exemple de Model

```php
// app/Models/Notification.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    protected $fillable = ['user_id', 'title', 'message', 'read'];
    
    protected $casts = [
        'read' => 'boolean',
        'created_at' => 'datetime:Y-m-d H:i:s',
    ];

    // Relations
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeUnread($query)
    {
        return $query->where('read', false);
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    // Accessors/Mutators
    public function getReadAtAttribute()
    {
        return $this->attributes['read'] ? now() : null;
    }
}
```

---

## 🎛️ Controllers

### Exemple de Controller

```php
// app/Http/Controllers/NotificationController.php
namespace App\Http\Controllers;

use App\Models\Notification;
use App\Http\Requests\StoreNotificationRequest;
use App\Services\NotificationService;

class NotificationController extends Controller
{
    public function __construct(private NotificationService $service)
    {
    }

    // Liste
    public function index()
    {
        $notifications = Notification::forUser(auth()->id())
            ->latest()
            ->paginate(15);

        return view('notifications.index', compact('notifications'));
    }

    // Créer
    public function create()
    {
        return view('notifications.create');
    }

    // Sauvegarder
    public function store(StoreNotificationRequest $request)
    {
        $notification = $this->service->create(
            auth()->id(),
            $request->validated()
        );

        return redirect()
            ->route('notifications.show', $notification)
            ->with('success', 'Notification créée');
    }

    // Afficher
    public function show(Notification $notification)
    {
        $this->authorize('view', $notification);
        return view('notifications.show', compact('notification'));
    }

    // Éditer
    public function edit(Notification $notification)
    {
        $this->authorize('update', $notification);
        return view('notifications.edit', compact('notification'));
    }

    // Mettre à jour
    public function update(Notification $notification, UpdateNotificationRequest $request)
    {
        $this->authorize('update', $notification);
        
        $notification->update($request->validated());

        return redirect()
            ->route('notifications.show', $notification)
            ->with('success', 'Notification mise à jour');
    }

    // Supprimer
    public function destroy(Notification $notification)
    {
        $this->authorize('delete', $notification);
        
        $notification->delete();

        return redirect()
            ->route('notifications.index')
            ->with('success', 'Notification supprimée');
    }
}
```

---

## 📋 Form Requests

### Validations Centralisées

```php
// app/Http/Requests/StoreNotificationRequest.php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreNotificationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:1000'],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Le titre est requis',
            'message.required' => 'Le message est requis',
        ];
    }
}
```

---

## 🔧 Services (Logique Métier)

```php
// app/Services/NotificationService.php
namespace App\Services;

use App\Models\Notification;

class NotificationService
{
    public function create(int $userId, array $data): Notification
    {
        return Notification::create([
            'user_id' => $userId,
            'title' => $data['title'],
            'message' => $data['message'],
        ]);
    }

    public function markAsRead(Notification $notification): void
    {
        $notification->update(['read' => true]);
        
        // Envoyer événement si couche événements existante
        // event(new NotificationRead($notification));
    }

    public function delete(Notification $notification): void
    {
        $notification->delete();
    }
}
```

---

## 🧪 Tests

### Test Feature (E2E)

```php
// tests/Feature/NotificationControllerTest.php
namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Notification;
use App\Models\User;

class NotificationControllerTest extends TestCase
{
    public function test_user_can_view_notifications()
    {
        $user = User::factory()->create();
        Notification::factory(3)->forUser($user)->create();

        $response = $this->actingAs($user)
            ->get(route('notifications.index'));

        $response->assertStatus(200);
        $response->assertViewHas('notifications');
    }

    public function test_user_can_create_notification()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->post(route('notifications.store'), [
                'title' => 'Test',
                'message' => 'Test message',
            ]);

        $this->assertDatabaseHas('notifications', [
            'title' => 'Test',
            'user_id' => $user->id,
        ]);
    }
}
```

### Test Unitaire

```php
// tests/Unit/Services/NotificationServiceTest.php
namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\NotificationService;
use App\Models\User;

class NotificationServiceTest extends TestCase
{
    public function test_can_create_notification()
    {
        $service = new NotificationService();
        $user = User::factory()->create();

        $notification = $service->create($user->id, [
            'title' => 'Test',
            'message' => 'Test message',
        ]);

        $this->assertEquals('Test', $notification->title);
        $this->assertEquals($user->id, $notification->user_id);
    }
}
```

---

## 🔐 Authorisation (Policies)

```bash
php artisan make:policy NotificationPolicy -m Notification
```

```php
// app/Policies/NotificationPolicy.php
namespace App\Policies;

use App\Models\User;
use App\Models\Notification;

class NotificationPolicy
{
    public function view(User $user, Notification $notification): bool
    {
        return $user->id === $notification->user_id;
    }

    public function update(User $user, Notification $notification): bool
    {
        return $user->id === $notification->user_id;
    }

    public function delete(User $user, Notification $notification): bool
    {
        return $user->id === $notification->user_id || $user->is_admin;
    }
}
```

---

## 📡 Routes

```php
// routes/web.php
Route::middleware(['auth'])->group(function () {
    Route::resource('notifications', NotificationController::class);
    Route::post('notifications/{notification}/mark-read', [
        NotificationController::class, 'markAsRead'
    ])->name('notifications.mark-read');
});
```

---

## 🎨 Views (Blade)

```blade
{{-- resources/views/notifications/index.blade.php --}}
@extends('layouts.app')

@section('content')
<div class="container">
    <h1>Notifications</h1>

    @forelse($notifications as $notification)
        <div class="notification {{ $notification->read ? 'read' : 'unread' }}">
            <h3>{{ $notification->title }}</h3>
            <p>{{ $notification->message }}</p>
            <small>{{ $notification->created_at->diffForHumans() }}</small>

            @can('update', $notification)
                <a href="{{ route('notifications.edit', $notification) }}">Éditer</a>
                <form action="{{ route('notifications.destroy', $notification) }}" method="POST">
                    @csrf @method('DELETE')
                    <button type="submit">Supprimer</button>
                </form>
            @endcan
        </div>
    @empty
        <p>Aucune notification</p>
    @endforelse

    {{ $notifications->links() }}
</div>
@endsection
```

---

## 🔍 Debugging

### Utiliser dd() et dump()

```php
// Arrête et affiche les données
dd($notification);

// Affiche sans arrêter
dump($notification);
```

### Laravel Debugbar

```bash
composer require barryvdh/laravel-debugbar --dev
```

### Log Files

```bash
tail -f storage/logs/laravel.log
```

---

## 📊 Commandes Utiles

```bash
# Code Style
php artisan pint              # Format le code
php artisan pint --check     # Vérifier sans modifier

# Tinker (REPL)
php artisan tinker

# Cache
php artisan cache:clear
php artisan view:clear
php artisan route:clear

# Database
php artisan db:seed
php artisan migrate:refresh
php artisan tinker              # Tester du code interactif
```

---

## 🎯 Bonnes Pratiques

✅ **À FAIRE:**
- Une responsabilité par classe
- Dependency Injection
- Guards/Policies pour l'autho
- Migrations pour DB changes
- Tests automatisés
- Comment le code complexe

❌ **À ÉVITER:**
- Logique dans les routes
- Queries N+1
- Pas de validation
- Comments inutiles
- Fichiers trop grands

---

Bon développement ! 🚀
