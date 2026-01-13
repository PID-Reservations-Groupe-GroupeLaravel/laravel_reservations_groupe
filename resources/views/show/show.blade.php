<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>{{ $show->title }}</title>
</head>
<body>
    <h1>{{ $show->title }}</h1>

    @if(!empty($show->poster_url))
        <p><img src="{{ $show->poster_url }}" alt="{{ $show->title }}" style="max-width:200px;"></p>
    @endif

    @if($show->location)
        <p><strong>Lieu de création :</strong> {{ $show->location->designation }}</p>
    @endif

    <p><strong>Prix :</strong> (à afficher selon ton modèle Price si prévu)</p>

    <p><em>{{ $show->bookable ? 'Réservable' : 'Non réservable' }}</em></p>

    <h2>Liste des représentations</h2>
    @forelse($show->representations as $rep)
        <p>
            {{ \Illuminate\Support\Carbon::parse($rep->schedule)->format('d-m-Y H:i') }}
            ({{ optional($rep->location)->designation ?? 'Lieu à déterminer' }})
        </p>
    @empty
        <p>Aucune représentation</p>
    @endforelse

    <p><a href="{{ route('show.index') }}">Retour à l’index</a></p>
</body>
</html>
