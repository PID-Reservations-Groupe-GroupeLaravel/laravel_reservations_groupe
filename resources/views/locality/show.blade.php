@extends('layouts.main')

@section('title', __('messages.localities.profile'))

@section('content')
    <h1>{{ $locality->postal_code }} {{ $locality->locality }}</h1>

    <ul>
        @foreach($locality->locations as $location)
            <li>{{ $location->designation }}</li>
        @endforeach
    </ul>

    <nav>
        <a href="{{ route('locality.index') }}">{{ __('messages.localities.back_index') }}</a>
    </nav>
@endsection
