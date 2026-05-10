<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'Ovatio')</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <style>
        body { font-family: sans-serif; margin: 0; }
        header nav { display: flex; gap: 20px; padding: 10px 20px; border-bottom: 1px solid #ccc; align-items: center; flex-wrap: wrap; }
        header nav a { text-decoration: none; color: #1e3a5f; }
        header nav a:hover { text-decoration: underline; }
        .lang-switcher { margin-left: auto; display: flex; gap: 8px; font-size: 13px; }
        .lang-switcher a { padding: 2px 8px; border: 1px solid #ccc; border-radius: 4px; color: #555; text-decoration: none; }
        .lang-switcher a.active { background: #1e3a5f; color: white; border-color: #1e3a5f; }
        main { padding: 20px; }
    </style>
</head>
<body>

<header>
    <nav>
        <a href="{{ route('home') }}">{{ __('messages.nav.home') }}</a>
        <a href="{{ route('show.index') }}">{{ __('messages.nav.shows') }}</a>
        <a href="{{ route('location.index') }}">{{ __('messages.nav.locations') }}</a>
        <a href="{{ route('artists.index') }}">{{ __('messages.nav.artists') }}</a>
        <a href="{{ route('type.index') }}">{{ __('messages.nav.types') }}</a>
        <a href="{{ route('price.index') }}">{{ __('messages.nav.prices') }}</a>
        <a href="{{ route('locality.index') }}">{{ __('messages.nav.localities') }}</a>
        <a href="{{ route('role.index') }}">{{ __('messages.nav.roles') }}</a>

        <div class="lang-switcher">
            <a href="{{ route('lang.switch', 'en') }}" class="{{ app()->getLocale() === 'en' ? 'active' : '' }}">EN</a>
            <a href="{{ route('lang.switch', 'nl') }}" class="{{ app()->getLocale() === 'nl' ? 'active' : '' }}">NL</a>
        </div>
    </nav>
</header>

<main>
    @yield('content')
</main>

</body>
</html>
