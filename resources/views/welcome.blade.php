<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Ovatio</title>
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />
        @vite(['resources/css/app.css', 'resources/js/app.js'])
        <style>
            body { font-family: 'Figtree', sans-serif; background: #f9fafb; }
            .hero { text-align: center; padding: 80px 20px 40px; }
            .hero h1 { font-size: 3rem; font-weight: 700; color: #1e3a5f; margin-bottom: 12px; }
            .hero p { font-size: 1.2rem; color: #555; margin-bottom: 32px; }
            .btn { display: inline-block; padding: 12px 28px; border-radius: 8px; font-weight: 600; text-decoration: none; margin: 6px; }
            .btn-primary { background: #1e3a5f; color: white; }
            .btn-primary:hover { background: #16304f; }
            .btn-secondary { border: 2px solid #1e3a5f; color: #1e3a5f; }
            .btn-secondary:hover { background: #1e3a5f; color: white; }
            .lang-bar { text-align: right; padding: 12px 24px; }
            .lang-bar a { margin-left: 8px; padding: 4px 12px; border: 1px solid #ccc; border-radius: 4px; color: #555; text-decoration: none; font-size: 13px; }
            .lang-bar a.active { background: #1e3a5f; color: white; border-color: #1e3a5f; }
            .cards { display: flex; justify-content: center; gap: 24px; flex-wrap: wrap; padding: 20px; }
            .card { background: white; border-radius: 12px; padding: 28px; width: 220px; text-align: center; box-shadow: 0 2px 12px rgba(0,0,0,0.08); text-decoration: none; color: #1e3a5f; font-weight: 600; transition: box-shadow .2s; }
            .card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.14); }
            .card span { display: block; font-size: 2.5rem; margin-bottom: 10px; }
        </style>
    </head>
    <body>

        <div class="lang-bar">
            <a href="{{ route('lang.switch', 'en') }}" class="{{ app()->getLocale() === 'en' ? 'active' : '' }}">EN</a>
            <a href="{{ route('lang.switch', 'nl') }}" class="{{ app()->getLocale() === 'nl' ? 'active' : '' }}">NL</a>
        </div>

        <div class="hero">
            <h1>🎭 {{ __('messages.welcome.title') }}</h1>
            <p>{{ __('messages.welcome.subtitle') }}</p>

            @auth
                <a href="{{ url('/dashboard') }}" class="btn btn-primary">{{ __('messages.welcome.dashboard') }}</a>
            @else
                <a href="{{ route('login') }}" class="btn btn-primary">{{ __('messages.welcome.login') }}</a>
                @if (Route::has('register'))
                    <a href="{{ route('register') }}" class="btn btn-secondary">{{ __('messages.welcome.register') }}</a>
                @endif
            @endauth
        </div>

        <div class="cards">
            <a href="{{ route('show.index') }}" class="card">
                <span>🎬</span>
                {{ __('messages.welcome.browse_shows') }}
            </a>
            <a href="{{ route('location.index') }}" class="card">
                <span>📍</span>
                {{ __('messages.welcome.browse_locations') }}
            </a>
        </div>

    </body>
</html>
