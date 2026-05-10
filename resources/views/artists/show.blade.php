@extends('layouts.main')

@section('title', __('messages.artists.profile'))

@section('content')

    <h1>{{ $artist->firstname }} {{ $artist->lastname }}</h1>

    <h2>{{ __('messages.artists.types_list') }}</h2>
    <ul>
        @foreach($artist->types as $type)
            <li>{{ $type->type }}</li>
        @endforeach
    </ul>

    <div>
        <a href="{{ route('artists.edit', $artist->id) }}">{{ __('messages.artists.edit') }}</a>
    </div>

    <form method="POST"
          action="{{ route('artists.destroy', $artist->id) }}"
          onsubmit="return confirm('{{ __('messages.artists.delete_confirm_long') }}')">
        @csrf
        @method('DELETE')
        <button type="submit">{{ __('messages.artists.delete') }}</button>
    </form>

    <nav>
        <a href="{{ route('artists.index') }}">{{ __('messages.artists.back_index') }}</a>
    </nav>

@endsection
