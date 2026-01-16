@extends('layouts.main')

@section('title', 'Liste des prix')

@section('content')
    <h1>Liste des tarifs</h1>

    <ul>
        @foreach($prices as $price)
            <li>
                <a href="{{ route('price.show', $price->id) }}">{{ $price->type }}</a>
                - {{ number_format($price->price, 2) }} €
            </li>
        @endforeach
    </ul>
@endsection
