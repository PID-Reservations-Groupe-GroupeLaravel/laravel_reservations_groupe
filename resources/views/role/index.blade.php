@extends('layouts.main')

@section('title', 'Liste des rôles')

@section('content')
    <h1>Liste des rôles</h1>

    <ul>
        @foreach($roles as $role)
            <li><a href="{{ route('role.show', $role->id) }}">{{ $role->role }}</a></li>
        @endforeach
    </ul>
@endsection
