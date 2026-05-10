<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="UTF-8">
    <title>{{ __('messages.admin.title') }}</title>
    <style>
        body { font-family: sans-serif; background: #f3f4f6; margin: 0; padding: 40px; }
        .card { background: white; border-radius: 8px; padding: 30px; max-width: 600px; margin: auto; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        h1 { color: #1e3a5f; }
        p  { color: #555; }
        .badge { background: #1e3a5f; color: white; padding: 4px 10px; border-radius: 20px; font-size: 13px; }
        .lang-switcher { text-align: right; margin-bottom: 16px; }
        .lang-switcher a { margin-left: 6px; padding: 2px 10px; border: 1px solid #ccc; border-radius: 4px; color: #555; text-decoration: none; font-size: 13px; }
        .lang-switcher a.active { background: #1e3a5f; color: white; border-color: #1e3a5f; }
    </style>
</head>
<body>
    <div class="card">
        <div class="lang-switcher">
            <a href="{{ route('lang.switch', 'en') }}" class="{{ app()->getLocale() === 'en' ? 'active' : '' }}">EN</a>
            <a href="{{ route('lang.switch', 'nl') }}" class="{{ app()->getLocale() === 'nl' ? 'active' : '' }}">NL</a>
        </div>

        <h1>🎭 {{ __('messages.admin.title') }}</h1>
        <p>{{ __('messages.admin.welcome', ['name' => auth()->user()->firstname ?? auth()->user()->name]) }}</p>
        <p><span class="badge">{{ __('messages.admin.badge') }}</span></p>
        <hr>
        <p>{!! __('messages.admin.access_note') !!}</p>
        <ul>
            <li><a href="{{ route('artists.index') }}">{{ __('messages.admin.manage_artists') }}</a></li>
            <li><a href="{{ route('show.index') }}">{{ __('messages.admin.view_shows') }}</a></li>
        </ul>
        <hr>
        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit">{{ __('messages.admin.logout') }}</button>
        </form>
    </div>
</body>
</html>
