<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Price;

class PriceApiController extends Controller
{
    /**
     * GET /api/prices — Liste tous les tarifs (public).
     */
    public function index()
    {
        return response()->json(Price::all());
    }
}
