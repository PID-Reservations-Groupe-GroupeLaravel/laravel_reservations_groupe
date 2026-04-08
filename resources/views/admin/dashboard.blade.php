<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Back-office Admin — Ovatio</title>
    <style>
        body { font-family: sans-serif; background: #f3f4f6; margin: 0; padding: 40px; }
        .card { background: white; border-radius: 8px; padding: 30px; max-width: 600px; margin: auto; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        h1 { color: #1e3a5f; }
        p  { color: #555; }
        .badge { background: #1e3a5f; color: white; padding: 4px 10px; border-radius: 20px; font-size: 13px; }
    </style>
</head>
<body>
    <div class="card">
        <h1>🎭 Back-office Ovatio</h1>
        <p>Bienvenue, <strong>{{ auth()->user()->firstname ?? auth()->user()->name }}</strong> !</p>
        <p><span class="badge">Administrateur</span></p>
        <hr>
        <p>Tu as accès à cette page car tu as le rôle <strong>admin</strong>.</p>
        <ul>
            <li><a href="{{ route('artists.index') }}">Gérer les artistes</a></li>
            <li><a href="{{ route('show.index') }}">Voir les spectacles</a></li>
        </ul>
        <hr>
        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit">Se déconnecter</button>
        </form>
    </div>
</body>
</html>
