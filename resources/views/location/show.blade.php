<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>{{ $location->designation }}</title>
</head>
<body>
    <h1>{{ $location->designation }}</h1>

    <p><strong>Adresse :</strong> {{ $location->address }}</p>

    @if(!empty($location->website))
        <p><a href="{{ $location->website }}" target="_blank">{{ $location->website }}</a></p>
    @endif

    @if(!empty($location->phone))
        <p><a href="tel:{{ $location->phone }}">{{ $location->phone }}</a></p>
    @endif

    <h2>Liste des spectacles</h2>

    @if($location->shows->count() === 0)
        <p>Aucun spectacle</p>
    @else
        <ul>
            @foreach($location->shows as $show)
                <li><a href="{{ route('show.show', $show->id) }}">{{ $show->title }}</a></li>
            @endforeach
        </ul>
    @endif

    <p><a href="{{ route('location.index') }}">Retour à l’index</a></p>
</body>
</html>
