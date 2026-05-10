@extends('layouts.main')

@section('title', __('messages.roles.list'))

@section('content')
    <h1>{{ __('messages.roles.list') }}</h1>

    <ul>
        @foreach($roles as $role)
            <li><a href="{{ route('role.show', $role->id) }}">{{ $role->role }}</a></li>
        @endforeach
    </ul>
@endsection
