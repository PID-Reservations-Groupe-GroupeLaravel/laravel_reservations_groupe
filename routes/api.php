<?php

use App\Http\Controllers\ArtistApiController;
use App\Http\Controllers\ShowApiController;
use App\Mail\WelcomeMail;
use App\Models\Price;
use App\Models\Representation;
use App\Models\Reservation;
use App\Models\Role;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

// Routes publiques — spectacles (pas de token requis)
Route::get('/shows', [ShowApiController::class, 'index']);
Route::get('/shows/{id}', [ShowApiController::class, 'show'])->whereNumber('id');

// GET /shows/{id}/representations
Route::get('/shows/{id}/representations', function ($id) {
    $representations = Representation::with('location')
        ->where('show_id', $id)
        ->orderBy('schedule')
        ->get()
        ->map(fn($r) => [
            'id'       => $r->id,
            'schedule' => $r->schedule,
            'location' => $r->location ? ['name' => $r->location->designation] : null,
        ]);

    return response()->json($representations);
})->whereNumber('id');

// GET /shows/{id}/reviews — avis validés d'un spectacle
Route::get('/shows/{id}/reviews', function ($id) {
    $reviews = \App\Models\Review::with('user')
        ->where('show_id', $id)
        ->where('validated', 1)
        ->latest()
        ->get()
        ->map(fn($r) => [
            'id'        => $r->id,
            'score'     => $r->score,
            'comment'   => $r->comment,
            'user_name' => $r->user?->name ?? ($r->user?->firstname . ' ' . $r->user?->lastname),
            'created_at'=> $r->created_at?->diffForHumans(),
        ]);
    return response()->json($reviews);
})->whereNumber('id');

// GET /prices
Route::get('/prices', function () {
    $prices = Price::all()->map(fn($p) => [
        'id'    => $p->id,
        'label' => $p->type,
        'price' => $p->price,
    ]);
    return response()->json($prices);
});

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
        'photo'     => ['nullable', 'image', 'max:2048'],
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
        'photo'     => $request->hasFile('photo') ? $request->file('photo')->store('photos', 'public') : null,
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
            'photo'     => $user->photo ? asset('storage/' . $user->photo) : null,
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

    // ─── Réservations ────────────────────────────────────────────────────────
    // POST /reservations → créer une réservation
    Route::post('/reservations', function (Request $request) {
        $request->validate([
            'representation_id' => 'required|integer|exists:representations,id',
            'price_id'          => 'required|integer|exists:prices,id',
            'quantity'          => 'required|integer|min:1|max:10',
        ]);

        $price = Price::findOrFail($request->price_id);

        $reservation = Reservation::create([
            'user_id'      => $request->user()->id,
            'booking_date' => now()->toDateString(),
            'status'       => 'En attente',
        ]);

        $reservation->representations()->attach($request->representation_id, [
            'quantity'   => $request->quantity,
            'unit_price' => $price->price,
        ]);

        return response()->json(['message' => 'Réservation créée avec succès.'], 201);
    });

    // GET /reservations → liste des réservations de l'utilisateur connecté
    Route::get('/reservations', function (Request $request) {
        $reservations = Reservation::with([
            'representations.show',
        ])
        ->where('user_id', $request->user()->id)
        ->orderByDesc('booking_date')
        ->get()
        ->map(function ($res) {
            return [
                'id'           => $res->id,
                'booking_date' => $res->booking_date,
                'status'       => $res->status,
                'total'        => $res->representations->sum(fn($r) =>
                    ($r->pivot->quantity ?? 0) * ($r->pivot->unit_price ?? 0)
                ),
                'representations' => $res->representations->map(fn($r) => [
                    'id'         => $r->id,
                    'show_title' => $r->show?->title,
                    'schedule'   => $r->schedule,
                    'quantity'   => $r->pivot->quantity,
                    'unit_price' => $r->pivot->unit_price,
                ]),
            ];
        });

        return response()->json($reservations);
    });

    // POST /reservations/{id}/pay → simuler un paiement (En attente → Payée)
    Route::post('/reservations/{id}/pay', function (Request $request, $id) {
        $reservation = Reservation::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if ($reservation->status !== 'En attente') {
            return response()->json(['message' => 'Seules les réservations en attente peuvent être payées.'], 422);
        }

        $reservation->status = 'Payée';
        $reservation->save();

        return response()->json(['message' => 'Paiement confirmé.']);
    });

    // DELETE /reservations/{id} → annuler une réservation (statut En attente uniquement)
    Route::delete('/reservations/{id}', function (Request $request, $id) {
        $reservation = Reservation::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if ($reservation->status !== 'En attente') {
            return response()->json(['message' => 'Seules les réservations en attente peuvent être annulées.'], 422);
        }

        $reservation->status = 'Annulée';
        $reservation->save();

        return response()->json(['message' => 'Réservation annulée.']);
    });

    // POST /reservations/{id}/ticket → générer et sauvegarder un ticket
    Route::post('/reservations/{id}/ticket', function (Request $request, $id) {
        $reservation = Reservation::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if ($reservation->status !== 'Payée') {
            return response()->json(['message' => 'Le ticket n\'est disponible que pour les réservations payées.'], 422);
        }

        // Vérifier si un ticket existe déjà
        $existing = DB::table('tickets')->where('reservation_id', $reservation->id)->first();
        if ($existing) {
            return response()->json([
                'message' => 'Ticket déjà généré.',
                'qr_code' => $existing->qr_code,
            ]);
        }

        $qrCode = 'OVT-' . strtoupper(Str::random(8)) . '-' . $reservation->id;

        DB::table('tickets')->insert([
            'reservation_id' => $reservation->id,
            'qr_code'        => $qrCode,
            'created_at'     => now(),
        ]);

        return response()->json([
            'message' => 'Ticket généré avec succès.',
            'qr_code' => $qrCode,
        ]);
    });

    // ─── Producteur ──────────────────────────────────────────────────────────
    // POST /producer/apply → demande pour devenir producteur
    Route::post('/producer/apply', function (Request $request) {
        $request->validate([
            'company_name' => 'required|string|max:255',
            'description'  => 'required|string|min:20',
            'siret'        => 'nullable|string|max:50',
            'website'      => 'nullable|url|max:255',
            'phone'        => 'nullable|string|max:20',
        ]);

        try {
            Mail::raw(
                "Nouvelle demande producteur de : {$request->user()->name}\n" .
                "Compagnie : {$request->company_name}\n" .
                "Description : {$request->description}\n" .
                "BCE/SIRET : {$request->siret}\n" .
                "Site : {$request->website}\n" .
                "Tél : {$request->phone}",
                fn($m) => $m->to('admin@ovatio.be')->subject('Demande producteur – Ovatio')
            );
        } catch (\Exception $e) {
            // Ne pas bloquer si l'email échoue
        }

        return response()->json(['message' => 'Demande envoyée avec succès.'], 201);
    });

    // ─── Sessions ────────────────────────────────────────────────────────────
    // GET /profile/sessions → liste des tokens actifs (sessions)
    Route::get('/profile/sessions', function (Request $request) {
        $tokens = DB::table('personal_access_tokens')
            ->where('tokenable_type', 'App\Models\User')
            ->where('tokenable_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($t) => [
                'logged_at'  => $t->last_used_at ?? $t->created_at,
                'ip_address' => null,
                'user_agent' => $t->name,
                'success'    => true,
            ]);

        return response()->json($tokens);
    });

    // DELETE /profile/sessions/others → révoquer tous les autres tokens
    Route::delete('/profile/sessions/others', function (Request $request) {
        $request->validate(['password' => 'required|string']);

        if (!Hash::check($request->password, $request->user()->password)) {
            return response()->json(['message' => 'Mot de passe incorrect.'], 422);
        }

        $currentToken = $request->user()->currentAccessToken()->id;

        DB::table('personal_access_tokens')
            ->where('tokenable_type', 'App\Models\User')
            ->where('tokenable_id', $request->user()->id)
            ->where('id', '!=', $currentToken)
            ->delete();

        return response()->json(['message' => 'Tous les autres appareils ont été déconnectés.']);
    });

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
