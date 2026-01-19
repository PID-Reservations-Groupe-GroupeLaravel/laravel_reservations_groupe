@extends('layouts.main')

@section('title', 'Fiche d\'un spectacle')

@section('content')
<article>
    <h1>{{ $show->title }}</h1>

    @if($show->poster_url)
        <p>
            <img src="{{ asset('images/'.$show->poster_url) }}"
                 alt="{{ $show->title }}"
                 width="200">
        </p>
    @else
        <canvas width="200" height="100" style="border:1px solid #000000;"></canvas>
    @endif

    @if($show->location)
        <p><strong>Lieu de création :</strong> {{ $show->location->designation }}</p>
    @endif

    <p><strong>Durée :</strong> {{ $show->duration }} minutes</p>
    <p><strong>Année de création :</strong> {{ $show->created_in }}</p>

    @if($show->bookable)
        <p><em>Réservable</em></p>
    @else
        <p><em>Non réservable</em></p>
    @endif
</article>

<nav><a href="{{ route('show.index') }}">Retour à l'index</a></nav>
@endsection
