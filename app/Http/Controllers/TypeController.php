<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Type;

class TypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $types = Type::all();

        return view('type.index', [
            'types' => $types,
            'resource' => 'types',
        ]);
    }

    //...

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $type = Type::find($id);

        return view('type.show', [
            'type' => $type,
        ]);
    }

    //...
}
