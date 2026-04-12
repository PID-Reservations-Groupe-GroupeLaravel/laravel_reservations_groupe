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
use App\Http\Controllers\SessionController;
use App\Http\Controllers\PasswordChangeController;

Route::view('/', 'welcome')->name('home');

Route::view('/dashboard', 'dashboard')
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile/sessions', [SessionController::class, 'index'])->name('profile.sessions');
    Route::delete('/profile/sessions/others', [SessionController::class, 'destroyOthers'])->name('profile.sessions.destroy-others');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile/password', [PasswordChangeController::class, 'edit'])->name('profile.password.edit');
    Route::put('/profile/password', [PasswordChangeController::class, 'update'])->name('profile.password.update');
});

Route::get('/location', [LocationController::class, 'index'])->name('location.index');
Route::get('/location/{id}', [LocationController::class, 'show'])->whereNumber('id')->name('location.show');
Route::get('/show', [ShowController::class, 'index'])->name('show.index');
Route::get('/show/{id}', [ShowController::class, 'show'])->whereNumber('id')->name('show.show');
Route::get('/type', [TypeController::class, 'index'])->name('type.index');
Route::get('/type/{id}', [TypeController::class, 'show'])->whereNumber('id')->name('type.show');
Route::get('/price', [PriceController::class, 'index'])->name('price.index');
Route::get('/price/{id}', [PriceController::class, 'show'])->whereNumber('id')->name('price.show');
Route::get('/locality', [LocalityController::class, 'index'])->name('locality.index');
Route::get('/locality/{postal_code}', [LocalityController::class, 'show'])->where('postal_code', '[0-9]+')->name('locality.show');
Route::get('/role', [RoleController::class, 'index'])->name('role.index');
Route::get('/role/{id}', [RoleController::class, 'show'])->whereNumber('id')->name('role.show');

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin', function () { return view('admin.dashboard'); })->name('admin.dashboard');
    Route::resource('artists', ArtistController::class);
});

require __DIR__ . '/auth.php';
