#!/usr/bin/env python3
"""
Editable PowerPoint wireframe / content deck — no third-party libs.
A .pptx is a ZIP of OOXML parts; we emit a minimal-but-valid package.

Deliberately ABSTRACT & low-fidelity: every section uses the same small,
generic content slots and a loose grey layout sketch, so the content owner
has freedom and is not boxed into a rigid template. English.

Output: wireframes/VitaminD3Spray_Wireframe_Content.pptx
  Slide 1  : how to use this deck
  Slide 2  : page flow (section order)
  Slide 3+ : one slide per section
             left  = abstract grey layout sketch
             right = generic, editable content slots

Run:  python3 wireframes/ppt/build_pptx.py
"""
import os, zipfile, xml.sax.saxutils as su

EMU = 914400  # 1 inch
SLIDE_W, SLIDE_H = int(13.333 * EMU), int(7.5 * EMU)


def esc(s):
    return su.escape(str(s))


_sid = [1]
def _next_id():
    _sid[0] += 1
    return _sid[0]


def _xfrm(x, y, w, h):
    return (f'<a:xfrm><a:off x="{int(x)}" y="{int(y)}"/>'
            f'<a:ext cx="{int(w)}" cy="{int(h)}"/></a:xfrm>')


def rect(x, y, w, h, fill="EAECEE", line="C7CCD1", prst="roundRect",
         label=None, lsize=900, lcolor="9AA1A8"):
    sid = _next_id()
    if label:
        body = (f'<p:txBody><a:bodyPr wrap="square" anchor="ctr"/><a:lstStyle/>'
                f'<a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-GB" sz="{lsize}">'
                f'<a:solidFill><a:srgbClr val="{lcolor}"/></a:solidFill>'
                f'<a:latin typeface="Segoe UI"/></a:rPr>'
                f'<a:t>{esc(label)}</a:t></a:r></a:p></p:txBody>')
    else:
        body = '<p:txBody><a:bodyPr/><a:lstStyle/><a:p/></p:txBody>'
    ln = (f'<a:ln w="9525"><a:solidFill><a:srgbClr val="{line}"/></a:solidFill>'
          f'</a:ln>') if line else '<a:ln><a:noFill/></a:ln>'
    return (f'<p:sp><p:nvSpPr><p:cNvPr id="{sid}" name="wf{sid}"/>'
            f'<p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr>{_xfrm(x,y,w,h)}'
            f'<a:prstGeom prst="{prst}"><a:avLst/></a:prstGeom>'
            f'<a:solidFill><a:srgbClr val="{fill}"/></a:solidFill>{ln}'
            f'</p:spPr>{body}</p:sp>')


def textbox(x, y, w, h, runs, align="l", anchor="t", wrap=True):
    sid = _next_id()
    paras = []
    for r in runs:
        rpr = (f'<a:rPr lang="en-GB" sz="{r.get("sz",1100)}" '
               f'b="{1 if r.get("b") else 0}" i="{1 if r.get("it") else 0}">'
               f'<a:solidFill><a:srgbClr val="{r.get("color","3C4248")}"/>'
               f'</a:solidFill><a:latin typeface="Segoe UI"/></a:rPr>')
        ppr = (f'<a:pPr algn="{align}">'
               f'<a:spcAft><a:spcPts val="{r.get("spcAfter",300)}"/></a:spcAft>'
               f'</a:pPr>')
        paras.append(f'<a:p>{ppr}<a:r>{rpr}<a:t>{esc(r["t"])}</a:t></a:r></a:p>')
    bodypr = (f'<a:bodyPr wrap="{"square" if wrap else "none"}" anchor="{anchor}" '
              f'lIns="45720" tIns="27432" rIns="45720" bIns="27432"/>')
    return (f'<p:sp><p:nvSpPr><p:cNvPr id="{sid}" name="tx{sid}"/>'
            f'<p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr><p:spPr>'
            f'{_xfrm(x,y,w,h)}<a:prstGeom prst="rect"><a:avLst/></a:prstGeom>'
            f'<a:noFill/></p:spPr><p:txBody>{bodypr}<a:lstStyle/>'
            f'{"".join(paras)}</p:txBody></p:sp>')


def field(x, y, w, label, prompt, h_body):
    cap_h = int(0.30 * EMU)
    sid = _next_id()
    cap_sp = textbox(x, y, w, cap_h,
                     [{"t": label, "sz": 1000, "b": True, "color": "6B7178"}])
    box = (f'<p:sp><p:nvSpPr><p:cNvPr id="{sid}" name="fld{sid}"/>'
           f'<p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr><p:spPr>'
           f'{_xfrm(x, y+cap_h, w, h_body)}'
           f'<a:prstGeom prst="roundRect"><a:avLst/></a:prstGeom>'
           f'<a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill>'
           f'<a:ln w="9525"><a:solidFill><a:srgbClr val="C7CCD1"/></a:solidFill>'
           f'</a:ln></p:spPr><p:txBody>'
           f'<a:bodyPr wrap="square" anchor="t" lIns="73152" tIns="45720" '
           f'rIns="73152" bIns="45720"/><a:lstStyle/>'
           f'<a:p><a:r><a:rPr lang="en-GB" sz="1050" i="1">'
           f'<a:solidFill><a:srgbClr val="AAB0B6"/></a:solidFill>'
           f'<a:latin typeface="Segoe UI"/></a:rPr>'
           f'<a:t>{esc(prompt)}</a:t></a:r></a:p></p:txBody></p:sp>')
    return cap_sp + box


# ---- abstract layout sketches ----------------------------------------------
def sketch(kind, x, y, w, h):
    """Loose grey blocks. Intentionally abstract — no element-level labels."""
    s, pad = [], int(0.20 * EMU)
    ix, iy = x + pad, y + pad
    iw, ih = w - 2 * pad, h - 2 * pad
    bar = lambda yy, hh, ww=None, xx=None, **k: s.append(
        rect(xx if xx is not None else ix, yy, ww if ww else iw, hh, **k))

    def cards(yy, n, hh):
        gap = int(0.14 * EMU)
        cw = (iw - gap * (n - 1)) / n
        for i in range(n):
            s.append(rect(ix + i * (cw + gap), yy, cw, hh))

    if kind == "media-right":
        s.append(rect(ix + iw*0.58, iy, iw*0.42, ih, label="visual"))
        bar(iy + int(0.15*EMU), int(0.55*EMU), iw*0.5)
        bar(iy + int(0.85*EMU), int(0.32*EMU), iw*0.5, fill="DDE0E3")
        bar(iy + int(1.27*EMU), int(0.32*EMU), iw*0.5, fill="DDE0E3")
        bar(iy + int(1.75*EMU), int(0.34*EMU), iw*0.28,
            fill="5B6168", line=None)
    elif kind == "media-left":
        s.append(rect(ix, iy, iw*0.42, ih, label="visual"))
        tx = ix + iw*0.50
        s.append(rect(tx, iy + int(0.15*EMU), iw*0.50, int(0.55*EMU)))
        s.append(rect(tx, iy + int(0.85*EMU), iw*0.50, int(0.32*EMU), fill="DDE0E3"))
        s.append(rect(tx, iy + int(1.27*EMU), iw*0.50, int(0.32*EMU), fill="DDE0E3"))
        s.append(rect(tx, iy + int(1.75*EMU), iw*0.24, int(0.34*EMU),
                      fill="5B6168", line=None))
    elif kind == "cards":
        bar(iy, int(0.5*EMU), iw*0.6, ix + iw*0.2)
        cards(iy + int(0.7*EMU), 3, ih - int(0.7*EMU))
    elif kind == "list":
        bar(iy, int(0.45*EMU), iw*0.5)
        yy = iy + int(0.6*EMU)
        for _ in range(5):
            bar(yy, int(0.34*EMU), fill="F3F4F5")
            yy += int(0.42*EMU)
    elif kind == "centered":
        bar(iy + int(0.3*EMU), int(0.55*EMU), iw*0.7, ix + iw*0.15)
        bar(iy + int(1.0*EMU), int(0.35*EMU), iw*0.85, ix + iw*0.075,
            fill="DDE0E3")
        s.append(rect(ix + iw*0.37, iy + int(1.7*EMU), iw*0.26,
                      int(0.36*EMU), fill="5B6168", line=None))
    else:  # "full"
        s.append(rect(ix, iy, iw, ih, label="block"))
    return "".join(s)


# ---- deck content (abstract & uniform) -------------------------------------
PROMPT = "‹ type content here ›"

# Same generic, abstract slot set on every section slide.
SLOTS = [
    ("Headline", "‹ headline ›"),
    ("Supporting copy", "‹ short supporting text / sub-headline ›"),
    ("Body", "‹ main copy — keep it loose, length is flexible ›"),
    ("Key points (optional — one per line)", "‹ point ›\n‹ point ›\n‹ point ›"),
    ("Call-to-action (if any)", "‹ button / link text ›"),
    ("Visual brief (subject / mood)", "‹ what should the image or graphic show ›"),
]

# Section = (name, purpose, sketch-kind)
SECTIONS = [
    ("Hero", "First impression — promise + primary action.", "media-right"),
    ("Trust strip", "Reassurance band right under the hero.", "list"),
    ("Why it matters", "Open the need / problem.", "centered"),
    ("Product & USP", "What makes it different.", "media-left"),
    ("How to use", "Simple step explainer.", "cards"),
    ("Benefits", "Concrete benefits.", "list"),
    ("Ingredients & specs", "What's inside / facts.", "list"),
    ("Reviews / social proof", "Credibility & customer voice.", "cards"),
    ("Pricing / options", "Purchase choices.", "cards"),
    ("FAQ", "Common questions.", "list"),
    ("Guarantee & trust", "Risk reversal + legal note.", "cards"),
    ("Closing CTA", "Final call-to-action.", "centered"),
]


def slide_xml(shapes):
    return ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n'
            '<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
            'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
            'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">'
            '<p:cSld><p:spTree>'
            '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>'
            '<p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/>'
            '<a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>'
            f'{shapes}</p:spTree></p:cSld>'
            '<p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>')


def banner(total, idx, title, note):
    s = rect(int(0.4*EMU), int(0.30*EMU), int(12.53*EMU), int(0.62*EMU),
             fill="2A2F34", line=None)
    t = textbox(int(0.55*EMU), int(0.34*EMU), int(9.0*EMU), int(0.55*EMU),
                [{"t": title, "sz": 1400, "b": True, "color": "FFFFFF"}],
                anchor="ctr")
    p = textbox(int(9.4*EMU), int(0.34*EMU), int(3.5*EMU), int(0.55*EMU),
                [{"t": f"Section {idx} / {total}", "sz": 1050,
                  "color": "AAB0B6"}], align="r", anchor="ctr")
    n = textbox(int(0.55*EMU), int(1.02*EMU), int(12.2*EMU), int(0.34*EMU),
                [{"t": note, "sz": 1000, "it": True, "color": "6B7178"}])
    return s + t + p + n


def build_section_slide(idx, total, name, purpose, kind):
    shapes = banner(total, idx, f"{idx:02d} · {name}", purpose)
    sx, sy = int(0.4*EMU), int(1.5*EMU)
    sw, sh = int(5.7*EMU), int(5.55*EMU)
    shapes += rect(sx, sy, sw, sh, fill="F6F7F8", line="D6DADE", prst="rect")
    shapes += textbox(sx+int(0.12*EMU), sy+int(0.06*EMU), sw, int(0.3*EMU),
                      [{"t": "LAYOUT SKETCH — abstract, not final",
                        "sz": 850, "b": True, "color": "9AA1A8"}])
    shapes += sketch(kind, sx, sy+int(0.34*EMU), sw, sh-int(0.34*EMU))

    cx, cw = int(6.35*EMU), int(6.55*EMU)
    cy = int(1.5*EMU)
    shapes += textbox(cx, cy, cw, int(0.32*EMU),
                      [{"t": "CONTENT — fill what's relevant, skip the rest",
                        "sz": 950, "b": True, "color": "9AA1A8"}])
    cy += int(0.38*EMU)
    avail = int(7.05*EMU) - cy
    n = len(SLOTS)
    unit = avail / n
    cap = int(0.30*EMU)
    bh = max(int(0.22*EMU), int(unit - cap - int(0.10*EMU)))
    for label, prompt in SLOTS:
        shapes += field(cx, cy, cw, label, prompt, bh)
        cy += cap + bh + int(0.10*EMU)
    return slide_xml(shapes)


def build_cover():
    s = rect(0, 0, SLIDE_W, SLIDE_H, fill="2A2F34", line=None, prst="rect")
    s += textbox(int(0.9*EMU), int(1.1*EMU), int(11.5*EMU), int(1.2*EMU),
                 [{"t": "Vitamin D3 Spray — Wireframe & Content Deck",
                   "sz": 3200, "b": True, "color": "FFFFFF"}])
    s += textbox(int(0.92*EMU), int(2.4*EMU), int(11.5*EMU), int(0.6*EMU),
                 [{"t": "Consumer / DTC · abstract low-fi · test slice",
                   "sz": 1400, "color": "AAB0B6"}])
    how = [
        {"t": "How to use this deck", "sz": 1500, "b": True,
         "color": "FFFFFF", "spcAfter": 600},
        {"t": "1.  Slide 2 shows the page flow (order of sections).",
         "sz": 1250, "color": "D3D7DB", "spcAfter": 400},
        {"t": "2.  One slide per section: a loose layout sketch on the "
              "left, generic content slots on the right.", "sz": 1250,
         "color": "D3D7DB", "spcAfter": 400},
        {"t": "3.  Click a slot and overwrite the grey prompt. Fill what's "
              "relevant — skip slots that don't apply.", "sz": 1250,
         "color": "D3D7DB", "spcAfter": 400},
        {"t": "4.  It's intentionally abstract: structure & copy first, "
              "exact layout comes later.", "sz": 1250, "color": "D3D7DB",
         "spcAfter": 400},
        {"t": "5.  Sign-off via PowerPoint comments (Review → New Comment).",
         "sz": 1250, "color": "D3D7DB", "spcAfter": 400},
        {"t": "Greyscale wireframe is deliberate (pre-brandbook). The build "
              "is done from the HTML reference.", "sz": 1050, "it": True,
         "color": "8A9099"},
    ]
    s += textbox(int(0.9*EMU), int(3.35*EMU), int(11.5*EMU), int(3.7*EMU), how)
    return slide_xml(s)


def build_overview():
    s = rect(0, 0, SLIDE_W, SLIDE_H, fill="FFFFFF", line=None, prst="rect")
    s += textbox(int(0.7*EMU), int(0.5*EMU), int(11.9*EMU), int(0.7*EMU),
                 [{"t": "Page flow — section order (top → bottom)",
                   "sz": 2000, "b": True, "color": "2A2F34"}])
    y = int(1.45*EMU)
    colw = int(6.0*EMU)
    for i, (name, purpose, _k) in enumerate(SECTIONS):
        col = i // 6
        rowi = i % 6
        x = int(0.7*EMU) + col * (colw + int(0.3*EMU))
        yy = y + rowi * int(0.92*EMU)
        s += rect(x, yy, colw, int(0.78*EMU), fill="F6F7F8", line="D6DADE")
        s += rect(x+int(0.1*EMU), yy+int(0.13*EMU), int(0.52*EMU),
                  int(0.52*EMU), fill="5B6168", line=None,
                  label=f"{i+1:02d}", lsize=1100, lcolor="FFFFFF")
        s += textbox(x+int(0.75*EMU), yy+int(0.06*EMU), colw-int(0.85*EMU),
                     int(0.7*EMU),
                     [{"t": name, "sz": 1200, "b": True, "color": "2A2F34",
                       "spcAfter": 100},
                      {"t": purpose, "sz": 900, "color": "6B7178"}],
                     anchor="ctr")
    return slide_xml(s)


# ---- static OOXML parts -----------------------------------------------------
RELS_PKG = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n'
 '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
 '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>'
 '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>'
 '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>'
 '</Relationships>')

CORE = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n'
 '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" '
 'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" '
 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
 '<dc:title>Vitamin D3 Spray — Wireframe &amp; Content Deck</dc:title>'
 '<dc:creator>PolarisDX</dc:creator><cp:lastModifiedBy>PolarisDX</cp:lastModifiedBy>'
 '</cp:coreProperties>')


def app_xml(n):
    return ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n'
     '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" '
     'xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">'
     f'<Application>WireframeBuilder</Application><Slides>{n}</Slides>'
     '<ScaleCrop>false</ScaleCrop></Properties>')


THEME = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n'
 '<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="WF">'
 '<a:themeElements><a:clrScheme name="WF">'
 '<a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1>'
 '<a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1>'
 '<a:dk2><a:srgbClr val="2A2F34"/></a:dk2><a:lt2><a:srgbClr val="EEF0F2"/></a:lt2>'
 '<a:accent1><a:srgbClr val="5B6168"/></a:accent1><a:accent2><a:srgbClr val="9AA1A8"/></a:accent2>'
 '<a:accent3><a:srgbClr val="C7CCD1"/></a:accent3><a:accent4><a:srgbClr val="6B7178"/></a:accent4>'
 '<a:accent5><a:srgbClr val="D6DADE"/></a:accent5><a:accent6><a:srgbClr val="3C4248"/></a:accent6>'
 '<a:hlink><a:srgbClr val="5B6168"/></a:hlink><a:folHlink><a:srgbClr val="9AA1A8"/></a:folHlink>'
 '</a:clrScheme><a:fontScheme name="WF">'
 '<a:majorFont><a:latin typeface="Segoe UI"/><a:ea typeface=""/><a:cs typeface=""/></a:majorFont>'
 '<a:minorFont><a:latin typeface="Segoe UI"/><a:ea typeface=""/><a:cs typeface=""/></a:minorFont>'
 '</a:fontScheme><a:fmtScheme name="WF">'
 '<a:fillStyleLst>'
 '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>'
 '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>'
 '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>'
 '</a:fillStyleLst><a:lnStyleLst>'
 '<a:ln w="6350"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln>'
 '<a:ln w="12700"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln>'
 '<a:ln w="19050"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln>'
 '</a:lnStyleLst><a:effectStyleLst>'
 '<a:effectStyle><a:effectLst/></a:effectStyle>'
 '<a:effectStyle><a:effectLst/></a:effectStyle>'
 '<a:effectStyle><a:effectLst/></a:effectStyle>'
 '</a:effectStyleLst><a:bgFillStyleLst>'
 '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>'
 '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>'
 '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>'
 '</a:bgFillStyleLst></a:fmtScheme></a:themeElements>'
 '<a:objectDefaults/><a:extraClrSchemeLst/></a:theme>')

SLIDE_MASTER = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n'
 '<p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
 'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">'
 '<p:cSld><p:bg><p:bgRef idx="1001"><a:schemeClr val="lt1"/></p:bgRef></p:bg>'
 '<p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>'
 '<p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/>'
 '<a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>'
 '</p:spTree></p:cSld>'
 '<p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" '
 'accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" '
 'accent6="accent6" hlink="hlink" folHlink="folHlink"/>'
 '<p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst>'
 '<p:txStyles><p:titleStyle><a:lvl1pPr><a:defRPr sz="1800"/></a:lvl1pPr></p:titleStyle>'
 '<p:bodyStyle><a:lvl1pPr><a:defRPr sz="1100"/></a:lvl1pPr></p:bodyStyle>'
 '<p:otherStyle/></p:txStyles></p:sldMaster>')

SLIDE_MASTER_RELS = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n'
 '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
 '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>'
 '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/>'
 '</Relationships>')

SLIDE_LAYOUT = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n'
 '<p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
 'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" '
 'type="blank" preserve="1"><p:cSld name="Blank">'
 '<p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>'
 '<p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/>'
 '<a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>'
 '</p:spTree></p:cSld>'
 '<p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>')

SLIDE_LAYOUT_RELS = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n'
 '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
 '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/>'
 '</Relationships>')

PRESPROPS = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n'
 '<p:presentationPr xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
 'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"/>')

SLIDE_RELS = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n'
 '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
 '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>'
 '</Relationships>')


def main():
    slides = [build_cover(), build_overview()]
    total = len(SECTIONS)
    for i, (name, purpose, kind) in enumerate(SECTIONS, 1):
        slides.append(build_section_slide(i, total, name, purpose, kind))
    n = len(slides)

    sldIds = "".join(
        f'<p:sldId id="{256+i}" r:id="rId{i+2}"/>' for i in range(n))
    presentation = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n'
     '<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
     'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
     'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">'
     '<p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst>'
     f'<p:sldIdLst>{sldIds}</p:sldIdLst>'
     f'<p:sldSz cx="{SLIDE_W}" cy="{SLIDE_H}" type="screen16x9"/>'
     f'<p:notesSz cx="{SLIDE_H}" cy="{SLIDE_W}"/></p:presentation>')

    pres_rels = ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n'
     '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
     '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>']
    for i in range(n):
        pres_rels.append(
            f'<Relationship Id="rId{i+2}" '
            'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" '
            f'Target="slides/slide{i+1}.xml"/>')
    pres_rels.append(
        f'<Relationship Id="rId{n+2}" '
        'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/presProps" '
        'Target="presProps.xml"/></Relationships>')
    pres_rels = "".join(pres_rels)

    ct = ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n'
     '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
     '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
     '<Default Extension="xml" ContentType="application/xml"/>'
     '<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>'
     '<Override PartName="/ppt/presProps.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presProps+xml"/>'
     '<Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>'
     '<Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>'
     '<Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>'
     '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>'
     '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>']
    for i in range(n):
        ct.append(f'<Override PartName="/ppt/slides/slide{i+1}.xml" '
                  'ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>')
    ct.append('</Types>')
    ct = "".join(ct)

    out = os.path.join(os.path.dirname(__file__), "..",
                       "VitaminD3Spray_Wireframe_Content.pptx")
    out = os.path.abspath(out)
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", ct)
        z.writestr("_rels/.rels", RELS_PKG)
        z.writestr("docProps/core.xml", CORE)
        z.writestr("docProps/app.xml", app_xml(n))
        z.writestr("ppt/presentation.xml", presentation)
        z.writestr("ppt/_rels/presentation.xml.rels", pres_rels)
        z.writestr("ppt/presProps.xml", PRESPROPS)
        z.writestr("ppt/theme/theme1.xml", THEME)
        z.writestr("ppt/slideMasters/slideMaster1.xml", SLIDE_MASTER)
        z.writestr("ppt/slideMasters/_rels/slideMaster1.xml.rels", SLIDE_MASTER_RELS)
        z.writestr("ppt/slideLayouts/slideLayout1.xml", SLIDE_LAYOUT)
        z.writestr("ppt/slideLayouts/_rels/slideLayout1.xml.rels", SLIDE_LAYOUT_RELS)
        for i, sx in enumerate(slides, 1):
            z.writestr(f"ppt/slides/slide{i}.xml", sx)
            z.writestr(f"ppt/slides/_rels/slide{i}.xml.rels", SLIDE_RELS)
    print(f"OK  {out}  ({n} slides)")


if __name__ == "__main__":
    main()
