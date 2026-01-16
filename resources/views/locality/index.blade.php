@extends('layouts.main')

@section('title', 'Liste des localités')

@section('content')
    <h1>Liste des localités</h1>

    <ul>
        @foreach($localities as $locality)
            <li>
                <a href="{{ route('locality.show', $locality->postal_code) }}">
                    {{ $locality->postal_code }} - {{ $locality->locality }}
                </a>
            </li>
        @endforeach
    </ul>
@endsection
