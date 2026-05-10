@extends('layouts.main')

@section('title', __('messages.types.list'))

@section('content')
    <h1>{{ __('messages.types.list') }}</h1>

    <ul>
    @foreach($types as $type)
        <li>
            <a href="{{ route('type.show', $type->id) }}">
                {{ $type->type }}
            </a>
        </li>
    @endforeach
    </ul>
@endsection
