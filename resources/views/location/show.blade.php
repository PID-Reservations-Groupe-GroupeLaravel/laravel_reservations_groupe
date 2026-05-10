@extends('layouts.main')

@section('title', __('messages.locations.profile'))

@section('content')
    <article>
        <h1>{{ $location->designation }}</h1>

        <address>
            <p>{{ $location->address }}</p>

            <p>
                {{ $location->locality->postal_code }}
                {{ $location->locality->locality }}
            </p>

            @if($location->website)
                <p>
                    <a href="{{ $location->website }}" target="_blank">
                        {{ $location->website }}
                    </a>
                </p>
            @else
                <p>{{ __('messages.locations.no_website') }}</p>
            @endif

            @if($location->phone)
                <p>
                    <a href="tel:{{ $location->phone }}">
                        {{ $location->phone }}
                    </a>
                </p>
            @else
                <p>{{ __('messages.locations.no_phone') }}</p>
            @endif
        </address>

        <h2>{{ __('messages.locations.shows_list') }}</h2>

        <ul>
            @foreach($location->shows as $show)
                <li>
                    <a href="{{ route('show.show', $show->id) }}">
                        {{ $show->title }}
                    </a>
                </li>
            @endforeach
        </ul>
    </article>

    <nav>
        <a href="{{ route('location.index') }}">{{ __('messages.locations.back_index') }}</a>
    </nav>
@endsection
