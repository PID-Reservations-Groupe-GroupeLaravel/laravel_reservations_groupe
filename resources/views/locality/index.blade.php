@extends('layouts.main')

@section('title', __('messages.localities.list'))

@section('content')
    <h1>{{ __('messages.localities.list') }}</h1>

    <ul>
        @foreach($localities as $locality)
            <li>
                <a href="{{ route('locality.show', $locality->postal_code) }}">
                    {{ $locality->postal_code }} {{ $locality->locality }}
                </a>
            </li>
        @endforeach
    </ul>
@endsection
