@extends('layouts.main')

@section('title', "Fiche d'un artiste")

@section('content')

    <h1>{{ $artist->firstname }} {{ $artist->lastname }}</h1>

    <h2>Liste des types</h2>
    <ul>
        @foreach($artist->types as $type)
            <li>{{ $type->type }}</li>
        @endforeach
    </ul>

    <div>
        <a href="{{ route('artists.edit', $artist->id) }}">Modifier</a>
    </div>

    <form method="POST"
          action="{{ route('artists.destroy', $artist->id) }}"
          onsubmit="return confirm('Êtes-vous sûr de vouloir supprimer ?')">
        @csrf
        @method('DELETE')
        <button type="submit">Supprimer</button>
    </form>

    <nav>
        <a href="{{ route('artists.index') }}">Retour à l'index</a>
    </nav>

@endsection
