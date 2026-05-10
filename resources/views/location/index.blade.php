@extends('layouts.main')

@section('title', __('messages.locations.list'))

@section('content')
    <h1>{{ __('messages.locations.list') }}</h1>

    <ul>
        @foreach($locations as $location)
            <li>
                <a href="{{ route('location.show', $location->id) }}">
                    {{ $location->designation }}
                </a>

                @if($location->website)
                    - <a href="{{ $location->website }}" target="_blank">
                        {{ $location->website }}
                    </a>
                @endif
            </li>
        @endforeach
    </ul>

    <p>
        <a href="{{ route('home') }}">{{ __('messages.locations.back_home') }}</a>
    </p>
@endsection
