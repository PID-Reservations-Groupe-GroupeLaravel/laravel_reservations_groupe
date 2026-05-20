<?php

use App\Http\Controllers\Admin\AdminRepresentationController;
use App\Http\Controllers\Admin\AdminReservationController;
use App\Http\Controllers\Admin\AdminShowController;
use App\Http\Controllers\Admin\AdminStatsController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\ArtistApiController;
use App\Http\Controllers\Auth\SocialiteController;
use App\Http\Controllers\ReviewTranslationController;
use App\Http\Controllers\ShowApiController;
use App\Http\Controllers\TranslateController;
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

// ─── Stripe Webhook (public, pas de token requis) ────────────────────────────
Route::post('/stripe/webhook', function (\Illuminate\Http\Request $request) {
    $payload = $request->getContent();
    $sig     = $request->header('Stripe-Signature');
    $secret  = config('services.stripe.webhook_secret');

    try {
        $event = \Stripe\Webhook::constructEvent($payload, $sig, $secret);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Invalid signature'], 400);
    }

    if ($event->type === 'checkout.session.completed') {
        $session       = $event->data->object;
        $reservationId = $session->metadata->reservation_id ?? null;
        if ($reservationId) {
            Reservation::where('id', $reservationId)->update(['status' => 'Payée']);
        }
    }

    return response()->json(['status' => 'ok']);
});

// ─── Flux RSS ────────────────────────────────────────────────────────────────
Route::get('/rss', function (\Illuminate\Http\Request $request) {
    $mode = $request->query('mode', 'latest');

    $query = \App\Models\Show::with(['representations' => function ($q) {
        $q->orderBy('schedule');
    }]);

    if ($mode === 'upcoming') {
        $query->whereHas('representations', fn($q) => $q->where('schedule', '>=', now()));
    }

    $shows = $query->latest()->take(20)->get();

    $items = $shows->map(function ($show) {
        $next = $show->representations->first(fn($r) => $r->schedule >= now());
        $date = $next ? \Carbon\Carbon::parse($next->schedule)->toRssString() : now()->toRssString();

        return sprintf(
            "<item>\n<title><![CDATA[%s]]></title>\n<link>%s</link>\n<description><![CDATA[%s]]></description>\n<pubDate>%s</pubDate>\n</item>",
            e($show->title),
            url('/api/shows/' . $show->id),
            e($show->description ?? ''),
            $date
        );
    })->implode("\n");

    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n"
        . '<rss version="2.0"><channel>' . "\n"
        . '<title>Ovatio.be – Spectacles</title>' . "\n"
        . '<link>' . url('/') . '</link>' . "\n"
        . '<description>Les derniers spectacles sur Ovatio.be</description>' . "\n"
        . $items . "\n"
        . '</channel></rss>';

    return response($xml, 200)->header('Content-Type', 'application/rss+xml; charset=UTF-8');
});

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

// GET /reviews/{id}/translate — traduire un avis
Route::get('/reviews/{id}/translate', [ReviewTranslationController::class, 'translate'])->whereNumber('id');

// POST /translate — traduire n'importe quel texte
Route::post('/translate', [TranslateController::class, 'translate']);

// POST /shows/{id}/reviews — poster un avis (membre avec ticket payé)
Route::middleware('auth:sanctum')->post('/shows/{id}/reviews', function (Request $request, $id) {
    $request->validate([
        'score'   => 'required|integer|min:1|max:5',
        'comment' => 'required|string|min:5|max:1000',
    ]);

    $hasTicket = Reservation::where('user_id', $request->user()->id)
        ->where('status', 'Payée')
        ->whereHas('representations', fn($q) => $q->where('show_id', $id))
        ->exists();

    if (!$hasTicket) {
        return response()->json([
            'message' => 'Vous devez avoir assisté à ce spectacle (ticket payé) pour laisser un avis.',
        ], 403);
    }

    $review = \App\Models\Review::create([
        'user_id'   => $request->user()->id,
        'show_id'   => $id,
        'score'     => $request->score,
        'comment'   => $request->comment,
        'validated' => null,
    ]);

    return response()->json([
        'id'         => $review->id,
        'score'      => $review->score,
        'comment'    => $review->comment,
        'user_name'  => $request->user()->name ?? ($request->user()->firstname . ' ' . $request->user()->lastname),
        'created_at' => 'À l\'instant',
    ], 201);
})->whereNumber('id');

// GET /prices
Route::get('/prices', function () {
    $prices = Price::all()->map(fn($p) => [
        'id'    => $p->id,
        'type'  => $p->type,
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

// ─── Google OAuth ─────────────────────────────────────────────────────────────
Route::get('/auth/redirect/google', function () {
    return redirect()->away(\App\Http\Controllers\Auth\SocialiteController::class);
});

Route::get('/auth/google', [App\Http\Controllers\Auth\SocialiteController::class, 'redirectGoogle'])->name('auth.google');
Route::get('/auth/callback/google', [App\Http\Controllers\Auth\SocialiteController::class, 'callbackGoogle'])->name('auth.google-callback');

// ─── Apple OAuth ──────────────────────────────────────────────────────────────
Route::get('/auth/apple', [App\Http\Controllers\Auth\SocialiteController::class, 'redirectApple'])->name('auth.apple');
Route::get('/auth/callback/apple', [App\Http\Controllers\Auth\SocialiteController::class, 'callbackApple'])->name('auth.apple-callback');

// ─── Connexion ───────────────────────────────────────────────────────────────
Route::post('/login', function (Request $request) {

    $request->validate([
        'email'    => 'required|string',
        'password' => 'required|string',
    ]);

    $identifier = $request->email;
    $user = User::where('email', $identifier)
                ->orWhere('login', $identifier)
                ->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    if ($user->is_disabled) {
        return response()->json([
            'message' => 'Ce compte a été désactivé par un administrateur.'
        ], 403);
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

    // POST /reservations/{id}/checkout → créer une session Stripe Checkout
    Route::post('/reservations/{id}/checkout', function (Request $request, $id) {
        $reservation = Reservation::with('representations.show')
            ->where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if ($reservation->status !== 'En attente') {
            return response()->json(['message' => 'Seules les réservations en attente peuvent être payées.'], 422);
        }

        \Stripe\Stripe::setApiKey(config('services.stripe.secret'));

        $lineItems = $reservation->representations->map(function ($rep) {
            $title    = $rep->show?->title ?? 'Spectacle';
            $quantity = $rep->pivot->quantity ?? 1;
            $price    = (int) round(($rep->pivot->unit_price ?? 0) * 100);

            return [
                'price_data' => [
                    'currency'     => 'eur',
                    'unit_amount'  => $price,
                    'product_data' => ['name' => $title],
                ],
                'quantity' => $quantity,
            ];
        })->values()->toArray();

        $frontendUrl = env('FRONTEND_URL', 'http://localhost:3001');

        $session = \Stripe\Checkout\Session::create([
            'payment_method_types' => ['card'],
            'line_items'           => $lineItems,
            'mode'                 => 'payment',
            'success_url'          => $frontendUrl . '/reservations?payment=success',
            'cancel_url'           => $frontendUrl . '/reservations?payment=cancel',
            'metadata'             => ['reservation_id' => $reservation->id],
        ]);

        return response()->json(['url' => $session->url]);
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
    // GET /producer/apply → statut de la demande de l'utilisateur connecté
    Route::get('/producer/apply', function (Request $request) {
        $req = DB::table('producer_requests')
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->first();
        if (!$req) return response()->json(['status' => 'none']);
        return response()->json(['status' => $req->status, 'rejection_reason' => $req->rejection_reason ?? null]);
    });

    // POST /producer/apply → demande pour devenir producteur
    Route::post('/producer/apply', function (Request $request) {
        $request->validate([
            'company_name' => 'required|string|max:255',
            'description'  => 'required|string|min:20',
            'siret'        => 'nullable|string|max:50',
            'website'      => 'nullable|url|max:255',
            'phone'        => 'nullable|string|max:20',
        ]);

        DB::table('producer_requests')->insert([
            'user_id'      => $request->user()->id,
            'company_name' => $request->company_name,
            'description'  => $request->description,
            'siret'        => $request->siret,
            'website'      => $request->website,
            'phone'        => $request->phone,
            'status'       => 'pending',
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);

        return response()->json(['message' => 'Demande envoyée avec succès.'], 201);
    });

    // ─── Admin ───────────────────────────────────────────────────────────────
    Route::middleware('admin')->prefix('admin')->group(function () {

        // ─── CRUD complet (D1) ───────────────────────────────────────────────
        Route::apiResource('users', AdminUserController::class)->only(['index', 'update', 'destroy']);
        Route::post('users/{user}/disable', [AdminUserController::class, 'disable']);
        Route::post('users/{user}/enable',  [AdminUserController::class, 'enable']);
        Route::apiResource('shows', AdminShowController::class);
        Route::patch('shows/{id}/confirm', [AdminShowController::class, 'confirm']);
        Route::patch('shows/{id}/revoke',  [AdminShowController::class, 'revoke']);
        Route::apiResource('representations', AdminRepresentationController::class);
        Route::get('reservations',            [AdminReservationController::class, 'index']);
        Route::patch('reservations/{id}',     [AdminReservationController::class, 'update']);
        Route::get('reservations/export/csv', [AdminReservationController::class, 'exportCsv']);
        Route::get('stats',                   [AdminStatsController::class, 'index']);

        // GET /admin/demandes → liste des demandes producteur
        Route::get('/demandes', function () {
            $demandes = DB::table('producer_requests')
                ->join('users', 'producer_requests.user_id', '=', 'users.id')
                ->select(
                    'producer_requests.*',
                    'users.firstname', 'users.lastname', 'users.name as user_name', 'users.email'
                )
                ->orderBy('producer_requests.created_at', 'desc')
                ->get()
                ->map(fn($d) => [
                    'id'           => $d->id,
                    'user_id'      => $d->user_id,
                    'user_name'    => $d->user_name ?? ($d->firstname . ' ' . $d->lastname),
                    'user_email'   => $d->email,
                    'company_name' => $d->company_name,
                    'description'  => $d->description,
                    'siret'        => $d->siret,
                    'website'      => $d->website,
                    'phone'        => $d->phone,
                    'status'       => $d->status,
                    'rejection_reason' => $d->rejection_reason,
                    'created_at'   => \Carbon\Carbon::parse($d->created_at)->diffForHumans(),
                ]);
            return response()->json($demandes);
        });

        // POST /admin/demandes/{id}/approve → approuver, assigner rôle producteur
        Route::post('/demandes/{id}/approve', function ($id) {
            $demande = DB::table('producer_requests')->where('id', $id)->firstOrFail();
            DB::table('producer_requests')->where('id', $id)->update([
                'status'     => 'approved',
                'updated_at' => now(),
            ]);
            $producerRole = Role::firstWhere('role', 'producer');
            if ($producerRole) {
                $user = User::find($demande->user_id);
                $user?->roles()->syncWithoutDetaching([$producerRole->id]);
            }
            return response()->json(['message' => 'Demande approuvée. Rôle producteur assigné.']);
        });

        // POST /admin/demandes/{id}/reject → refuser avec motif obligatoire
        Route::post('/demandes/{id}/reject', function (Request $request, $id) {
            $request->validate([
                'reason' => 'required|string|min:10',
            ], [
                'reason.required' => 'Le motif de refus est obligatoire.',
                'reason.min'      => 'Le motif doit faire au moins 10 caractères.',
            ]);
            DB::table('producer_requests')->where('id', $id)->update([
                'status'           => 'rejected',
                'rejection_reason' => $request->reason,
                'updated_at'       => now(),
            ]);
            return response()->json(['message' => 'Demande refusée.']);
        });

        // GET /admin/members → liste des membres
        Route::get('/members', function () {
            $approvedProducerIds = DB::table('producer_requests')
                ->where('status', 'approved')
                ->pluck('user_id')
                ->toArray();

            $members = User::with('roles')
                ->get()
                ->map(fn($u) => [
                    'id'          => $u->id,
                    'name'        => $u->name ?? ($u->firstname . ' ' . $u->lastname),
                    'email'       => $u->email,
                    'login'       => $u->login,
                    'roles'       => $u->roles->pluck('role'),
                    'is_producer' => in_array($u->id, $approvedProducerIds),
                    'is_disabled' => (bool) $u->is_disabled,
                    'created_at'  => $u->created_at?->diffForHumans(),
                ]);
            return response()->json($members);
        });

        // GET /admin/producers → liste des producteurs approuvés
        Route::get('/producers', function () {
            $producers = DB::table('producer_requests')
                ->join('users', 'producer_requests.user_id', '=', 'users.id')
                ->where('producer_requests.status', 'approved')
                ->select(
                    'users.id',
                    'users.firstname', 'users.lastname', 'users.name as user_name',
                    'users.email', 'users.login', 'users.is_disabled',
                    'producer_requests.company_name',
                    'producer_requests.siret',
                    'producer_requests.website',
                    'producer_requests.phone',
                    'producer_requests.updated_at as approved_at',
                )
                ->orderBy('producer_requests.updated_at', 'desc')
                ->get()
                ->map(fn($p) => [
                    'id'           => $p->id,
                    'name'         => $p->user_name ?? ($p->firstname . ' ' . $p->lastname),
                    'email'        => $p->email,
                    'login'        => $p->login,
                    'company_name' => $p->company_name,
                    'siret'        => $p->siret,
                    'website'      => $p->website,
                    'phone'        => $p->phone,
                    'is_disabled'  => (bool) $p->is_disabled,
                    'approved_at'  => \Carbon\Carbon::parse($p->approved_at)->diffForHumans(),
                ]);
            return response()->json($producers);
        });
    });

    // ─── Sessions ────────────────────────────────────────────────────────────
    // PATCH /profile/langue → mettre à jour la langue de l'utilisateur
    Route::patch('/profile/langue', function (Request $request) {
        $request->validate(['langue' => 'required|in:fr,en,nl']);
        $request->user()->update(['langue' => $request->langue]);
        return response()->json(['message' => 'Langue mise à jour.']);
    });

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

    // ─── Producteur : spectacles + modération des avis ───────────────────────
    Route::middleware('producer')->prefix('producer')->group(function () {

        // GET /producer/stats → statistiques du producteur
        Route::get('/stats', function (Request $request) {
            $userId  = $request->user()->id;
            $showIds = \App\Models\Show::where('user_id', $userId)->pluck('id');
            $repIds  = \App\Models\Representation::whereIn('show_id', $showIds)->pluck('id');

            return response()->json([
                'total_shows'        => $showIds->count(),
                'confirmed_shows'    => \App\Models\Show::where('user_id', $userId)->where('bookable', true)->count(),
                'total_reps'         => $repIds->count(),
                'upcoming_reps'      => \App\Models\Representation::whereIn('show_id', $showIds)->where('schedule', '>', now())->count(),
                'total_reservations' => DB::table('representation_reservation')->whereIn('representation_id', $repIds)->count(),
                'pending_reviews'    => \App\Models\Review::whereIn('show_id', $showIds)->whereNull('validated')->count(),
            ]);
        });

        // GET /producer/data → données de référence (lieux, prix, artistes)
        Route::get('/data', function () {
            return response()->json([
                'locations'   => \App\Models\Location::orderBy('designation')->get(['id', 'designation']),
                'prices'      => \App\Models\Price::orderBy('type')->get(['id', 'type', 'price']),
                'artists'     => \App\Models\Artist::orderBy('lastname')->get(['id', 'firstname', 'lastname']),
                'artistTypes' => \App\Models\ArtistType::with(['artist', 'type'])->get()->map(fn($at) => [
                    'id'    => $at->id,
                    'label' => trim(($at->artist?->firstname ?? '') . ' ' . ($at->artist?->lastname ?? '')) . ' — ' . ($at->type?->type ?? ''),
                ]),
            ]);
        });

        // GET /producer/shows → spectacles du producteur (enrichis)
        Route::get('/shows', function (Request $request) {
            $shows = \App\Models\Show::where('user_id', $request->user()->id)
                ->with(['location', 'prices', 'artistTypes'])
                ->withCount('representations')
                ->orderByDesc('created_at')
                ->get()
                ->map(fn($s) => [
                    'id'                    => $s->id,
                    'title'                 => $s->title,
                    'description'           => $s->description,
                    'poster_url'            => $s->poster_url,
                    'duration'              => $s->duration,
                    'created_in'            => $s->created_in,
                    'location_id'           => $s->location_id,
                    'location_name'         => $s->location?->designation,
                    'bookable'              => (bool) $s->bookable,
                    'status'                => $s->status,
                    'representations_count' => $s->representations_count,
                    'price_ids'             => $s->prices->pluck('id'),
                    'artist_type_ids'       => $s->artistTypes->pluck('id'),
                ]);
            return response()->json($shows);
        });

        // POST /producer/shows → créer un spectacle
        Route::post('/shows', function (Request $request) {
            $data = $request->validate([
                'title'           => 'required|string|max:255',
                'description'     => 'nullable|string',
                'poster_url'      => 'nullable|string|max:255',
                'duration'        => 'required|integer|min:1|max:600',
                'created_in'      => 'required|integer|min:1900|max:2100',
                'location_id'     => 'nullable|integer|exists:locations,id',
                'bookable'        => 'boolean',
                'price_ids'       => 'nullable|array',
                'price_ids.*'     => 'integer|exists:prices,id',
                'artist_type_ids'   => 'nullable|array',
                'artist_type_ids.*' => 'integer|exists:artist_type,id',
            ]);

            $slug = \Illuminate\Support\Str::slug($data['title']) . '-' . time();

            $show = \App\Models\Show::create([
                'user_id'     => $request->user()->id,
                'slug'        => $slug,
                'title'       => $data['title'],
                'description' => $data['description'] ?? null,
                'poster_url'  => $data['poster_url'] ?? null,
                'duration'    => $data['duration'],
                'created_in'  => $data['created_in'],
                'location_id' => $data['location_id'] ?? null,
                'bookable'    => $data['bookable'] ?? false,
                'status'      => 'A_CONFIRMER',
            ]);

            if (!empty($data['price_ids'])) {
                $show->prices()->sync($data['price_ids']);
            }
            if (!empty($data['artist_type_ids'])) {
                $show->artistTypes()->sync($data['artist_type_ids']);
            }

            $show->load(['location', 'prices', 'artistTypes']);
            return response()->json([
                'id'                    => $show->id,
                'title'                 => $show->title,
                'description'           => $show->description,
                'poster_url'            => $show->poster_url,
                'duration'              => $show->duration,
                'created_in'            => $show->created_in,
                'location_id'           => $show->location_id,
                'location_name'         => $show->location?->designation,
                'bookable'              => (bool) $show->bookable,
                'status'                => $show->status,
                'representations_count' => 0,
                'price_ids'             => $show->prices->pluck('id'),
                'artist_type_ids'       => $show->artistTypes->pluck('id'),
            ], 201);
        });

        // PUT /producer/shows/{id} → modifier un spectacle
        Route::put('/shows/{id}', function (Request $request, $id) {
            $show = \App\Models\Show::where('id', $id)
                ->where('user_id', $request->user()->id)
                ->firstOrFail();

            $data = $request->validate([
                'title'             => 'required|string|max:255',
                'description'       => 'nullable|string',
                'poster_url'        => 'nullable|string|max:255',
                'duration'          => 'required|integer|min:1|max:600',
                'created_in'        => 'required|integer|min:1900|max:2100',
                'location_id'       => 'nullable|integer|exists:locations,id',
                'bookable'          => 'boolean',
                'price_ids'         => 'nullable|array',
                'price_ids.*'       => 'integer|exists:prices,id',
                'artist_type_ids'   => 'nullable|array',
                'artist_type_ids.*' => 'integer|exists:artist_type,id',
            ]);

            $show->update(\Illuminate\Support\Arr::except($data, ['price_ids', 'artist_type_ids']));
            $show->prices()->sync($data['price_ids'] ?? []);
            $show->artistTypes()->sync($data['artist_type_ids'] ?? []);

            $show->load(['location', 'prices', 'artistTypes']);
            return response()->json([
                'id'                    => $show->id,
                'title'                 => $show->title,
                'description'           => $show->description,
                'poster_url'            => $show->poster_url,
                'duration'              => $show->duration,
                'created_in'            => $show->created_in,
                'location_id'           => $show->location_id,
                'location_name'         => $show->location?->designation,
                'bookable'              => (bool) $show->bookable,
                'status'                => $show->status,
                'representations_count' => $show->representations()->count(),
                'price_ids'             => $show->prices->pluck('id'),
                'artist_type_ids'       => $show->artistTypes->pluck('id'),
            ]);
        });

        // DELETE /producer/shows/{id} → supprimer un spectacle
        Route::delete('/shows/{id}', function (Request $request, $id) {
            $show = \App\Models\Show::where('id', $id)
                ->where('user_id', $request->user()->id)
                ->firstOrFail();
            $show->delete();
            return response()->json(['message' => 'Spectacle supprimé.']);
        });

        // PATCH /producer/shows/{id}/confirm → confirmer (bookable=1, status=CONFIRME)
        Route::patch('/shows/{id}/confirm', function (Request $request, $id) {
            $show = \App\Models\Show::where('id', $id)->where('user_id', $request->user()->id)->firstOrFail();
            $show->update(['bookable' => true, 'status' => 'CONFIRME']);
            return response()->json(['message' => 'Spectacle confirmé.']);
        });

        // PATCH /producer/shows/{id}/unconfirm → retirer la confirmation (bookable=0, status=A_CONFIRMER)
        Route::patch('/shows/{id}/unconfirm', function (Request $request, $id) {
            $show = \App\Models\Show::where('id', $id)->where('user_id', $request->user()->id)->firstOrFail();
            $show->update(['bookable' => false, 'status' => 'A_CONFIRMER']);
            return response()->json(['message' => 'Spectacle mis en attente.']);
        });

        // GET /producer/shows/{id}/detail → détail + représentations
        Route::get('/shows/{id}/detail', function (Request $request, $id) {
            $show = \App\Models\Show::where('id', $id)
                ->where('user_id', $request->user()->id)
                ->with(['location', 'representations.location'])
                ->firstOrFail();

            return response()->json([
                'id'          => $show->id,
                'title'       => $show->title,
                'description' => $show->description,
                'poster_url'  => $show->poster_url,
                'duration'    => $show->duration,
                'created_in'  => $show->created_in,
                'location_id' => $show->location_id,
                'bookable'    => (bool) $show->bookable,
                'representations' => $show->representations->map(fn($r) => [
                    'id'           => $r->id,
                    'schedule'     => $r->schedule,
                    'location_id'  => $r->location_id,
                    'location_name'=> $r->location?->designation ?? $show->location?->designation,
                ]),
            ]);
        });

        // POST /producer/shows/{id}/representations → ajouter une représentation
        Route::post('/shows/{id}/representations', function (Request $request, $id) {
            $show = \App\Models\Show::where('id', $id)->where('user_id', $request->user()->id)->firstOrFail();

            // Detect language from request header or use default
            $locale = $request->header('Accept-Language', 'fr');
            if (strpos($locale, 'en') === 0) {
                $locale = 'en';
            } elseif (strpos($locale, 'nl') === 0) {
                $locale = 'nl';
            } else {
                $locale = 'fr';
            }

            app()->setLocale($locale);

            $data = $request->validate([
                'schedule'    => 'required|date|after:now',
                'location_id' => 'nullable|integer|exists:locations,id',
            ]);

            $rep = \App\Models\Representation::create([
                'show_id'     => $show->id,
                'schedule'    => $data['schedule'],
                'location_id' => $data['location_id'] ?? $show->location_id,
            ]);

            $rep->load('location');
            return response()->json([
                'id'           => $rep->id,
                'schedule'     => $rep->schedule,
                'location_id'  => $rep->location_id,
                'location_name'=> $rep->location?->designation ?? $show->location?->designation,
            ], 201);
        });

        // DELETE /producer/representations/{repId} → annuler une représentation
        Route::delete('/representations/{repId}', function (Request $request, $repId) {
            $rep = \App\Models\Representation::whereHas(
                'show', fn($q) => $q->where('user_id', $request->user()->id)
            )->findOrFail($repId);
            $rep->delete();
            return response()->json(['message' => 'Représentation annulée.']);
        });

        // GET /producer/avis → avis sur les spectacles du producteur
        Route::get('/avis', function (Request $request) {
            $user = $request->user();
            $avis = \App\Models\Review::with(['user', 'show'])
                ->whereHas('show', fn($q) => $q->where('user_id', $user->id))
                ->orderByDesc('created_at')
                ->get()
                ->map(fn($a) => [
                    'id'         => $a->id,
                    'user_name'  => $a->user?->name ?? ($a->user?->firstname . ' ' . $a->user?->lastname),
                    'show_title' => $a->show?->title,
                    'score'      => $a->score,
                    'comment'    => $a->comment,
                    'validated'  => $a->validated,
                ]);
            return response()->json($avis);
        });

        // POST /producer/avis/{id}/approve → valider un avis (validated=1)
        Route::post('/avis/{id}/approve', function (Request $request, $id) {
            $review = \App\Models\Review::whereHas('show', fn($q) => $q->where('user_id', $request->user()->id))->findOrFail($id);
            $review->update(['validated' => 1]);
            return response()->json(['message' => 'Avis validé.']);
        });

        // POST /producer/avis/{id}/reject → rejeter un avis (validated=-1)
        Route::post('/avis/{id}/reject', function (Request $request, $id) {
            $review = \App\Models\Review::whereHas('show', fn($q) => $q->where('user_id', $request->user()->id))->findOrFail($id);
            $review->update(['validated' => -1]);
            return response()->json(['message' => 'Avis rejeté.']);
        });

        // POST /producer/apply → déjà géré hors du groupe producer (avant auth check)
    });
});
