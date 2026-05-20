<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Standing-Ovation.be — Flux RSS</title>
  <link rel="alternate" type="application/rss+xml" title="Standing-Ovation RSS" href="{{ url('/api/rss') }}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,600;0,700;0,800;1,700&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

    :root {
      --navy:   #000666;
      --navy2:  #1a237e;
      --gold:   #fdd400;
      --orange: #e07b39;
      --bg:     #f4f5fb;
      --white:  #ffffff;
      --text:   #191c1e;
      --muted:  #767683;
      --border: #e8eaf0;
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: 'Manrope', sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
    }

    /* ── TOPBAR ─────────────────────────────────────────── */
    .topbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(0,6,102,0.97);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255,255,255,0.08);
      height: 58px;
      display: flex;
      align-items: center;
      padding: 0 48px;
      justify-content: space-between;
    }
    .topbar-logo {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 800;
      font-size: 17px;
      color: #fff;
      text-decoration: none;
      letter-spacing: -0.4px;
    }
    .topbar-logo em { color: var(--gold); font-style: normal; }
    .topbar-right { display: flex; align-items: center; gap: 20px; }
    .topbar-link {
      font-size: 12px;
      font-weight: 600;
      color: rgba(255,255,255,0.55);
      text-decoration: none;
      letter-spacing: 0.02em;
      transition: color .15s;
    }
    .topbar-link:hover { color: var(--gold); }
    .live-pill {
      display: flex;
      align-items: center;
      gap: 7px;
      background: rgba(253,212,0,0.12);
      border: 1px solid rgba(253,212,0,0.3);
      color: var(--gold);
      font-size: 11px;
      font-weight: 700;
      padding: 5px 14px;
      border-radius: 30px;
      letter-spacing: 0.06em;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .live-dot {
      width: 7px; height: 7px;
      background: var(--gold);
      border-radius: 50%;
      animation: blink 1.6s ease-in-out infinite;
    }
    @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.2;} }

    /* ── HERO ──────────────────────────────────────────── */
    .hero {
      background: linear-gradient(135deg, #000666 0%, #0d1680 50%, #1a237e 100%);
      padding: 72px 48px 56px;
      position: relative;
      overflow: hidden;
    }
    .hero-orb1 {
      position: absolute;
      top: -100px; right: -60px;
      width: 420px; height: 420px;
      background: radial-gradient(circle, rgba(253,212,0,0.1) 0%, transparent 65%);
      border-radius: 50%;
      pointer-events: none;
    }
    .hero-orb2 {
      position: absolute;
      bottom: -80px; left: 5%;
      width: 280px; height: 280px;
      background: radial-gradient(circle, rgba(90,110,255,0.18) 0%, transparent 65%);
      border-radius: 50%;
      pointer-events: none;
    }
    .hero-inner {
      max-width: 1100px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }
    .hero-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.15);
      color: rgba(255,255,255,0.7);
      font-size: 11px;
      font-weight: 700;
      padding: 6px 16px;
      border-radius: 30px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      font-family: 'Plus Jakarta Sans', sans-serif;
      margin-bottom: 24px;
    }
    .hero h1 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: clamp(32px, 5vw, 52px);
      font-weight: 800;
      color: #fff;
      letter-spacing: -1.5px;
      line-height: 1.1;
      margin-bottom: 16px;
    }
    .hero h1 em { color: var(--gold); font-style: italic; }
    .hero-desc {
      font-size: 15px;
      color: rgba(255,255,255,0.5);
      max-width: 560px;
      line-height: 1.7;
      margin-bottom: 36px;
    }
    .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
    .btn-ghost {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 11px 22px;
      border-radius: 40px;
      font-size: 13px;
      font-weight: 700;
      text-decoration: none;
      border: 1.5px solid rgba(255,255,255,0.25);
      color: rgba(255,255,255,0.75);
      transition: all .2s;
      font-family: 'Plus Jakarta Sans', sans-serif;
      letter-spacing: 0.01em;
    }
    .btn-ghost:hover, .btn-ghost.active {
      border-color: var(--gold);
      color: var(--gold);
      background: rgba(253,212,0,0.06);
    }
    .btn-ghost.active { background: rgba(253,212,0,0.1); }
    .hero-stat {
      display: flex;
      align-items: center;
      gap: 6px;
      color: rgba(255,255,255,0.35);
      font-size: 12px;
      font-weight: 500;
      margin-left: 8px;
    }
    .hero-stat strong { color: rgba(255,255,255,0.7); font-size: 18px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; }

    /* ── SUBSCRIBE STRIP ───────────────────────────────── */
    .strip {
      background: var(--white);
      border-bottom: 1px solid var(--border);
      padding: 0 48px;
    }
    .strip-inner {
      max-width: 1100px;
      margin: 0 auto;
      height: 52px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .strip-icon { font-size: 16px; flex-shrink: 0; }
    .strip-text { font-size: 13px; color: var(--muted); flex: 1; }
    .strip-code {
      background: #f0eafa;
      color: #4a2aa0;
      padding: 3px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-family: monospace;
      letter-spacing: 0.02em;
    }
    .strip-sep { color: var(--border); margin: 0 6px; }

    /* ── MAIN ──────────────────────────────────────────── */
    .main {
      max-width: 1100px;
      margin: 40px auto 80px;
      padding: 0 48px;
    }

    .section-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 28px;
    }
    .section-title {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 22px;
      font-weight: 800;
      color: var(--text);
      letter-spacing: -0.5px;
    }
    .section-count {
      font-size: 13px;
      color: var(--muted);
      background: var(--white);
      border: 1px solid var(--border);
      padding: 4px 14px;
      border-radius: 20px;
      font-weight: 600;
    }

    /* ── GRID ──────────────────────────────────────────── */
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
      gap: 24px;
    }

    /* ── CARD ──────────────────────────────────────────── */
    .card {
      background: var(--white);
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid var(--border);
      box-shadow: 0 2px 12px rgba(0,6,102,0.05);
      display: flex;
      flex-direction: column;
      transition: transform .2s ease, box-shadow .2s ease;
    }
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 16px 40px rgba(0,6,102,0.12);
    }

    .card-thumb {
      position: relative;
      height: 210px;
      background: linear-gradient(135deg, var(--navy) 0%, #283593 100%);
      overflow: hidden;
      flex-shrink: 0;
    }
    .card-thumb img {
      width: 100%; height: 100%;
      object-fit: cover;
      display: block;
      transition: transform .4s ease;
    }
    .card:hover .card-thumb img { transform: scale(1.04); }
    .card-thumb-empty {
      width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
      font-size: 56px;
      background: linear-gradient(135deg, #000666 0%, #1a237e 100%);
    }
    .card-thumb-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,6,102,0.35) 0%, transparent 50%);
    }

    .card-status {
      position: absolute;
      top: 14px; left: 14px;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding: 5px 13px;
      border-radius: 30px;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .status-ok   { background: rgba(0,6,102,0.88); color: #fff; }
    .status-soon { background: rgba(253,212,0,0.95); color: #5c4800; }

    .card-body {
      padding: 22px 24px 24px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .card-tag {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: var(--orange);
      margin-bottom: 9px;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .card-title {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 17px;
      font-weight: 800;
      color: var(--text);
      line-height: 1.3;
      margin-bottom: 10px;
      letter-spacing: -0.3px;
    }
    .card-title a { color: inherit; text-decoration: none; }
    .card-title a:hover { color: var(--navy); }

    .card-desc {
      font-size: 13px;
      color: var(--muted);
      line-height: 1.65;
      flex: 1;
      margin-bottom: 18px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }
    .card-date {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #555;
      font-weight: 500;
    }
    .card-date svg { opacity: .5; flex-shrink: 0; }
    .card-price {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 15px;
      font-weight: 800;
      color: var(--navy);
      letter-spacing: -0.3px;
    }
    .card-price small {
      font-size: 10px;
      font-weight: 500;
      color: var(--muted);
      margin-right: 1px;
      letter-spacing: 0;
    }

    .card-cta {
      display: block;
      text-align: center;
      padding: 12px 0;
      background: linear-gradient(135deg, var(--navy) 0%, var(--navy2) 100%);
      color: #fff;
      text-decoration: none;
      border-radius: 14px;
      font-size: 13px;
      font-weight: 700;
      font-family: 'Plus Jakarta Sans', sans-serif;
      letter-spacing: 0.01em;
      transition: opacity .15s, transform .15s;
    }
    .card-cta:hover { opacity: .88; transform: scale(0.99); }

    /* ── EMPTY ─────────────────────────────────────────── */
    .empty {
      text-align: center;
      padding: 100px 20px;
      color: var(--muted);
    }
    .empty-icon { font-size: 56px; display: block; margin-bottom: 20px; opacity: .6; }
    .empty h3 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 20px;
      font-weight: 800;
      color: var(--text);
      margin-bottom: 8px;
    }
    .empty p { font-size: 14px; color: var(--muted); }

    /* ── FOOTER ────────────────────────────────────────── */
    .footer {
      background: var(--navy);
      padding: 36px 48px;
    }
    .footer-inner {
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }
    .footer-brand {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 800;
      font-size: 15px;
      color: #fff;
      text-decoration: none;
      letter-spacing: -0.3px;
    }
    .footer-brand em { color: var(--gold); font-style: normal; }
    .footer-copy {
      font-size: 12px;
      color: rgba(255,255,255,0.35);
    }
    .footer-rss {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: rgba(255,255,255,0.45);
      font-weight: 600;
    }

    /* ── RESPONSIVE ────────────────────────────────────── */
    @media (max-width: 640px) {
      .topbar { padding: 0 20px; }
      .topbar-link { display: none; }
      .hero { padding: 48px 20px 40px; }
      .strip { padding: 0 20px; }
      .strip-inner { height: auto; padding: 12px 0; flex-wrap: wrap; }
      .main { padding: 0 20px; margin-top: 28px; }
      .footer { padding: 28px 20px; }
      .footer-inner { flex-direction: column; align-items: flex-start; }
    }
  </style>
</head>
<body>

  <!-- Topbar -->
  <nav class="topbar">
    <a href="{{ env('FRONTEND_URL', '/') }}" class="topbar-logo">Standing-Ovation<em>.be</em></a>
    <div class="topbar-right">
      <a href="{{ env('FRONTEND_URL', '/') }}/shows" class="topbar-link">Tous les spectacles</a>
      <div class="live-pill">
        <div class="live-dot"></div>
        RSS Live
      </div>
    </div>
  </nav>

  <!-- Hero -->
  <div class="hero">
    <div class="hero-orb1"></div>
    <div class="hero-orb2"></div>
    <div class="hero-inner">
      <div class="hero-eyebrow">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1" fill="currentColor"/></svg>
        Flux RSS — Standing-Ovation.be
      </div>
      <h1>Les <em>spectacles</em><br>à ne pas manquer</h1>
      <p class="hero-desc">Abonnez-vous pour recevoir les nouveautés de la scène bruxelloise directement dans votre lecteur RSS favori.</p>
      <div class="hero-actions">
        <a href="?mode=latest"   class="btn-ghost {{ $mode === 'latest'   ? 'active' : '' }}">
          🎬&nbsp; Derniers ajouts
        </a>
        <a href="?mode=upcoming" class="btn-ghost {{ $mode === 'upcoming' ? 'active' : '' }}">
          📅&nbsp; Prochaines dates
        </a>
        @if(count($shows) > 0)
        <span class="hero-stat">
          <strong>{{ count($shows) }}</strong>&nbsp;spectacle{{ count($shows) > 1 ? 's' : '' }}
        </span>
        @endif
      </div>
    </div>
  </div>


  <!-- Content -->
  <main class="main">
    <div class="section-bar">
      <h2 class="section-title">Programme</h2>
      <span class="section-count">{{ count($shows) }} spectacle{{ count($shows) > 1 ? 's' : '' }}</span>
    </div>

    @if(count($shows) > 0)
      <div class="grid">
        @foreach($shows as $show)
          <article class="card">

            <div class="card-thumb">
              @if(!empty($show['image']))
                <img src="{{ $show['image'] }}" alt="{{ $show['title'] }}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\'card-thumb-empty\'>🎭</div>'">
                <div class="card-thumb-overlay"></div>
              @else
                <div class="card-thumb-empty">🎭</div>
              @endif
              <span class="card-status {{ $show['status'] === 'CONFIRME' ? 'status-ok' : 'status-soon' }}">
                {{ $show['status'] === 'CONFIRME' ? '✓ Confirmé' : '⏳ À confirmer' }}
              </span>
            </div>

            <div class="card-body">
              <p class="card-tag">Spectacle · Bruxelles</p>
              <h3 class="card-title">
                <a href="{{ $show['bookUrl'] }}">{{ $show['title'] }}</a>
              </h3>
              <p class="card-desc">{{ $show['desc'] }}</p>

              <div class="card-footer">
                @if(!empty($show['nextDate']))
                  <span class="card-date">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
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

          </article>
        @endforeach
      </div>
    @else
      <div class="empty">
        <span class="empty-icon">🎭</span>
        <h3>Aucun spectacle pour le moment</h3>
        <p>Revenez bientôt, le programme se met à jour régulièrement.</p>
      </div>
    @endif
  </main>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-inner">
      <a href="{{ env('FRONTEND_URL', '/') }}" class="footer-brand">Standing-Ovation<em>.be</em></a>
      <div class="footer-rss">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1" fill="currentColor"/></svg>
        Flux RSS · mis à jour en temps réel
      </div>
      <span class="footer-copy">© 2026 Standing-Ovation.be</span>
    </div>
  </footer>

</body>
</html>
