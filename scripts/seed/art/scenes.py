"""
Generates the Scootorama illustration set as SVG.

Flat retro-kitsch style: sunburst skies, chunky ink outlines, checkerboard
roads. Run `python3 scripts/seed/art/scenes.py` then
`node scripts/seed/art/render.mjs` to rasterize to scripts/seed/images/.
"""
import math, os, random

INK = '#241E3A'
CREAM = '#FFFBF0'
PINK = '#D6117A'; PINK_L = '#FF4FA8'
TEAL = '#00858C'; TEAL_L = '#2CC4C4'
LIME = '#7CC21E'; YELLOW = '#FFD21F'; PURPLE = '#8B5CF6'; ORANGE = '#F26B00'
SW = 6  # outline width

OUT = os.path.join(os.path.dirname(__file__), 'svg')
os.makedirs(OUT, exist_ok=True)


def svg(w, h, body, bg=CREAM):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">'
            f'<rect width="{w}" height="{h}" fill="{bg}"/>{body}</svg>')


def o(fill, extra=''):
    return f'fill="{fill}" stroke="{INK}" stroke-width="{SW}" stroke-linejoin="round" stroke-linecap="round" {extra}'


def sunburst(cx, cy, r, n, c1, c2, opacity=0.35):
    out = [f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{c1}"/>']
    for i in range(n):
        a1 = 2 * math.pi * i / n; a2 = 2 * math.pi * (i + 0.5) / n
        out.append(f'<path d="M{cx},{cy} L{cx + r * math.cos(a1):.1f},{cy + r * math.sin(a1):.1f} '
                   f'L{cx + r * math.cos(a2):.1f},{cy + r * math.sin(a2):.1f} Z" fill="{c2}" opacity="{opacity}"/>')
    return ''.join(out)


def sky(w, h, top, bottom, burst_c=None, cx=None, cy=None):
    g = f'<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{top}"/><stop offset="1" stop-color="{bottom}"/></linearGradient></defs>'
    body = g + f'<rect width="{w}" height="{h}" fill="url(#sky)"/>'
    if burst_c:
        body += f'<g opacity="0.55">{sunburst(cx, cy, max(w, h) * 1.2, 28, "none", burst_c, 0.5)}</g>'
    return body


def sun(cx, cy, r, color=YELLOW, face=True):
    s = f'<circle cx="{cx}" cy="{cy}" r="{r}" {o(color)}/>'
    if face:
        s += (f'<circle cx="{cx - r * .32}" cy="{cy - r * .12}" r="{r * .08}" fill="{INK}"/>'
              f'<circle cx="{cx + r * .32}" cy="{cy - r * .12}" r="{r * .08}" fill="{INK}"/>'
              f'<path d="M{cx - r * .38},{cy + r * .22} Q{cx},{cy + r * .6} {cx + r * .38},{cy + r * .22}" fill="none" stroke="{INK}" stroke-width="{SW}" stroke-linecap="round"/>'
              f'<circle cx="{cx - r * .55}" cy="{cy + r * .2}" r="{r * .12}" fill="{PINK_L}" opacity=".7"/>'
              f'<circle cx="{cx + r * .55}" cy="{cy + r * .2}" r="{r * .12}" fill="{PINK_L}" opacity=".7"/>')
    return s


def cloud(x, y, s=1.0, fill='#FFFFFF'):
    parts = [(0, 0, 50), (55, -25, 60), (115, 0, 48), (60, 18, 55)]
    circles = ''.join(f'<circle cx="{x + dx * s}" cy="{y + dy * s}" r="{r * s}"/>' for dx, dy, r in parts)
    return (f'<g stroke="{INK}" stroke-width="{SW * 2}" fill="{INK}">{circles}</g>'
            f'<g fill="{fill}">{circles}</g>')


def checker_road(w, h, y, color_a=INK, color_b=CREAM, rows=4, cols=24):
    """Checkerboard ground band in simple perspective (rows get taller toward viewer)."""
    out = []
    total = h - y
    heights = [total * (i + 1) / sum(range(1, rows + 1)) for i in range(rows)]
    yy = y
    for r, rh in enumerate(heights):
        for c in range(cols + 2):
            cw = w / cols
            x = (c - 1) * cw - (r * cw / 3)
            col = color_a if (r + c) % 2 == 0 else color_b
            out.append(f'<rect x="{x:.1f}" y="{yy:.1f}" width="{cw + 1:.1f}" height="{rh + 1:.1f}" fill="{col}"/>')
        yy += rh
    out.append(f'<line x1="0" y1="{y}" x2="{w}" y2="{y}" stroke="{INK}" stroke-width="{SW * 1.5}"/>')
    return ''.join(out)


def hills(w, y, color, amp=60, n=4, seed=1):
    random.seed(seed)
    pts = [f'M0,{y + 400}', f'L0,{y}']
    step = w / n
    for i in range(n):
        x1 = i * step + step / 2; x2 = (i + 1) * step
        pts.append(f'Q{x1:.0f},{y - amp - random.randint(0, int(amp))} {x2:.0f},{y}')
    pts.append(f'L{w},{y + 400} Z')
    return f'<path d="{" ".join(pts)}" {o(color)}/>'


def palm(x, y, s=1.0, lean=0):
    trunk = f'<path d="M{x},{y} Q{x + 20 * s + lean},{y - 120 * s} {x + lean * 1.6},{y - 230 * s}" fill="none" stroke="{INK}" stroke-width="{26 * s}" stroke-linecap="round"/>' \
            f'<path d="M{x},{y} Q{x + 20 * s + lean},{y - 120 * s} {x + lean * 1.6},{y - 230 * s}" fill="none" stroke="#C98A4B" stroke-width="{14 * s}" stroke-linecap="round"/>'
    tx, ty = x + lean * 1.6, y - 230 * s
    leaves = ''
    for ang in (-160, -120, -60, -20, 200):
        a = math.radians(ang)
        ex, ey = tx + 120 * s * math.cos(a), ty + 120 * s * math.sin(a) + 40 * s
        mx, my = tx + 60 * s * math.cos(a), ty + 60 * s * math.sin(a) - 30 * s
        leaves += f'<path d="M{tx},{ty} Q{mx},{my} {ex},{ey} Q{mx + 10 * s},{my + 30 * s} {tx},{ty}" {o(LIME)}/>'
    nuts = f'<circle cx="{tx - 10 * s}" cy="{ty + 12 * s}" r="{12 * s}" {o("#8A5A2B")}/><circle cx="{tx + 12 * s}" cy="{ty + 14 * s}" r="{12 * s}" {o("#8A5A2B")}/>'
    return trunk + leaves + nuts


def scooter(x, y, s=1.0, deck=PINK, wheel=TEAL, streamers=True, facing=1):
    """Kick scooter with its front wheel at (x, y). facing=1 points right."""
    f = facing
    g = f'<g transform="translate({x},{y}) scale({s * f},{s})">'
    # deck + stem + bars
    g += f'<path d="M-260,-10 L-20,-10" stroke="{INK}" stroke-width="34" stroke-linecap="round"/>'
    g += f'<path d="M-260,-10 L-20,-10" stroke="{deck}" stroke-width="20" stroke-linecap="round"/>'
    g += f'<path d="M-20,-10 L40,-300" stroke="{INK}" stroke-width="30" stroke-linecap="round"/>'
    g += f'<path d="M-20,-10 L40,-300" stroke="#D9D9E3" stroke-width="16" stroke-linecap="round"/>'
    g += f'<path d="M-10,-300 L90,-300" stroke="{INK}" stroke-width="30" stroke-linecap="round"/>'
    g += f'<path d="M-10,-300 L90,-300" stroke="{deck}" stroke-width="16" stroke-linecap="round"/>'
    if streamers:
        for i, c in enumerate([PINK_L, YELLOW, TEAL_L]):
            g += f'<path d="M85,{-300 + i * 4} q-60,{20 + i * 12} -120,{8 + i * 22} q-40,-4 -70,{18 + i * 6}" fill="none" stroke="{c}" stroke-width="9" stroke-linecap="round"/>'
    # fenders + wheels
    for wx in (-250, 0):
        g += f'<path d="M{wx - 52},-12 A55,55 0 0 1 {wx + 52},-12" fill="none" stroke="{INK}" stroke-width="22"/>'
        g += f'<path d="M{wx - 52},-12 A55,55 0 0 1 {wx + 52},-12" fill="none" stroke="#E6E6EE" stroke-width="10"/>'
        g += f'<circle cx="{wx}" cy="30" r="44" {o(wheel)}/><circle cx="{wx}" cy="30" r="14" {o(CREAM)}/>'
    # bulb horn
    g += f'<circle cx="95" cy="-322" r="20" {o(ORANGE)}/><path d="M80,-310 l-24,14" stroke="{INK}" stroke-width="10"/>'
    g += '</g>'
    return g


def stars(w, h, n, seed=3):
    random.seed(seed)
    out = ''
    for _ in range(n):
        x, y, r = random.randint(0, w), random.randint(0, int(h * .55)), random.choice([3, 4, 6])
        out += f'<circle cx="{x}" cy="{y}" r="{r}" fill="#FFF6C2"/>'
    return out


def confetti(w, h, n, seed=7, y_max=None):
    random.seed(seed)
    out = ''
    cols = [PINK_L, YELLOW, TEAL_L, LIME, PURPLE]
    for _ in range(n):
        x, y = random.randint(0, w), random.randint(0, y_max or h)
        c = random.choice(cols); rot = random.randint(0, 180)
        out += f'<rect x="{x}" y="{y}" width="18" height="8" rx="3" fill="{c}" transform="rotate({rot} {x} {y})"/>'
    return out


# ----------------------------------------------------------------- worlds
W, H = 1600, 900
GROUND = 700


def bora_bora():
    b = sky(W, H, '#FF7FBF', '#FFD9A8', '#FFFFFF', 1250, 220)
    b += sun(1250, 220, 110)
    b += cloud(180, 170, 1.0) + cloud(640, 110, .8)
    # volcano with confetti eruption
    b += f'<path d="M820,{GROUND} L1060,330 L1140,330 L1400,{GROUND} Z" {o("#9B5DE5")}/>'
    b += f'<path d="M1060,330 L1140,330 L1120,370 L1085,360 Z" {o(PINK_L)}/>'
    b += confetti(560, 260, 70, 11).replace('<rect x="', '<rect transform-origin="0 0" x="').replace('x="', 'x="').replace('<rect', '<rect') .replace('y="', 'y="')
    # lagoon
    b += f'<rect x="0" y="{GROUND - 60}" width="{W}" height="140" {o(TEAL_L)}/>'
    for i in range(6):
        b += f'<path d="M{80 + i * 260},{GROUND - 10} q30,-18 60,0 q30,18 60,0" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" opacity=".8"/>'
    # bungalows on stilts
    for bx in (140, 430, 1320):
        b += ''.join(f'<rect x="{bx + dx}" y="{GROUND - 150}" width="12" height="130" {o("#8A5A2B")}/>' for dx in (10, 90, 170))
        b += f'<rect x="{bx}" y="{GROUND - 250}" width="200" height="110" {o(YELLOW)}/>'
        b += f'<rect x="{bx + 80}" y="{GROUND - 210}" width="40" height="70" {o(PINK)}/>'
        b += f'<path d="M{bx - 30},{GROUND - 245} L{bx + 100},{GROUND - 340} L{bx + 230},{GROUND - 245} Z" {o("#E3B34A")}/>'
    b += palm(760, GROUND - 40, 1.1, 30) + palm(1510, GROUND - 40, .9, -40)
    b += checker_road(W, H, GROUND + 80, PINK, CREAM)
    b += scooter(1000, 815, .75)
    return svg(W, H, b)


def alamo():
    b = sky(W, H, '#FF9F5A', '#FFE3A3', '#FFFFFF', 300, 180)
    b += sun(300, 180, 100)
    b += cloud(900, 120, .9) + cloud(1300, 200, .7)
    b += hills(W, GROUND - 40, '#E8B77A', 40, 3, 5)
    # fort facade with the famous curved parapet
    fx, fy, fw = 520, GROUND - 330, 620
    b += f'<rect x="{fx}" y="{fy + 80}" width="{fw}" height="330" {o("#F3D9B1")}/>'
    b += (f'<path d="M{fx + 120},{fy + 80} L{fx + 120},{fy + 40} Q{fx + 200},{fy + 40} {fx + 230},{fy} '
          f'Q{fx + 310},{fy - 70} {fx + 390},{fy} Q{fx + 420},{fy + 40} {fx + 500},{fy + 40} L{fx + 500},{fy + 80} Z" {o("#F3D9B1")}/>')
    b += f'<path d="M{fx + 250},{GROUND + 80} L{fx + 250},{fy + 230} Q{fx + 310},{fy + 160} {fx + 370},{fy + 230} L{fx + 370},{GROUND + 80} Z" {o(INK)}/>'
    for wx in (fx + 80, fx + 470):
        b += f'<path d="M{wx},{fy + 250} L{wx},{fy + 180} Q{wx + 35},{fy + 140} {wx + 70},{fy + 180} L{wx + 70},{fy + 250} Z" {o(TEAL)}/>'
    for px in (fx + 150, fx + 430):
        b += f'<rect x="{px}" y="{fy + 120}" width="40" height="{GROUND + 80 - fy - 120}" {o("#E8C99A")}/>'
    # banner + gift shop sign
    b += f'<path d="M{fx + 150},{fy + 105} Q{fx + 310},{fy + 150} {fx + 470},{fy + 105}" fill="none" stroke="{INK}" stroke-width="8"/>'
    for i, c in enumerate([PINK, YELLOW, TEAL, LIME, PURPLE, ORANGE, PINK, YELLOW]):
        t = (i + .5) / 8; x = fx + 150 + 320 * t; y = fy + 105 + 90 * t * (1 - t)
        b += f'<path d="M{x - 16},{y} L{x + 16},{y} L{x},{y + 34} Z" {o(c)}/>'
    b += f'<rect x="1180" y="{GROUND - 260}" width="300" height="110" rx="18" {o(PINK)}/>'
    b += f'<text x="1330" y="{GROUND - 190}" text-anchor="middle" font-family="Bungee, sans-serif" font-size="44" fill="{YELLOW}" stroke="{INK}" stroke-width="3" paint-order="stroke">GIFT SHOP</text>'
    b += f'<rect x="1320" y="{GROUND - 150}" width="20" height="230" {o("#8A5A2B")}/>'
    # cacti
    for cx_, s in ((200, 1), (420, .7), (1480, .8)):
        b += (f'<g transform="translate({cx_},{GROUND + 80}) scale({s})">'
              f'<rect x="-30" y="-260" width="60" height="260" rx="30" {o(LIME)}/>'
              f'<path d="M-30,-120 L-80,-120 L-80,-190" fill="none" stroke="{INK}" stroke-width="42" stroke-linecap="round" stroke-linejoin="round"/>'
              f'<path d="M-30,-120 L-80,-120 L-80,-190" fill="none" stroke="{LIME}" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>'
              f'<path d="M30,-160 L80,-160 L80,-220" fill="none" stroke="{INK}" stroke-width="42" stroke-linecap="round" stroke-linejoin="round"/>'
              f'<path d="M30,-160 L80,-160 L80,-220" fill="none" stroke="{LIME}" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/></g>')
    b += checker_road(W, H, GROUND + 80, ORANGE, CREAM)
    b += scooter(420, 815, .75, deck=TEAL, wheel=PINK)
    return svg(W, H, b)


def dino():
    b = sky(W, H, '#FFC56B', '#FFF1BF', '#FFFFFF', 1350, 170)
    b += sun(1350, 170, 95)
    b += cloud(250, 140, .8)
    # mesas
    b += f'<path d="M0,{GROUND} L0,450 L180,450 L240,520 L420,520 L480,{GROUND} Z" {o("#E07B39")}/>'
    b += f'<path d="M1100,{GROUND} L1160,470 L1420,470 L1480,{GROUND} Z" {o("#E07B39")}/>'
    b += f'<rect x="0" y="{GROUND}" width="{W}" height="90" {o("#F2B66B")}/>'
    # brontosaurus
    bx, by = 380, GROUND - 40
    b += (f'<path d="M{bx},{by} Q{bx + 30},{by - 170} {bx + 220},{by - 170} Q{bx + 380},{by - 170} {bx + 430},{by - 60} '
          f'Q{bx + 560},{by - 40} {bx + 650},{by - 10} Q{bx + 520},{by - 10} {bx + 440},{by} Z" {o(LIME)}/>')
    b += f'<path d="M{bx + 60},{by - 120} Q{bx - 40},{by - 300} {bx - 20},{by - 420} Q{bx + 10},{by - 460} {bx + 60},{by - 430} Q{bx + 40},{by - 330} {bx + 130},{by - 150}" {o(LIME)}/>'
    b += f'<circle cx="{bx + 22}" cy="{by - 432}" r="8" fill="{INK}"/>'
    for lx in (bx + 90, bx + 170, bx + 300, bx + 380):
        b += f'<rect x="{lx}" y="{by - 50}" width="46" height="130" rx="12" {o(LIME)}/>'
    for sx in range(bx + 120, bx + 400, 50):
        b += f'<path d="M{sx},{by - 168} l22,-40 l22,40" {o(YELLOW)}/>'
    # t-rex
    tx, ty = 1060, GROUND + 40
    b += (f'<path d="M{tx},{ty} L{tx + 20},{ty - 160} Q{tx - 40},{ty - 260} {tx + 40},{ty - 360} L{tx + 190},{ty - 380} '
          f'Q{tx + 250},{ty - 360} {tx + 240},{ty - 300} L{tx + 150},{ty - 290} Q{tx + 140},{ty - 200} {tx + 110},{ty - 150} L{tx + 130},{ty} Z" {o(PURPLE)}/>')
    b += f'<path d="M{tx + 30},{ty - 150} Q{tx - 90},{ty - 150} {tx - 150},{ty - 60}" fill="none" stroke="{INK}" stroke-width="64" stroke-linecap="round"/>'
    b += f'<path d="M{tx + 30},{ty - 150} Q{tx - 90},{ty - 150} {tx - 150},{ty - 60}" fill="none" stroke="{PURPLE}" stroke-width="50" stroke-linecap="round"/>'
    b += f'<circle cx="{tx + 150}" cy="{ty - 345}" r="9" fill="{INK}"/>'
    b += ''.join(f'<path d="M{tx + 165 + i * 22},{ty - 300} l10,16 l10,-16" fill="#FFFFFF" stroke="{INK}" stroke-width="3"/>' for i in range(3))
    # coffee pot diner
    cx_ = 1380
    b += f'<path d="M{cx_},{GROUND + 60} L{cx_ + 20},{GROUND - 200} Q{cx_ + 100},{GROUND - 260} {cx_ + 180},{GROUND - 200} L{cx_ + 200},{GROUND + 60} Z" {o("#E6E6EE")}/>'
    b += f'<path d="M{cx_ + 200},{GROUND - 150} q70,10 60,90 q-10,60 -60,60" fill="none" stroke="{INK}" stroke-width="20"/>'
    b += f'<rect x="{cx_ + 40}" y="{GROUND - 110}" width="120" height="50" rx="8" {o(PINK)}/>'
    b += f'<text x="{cx_ + 100}" y="{GROUND - 75}" text-anchor="middle" font-family="Bungee, sans-serif" font-size="26" fill="{YELLOW}">EATS</text>'
    b += checker_road(W, H, GROUND + 80, TEAL, CREAM)
    b += scooter(270, 815, .75, deck=ORANGE, wheel=PURPLE)
    return svg(W, H, b)


def niagara():
    b = sky(W, H, '#B79BFF', '#FFD1E8', '#FFFFFF', 800, 150)
    # rainbow
    for i, c in enumerate([PINK_L, ORANGE, YELLOW, LIME, TEAL_L, PURPLE]):
        r = 520 - i * 34
        b += f'<path d="M{800 - r},560 A{r},{r} 0 0 1 {800 + r},560" fill="none" stroke="{c}" stroke-width="34"/>'
    b += cloud(220, 180, .9) + cloud(1250, 160, .9)
    # cliffs + falls
    b += f'<path d="M0,{H} L0,420 L520,420 L560,{H} Z" {o("#6BB36B")}/>'
    b += f'<path d="M{W},{H} L{W},420 L1080,420 L1040,{H} Z" {o("#6BB36B")}/>'
    b += f'<rect x="520" y="420" width="560" height="360" {o("#8FE3F0")}/>'
    for i in range(12):
        x = 540 + i * 45
        b += f'<path d="M{x},430 C{x - 8},560 {x + 8},660 {x},770" fill="none" stroke="#FFFFFF" stroke-width="8" opacity=".85" stroke-linecap="round"/>'
    b += f'<ellipse cx="800" cy="780" rx="360" ry="60" fill="#FFFFFF" opacity=".9"/>'
    # heart hot tub on cliff
    hx, hy = 1300, 420
    b += (f'<path d="M{hx},{hy + 20} C{hx - 150},{hy - 80} {hx - 150},{hy - 190} {hx - 60},{hy - 190} C{hx - 20},{hy - 190} {hx},{hy - 160} {hx},{hy - 130} '
          f'C{hx},{hy - 160} {hx + 20},{hy - 190} {hx + 60},{hy - 190} C{hx + 150},{hy - 190} {hx + 150},{hy - 80} {hx},{hy + 20} Z" {o(PINK)}/>')
    b += f'<path d="M{hx - 90},{hy - 120} q90,40 180,0" fill="none" stroke="{TEAL_L}" stroke-width="18" stroke-linecap="round"/>'
    for i in range(4):
        b += f'<circle cx="{hx - 50 + i * 35}" cy="{hy - 230 - (i % 2) * 20}" r="10" fill="#FFFFFF" stroke="{INK}" stroke-width="3"/>'
    # barrel
    b += f'<g transform="rotate(-20 260 380)"><rect x="200" y="300" width="120" height="160" rx="40" {o("#B0763A")}/><path d="M200,340 h120 M200,420 h120" stroke="{INK}" stroke-width="8"/></g>'
    b += checker_road(W, H, GROUND + 80, PURPLE, CREAM)
    b += scooter(300, 815, .75, deck=PINK, wheel=YELLOW)
    return svg(W, H, b)


def paree():
    b = sky(W, H, '#8FD3FF', '#FFE6F2', '#FFFFFF', 300, 170)
    b += sun(300, 170, 95)
    b += cloud(1150, 130, .9) + cloud(700, 220, .6)
    # townhouses
    cols = [PINK_L, YELLOW, TEAL_L, '#F6C7DA', LIME]
    for i, x in enumerate(range(-40, W, 230)):
        if 560 < x < 1000: continue
        h_ = 260 + (i % 3) * 40
        b += f'<rect x="{x}" y="{GROUND + 80 - h_}" width="210" height="{h_}" {o(cols[i % 5])}/>'
        b += f'<path d="M{x - 10},{GROUND + 80 - h_} L{x + 105},{GROUND + 20 - h_} L{x + 220},{GROUND + 80 - h_} Z" {o("#5C6BC0")}/>'
        for wy in range(GROUND + 110 - h_, GROUND + 20, 80):
            for wx in (x + 30, x + 130):
                b += f'<rect x="{wx}" y="{wy}" width="50" height="50" rx="6" {o(CREAM)}/>'
        b += f'<path d="M{x},{GROUND - 40} h210" stroke="{INK}" stroke-width="4"/>'
        b += ''.join(f'<path d="M{x + k * 30},{GROUND - 40} l15,26 l15,-26" fill="{PINK if k % 2 else CREAM}" stroke="{INK}" stroke-width="3"/>' for k in range(7))
    # cake tower
    cx_ = 790
    layers = [(360, 110, PINK_L), (300, 100, CREAM), (240, 90, TEAL_L), (190, 80, YELLOW), (140, 70, PURPLE), (100, 60, PINK_L), (64, 50, CREAM)]
    y = GROUND + 80
    for w_, h_, c in layers:
        y -= h_
        b += f'<rect x="{cx_ - w_ / 2}" y="{y}" width="{w_}" height="{h_}" rx="14" {o(c)}/>'
        drips = ''.join(f'<path d="M{cx_ - w_ / 2 + 10 + k * (w_ - 20) / 6},{y + 4} q10,{24 + (k % 2) * 16} 20,0" fill="#FFFFFF" stroke="{INK}" stroke-width="4"/>' for k in range(6))
        b += f'<rect x="{cx_ - w_ / 2}" y="{y}" width="{w_}" height="18" rx="9" fill="#FFFFFF" stroke="{INK}" stroke-width="4"/>' + drips
    b += f'<rect x="{cx_ - 10}" y="{y - 90}" width="20" height="90" {o(TEAL)}/>'
    b += f'<path d="M{cx_},{y - 150} q-24,30 0,56 q24,-26 0,-56 Z" {o(ORANGE)}/>'
    b += f'<circle cx="{cx_ - 60}" cy="{y + 200}" r="14" {o("#E0262D")}/><circle cx="{cx_ + 70}" cy="{y + 330}" r="14" {o("#E0262D")}/>'
    b += checker_road(W, H, GROUND + 80, INK, CREAM)
    b += scooter(1270, 815, .75, deck=PURPLE, wheel=PINK)
    return svg(W, H, b)


def roswell():
    b = sky(W, H, '#1A1240', '#5B2FC9', '#8B5CF6', 800, 1200)
    b += stars(W, H, 90)
    b += f'<circle cx="1330" cy="160" r="80" {o("#FFF3C4")}/><circle cx="1300" cy="140" r="14" fill="#E9DCA0"/><circle cx="1360" cy="190" r="10" fill="#E9DCA0"/>'
    # mesas
    b += f'<path d="M0,{GROUND + 80} L0,520 L260,520 L320,600 L520,600 L580,{GROUND + 80} Z" {o("#3B2A7A")}/>'
    b += f'<path d="M1080,{GROUND + 80} L1140,560 L1600,560 L1600,{GROUND + 80} Z" {o("#3B2A7A")}/>'
    # saucer + beam
    sx, sy = 760, 240
    b += f'<path d="M{sx - 90},{sy + 40} L{sx - 260},{GROUND + 80} L{sx + 260},{GROUND + 80} L{sx + 90},{sy + 40} Z" fill="{LIME}" opacity=".35"/>'
    b += f'<ellipse cx="{sx}" cy="{sy}" rx="100" ry="80" {o(TEAL_L)} opacity=".95"/>'
    b += f'<ellipse cx="{sx}" cy="{sy + 30}" rx="240" ry="60" {o("#C9CCD8")}/>'
    b += ''.join(f'<circle cx="{sx - 180 + k * 60}" cy="{sy + 36}" r="14" {o([YELLOW, PINK_L, LIME][k % 3])}/>' for k in range(7))
    # little green friend
    b += f'<g transform="translate({sx},{sy - 20})"><ellipse cx="0" cy="0" rx="36" ry="44" {o(LIME)}/><ellipse cx="-14" cy="-6" rx="10" ry="14" fill="{INK}"/><ellipse cx="14" cy="-6" rx="10" ry="14" fill="{INK}"/><path d="M-20,-40 l-16,-30 M20,-40 l16,-30" stroke="{INK}" stroke-width="6"/><circle cx="-36" cy="-72" r="8" {o(PINK_L)}/><circle cx="36" cy="-72" r="8" {o(PINK_L)}/></g>'
    # neon motel sign
    mx = 1250
    b += f'<rect x="{mx + 80}" y="{GROUND - 260}" width="24" height="340" {o("#555")}/>'
    b += f'<rect x="{mx - 40}" y="{GROUND - 400}" width="300" height="150" rx="24" {o(PINK)}/>'
    b += f'<text x="{mx + 110}" y="{GROUND - 330}" text-anchor="middle" font-family="Bungee, sans-serif" font-size="44" fill="{LIME}" stroke="{INK}" stroke-width="3" paint-order="stroke">SAUCER</text>'
    b += f'<text x="{mx + 110}" y="{GROUND - 280}" text-anchor="middle" font-family="Bungee, sans-serif" font-size="38" fill="{YELLOW}" stroke="{INK}" stroke-width="3" paint-order="stroke">MOTEL</text>'
    b += f'<path d="M{mx + 250},{GROUND - 370} l40,-60 l10,40 l40,-50" fill="none" stroke="{YELLOW}" stroke-width="10" stroke-linecap="round"/>'
    b += checker_road(W, H, GROUND + 80, LIME, INK)
    b += scooter(360, 815, .75, deck=LIME, wheel=PINK)
    return svg(W, H, b)


# ------------------------------------------------------------ home hero
def home_hero():
    """Homepage hero, composed around the overlaid content.

    The site nav sits on the top band and the headline, subheading and CTA on
    the left ~60%, so both stay calm and dark (light text on dark sky). All of
    the characters live on the right, where the sun is setting. 3:2 to match
    the 2400x1600 crop the Hero block requests.
    """
    w, h = 2400, 1600
    ground = 1290
    sx, sy = 1990, ground - 170  # setting sun, its base sinking into the road
    b = ('<defs>'
         '<linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1">'
         '<stop offset="0" stop-color="#1E1838"/><stop offset=".45" stop-color="#4A2470"/>'
         '<stop offset=".72" stop-color="#B8327E"/><stop offset="1" stop-color="#FF8A5C"/></linearGradient>'
         f'<radialGradient id="glow" cx="{sx / w}" cy="{sy / h}" r=".55">'
         '<stop offset="0" stop-color="#FFD66B" stop-opacity=".9"/><stop offset=".35" stop-color="#FF6FA8" stop-opacity=".45"/>'
         '<stop offset="1" stop-color="#FF6FA8" stop-opacity="0"/></radialGradient>'
         '<linearGradient id="calm" x1="0" y1="0" x2="1" y2="0">'
         '<stop offset="0" stop-color="#1E1838" stop-opacity=".75"/><stop offset=".5" stop-color="#1E1838" stop-opacity=".35"/>'
         '<stop offset=".68" stop-color="#1E1838" stop-opacity="0"/></linearGradient>'
         '<linearGradient id="navband" x1="0" y1="0" x2="0" y2="1">'
         '<stop offset="0" stop-color="#1E1838" stop-opacity=".7"/><stop offset="1" stop-color="#1E1838" stop-opacity="0"/></linearGradient>'
         '</defs>')
    b += f'<rect width="{w}" height="{h}" fill="url(#dusk)"/>'
    b += f'<rect width="{w}" height="{h}" fill="url(#glow)"/>'
    # rays fan out from the sun, faint so they read as texture, not detail
    b += f'<g opacity=".22">{sunburst(sx, sy, 1500, 30, "none", "#FFE08A", .6)}</g>'
    # a few stars high in the dark sky, below the nav band
    random.seed(11)
    for _ in range(26):
        x, y = random.randint(80, 2320), random.randint(260, 640)
        b += f'<circle cx="{x}" cy="{y}" r="{random.choice([3, 4, 5])}" fill="#FFF6C2" opacity="{random.choice([.5, .7, .9])}"/>'
    b += sun(sx, sy, 250, face=True)
    # distant hills: low-contrast silhouettes carry the horizon under the copy
    b += (f'<path d="M0,{ground} L0,{ground - 90} Q260,{ground - 190} 560,{ground - 110} Q820,{ground - 40} 1100,{ground - 130} '
          f'Q1330,{ground - 200} 1560,{ground - 90} L1560,{ground} Z" fill="#35205A" stroke="{INK}" stroke-width="{SW}"/>')
    # landmark parade, all right of the copy column
    # cake tower (Niagara Honeymoon Heights)
    cx_, y = 1330, ground
    for w_, h_, c in [(220, 80, PINK_L), (170, 70, CREAM), (125, 60, TEAL_L), (82, 50, YELLOW)]:
        y -= h_
        b += f'<rect x="{cx_ - w_ / 2}" y="{y}" width="{w_}" height="{h_}" rx="10" {o(c)}/>'
    b += f'<rect x="{cx_ - 7}" y="{y - 60}" width="14" height="60" {o(TEAL)}/><path d="M{cx_},{y - 100} q-16,20 0,38 q16,-18 0,-38 Z" {o(ORANGE)}/>'
    # palms (Bora Bora Bungalow Bay)
    b += palm(2290, ground, 1.45, -34) + palm(2120, ground, 1.05, 22)
    # saucer with tractor beam (Roswell Saucer Speedway)
    b += f'<path d="M1990,610 L1900,860 L2120,860 L2050,610 Z" fill="#E8FF8A" opacity=".28"/>'
    b += f'<ellipse cx="2020" cy="560" rx="80" ry="62" {o(TEAL_L)}/><ellipse cx="2020" cy="585" rx="195" ry="48" {o("#C9CCD8")}/>'
    b += ''.join(f'<circle cx="{1885 + k * 54}" cy="590" r="11" {o([YELLOW, PINK_L, LIME][k % 3])}/>' for k in range(6))
    # dino peeking in (Dino Detour)
    dx = 1500
    b += (f'<path d="M{dx},{ground} Q{dx + 20},{ground - 130} {dx + 150},{ground - 130} Q{dx + 250},{ground - 130} {dx + 280},{ground - 45} '
          f'Q{dx + 350},{ground - 30} {dx + 400},{ground - 8} Q{dx + 320},{ground - 2} {dx + 290},{ground} Z" {o(LIME)}/>'
          f'<path d="M{dx + 40},{ground - 90} Q{dx - 30},{ground - 240} {dx - 10},{ground - 330} Q{dx + 20},{ground - 362} {dx + 52},{ground - 335} '
          f'Q{dx + 30},{ground - 250} {dx + 110},{ground - 120}" {o(LIME)}/><circle cx="{dx + 8}" cy="{ground - 333}" r="8" fill="{INK}"/>')
    # sparse confetti, right side only
    random.seed(21)
    cols = [PINK_L, YELLOW, TEAL_L, LIME]
    for _ in range(34):
        x, y = random.randint(1450, 2380), random.randint(250, 1000)
        rot = random.randint(0, 180)
        b += f'<rect x="{x}" y="{y}" width="20" height="9" rx="3" fill="{random.choice(cols)}" transform="rotate({rot} {x} {y})"/>'
    # muted checker road: texture under the CTA without competing with it
    b += checker_road(w, h, ground, '#2A2150', '#4B3A7A', rows=3, cols=26)
    b += scooter(2250, ground + 95, 1.0)
    # keep the copy column and nav band calm
    b += f'<rect width="{w}" height="{h}" fill="url(#calm)"/>'
    b += f'<rect width="{w}" height="260" fill="url(#navband)"/>'
    return svg(w, h, b)


# ------------------------------------------------------------- products
P = 1200


def product_bg(c1, c2):
    return f'<rect width="{P}" height="{P}" fill="{c1}"/>' + sunburst(P / 2, P / 2, P, 24, 'none', c2, .45) + f'<circle cx="{P / 2}" cy="{P / 2}" r="430" fill="{CREAM}" stroke="{INK}" stroke-width="{SW * 1.5}"/>'


def product_cruiser():
    b = product_bg('#FFB3D6', '#FFFFFF')
    b += f'<ellipse cx="600" cy="905" rx="340" ry="30" fill="{INK}" opacity=".15"/>'
    b += scooter(800, 830, 1.6)
    return svg(P, P, b)


def product_kickstand():
    b = product_bg('#9FE7E7', '#FFFFFF')
    s_, fx, fy = 1.3, 800, 770
    rear = fx - 250 * s_
    wheel_y = fy + 30 * s_
    b += f'<ellipse cx="600" cy="930" rx="360" ry="26" fill="{INK}" opacity=".15"/>'
    # base plate
    b += f'<rect x="{rear - 150}" y="880" width="{fx - rear + 300}" height="44" rx="22" {o(TEAL)}/>'
    # rear roller drum under the rear wheel
    b += f'<rect x="{rear - 80}" y="{wheel_y + 40}" width="160" height="60" rx="30" {o("#C9CCD8")}/>'
    b += ''.join(f'<path d="M{rear - 50 + k * 25},{wheel_y + 48} v44" stroke="{INK}" stroke-width="4"/>' for k in range(5))
    # front wheel cradle
    b += f'<path d="M{fx - 80},{wheel_y + 20} L{fx - 60},880 L{fx + 60},880 L{fx + 80},{wheel_y + 20} Q{fx},{wheel_y + 90} {fx - 80},{wheel_y + 20} Z" {o(PINK)}/>'
    # console
    b += f'<rect x="{(rear + fx) / 2 - 70}" y="890" width="140" height="26" rx="8" {o(YELLOW)}/>'
    b += scooter(fx, fy, s_, deck=TEAL, wheel=PINK, streamers=False)
    return svg(P, P, b)


def product_buttons():
    b = product_bg('#FFE58A', '#FFFFFF')
    b += f'<path d="M260,560 L940,560" stroke="{INK}" stroke-width="56" stroke-linecap="round"/><path d="M260,560 L940,560" stroke="#D9D9E3" stroke-width="36" stroke-linecap="round"/>'
    for cx_, col, lab in ((380, PINK, 'A'), (820, TEAL, 'B')):
        b += f'<rect x="{cx_ - 120}" y="470" width="240" height="190" rx="70" {o(col)}/>'
        b += f'<circle cx="{cx_}" cy="545" r="52" {o(YELLOW)}/>'
        b += f'<text x="{cx_}" y="565" text-anchor="middle" font-family="Bungee, sans-serif" font-size="54" fill="{INK}">{lab}</text>'
        b += ''.join(f'<circle cx="{cx_ - 60 + k * 60}" cy="625" r="14" {o(CREAM)}/>' for k in range(3))
    # bulb horn
    b += f'<path d="M600,500 L600,400" stroke="{INK}" stroke-width="30" stroke-linecap="round"/><path d="M600,500 L600,400" stroke="#E6E6EE" stroke-width="16" stroke-linecap="round"/>'
    b += f'<path d="M540,400 L660,400 L700,300 L500,300 Z" {o(ORANGE)}/>'
    b += f'<circle cx="600" cy="250" r="70" {o("#E0262D")}/>'
    b += f'<text x="600" y="820" text-anchor="middle" font-family="Bungee, sans-serif" font-size="64" fill="{PINK}" stroke="{INK}" stroke-width="4" paint-order="stroke">HONK! HONK!</text>'
    return svg(P, P, b)


SCENES = {
    'world-bora-bora-bungalow-bay': bora_bora,
    'world-alamo-rama': alamo,
    'world-dino-detour': dino,
    'world-niagara-honeymoon-heights': niagara,
    'world-petit-paree': paree,
    'world-roswell-saucer-speedway': roswell,
    'home-hero': home_hero,
    'product-cruiser-deluxe': product_cruiser,
    'product-kick-stand': product_kickstand,
    'product-honk-honk-buttons': product_buttons,
}


# ------------------------------------------------------------ campaigns
def luau_week():
    """Luau Week key art: sunset lagoon, tiki torches, lei garland, sign."""
    b = sky(W, H, '#FF5A36', '#FFC46B', '#FFE08A', 800, 620)
    b += sun(800, 560, 170, '#FFD21F', face=False)
    for i, y in enumerate(range(520, 700, 34)):
        b += f'<rect x="{600 + i * 20}" y="{y}" width="{400 - i * 40}" height="10" rx="5" fill="#FFB36B" opacity=".7"/>'
    b += f'<rect x="0" y="{GROUND - 60}" width="{W}" height="140" {o("#0B7A7C")}/>'
    for i in range(7):
        b += f'<path d="M{60 + i * 240},{GROUND - 10} q30,-18 60,0 q30,18 60,0" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" opacity=".7"/>'
    b += palm(140, GROUND - 40, 1.2, 40) + palm(1560, GROUND - 40, 1.1, -50)
    # tiki torches
    for tx in (380, 1440):
        b += f'<rect x="{tx - 10}" y="{GROUND - 260}" width="20" height="260" {o("#8A5A2B")}/>'
        b += f'<rect x="{tx - 24}" y="{GROUND - 300}" width="48" height="50" rx="8" {o("#B0763A")}/>'
        b += f'<path d="M{tx},{GROUND - 400} q-34,40 -14,92 h28 q20,-52 -14,-92 Z" {o(ORANGE)}/>'
        b += f'<path d="M{tx},{GROUND - 360} q-14,20 -6,50 h12 q8,-30 -6,-50 Z" fill="{YELLOW}"/>'
    # lei garland across the top
    for i in range(34):
        x = i * 50; y = 40 + 90 * math.sin(math.pi * i / 33)
        b += f'<circle cx="{x}" cy="{y:.0f}" r="22" {o([PINK_L, YELLOW, "#FF5A36", PURPLE][i % 4])}/>'
    # sign
    b += f'<g transform="rotate(-4 1110 380)"><rect x="830" y="300" width="560" height="160" rx="30" {o("#0B3B3F")}/>'
    b += f'<text x="1110" y="405" text-anchor="middle" font-family="Bungee, sans-serif" font-size="78" fill="{YELLOW}" stroke="{INK}" stroke-width="4" paint-order="stroke">LUAU WEEK</text></g>'
    b += confetti(W, 600, 60, 31)
    b += checker_road(W, H, GROUND + 80, '#FF5A36', CREAM)
    b += scooter(1000, 815, .75, deck='#FF5A36', wheel=TEAL)
    return svg(W, H, b)


def saucer_season():
    """Saucer Season key art: neon night, a fleet of saucers, sign."""
    b = sky(W, H, '#0D0826', '#3B1C8C', '#7CC21E', 800, 1200)
    b += stars(W, H, 140, 9)
    b += f'<path d="M0,{GROUND + 80} L0,540 L300,540 L360,620 L560,620 L620,{GROUND + 80} Z" {o("#2A1666")}/>'
    b += f'<path d="M1040,{GROUND + 80} L1100,580 L1600,580 L1600,{GROUND + 80} Z" {o("#2A1666")}/>'
    for sx, sy, sc, beam in ((560, 130, .55, False), (1110, 250, 1.0, True), (1470, 110, .6, False)):
        g = f'<g transform="translate({sx},{sy}) scale({sc})">'
        if beam:
            g += f'<path d="M-90,40 L-300,{(GROUND + 80 - sy) / sc} L300,{(GROUND + 80 - sy) / sc} L90,40 Z" fill="{LIME}" opacity=".3"/>'
        g += f'<ellipse cx="0" cy="0" rx="100" ry="80" {o(TEAL_L)}/><ellipse cx="0" cy="30" rx="240" ry="60" {o("#C9CCD8")}/>'
        g += ''.join(f'<circle cx="{-180 + k * 60}" cy="36" r="14" {o([LIME, PINK_L, YELLOW][k % 3])}/>' for k in range(7))
        g += '</g>'
        b += g
    b += f'<g transform="rotate(3 1180 560)"><rect x="860" y="480" width="640" height="160" rx="30" {o(INK)}/>'
    b += f'<text x="1180" y="585" text-anchor="middle" font-family="Bungee, sans-serif" font-size="70" fill="{LIME}" stroke="{PINK}" stroke-width="3" paint-order="stroke">SAUCER SEASON</text></g>'
    b += checker_road(W, H, GROUND + 80, LIME, INK)
    b += scooter(1300, 815, .75, deck=LIME, wheel=PINK)
    return svg(W, H, b)


def lockup(label, fill, stroke, accent):
    """Transparent nav lockup (880x224, shown at 220x56): wordmark + campaign tag."""
    w, h = 880, 224
    b = f'<text x="16" y="104" font-family="Bungee, sans-serif" font-size="80" fill="{fill}" stroke="{stroke}" stroke-width="8" paint-order="stroke" letter-spacing="1">SCOOTORAMA</text>'
    b += f'<g transform="rotate(-5 600 170)"><rect x="330" y="124" width="520" height="84" rx="22" fill="{accent}" stroke="{stroke}" stroke-width="7"/>'
    b += f'<text x="590" y="184" text-anchor="middle" font-family="Bungee, sans-serif" font-size="46" fill="{stroke}">{label}</text></g>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">{b}</svg>'


SCENES.update({
    'campaign-luau-week': luau_week,
    'campaign-saucer-season': saucer_season,
    'lockup-luau-week': lambda: lockup('LUAU WEEK', '#FFFBF0', INK, YELLOW),
    'lockup-saucer-season': lambda: lockup('SAUCER SEASON', '#FFFBF0', INK, LIME),
})

if __name__ == '__main__':
    for name, fn in SCENES.items():
        with open(os.path.join(OUT, f'{name}.svg'), 'w') as fh:
            fh.write(fn())
    print(f'wrote {len(SCENES)} SVGs to {OUT}')
