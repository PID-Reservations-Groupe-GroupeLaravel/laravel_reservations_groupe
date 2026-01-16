@extends('layouts.main')

@section('title', 'Fiche d\'une localité')

@section('content')
    <h1>{{ $locality->locality }}</h1>
    <p>Code postal : {{ $locality->postal_code }}</p>

    <nav><a href="{{ route('locality.index') }}">Retour à l'index</a></nav>
@endsection
