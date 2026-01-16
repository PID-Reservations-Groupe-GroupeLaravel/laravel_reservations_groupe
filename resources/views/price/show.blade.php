@extends('layouts.main')

@section('title', 'Fiche d\'un prix')

@section('content')
    <h1>Tarif {{ ucfirst($price->type) }}</h1>
    <p>{{ $price->description }}</p>
    <p>{{ $price->price }} €</p>
    <p>Validité : du {{ $price->start_date }} au {{ $price->end_date }}</p>

    <nav><a href="{{ route('price.index') }}">Retour à l'index</a></nav>
@endsection
