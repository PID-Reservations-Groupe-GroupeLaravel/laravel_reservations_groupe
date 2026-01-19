<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>@yield('title', 'Reservations')</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
</head>
<body>

<header>
    <nav style="display:flex; gap:20px; padding:10px; border-bottom:1px solid #ccc;">
        <a href="{{ route('home') }}">Home</a>
        <a href="{{ route('show.index') }}">Shows</a>
        <a href="{{ route('location.index') }}">Locations</a>

        {{--  Artists (route resource = artists.*) --}}
        <a href="{{ route('artists.index') }}">Artists</a>

        <a href="{{ route('type.index') }}">Types</a>
        <a href="{{ route('price.index') }}">Prices</a>
        <a href="{{ route('locality.index') }}">Localities</a>
        <a href="{{ route('role.index') }}">Roles</a>
    </nav>
</header>

<main style="padding:20px;">
    @yield('content')
</main>

</body>
</html>
