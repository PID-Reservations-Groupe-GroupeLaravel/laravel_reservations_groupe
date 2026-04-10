<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; background: #f3f4f6; margin: 0; padding: 40px; }
        .card { background: white; border-radius: 10px; padding: 40px; max-width: 500px; margin: auto; }
        h1 { color: #1e3a5f; }
        .btn { display: inline-block; background: #1e3a5f; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 20px; }
        .footer { color: #999; font-size: 12px; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="card">
        <h1>🎭 Bienvenue sur Ovatio !</h1>
        <p>Bonjour <strong>{{ $user->firstname }} {{ $user->lastname }}</strong>,</p>
        <p>Votre compte a bien été créé. Vous pouvez dès maintenant découvrir et réserver vos spectacles préférés.</p>
        <p><strong>Votre identifiant :</strong> {{ $user->login }}</p>
        <a href="{{ config('app.url') }}" class="btn">Accéder à Ovatio</a>
        <p class="footer">Si vous n'êtes pas à l'origine de cette inscription, ignorez cet email.</p>
    </div>
</body>
</html>
