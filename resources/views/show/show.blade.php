@extends('layouts.main')

@section('title', __('messages.shows.profile'))

@section('content')
<article>
    <h1>{{ $show->title }}</h1>

    @if($show->poster_url)
        <p>
            <img src="{{ asset('images/' . $show->poster_url) }}"
                 alt="{{ $show->title }}"
                 width="200">
        </p>
    @else
        <canvas width="200" height="100" style="border:1px solid #000000;"></canvas>
    @endif

    @if($show->location)
        <p><strong>{{ __('messages.shows.venue') }} :</strong> {{ $show->location->designation }}</p>
    @endif

    <p><strong>{{ __('messages.shows.duration') }} :</strong> {{ __('messages.shows.duration_minutes', ['duration' => $show->duration]) }}</p>
    <p><strong>{{ __('messages.shows.created_in') }} :</strong> {{ $show->created_in }}</p>

    @if($show->bookable)
        <p><em>{{ __('messages.shows.bookable') }}</em></p>
    @else
        <p><em>{{ __('messages.shows.not_bookable') }}</em></p>
    @endif

    <h2>{{ __('messages.shows.representations') }}</h2>
    @if($show->representations->count() >= 1)
        <ul>
            @foreach ($show->representations as $representation)
                <li>
                    {{ $representation->schedule }}
                    @if($representation->location)
                        ({{ $representation->location->designation }})
                    @elseif($representation->show->location)
                        ({{ $representation->show->location->designation }})
                    @else
                        ({{ __('messages.shows.venue_tbd') }})
                    @endif
                </li>
            @endforeach
        </ul>
    @else
        <p>{{ __('messages.shows.no_representation') }}</p>
    @endif

    <h2>{{ __('messages.shows.artists_list') }}</h2>

    <p>
        <strong>{{ __('messages.shows.author') }} :</strong>
        @if(isset($collaborateurs['auteur']))
            @foreach($collaborateurs['auteur'] as $auteur)
                {{ $auteur->firstname }} {{ $auteur->lastname }}
                @if($loop->iteration == $loop->count-1)
                    et
                @elseif(!$loop->last)
                    ,
                @endif
            @endforeach
        @else
            -
        @endif
    </p>

    <p>
        <strong>{{ __('messages.shows.director') }} :</strong>
        @if(isset($collaborateurs['scénographe']))
            @foreach($collaborateurs['scénographe'] as $scenographe)
                {{ $scenographe->firstname }} {{ $scenographe->lastname }}
                @if($loop->iteration == $loop->count-1)
                    et
                @elseif(!$loop->last)
                    ,
                @endif
            @endforeach
        @else
            -
        @endif
    </p>

    <p>
        <strong>{{ __('messages.shows.cast') }} :</strong>
        @if(isset($collaborateurs['comédien']))
            @foreach($collaborateurs['comédien'] as $comedien)
                {{ $comedien->firstname }} {{ $comedien->lastname }}
                @if($loop->iteration == $loop->count-1)
                    et
                @elseif(!$loop->last)
                    ,
                @endif
            @endforeach
        @else
            -
        @endif
    </p>

</article>

<nav>
    <a href="{{ route('show.index') }}">{{ __('messages.shows.back_index') }}</a>
</nav>
@endsection
