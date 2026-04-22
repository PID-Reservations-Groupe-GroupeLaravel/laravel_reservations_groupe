<?php

use App\Http\Controllers\ArtistApiController;
use App\Http\Controllers\ShowApiController;
use App\Mail\WelcomeMail;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;

// Routes publiques — spectacles (pas de token requis)
Route::get('/shows', [ShowApiController::class, 'index']);
Route::get('/shows/{id}', [ShowApiController::class, 'show'])->whereNumber('id');

// ─── Inscription ────────────────────────────────────────────────────────────
Route::post('/register', function (Request $request) {

    $request->validate([
        'login'     => ['required', 'string', 'max:60', 'unique:users,login'],
        'firstname' => ['required', 'string', 'max:60'],
        'lastname'  => ['required', 'string', 'max:60'],
        'email'     => ['required', 'email', 'max:255', 'unique:users,email'],
        'password'  => [
            'required',
            'string',
            'min:6',
            'regex:/^(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{6,}$/',
            'confirmed',
        ],
        'langue'    => ['sometimes', 'string', 'size:2'],
    ], [
        'login.unique'      => 'Ce pseudo est déjà utilisé.',
        'email.unique'      => 'Cette adresse email est déjà utilisée.',
        'password.regex'    => 'Le mot de passe doit contenir au moins 6 caractères, 1 majuscule et 1 caractère spécial.',
        'password.confirmed'=> 'Les mots de passe ne correspondent pas.',
    ]);

    $user = User::create([
        'login'     => $request->login,
        'firstname' => $request->firstname,
        'lastname'  => $request->lastname,
        'name'      => $request->firstname . ' ' . $request->lastname,
        'email'     => $request->email,
        'password'  => Hash::make($request->password),
        'langue'    => $request->langue ?? 'fr',
    ]);

    // Assigner le rôle "member"
    $memberRole = Role::firstWhere('role', 'member');
    if ($memberRole) {
        $user->roles()->syncWithoutDetaching([$memberRole->id]);
    }

    // Envoyer l'email de bienvenue
    try {
        Mail::to($user->email)->send(new WelcomeMail($user));
    } catch (\Exception $e) {
        // Ne pas bloquer l'inscription si l'email échoue
    }

    $token = $user->createToken('api-token')->plainTextToken;

    return response()->json([
        'token' => $token,
        'user'  => [
            'id'        => $user->id,
            'login'     => $user->login,
            'firstname' => $user->firstname,
            'lastname'  => $user->lastname,
            'name'      => $user->name,
            'email'     => $user->email,
            'langue'    => $user->langue,
            'roles'     => $user->roles()->pluck('role'),
        ],
    ], 201);
});

// ─── Vérification unicité (temps réel) ──────────────────────────────────────
Route::post('/check-login', function (Request $request) {
    $exists = User::where('login', $request->login)->exists();
    return response()->json(['available' => !$exists]);
});

Route::post('/check-email', function (Request $request) {
    $exists = User::where('email', $request->email)->exists();
    return response()->json(['available' => !$exists]);
});

// ─── Connexion ───────────────────────────────────────────────────────────────
Route::post('/login', function (Request $request) {

    $request->validate([
        'email' => 'required|email',
        'password' => 'required|string',
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    $token = $user->createToken('api-token')->plainTextToken;

    return response()->json([
        'token' => $token,
        'user' => [
            'id' => $user->id,
            'login' => $user->login,
            'firstname' => $user->firstname,
            'lastname' => $user->lastname,
            'name' => $user->name,
            'email' => $user->email,
            'langue' => $user->langue,
            'roles' => $user->roles()->pluck('role'),
        ],
    ], 200);
});

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'login' => $user->login,
            'firstname' => $user->firstname,
            'lastname' => $user->lastname,
            'name' => $user->name,
            'email' => $user->email,
            'langue' => $user->langue,
            'roles' => $user->roles()->pluck('role'),
        ], 200);
    });

    Route::apiResource('artists', ArtistApiController::class);

    // ─── Producteur : modération des avis ────────────────────────────────────
    Route::middleware('producer')->prefix('producer')->group(function () {

        // GET /producer/avis → avis sur les spectacles du producteur
        Route::get('/avis', function (Request $request) {
            $user = $request->user();
            $avis = \App\Models\Review::with(['user', 'show'])
                ->whereHas('show', fn($q) => $q->where('producer_id', $user->id))
                ->orderByDesc('created_at')
                ->get()
                ->map(fn($a) => [
                    'id'         => $a->id,
                    'user_name'  => $a->user?->name ?? ($a->user?->firstname . ' ' . $a->user?->lastname),
                    'show_title' => $a->show?->title,
                    'rating'     => $a->rating,
                    'comment'    => $a->comment,
                    'status'     => $a->status ?? 'pending',
                ]);
            return response()->json($avis);
        });

        // POST /producer/avis/{id}/approve → valider un avis
        Route::post('/avis/{id}/approve', function ($id) {
            \App\Models\Review::findOrFail($id)->update(['status' => 'approved']);
            return response()->json(['message' => 'Avis validé.']);
        });

        // POST /producer/avis/{id}/reject → rejeter un avis
        Route::post('/avis/{id}/reject', function ($id) {
            \App\Models\Review::findOrFail($id)->update(['status' => 'rejected']);
            return response()->json(['message' => 'Avis rejeté.']);
        });
    });
});
