<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ArtistController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\ShowController;

use App\Http\Controllers\TypeController;
use App\Http\Controllers\PriceController;
use App\Http\Controllers\LocalityController;
use App\Http\Controllers\RoleController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::view('/', 'welcome')->name('home');

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

Route::view('/dashboard', 'dashboard')
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

/*
|--------------------------------------------------------------------------
| Profile
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| Public routes (PDF)
|--------------------------------------------------------------------------
*/

Route::get('/location', [LocationController::class, 'index'])->name('location.index');
Route::get('/location/{id}', [LocationController::class, 'show'])
    ->whereNumber('id')
    ->name('location.show');

Route::get('/show', [ShowController::class, 'index'])->name('show.index');
Route::get('/show/{id}', [ShowController::class, 'show'])
    ->whereNumber('id')
    ->name('show.show');

/*
|--------------------------------------------------------------------------
| Type
|--------------------------------------------------------------------------
*/

Route::get('/type', [TypeController::class, 'index'])->name('type.index');
Route::get('/type/{id}', [TypeController::class, 'show'])
    ->whereNumber('id')
    ->name('type.show');

/*
|--------------------------------------------------------------------------
| Price
|--------------------------------------------------------------------------
*/

Route::get('/price', [PriceController::class, 'index'])->name('price.index');
Route::get('/price/{id}', [PriceController::class, 'show'])
    ->whereNumber('id')
    ->name('price.show');

/*
|--------------------------------------------------------------------------
| Locality
|--------------------------------------------------------------------------
*/

Route::get('/locality', [LocalityController::class, 'index'])->name('locality.index');
Route::get('/locality/{postal_code}', [LocalityController::class, 'show'])
    ->where('postal_code', '[0-9]+')
    ->name('locality.show');

/*
|--------------------------------------------------------------------------
| Role
|--------------------------------------------------------------------------
*/

Route::get('/role', [RoleController::class, 'index'])->name('role.index');
Route::get('/role/{id}', [RoleController::class, 'show'])
    ->whereNumber('id')
    ->name('role.show');

/*
|--------------------------------------------------------------------------
| Artists (Admin only)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::resource('artists', ArtistController::class);
});

require __DIR__ . '/auth.php';
