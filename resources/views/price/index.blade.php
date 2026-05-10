@extends('layouts.main')

@section('title', __('messages.prices.list'))

@section('content')
    <h1>{{ __('messages.prices.title') }}</h1>

    <ul>
        @foreach($prices as $price)
            <li>
                <a href="{{ route('price.show', $price->id) }}">{{ $price->type }}</a>
                - {{ number_format($price->price, 2) }} €
            </li>
        @endforeach
    </ul>
@endsection
