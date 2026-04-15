<?php

use App\Http\Controllers\ArtistApiController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;

Route::post('/login', function (Request $request) {
    $request->validate([
        'email'    => 'required|email',
        'password' => 'required|string',
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Identifiants invalides'], 401);
    }

    $token = $user->createToken('api-token')->plainTextToken;

    return response()->json([
        'token' => $token,
        'user'  => [
            'id'        => $user->id,
            'login'     => $user->login,
            'firstname' => $user->firstname,
            'lastname'  => $user->lastname,
            'email'     => $user->email,
            'langue'    => $user->langue,
            'roles'     => $user->roles()->pluck('role'),
        ],
    ]);
});

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        $user = $request->user();
        return response()->json([
            'id'        => $user->id,
            'login'     => $user->login,
            'firstname' => $user->firstname,
            'lastname'  => $user->lastname,
            'email'     => $user->email,
            'langue'    => $user->langue,
            'roles'     => $user->roles()->pluck('role'),
        ]);
    });

    Route::post('/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté']);
    });

    Route::apiResource('artists', ArtistApiController::class);

    // Routes ADMIN
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', function () {
            return response()->json([
                'message' => 'Bienvenue sur le dashboard admin',
                'users'   => \App\Models\User::count(),
                'shows'   => \App\Models\Show::count(),
            ]);
        });

        Route::get('/users', function () {
            return \App\Models\User::with('roles')->get();
        });
    });

    // Routes PRODUCTEUR
    Route::middleware('producer')->prefix('producer')->group(function () {
        Route::get('/dashboard', function () {
            return response()->json(['message' => 'Bienvenue sur le dashboard producteur']);
        });
    });
});