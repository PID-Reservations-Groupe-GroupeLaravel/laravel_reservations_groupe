<?php

use App\Http\Controllers\ArtistApiController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

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

// Routes publiques
Route::post('/register', function (Request $request) {
    $data = $request->validate([
        'name'                  => 'required|string|max:255',
        'email'                 => 'required|email|unique:users',
        'password'              => 'required|string|min:6|confirmed',
    ]);

    $user = User::create([
        'name'     => $data['name'],
        'email'    => $data['email'],
        'password' => bcrypt($data['password']),
    ]);

    $token = $user->createToken('api-token')->plainTextToken;

    return response()->json(['token' => $token, 'user' => $user], 201);
});

// Routes authentifiées (Sanctum)
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Deconnecte avec succes.']);
    });

    Route::get('/user', function (Request $request) {
        $user = $request->user();
        return response()->json([
            'id'        => $user->id,
            'login'     => $user->login,
            'firstname' => $user->firstname,
            'lastname'  => $user->lastname,
            'name'      => $user->name,
            'email'     => $user->email,
            'langue'    => $user->langue,
            'roles'     => $user->roles()->pluck('role'),
        ], 200);
    });

    Route::apiResource('artists', ArtistApiController::class);

    // Routes admin — protegees par middleware 'admin'
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', function () {
            return response()->json(['message' => 'Bienvenue dans le panneau admin.']);
        });
        Route::get('/users', function () {
            return response()->json(User::with('roles')->paginate(20));
        });
    });

    // Routes producteur — protegees par middleware 'producer'
    Route::middleware('producer')->prefix('producer')->group(function () {
        Route::get('/dashboard', function () {
            return response()->json(['message' => 'Bienvenue dans le panneau producteur.']);
        });
    });
});
