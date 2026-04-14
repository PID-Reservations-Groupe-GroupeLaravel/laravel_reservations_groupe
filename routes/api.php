<?php
use App\Http\Controllers\Api\ReservationApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::apiResource('reservations', ReservationApiController::class);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn(Request $r) => $r->user()->load('roles'));
});
