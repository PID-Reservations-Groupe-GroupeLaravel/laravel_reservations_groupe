@extends('layouts.main')

@section('title', 'Liste des spectacles')

@section('content')
    <h1>Liste des spectacles</h1>

    <ul>
    @foreach($shows as $show)
        <li>
            <a href="{{ route('show.show', $show->id) }}">{{ $show->title }}</a>
            @if(!$show->bookable)
                <em>Réservation indisponible</em>
            @endif
        </li>
    @endforeach
    </ul>
@endsection
