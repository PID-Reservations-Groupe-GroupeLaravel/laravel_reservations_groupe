"""
Generate TUTORIEL_FEATURES.pdf from TUTORIEL_FEATURES.md
Requires: pip install reportlab
"""

import re
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_MD   = os.path.join(SCRIPT_DIR, "TUTORIEL_FEATURES.md")
OUTPUT_PDF = os.path.join(SCRIPT_DIR, "TUTORIEL_FEATURES.pdf")

# ── Emoji → ASCII ─────────────────────────────────────────────────────────────
EMOJI_MAP = {
    "\U0001f4bb": "[LOCAL]",
    "\U0001f310": "[EXTERNE]",
    "\U0001f5a5️": "[SERVEUR]",
    "⚠️": "[!]",
    "→": "->",
}
def strip_emoji(text):
    for e, r in EMOJI_MAP.items():
        text = text.replace(e, r)
    # Remove any remaining non-latin1 chars that Helvetica can't render
    result = []
    for ch in text:
        try:
            ch.encode("latin-1")
            result.append(ch)
        except (UnicodeEncodeError, UnicodeDecodeError):
            result.append("?")
    return "".join(result)

# ── Palette ───────────────────────────────────────────────────────────────────
PURPLE      = colors.HexColor("#6c3cde")
DARK_PURPLE = colors.HexColor("#4a2aa0")
LIGHT_GRAY  = colors.HexColor("#f5f5f5")
DARK_GRAY   = colors.HexColor("#222222")
CODE_BG     = colors.HexColor("#1e1e2e")
CODE_FG     = colors.HexColor("#cdd6f4")

# ── Paragraph styles ──────────────────────────────────────────────────────────
H1 = ParagraphStyle("H1", fontName="Helvetica-Bold", fontSize=20,
                    textColor=DARK_PURPLE, spaceAfter=4, spaceBefore=14, leading=26)
H2 = ParagraphStyle("H2", fontName="Helvetica-Bold", fontSize=13,
                    textColor=colors.white, spaceAfter=0, spaceBefore=0, leading=18)
H3 = ParagraphStyle("H3", fontName="Helvetica-Bold", fontSize=11,
                    textColor=DARK_GRAY, spaceAfter=3, spaceBefore=8, leading=15)
BODY = ParagraphStyle("BODY", fontName="Helvetica", fontSize=9.5,
                      textColor=DARK_GRAY, spaceAfter=3, spaceBefore=2, leading=14)
BULLET = ParagraphStyle("BULLET", fontName="Helvetica", fontSize=9.5,
                        textColor=DARK_GRAY, spaceAfter=2, spaceBefore=1,
                        leading=13, leftIndent=14, bulletIndent=2)
BULLET2 = ParagraphStyle("BULLET2", fontName="Helvetica", fontSize=9.5,
                         textColor=DARK_GRAY, spaceAfter=2, spaceBefore=1,
                         leading=13, leftIndent=28, bulletIndent=16)
BQ = ParagraphStyle("BQ", fontName="Helvetica-Oblique", fontSize=9.5,
                    textColor=colors.HexColor("#555555"),
                    spaceAfter=4, spaceBefore=4, leading=13,
                    leftIndent=18, backColor=colors.HexColor("#f0eafa"))
CODE_LINE = ParagraphStyle("CODELINE", fontName="Courier", fontSize=7.5,
                           textColor=CODE_FG, leading=11, backColor=CODE_BG,
                           leftIndent=10, rightIndent=4,
                           spaceAfter=0, spaceBefore=0)
HDR_LBL = ParagraphStyle("HDRLBL", fontName="Helvetica-Bold", fontSize=7.5,
                          textColor=colors.white, leading=10)
TH = ParagraphStyle("TH", fontName="Helvetica-Bold", fontSize=8.5,
                    textColor=colors.white, leading=11)
TD = ParagraphStyle("TD", fontName="Helvetica", fontSize=8.5,
                    textColor=DARK_GRAY, leading=11)
COVER_TITLE = ParagraphStyle("CTITLE", fontName="Helvetica-Bold", fontSize=32,
                              textColor=colors.white, alignment=TA_CENTER, leading=40)
COVER_SUB   = ParagraphStyle("CSUB", fontName="Helvetica", fontSize=14,
                              textColor=colors.HexColor("#ddd5f8"),
                              alignment=TA_CENTER, leading=20)
COVER_META  = ParagraphStyle("CMETA", fontName="Helvetica-Oblique", fontSize=10,
                              textColor=colors.HexColor("#b8aee8"),
                              alignment=TA_CENTER, leading=14)

# ── Inline markdown → ReportLab XML ──────────────────────────────────────────
def inline(text):
    text = strip_emoji(text)
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    text = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)
    text = re.sub(r'`([^`]+)`',
                  lambda m: '<font name="Courier" color="#6c3cde"> '
                            + m.group(1).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                            + ' </font>', text)
    text = re.sub(r'\*(.+?)\*', r'<i>\1</i>', text)
    text = re.sub(r'_(.+?)_',   r'<i>\1</i>', text)
    text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)
    return text

# ── Code block → list of flowables (splittable across pages) ─────────────────
def make_code_block(code_lines, lang=""):
    label = lang.upper() if lang else "CODE"
    result = []

    hdr = Table([[Paragraph(label, HDR_LBL)]], colWidths=[16.3*cm])
    hdr.setStyle(TableStyle([
        ("BACKGROUND",    (0,0),(-1,-1), PURPLE),
        ("TOPPADDING",    (0,0),(-1,-1), 3),
        ("BOTTOMPADDING", (0,0),(-1,-1), 3),
        ("LEFTPADDING",   (0,0),(-1,-1), 8),
        ("RIGHTPADDING",  (0,0),(-1,-1), 4),
    ]))
    result.append(hdr)

    for raw in code_lines:
        if len(raw) > 100:
            raw = raw[:100] + "..."
        safe = raw.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        spaces = len(raw) - len(raw.lstrip(" "))
        safe = " " * spaces + safe.lstrip(" ")  # non-breaking spaces for indent
        if not safe.strip():
            safe = " "
        result.append(Paragraph(safe, CODE_LINE))

    result.append(Spacer(1, 6))
    return result

# ── Markdown table → ReportLab Table ─────────────────────────────────────────
def make_md_table(rows):
    clean = [r for r in rows if not re.match(r'^\|?\s*[-:| ]+\s*\|?\s*$', r)]
    if not clean:
        return None
    parsed = []
    for row in clean:
        cells = [c.strip() for c in row.strip().strip("|").split("|")]
        parsed.append(cells)
    col_n = max(len(r) for r in parsed)
    for r in parsed:
        while len(r) < col_n:
            r.append("")
    col_w = 16.3 * cm / col_n
    data = []
    data.append([Paragraph(inline(h), TH) for h in parsed[0]])
    for row in parsed[1:]:
        data.append([Paragraph(inline(c), TD) for c in row])
    t = Table(data, colWidths=[col_w]*col_n)
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0),(-1,0),  PURPLE),
        ("ROWBACKGROUNDS",(0,1),(-1,-1), [colors.white, colors.HexColor("#f3eeff")]),
        ("GRID",          (0,0),(-1,-1), 0.5, colors.HexColor("#cccccc")),
        ("TOPPADDING",    (0,0),(-1,-1), 5),
        ("BOTTOMPADDING", (0,0),(-1,-1), 5),
        ("LEFTPADDING",   (0,0),(-1,-1), 6),
        ("VALIGN",        (0,0),(-1,-1), "TOP"),
    ]))
    return t

# ── Cover page ────────────────────────────────────────────────────────────────
def make_cover():
    rows = [
        [Spacer(1, 5*cm)],
        [Paragraph("OVATIO", COVER_TITLE)],
        [Spacer(1, 0.4*cm)],
        [Paragraph("Tutoriel d'implementation", COVER_SUB)],
        [Paragraph("des nouvelles fonctionnalites", COVER_SUB)],
        [Spacer(1, 0.6*cm)],
        [Paragraph("Laravel 12  +  React 18", COVER_META)],
        [Spacer(1, 1*cm)],
        [Paragraph("Google OAuth  |  Apple Sign In  |  RSS Auto  |  Traduction des Avis", COVER_META)],
        [Spacer(1, 2*cm)],
        [Paragraph("Mai 2026", COVER_META)],
    ]
    t = Table(rows, colWidths=[16.3*cm])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0),(-1,-1), PURPLE),
        ("TOPPADDING",    (0,0),(-1,-1), 4),
        ("BOTTOMPADDING", (0,0),(-1,-1), 4),
        ("LEFTPADDING",   (0,0),(-1,-1), 20),
        ("RIGHTPADDING",  (0,0),(-1,-1), 20),
    ]))
    return t

# ── Parse markdown into flowable list ─────────────────────────────────────────
def parse_md(text):
    elements = []
    lines = text.split("\n")
    i = 0
    in_code = False
    code_lines, code_lang = [], ""
    table_rows = []
    in_table = False

    def flush_table():
        nonlocal table_rows, in_table
        if table_rows:
            t = make_md_table(table_rows)
            if t:
                elements.append(t)
                elements.append(Spacer(1, 6))
        table_rows.clear()
        in_table = False

    elements.append(make_cover())
    elements.append(Spacer(1, 0.5*cm))

    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # ── Code fence ───────────────────────────────────────────────────────
        if stripped.startswith("```"):
            if in_table:
                flush_table()
            if not in_code:
                in_code = True
                code_lang = stripped[3:].strip()
                code_lines = []
            else:
                in_code = False
                for el in make_code_block(code_lines, code_lang):
                    elements.append(el)
                code_lines, code_lang = [], ""
            i += 1
            continue

        if in_code:
            code_lines.append(line)
            i += 1
            continue

        # ── Table row ────────────────────────────────────────────────────────
        if stripped.startswith("|"):
            in_table = True
            table_rows.append(stripped)
            i += 1
            continue
        elif in_table:
            flush_table()

        # ── HR ───────────────────────────────────────────────────────────────
        if re.match(r'^-{3,}$', stripped) or stripped in ("***", "___"):
            elements.append(HRFlowable(width="100%", thickness=1,
                                        color=colors.HexColor("#dddddd"),
                                        spaceAfter=4, spaceBefore=4))
            i += 1
            continue

        # ── H1 ───────────────────────────────────────────────────────────────
        m = re.match(r'^# (.+)', stripped)
        if m:
            txt = strip_emoji(m.group(1))
            elements.append(Spacer(1, 6))
            elements.append(Paragraph(f"<b>{txt}</b>", H1))
            elements.append(HRFlowable(width="100%", thickness=2,
                                        color=PURPLE, spaceAfter=3, spaceBefore=2))
            i += 1
            continue

        # ── H2 ───────────────────────────────────────────────────────────────
        m = re.match(r'^## (.+)', stripped)
        if m:
            txt = strip_emoji(m.group(1))
            t = Table([[Paragraph(txt, H2)]], colWidths=[16.3*cm])
            t.setStyle(TableStyle([
                ("BACKGROUND",    (0,0),(-1,-1), DARK_PURPLE),
                ("TOPPADDING",    (0,0),(-1,-1), 7),
                ("BOTTOMPADDING", (0,0),(-1,-1), 7),
                ("LEFTPADDING",   (0,0),(-1,-1), 10),
            ]))
            elements.append(Spacer(1, 10))
            elements.append(t)
            elements.append(Spacer(1, 4))
            i += 1
            continue

        # ── H3 ───────────────────────────────────────────────────────────────
        m = re.match(r'^### (.+)', stripped)
        if m:
            txt = strip_emoji(m.group(1))
            elements.append(Spacer(1, 5))
            elements.append(Paragraph(f"<b>{txt}</b>", H3))
            i += 1
            continue

        # ── Blockquote ────────────────────────────────────────────────────────
        m = re.match(r'^>\s*(.*)', stripped)
        if m:
            bq_lines = [m.group(1)]
            while i + 1 < len(lines):
                nm = re.match(r'^>\s*(.*)', lines[i+1].strip())
                if nm:
                    i += 1
                    bq_lines.append(nm.group(1))
                else:
                    break
            elements.append(Paragraph(inline(" ".join(bq_lines)), BQ))
            elements.append(Spacer(1, 3))
            i += 1
            continue

        # ── Bullet / numbered list ────────────────────────────────────────────
        m = re.match(r'^(\s*)([-*]|\d+\.)\s+(.*)', line)
        if m:
            indent = len(m.group(1))
            st = BULLET2 if indent >= 3 else BULLET
            elements.append(Paragraph(f"&bull; {inline(m.group(3))}", st))
            i += 1
            continue

        # ── Blank line ────────────────────────────────────────────────────────
        if stripped == "":
            elements.append(Spacer(1, 3))
            i += 1
            continue

        # ── Normal paragraph ─────────────────────────────────────────────────
        elements.append(Paragraph(inline(stripped), BODY))
        i += 1

    if in_table:
        flush_table()

    return elements

# ── Page header/footer ────────────────────────────────────────────────────────
def on_page(canvas, doc):
    canvas.saveState()
    w, h = A4

    # Top bar
    canvas.setFillColor(PURPLE)
    canvas.rect(0, h - 1.1*cm, w, 1.1*cm, fill=1, stroke=0)
    canvas.setFillColor(colors.white)
    canvas.setFont("Helvetica-Bold", 8.5)
    canvas.drawString(1*cm, h - 0.75*cm, "OVATIO  —  Tutoriel d'implementation")
    canvas.setFont("Helvetica", 8)
    canvas.drawRightString(w - 1*cm, h - 0.75*cm, "Laravel 12  +  React 18")

    # Bottom bar
    canvas.setFillColor(colors.HexColor("#eeeeee"))
    canvas.rect(0, 0, w, 0.9*cm, fill=1, stroke=0)
    canvas.setFillColor(colors.HexColor("#666666"))
    canvas.setFont("Helvetica", 7.5)
    canvas.drawString(1*cm, 0.32*cm, "Projet OVATIO  —  Document confidentiel")
    canvas.drawRightString(w - 1*cm, 0.32*cm, f"Page {doc.page}")

    # Left accent stripe
    canvas.setFillColor(PURPLE)
    canvas.rect(0, 0.9*cm, 0.18*cm, h - 2.0*cm, fill=1, stroke=0)

    canvas.restoreState()

# ── Build ─────────────────────────────────────────────────────────────────────
def build():
    with open(INPUT_MD, "r", encoding="utf-8") as f:
        md = f.read()

    doc = SimpleDocTemplate(
        OUTPUT_PDF, pagesize=A4,
        leftMargin=1.5*cm, rightMargin=1.3*cm,
        topMargin=1.6*cm, bottomMargin=1.4*cm,
        title="Tutoriel OVATIO",
        author="OVATIO Dev Team",
        subject="Google OAuth, Apple Sign In, RSS, Traduction",
    )
    story = parse_md(md)
    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
    print(f"PDF cree : {OUTPUT_PDF}")

if __name__ == "__main__":
    build()
