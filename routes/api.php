<?php
use App\Http\Controllers\Api\ReservationApiController;
use App\Http\Controllers\Api\ShowApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/shows', [ShowApiController::class, 'index']);
Route::get('/shows/{show}', [ShowApiController::class, 'show']);
Route::get('/shows/{show}/representations', [ShowApiController::class, 'representations']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn(Request $r) => $r->user()->load('roles'));
    Route::apiResource('reservations', ReservationApiController::class);
});
