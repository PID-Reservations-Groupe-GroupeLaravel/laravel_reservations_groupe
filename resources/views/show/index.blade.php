@extends('layouts.main')

@section('title', __('messages.shows.list'))

@section('content')
    <h1>{{ __('messages.shows.list') }}</h1>

    <ul>
    @foreach($shows as $show)
        <li>
            <a href="{{ route('show.show', $show->id) }}">{{ $show->title }}</a>
            @if(!$show->bookable)
                <em>{{ __('messages.shows.booking_unavailable') }}</em>
            @endif
        </li>
    @endforeach
    </ul>
@endsection
