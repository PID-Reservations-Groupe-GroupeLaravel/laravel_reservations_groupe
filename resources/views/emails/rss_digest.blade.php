<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Standing-Ovation — Resume des spectacles</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #f4f6fb; color: #191c1e; }
        .wrapper { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #000666 0%, #1a237e 100%); padding: 36px 40px; }
        .header h1 { color: white; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
        .header h1 span { color: #fdd400; }
        .header p { color: rgba(255,255,255,0.6); font-size: 13px; margin-top: 6px; }
        .badge { display: inline-block; background: #fdd400; color: #000666; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; letter-spacing: 0.08em; text-transform: uppercase; margin-top: 14px; }
        .body { padding: 36px 40px; }
        .greeting { font-size: 16px; font-weight: 700; margin-bottom: 10px; color: #191c1e; }
        .intro { font-size: 14px; color: #555; line-height: 1.6; margin-bottom: 28px; }
        .cta { display: inline-block; background: linear-gradient(135deg, #000666, #1a237e); color: white; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-size: 14px; font-weight: 700; margin-bottom: 32px; }
        .divider { height: 1px; background: #eceef1; margin: 28px 0; }
        .footer { padding: 24px 40px; background: #f7f9fc; text-align: center; }
        .footer p { font-size: 12px; color: #aaa; line-height: 1.6; }
        .footer a { color: #000666; text-decoration: none; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <h1>Standing-Ovation<span>.be</span></h1>
            <p>La scene curatee de Bruxelles</p>
            <div class="badge">
                @if($freq === 'weekly')
                    Resume hebdomadaire
                @else
                    Resume quotidien
                @endif
                —
                @if($mode === 'upcoming')
                    Prochains spectacles
                @else
                    Nouveautes
                @endif
            </div>
        </div>

        <div class="body">
            <p class="greeting">Bonjour {{ $user->firstname ?? $user->name }},</p>
            <p class="intro">
                @if($freq === 'weekly')
                    Voici votre recap <strong>hebdomadaire</strong> des spectacles Standing-Ovation.
                @else
                    Voici les <strong>derniers spectacles</strong> du jour sur Standing-Ovation.
                @endif
                <br>Decouvrez les representations disponibles et reservez votre place directement en ligne.
            </p>

            <a href="{{ config('app.frontend_url', env('FRONTEND_URL', 'https://standing-ovation.be')) }}/shows" class="cta">
                Voir tous les spectacles &rarr;
            </a>

            <div class="divider"></div>

            <p style="font-size:13px; color:#767683; margin-bottom:8px;">
                Ou consultez directement le flux RSS :
            </p>
            <a href="{{ $rssUrl }}" style="font-size:13px; color:#000666; word-break:break-all;">
                {{ $rssUrl }}
            </a>
        </div>

        <div class="footer">
            <p>
                Vous recevez cet email car vous etes inscrit sur
                <a href="{{ config('app.frontend_url', 'https://standing-ovation.be') }}">Standing-Ovation.be</a>.<br>
                Pour vous desinscrire, modifiez vos preferences dans votre profil.
            </p>
        </div>
    </div>
</body>
</html>
