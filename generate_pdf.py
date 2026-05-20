from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.lib import colors

doc = SimpleDocTemplate("PLAN_PRESENTATION_OVATIO.pdf", pagesize=A4,
                       rightMargin=0.75*inch, leftMargin=0.75*inch,
                       topMargin=0.75*inch, bottomMargin=0.75*inch)

styles = getSampleStyleSheet()
title_style = ParagraphStyle('CustomTitle', parent=styles['Heading1'],
    fontSize=28, textColor=colors.HexColor('#000666'), spaceAfter=12,
    alignment=TA_CENTER, fontName='Helvetica-Bold')

heading_style = ParagraphStyle('CustomHeading', parent=styles['Heading2'],
    fontSize=14, textColor=colors.HexColor('#1a237e'), spaceAfter=8,
    spaceBefore=8, fontName='Helvetica-Bold')

content_style = ParagraphStyle('Content', parent=styles['Normal'],
    fontSize=11, textColor=colors.HexColor('#333333'), spaceAfter=6,
    alignment=TA_JUSTIFY, fontName='Helvetica')

story = []
story.append(Spacer(1, 0.3*inch))
story.append(Paragraph("PLAN DE PRESENTATION", title_style))
story.append(Paragraph("STANDING-OVATION - Plateforme de Spectacles Vivants", styles['Heading2']))
story.append(Spacer(1, 0.15*inch))

# INTRO
story.append(Paragraph("<b>INTRO (1 min)</b>", heading_style))
story.append(Paragraph("• Bienvenue sur Ovatio.be", content_style))
story.append(Paragraph("• La plateforme de reservation pour les spectacles vivants a Bruxelles", content_style))
story.append(Paragraph("• Objectif: Faire decouvrir les meilleurs spectacles, simplifier la reservation", content_style))
story.append(Spacer(1, 0.1*inch))

# Section 1
story.append(Paragraph("<b>1 - NAVIGATION &amp; CATALOGUE (2 min)</b>", heading_style))
story.append(Paragraph("• Accueil → Page des spectacles", content_style))
story.append(Paragraph("• 4 spectacles curates", content_style))
story.append(Paragraph("• Statut (Confirme / A confirmer)", content_style))
story.append(Paragraph("• Tarif minimum visible", content_style))
story.append(Spacer(1, 0.1*inch))

# Section 2
story.append(Paragraph("<b>2 - DETAIL SPECTACLE (3 min)</b>", heading_style))
story.append(Paragraph("<b>Montrer: Ayiti (Spectacle 1)</b>", content_style))
story.append(Paragraph("• Page detail complete", content_style))
story.append(Paragraph("• Affiche + titre traduit", content_style))
story.append(Paragraph("• Description (avec traduction EN/NL)", content_style))
story.append(Paragraph("• Producteur", content_style))
story.append(Paragraph("• Dates des representations (traduction des dates)", content_style))
story.append(Paragraph("• Avis curateur Ovatio (traduction)", content_style))
story.append(Paragraph("• Avis spectateurs (5 etoiles)", content_style))
story.append(Spacer(1, 0.1*inch))

# Section 3
story.append(Paragraph("<b>3 - MULTILANGUE (2 min)</b>", heading_style))
story.append(Paragraph("• <b>Changer la langue</b> (FR → EN → NL)", content_style))
story.append(Paragraph("• Tous les textes se traduisent", content_style))
story.append(Paragraph("• Titles, descriptions, curator reviews", content_style))
story.append(Paragraph("• Dates (formats changent)", content_style))
story.append(Paragraph("• Prix et labels de tarifs", content_style))
story.append(Spacer(1, 0.1*inch))

story.append(PageBreak())

# Section 4
story.append(Paragraph("<b>4 - RESERVATION (2 min)</b>", heading_style))
story.append(Paragraph("<b>Tester la reservation:</b>", content_style))
story.append(Paragraph("• Choisir une date", content_style))
story.append(Paragraph("• Selectionner un tarif (avec traductions):", content_style))
story.append(Paragraph("  - Tarif normal", content_style))
story.append(Paragraph("  - Enfants (-12 ans)", content_style))
story.append(Paragraph("  - Tarif PMR", content_style))
story.append(Paragraph("  - Senior (60+)", content_style))
story.append(Paragraph("  - <b>Etudiant POPULAIRE</b> ← Badge position", content_style))
story.append(Paragraph("• Choisir quantite", content_style))
story.append(Paragraph("• Voir le total", content_style))
story.append(Paragraph("• Cliquer \"Confirmer la reservation\"", content_style))
story.append(Spacer(1, 0.1*inch))

# Section 5
story.append(Paragraph("<b>5 - AUTRES SPECTACLES (1 min)</b>", heading_style))
story.append(Paragraph("• Montrer que Cible mouvante et Manneke...! ont des representations", content_style))
story.append(Paragraph("• Essayer de reserver un autre spectacle", content_style))
story.append(Spacer(1, 0.15*inch))

# Conclusion
story.append(Paragraph("<b>CONCLUSION (1 min)</b>", heading_style))
story.append(Paragraph("• Plateforme complete et multilingue", content_style))
story.append(Paragraph("• UX fluide et intuitive", content_style))
story.append(Paragraph("• Prete pour la production", content_style))
story.append(Paragraph("• Questions?", content_style))
story.append(Spacer(1, 0.2*inch))

# Footer
story.append(Paragraph("<b>DUREE TOTALE:</b> ~12 minutes (avec demos)", heading_style))
story.append(Spacer(1, 0.1*inch))
story.append(Paragraph("<b>POINTS A METTRE EN AVANT:</b>", heading_style))
story.append(Paragraph("• Traduction automatique de TOUS les contenus", content_style))
story.append(Paragraph("• Dates formatees selon la langue", content_style))
story.append(Paragraph("• Tarification flexible et claire", content_style))
story.append(Paragraph("• Design elegant et accessible", content_style))

doc.build(story)
print("PDF cree: PLAN_PRESENTATION_OVATIO.pdf")
