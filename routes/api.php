<?php
use App\Http\Controllers\Api\PriceApiController;
use App\Http\Controllers\Api\ReservationApiController;
use App\Http\Controllers\Api\ShowApiController;
use App\Http\Controllers\Api\TicketApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/shows', [ShowApiController::class, 'index']);
Route::get('/shows/{show}', [ShowApiController::class, 'show']);
Route::get('/shows/{show}/representations', [ShowApiController::class, 'representations']);
Route::get('/prices', [PriceApiController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn(Request $r) => $r->user()->load('roles'));
    Route::apiResource('reservations', ReservationApiController::class);
    Route::post('/reservations/{reservation}/ticket', [TicketApiController::class, 'generate']);
    Route::get('/reservations/{reservation}/tickets', [TicketApiController::class, 'index']);
});
