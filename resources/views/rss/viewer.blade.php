<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Standing-Ovation.be — Flux RSS</title>
  <link rel="alternate" type="application/rss+xml" title="Standing-Ovation RSS" href="{{ url('/api/rss') }}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:'Manrope',sans-serif;background:#f0f2f8;color:#191c1e;}

    /* NAV */
    .topnav{background:#000666;padding:0 40px;height:56px;display:flex;align-items:center;justify-content:space-between;}
    .topnav-logo{font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:18px;color:#fff;text-decoration:none;}
    .topnav-logo span{color:#fdd400;}
    .topnav-badge{background:#e07b39;color:#fff;font-size:11px;font-weight:700;padding:4px 14px;border-radius:20px;display:flex;align-items:center;gap:6px;}
    .dot{width:8px;height:8px;background:#fff;border-radius:50%;animation:pulse 1.5s infinite;}
    @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.3;}}

    /* HERO */
    .hero{background:linear-gradient(135deg,#000666 0%,#1a237e 60%,#283593 100%);padding:52px 40px 44px;position:relative;overflow:hidden;}
    .hero::after{content:'';position:absolute;top:-80px;right:-80px;width:320px;height:320px;background:radial-gradient(circle,rgba(253,212,0,0.12) 0%,transparent 70%);border-radius:50%;}
    .hero-inner{max-width:1100px;margin:0 auto;position:relative;z-index:1;}
    .hero h1{font-family:'Plus Jakarta Sans',sans-serif;font-size:36px;font-weight:800;color:#fff;letter-spacing:-1px;line-height:1.15;margin-bottom:10px;}
    .hero h1 span{color:#fdd400;}
    .hero-sub{font-size:15px;color:rgba(255,255,255,0.55);margin-bottom:28px;}
    .hero-modes{display:flex;gap:10px;flex-wrap:wrap;}
    .mode-pill{display:inline-flex;align-items:center;gap:7px;padding:10px 20px;border-radius:30px;font-size:13px;font-weight:700;text-decoration:none;border:2px solid rgba(255,255,255,0.3);color:rgba(255,255,255,0.75);transition:all 0.15s;font-family:'Plus Jakarta Sans',sans-serif;}
    .mode-pill:hover,.mode-pill.active{border-color:#fdd400;color:#fdd400;}

    /* SUBSCRIBE */
    .subscribe-bar{background:#fff;border-bottom:1px solid #eceef1;padding:14px 40px;}
    .subscribe-inner{max-width:1100px;margin:0 auto;display:flex;align-items:center;gap:12px;flex-wrap:wrap;}
    .subscribe-bar p{font-size:13px;color:#555;flex:1;}
    code{background:#f0eafa;color:#4a2aa0;padding:3px 8px;border-radius:6px;font-size:12px;}

    /* MAIN */
    .main{max-width:1100px;margin:36px auto 60px;padding:0 40px;}
    .section-header{display:flex;align-items:baseline;gap:10px;margin-bottom:22px;}
    .section-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:20px;font-weight:800;color:#191c1e;}
    .section-count{font-size:13px;color:#aaa;}

    /* GRID */
    .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:22px;}

    /* CARD */
    .card{background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.07);transition:transform 0.2s,box-shadow 0.2s;display:flex;flex-direction:column;}
    .card:hover{transform:translateY(-4px);box-shadow:0 10px 32px rgba(0,6,102,0.13);}

    .card-img{position:relative;height:200px;background:linear-gradient(135deg,#000666,#283593);overflow:hidden;display:flex;align-items:center;justify-content:center;}
    .card-img img{width:100%;height:100%;object-fit:cover;display:block;}
    .card-img-icon{font-size:52px;}

    .card-badge{position:absolute;top:12px;left:12px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;padding:5px 12px;border-radius:20px;font-family:'Plus Jakarta Sans',sans-serif;}
    .badge-ok{background:rgba(0,6,102,0.85);color:#fff;}
    .badge-soon{background:rgba(253,212,0,0.95);color:#6f5c00;}

    .card-body{padding:20px 22px;flex:1;display:flex;flex-direction:column;}
    .card-cat{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.18em;color:#e07b39;margin-bottom:8px;font-family:'Plus Jakarta Sans',sans-serif;}
    .card-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:17px;font-weight:800;color:#191c1e;line-height:1.3;margin-bottom:10px;}
    .card-title a{color:inherit;text-decoration:none;}
    .card-title a:hover{color:#000666;}
    .card-desc{font-size:13px;color:#767683;line-height:1.6;flex:1;margin-bottom:16px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}

    .card-meta{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px;}
    .card-date{font-size:12px;color:#555;display:flex;align-items:center;gap:5px;}
    .card-price{font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:700;color:#000666;}
    .card-price small{font-size:10px;font-weight:500;color:#aaa;margin-right:2px;}

    .card-cta{display:block;text-align:center;padding:11px 0;background:linear-gradient(135deg,#000666,#1a237e);color:#fff;text-decoration:none;border-radius:12px;font-size:13px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;transition:opacity 0.15s;}
    .card-cta:hover{opacity:0.85;}

    /* EMPTY */
    .empty{text-align:center;padding:80px 20px;color:#aaa;font-size:15px;}
    .empty span{display:block;font-size:48px;margin-bottom:16px;}

    /* FOOTER */
    .footer{background:#000666;color:rgba(255,255,255,0.45);text-align:center;padding:28px;font-size:12px;}
    .footer a{color:#fdd400;text-decoration:none;}

    @media(max-width:600px){
      .hero{padding:32px 20px 28px;}
      .hero h1{font-size:26px;}
      .main{padding:0 16px;}
      .topnav{padding:0 16px;}
    }
  </style>
</head>
<body>

  <nav class="topnav">
    <a href="{{ env('FRONTEND_URL', '/') }}" class="topnav-logo">Standing-Ovation<span>.be</span></a>
    <div class="topnav-badge">
      <div class="dot"></div>
      Flux RSS en direct
    </div>
  </nav>

  <div class="hero">
    <div class="hero-inner">
      <h1>Nos <span>spectacles</span><br>en flux RSS</h1>
      <p class="hero-sub">Abonnez-vous pour recevoir les nouveautés automatiquement dans votre lecteur favori</p>
      <div class="hero-modes">
        <a href="?mode=latest"   class="mode-pill {{ $mode === 'latest'   ? 'active' : '' }}">🎬&nbsp; Derniers spectacles</a>
        <a href="?mode=upcoming" class="mode-pill {{ $mode === 'upcoming' ? 'active' : '' }}">📅&nbsp; Prochaines dates</a>
      </div>
    </div>
  </div>

  <div class="subscribe-bar">
    <div class="subscribe-inner">
      <p>
        🔔&nbsp; Copiez cette URL dans Feedly, NetNewsWire ou votre lecteur RSS :&nbsp;
        <code>{{ url('/api/rss') }}</code>&nbsp;&nbsp;|&nbsp;&nbsp;
        <code>{{ url('/api/rss?mode=upcoming') }}</code>
      </p>
    </div>
  </div>

  <div class="main">
    <div class="section-header">
      <span class="section-title">Programme</span>
      <span class="section-count">{{ count($shows) }} spectacle{{ count($shows) > 1 ? 's' : '' }}</span>
    </div>

    @if(count($shows) > 0)
      <div class="grid">
        @foreach($shows as $show)
          <div class="card">

            <div class="card-img">
              @if(!empty($show['image']))
                <img src="{{ $show['image'] }}" alt="{{ $show['title'] }}" onerror="this.style.display='none'">
              @else
                <div class="card-img-icon">🎭</div>
              @endif
              <span class="card-badge {{ $show['status'] === 'CONFIRME' ? 'badge-ok' : 'badge-soon' }}">
                {{ $show['status'] === 'CONFIRME' ? 'Confirmé' : 'À confirmer' }}
              </span>
            </div>

            <div class="card-body">
              <p class="card-cat">Spectacle</p>
              <h2 class="card-title">
                <a href="{{ $show['bookUrl'] }}">{{ $show['title'] }}</a>
              </h2>
              <p class="card-desc">{{ $show['desc'] }}</p>

              <div class="card-meta">
                @if(!empty($show['nextDate']))
                  <span class="card-date">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    {{ $show['nextDate'] }}
                  </span>
                @endif
                @if(!empty($show['minPrice']))
                  <span class="card-price"><small>dès </small>{{ $show['minPrice'] }}</span>
                @endif
              </div>

              <a href="{{ $show['bookUrl'] }}" class="card-cta">Réserver ma place →</a>
            </div>

          </div>
        @endforeach
      </div>
    @else
      <div class="empty">
        <span>🎭</span>
        Aucun spectacle disponible pour le moment.
      </div>
    @endif
  </div>

  <footer class="footer">
    <a href="{{ env('FRONTEND_URL', '/') }}">Standing-Ovation.be</a> © 2026 — La scène curatée de Bruxelles
  </footer>

</body>
</html>
