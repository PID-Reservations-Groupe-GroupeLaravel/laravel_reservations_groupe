<?php
use App\Http\Controllers\Api\AuthApiController;
use App\Http\Controllers\Api\PriceApiController;
use App\Http\Controllers\Api\ReservationApiController;
use App\Http\Controllers\Api\ShowApiController;
use App\Http\Controllers\Api\TicketApiController;
use App\Http\Controllers\SessionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthApiController::class, 'login']);
Route::post('/register', [AuthApiController::class, 'register']);

Route::get('/shows', [ShowApiController::class, 'index']);
Route::get('/shows/{show}', [ShowApiController::class, 'show']);
Route::get('/shows/{show}/representations', [ShowApiController::class, 'representations']);
Route::get('/prices', [PriceApiController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn(Request $r) => $r->user()->load('roles'));
    Route::apiResource('reservations', ReservationApiController::class);
    Route::post('/reservations/{reservation}/ticket', [TicketApiController::class, 'generate']);
    Route::get('/reservations/{reservation}/tickets', [TicketApiController::class, 'index']);
    Route::get('/profile/sessions', [SessionController::class, 'index']);
    Route::delete('/profile/sessions/others', [SessionController::class, 'destroyOthers']);
    Route::get('/health', fn() => response()->json(['status' => 'ok']));
});
