<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Liste des lieux</title>
</head>
<body>
    <h1>Liste des lieux</h1>

    <ul>
        @foreach($locations as $loc)
            <li>
                <a href="{{ route('location.show', $loc->id) }}">{{ $loc->designation }}</a>
                @if(!empty($loc->website))
                    - <a href="{{ $loc->website }}" target="_blank">{{ $loc->website }}</a>
                @endif
            </li>
        @endforeach
    </ul>

    <p><a href="{{ route('home') }}">Retour à l’accueil</a></p>
</body>
</html>
