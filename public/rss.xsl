<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:ovatio="https://standing-ovation.be/rss">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>

<xsl:template match="/">
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Standing-Ovation.be — Flux RSS</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&amp;family=Manrope:wght@400;500;600;700&amp;display=swap');

    *{margin:0;padding:0;box-sizing:border-box;}

    body{
      font-family:'Manrope',sans-serif;
      background:#f0f2f8;
      color:#191c1e;
    }

    /* ── TOP NAV ── */
    .topnav{
      background:#000666;
      padding:0 40px;
      height:56px;
      display:flex;
      align-items:center;
      justify-content:space-between;
    }
    .topnav-logo{
      font-family:'Plus Jakarta Sans',sans-serif;
      font-weight:800;
      font-size:18px;
      color:#fff;
      text-decoration:none;
      letter-spacing:-0.3px;
    }
    .topnav-logo span{color:#fdd400;}
    .topnav-badge{
      background:#e07b39;
      color:#fff;
      font-size:11px;
      font-weight:700;
      padding:4px 12px;
      border-radius:20px;
      letter-spacing:0.06em;
      display:flex;
      align-items:center;
      gap:6px;
    }
    .rss-dot{
      width:8px;height:8px;
      background:#fff;
      border-radius:50%;
      animation:pulse 1.5s infinite;
    }
    @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.3;}}

    /* ── HERO ── */
    .hero{
      background:linear-gradient(135deg,#000666 0%,#1a237e 60%,#283593 100%);
      padding:52px 40px 44px;
      position:relative;
      overflow:hidden;
    }
    .hero::after{
      content:'';
      position:absolute;
      top:-80px;right:-80px;
      width:320px;height:320px;
      background:radial-gradient(circle,rgba(253,212,0,0.12) 0%,transparent 70%);
      border-radius:50%;
    }
    .hero-inner{max-width:1100px;margin:0 auto;}
    .hero h1{
      font-family:'Plus Jakarta Sans',sans-serif;
      font-size:36px;
      font-weight:800;
      color:#fff;
      letter-spacing:-1px;
      line-height:1.15;
      margin-bottom:10px;
    }
    .hero h1 span{color:#fdd400;}
    .hero-sub{
      font-size:15px;
      color:rgba(255,255,255,0.55);
      margin-bottom:28px;
    }
    .hero-modes{display:flex;gap:10px;flex-wrap:wrap;}
    .mode-pill{
      display:inline-flex;
      align-items:center;
      gap:7px;
      padding:10px 20px;
      border-radius:30px;
      font-size:13px;
      font-weight:700;
      text-decoration:none;
      border:2px solid rgba(255,255,255,0.3);
      color:rgba(255,255,255,0.75);
      transition:all 0.15s;
      font-family:'Plus Jakarta Sans',sans-serif;
    }
    .mode-pill:hover{
      border-color:#fdd400;
      color:#fdd400;
    }

    /* ── SUBSCRIBE BAR ── */
    .subscribe-bar{
      background:#fff;
      border-bottom:1px solid #eceef1;
      padding:14px 40px;
    }
    .subscribe-inner{
      max-width:1100px;
      margin:0 auto;
      display:flex;
      align-items:center;
      gap:12px;
      flex-wrap:wrap;
    }
    .subscribe-bar p{
      font-size:13px;
      color:#555;
      flex:1;
    }
    .subscribe-bar code{
      background:#f0eafa;
      color:#4a2aa0;
      padding:3px 8px;
      border-radius:6px;
      font-size:12px;
      font-family:monospace;
    }

    /* ── MAIN LAYOUT ── */
    .main{
      max-width:1100px;
      margin:36px auto 60px;
      padding:0 40px;
    }

    .section-header{
      display:flex;
      align-items:baseline;
      gap:10px;
      margin-bottom:22px;
    }
    .section-title{
      font-family:'Plus Jakarta Sans',sans-serif;
      font-size:20px;
      font-weight:800;
      color:#191c1e;
    }
    .section-count{
      font-size:13px;
      color:#aaa;
      font-weight:500;
    }

    /* ── GRID ── */
    .grid{
      display:grid;
      grid-template-columns:repeat(auto-fill,minmax(300px,1fr));
      gap:22px;
    }

    /* ── CARD (style Bozar) ── */
    .card{
      background:#fff;
      border-radius:18px;
      overflow:hidden;
      box-shadow:0 2px 16px rgba(0,0,0,0.07);
      transition:transform 0.2s,box-shadow 0.2s;
      display:flex;
      flex-direction:column;
    }
    .card:hover{
      transform:translateY(-4px);
      box-shadow:0 10px 32px rgba(0,6,102,0.13);
    }

    /* Image area */
    .card-img{
      position:relative;
      height:200px;
      background:linear-gradient(135deg,#000666,#283593);
      overflow:hidden;
    }
    .card-img img{
      width:100%;
      height:100%;
      object-fit:cover;
      display:block;
    }
    .card-img-placeholder{
      width:100%;
      height:100%;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:52px;
    }

    /* Badge (Bozar style) */
    .card-badge{
      position:absolute;
      top:12px;
      left:12px;
      font-size:10px;
      font-weight:800;
      text-transform:uppercase;
      letter-spacing:0.1em;
      padding:5px 12px;
      border-radius:20px;
      font-family:'Plus Jakarta Sans',sans-serif;
    }
    .badge-confirmed{background:rgba(0,6,102,0.85);color:#fff;}
    .badge-toconfirm{background:rgba(253,212,0,0.95);color:#6f5c00;}

    /* Card body */
    .card-body{
      padding:20px 22px;
      flex:1;
      display:flex;
      flex-direction:column;
    }
    .card-category{
      font-size:10px;
      font-weight:800;
      text-transform:uppercase;
      letter-spacing:0.18em;
      color:#e07b39;
      margin-bottom:8px;
      font-family:'Plus Jakarta Sans',sans-serif;
    }
    .card-title{
      font-family:'Plus Jakarta Sans',sans-serif;
      font-size:17px;
      font-weight:800;
      color:#191c1e;
      line-height:1.3;
      margin-bottom:10px;
    }
    .card-title a{color:inherit;text-decoration:none;}
    .card-title a:hover{color:#000666;}

    .card-desc{
      font-size:13px;
      color:#767683;
      line-height:1.6;
      flex:1;
      margin-bottom:16px;
      display:-webkit-box;
      -webkit-line-clamp:3;
      -webkit-box-orient:vertical;
      overflow:hidden;
    }

    /* Meta row */
    .card-meta{
      display:flex;
      align-items:center;
      justify-content:space-between;
      margin-bottom:14px;
      flex-wrap:wrap;
      gap:8px;
    }
    .card-date{
      font-size:12px;
      color:#555;
      display:flex;
      align-items:center;
      gap:5px;
    }
    .card-date svg{width:13px;height:13px;color:#aaa;}
    .card-price{
      font-family:'Plus Jakarta Sans',sans-serif;
      font-size:13px;
      font-weight:700;
      color:#000666;
    }
    .card-price span{
      font-size:10px;
      font-weight:500;
      color:#aaa;
      margin-right:2px;
    }

    /* CTA button */
    .card-cta{
      display:block;
      text-align:center;
      padding:11px 0;
      background:linear-gradient(135deg,#000666,#1a237e);
      color:#fff;
      text-decoration:none;
      border-radius:12px;
      font-size:13px;
      font-weight:700;
      font-family:'Plus Jakarta Sans',sans-serif;
      transition:opacity 0.15s;
    }
    .card-cta:hover{opacity:0.85;}

    /* ── FOOTER ── */
    .footer{
      background:#000666;
      color:rgba(255,255,255,0.45);
      text-align:center;
      padding:28px;
      font-size:12px;
    }
    .footer a{color:#fdd400;text-decoration:none;}
  </style>
</head>
<body>

  <!-- Top nav -->
  <nav class="topnav">
    <a href="/" class="topnav-logo">Standing-Ovation<span>.be</span></a>
    <div class="topnav-badge">
      <div class="rss-dot"/>
      Flux RSS en direct
    </div>
  </nav>

  <!-- Hero -->
  <div class="hero">
    <div class="hero-inner">
      <h1>Nos <span>spectacles</span><br/>en flux RSS</h1>
      <p class="hero-sub">Abonnez-vous pour recevoir les nouveautés automatiquement dans votre lecteur favori</p>
      <div class="hero-modes">
        <a href="?mode=latest"   class="mode-pill">&#127381;&#160;&#160;Derniers spectacles</a>
        <a href="?mode=upcoming" class="mode-pill">&#128197;&#160;&#160;Prochaines dates</a>
      </div>
    </div>
  </div>

  <!-- Subscribe bar -->
  <div class="subscribe-bar">
    <div class="subscribe-inner">
      <p>
        &#128276;&#160; Copiez cette URL dans Feedly, NetNewsWire ou tout lecteur RSS :&#160;
        <code>/api/rss</code>&#160;&#160;|&#160;&#160;
        <code>/api/rss?mode=upcoming</code>
      </p>
    </div>
  </div>

  <!-- Cards -->
  <div class="main">
    <div class="section-header">
      <span class="section-title">Programme</span>
      <span class="section-count"><xsl:value-of select="count(/rss/channel/item)"/> spectacles</span>
    </div>

    <div class="grid">
      <xsl:for-each select="/rss/channel/item">
        <div class="card">

          <!-- Image -->
          <div class="card-img">
            <xsl:choose>
              <xsl:when test="normalize-space(ovatio:image) != ''">
                <img src="{ovatio:image}" alt="{title}"/>
              </xsl:when>
              <xsl:otherwise>
                <div class="card-img-placeholder">&#127914;</div>
              </xsl:otherwise>
            </xsl:choose>

            <!-- Badge statut -->
            <xsl:choose>
              <xsl:when test="ovatio:status = 'CONFIRME'">
                <span class="card-badge badge-confirmed">Confirm&#233;</span>
              </xsl:when>
              <xsl:otherwise>
                <span class="card-badge badge-toconfirm">&#192; confirmer</span>
              </xsl:otherwise>
            </xsl:choose>
          </div>

          <!-- Body -->
          <div class="card-body">
            <p class="card-category">Spectacle</p>
            <h2 class="card-title">
              <a href="{ovatio:bookUrl}"><xsl:value-of select="title"/></a>
            </h2>
            <p class="card-desc"><xsl:value-of select="description"/></p>

            <div class="card-meta">
              <xsl:if test="normalize-space(ovatio:nextDate) != ''">
                <span class="card-date">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <xsl:value-of select="ovatio:nextDate"/>
                </span>
              </xsl:if>
              <xsl:if test="normalize-space(ovatio:minPrice) != ''">
                <span class="card-price">
                  <span>d&#232;s </span>
                  <xsl:value-of select="ovatio:minPrice"/>
                </span>
              </xsl:if>
            </div>

            <a href="{ovatio:bookUrl}" class="card-cta">R&#233;server ma place &#8594;</a>
          </div>

        </div>
      </xsl:for-each>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <a href="/">Standing-Ovation.be</a> &#169; 2026 &#8212; La sc&#232;ne curat&#233;e de Bruxelles
  </div>

</body>
</html>
</xsl:template>
</xsl:stylesheet>
