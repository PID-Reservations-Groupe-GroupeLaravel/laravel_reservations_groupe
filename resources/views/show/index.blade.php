<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Liste des spectacles</title>
</head>
<body>
    <h1>Liste des spectacles</h1>

    <ul>
        @foreach($shows as $show)
            <li>
                <a href="{{ route('show.show', $show->id) }}">{{ $show->title }}</a>
                @if($show->location)
                    ({{ $show->location->designation }})
                @endif

                <ul>
                    @forelse($show->representations as $rep)
                        <li>
                            {{ \Illuminate\Support\Carbon::parse($rep->schedule)->format('d-m-Y H:i') }}
                            ({{ optional($rep->location)->designation ?? 'Lieu à déterminer' }})
                        </li>
                    @empty
                        <li>Aucune représentation</li>
                    @endforelse
                </ul>
            </li>
        @endforeach
    </ul>

    <p><a href="{{ route('home') }}">Retour à l’accueil</a></p>
</body>
</html>
