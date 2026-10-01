#!/usr/bin/env python3
"""
Génère les images de partage de la page d'accueil (public/og.png, og-en.png et og-de.png).

    python3 scripts/og.py

Nécessite Pillow (pip install pillow). À relancer si la liste des apps change.
Les icônes sont lues dans public/appstore/<id>/icon.png et public/images/apps/.
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / 'node_modules/@fontsource-variable'
W, H = 1200, 630

ICONS = [
    ROOT / 'public/appstore/6754793003/icon.png',  # Skyjo Keeper
    ROOT / 'public/appstore/6760317673/icon.png',  # Flip
    ROOT / 'public/appstore/6745412690/icon.png',  # Jogr
    ROOT / 'public/appstore/6762646444/icon.png',  # Budgy
    ROOT / 'public/images/apps/lumi/icon.png',  # Lumi
]

TEXTS = {
    'og.png': ('Des apps iPhone simples,', 'pour les moments qui comptent.', 'Développeur iOS'),
    'og-en.png': ('Simple iPhone apps', 'for the moments that count.', 'iOS developer'),
    'og-de.png': ('Einfache iPhone-Apps', 'für die Momente, die zählen.', 'iOS-Entwickler'),
}


def font(name: str, size: int, weight: int) -> ImageFont.FreeTypeFont:
    face = ImageFont.truetype(str(FONTS / name), size)
    face.set_variation_by_axes([weight])
    return face


def rounded(image: Image.Image, size: int, ratio: float = 0.225) -> Image.Image:
    image = image.convert('RGBA').resize((size, size), Image.LANCZOS)
    mask = Image.new('L', (size * 4, size * 4), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, size * 4 - 1, size * 4 - 1], radius=int(size * 4 * ratio), fill=255)
    image.putalpha(mask.resize((size, size), Image.LANCZOS))
    return image


def gradient(size: tuple[int, int], stops: list[tuple[int, int, int]]) -> Image.Image:
    width, height = size
    strip = Image.new('RGB', (width, 1))
    for x in range(width):
        t = x / max(width - 1, 1) * (len(stops) - 1)
        i = min(int(t), len(stops) - 2)
        f = t - i
        a, b = stops[i], stops[i + 1]
        strip.putpixel((x, 0), tuple(round(a[c] + (b[c] - a[c]) * f) for c in range(3)))
    return strip.resize((width, height))


def background() -> Image.Image:
    base = Image.new('RGB', (W, H), (7, 7, 11))
    glow = Image.new('RGB', (W, H), (0, 0, 0))
    draw = ImageDraw.Draw(glow)
    for (x, y, r, color) in [
        (160, -60, 360, (139, 92, 246)),
        (1080, -40, 340, (28, 195, 196)),
        (620, 700, 380, (43, 150, 245)),
        (1180, 640, 260, (47, 207, 134)),
    ]:
        draw.ellipse([x - r, y - r, x + r, y + r], fill=color)
    glow = glow.filter(ImageFilter.GaussianBlur(150))
    return Image.blend(base, glow, 0.55)


def render(filename: str, line1: str, line2: str, role: str) -> None:
    canvas = background().convert('RGBA')
    draw = ImageDraw.Draw(canvas)

    # Monogramme + nom
    mark = rounded(Image.open(ROOT / 'public/apple-touch-icon.png'), 72, 0.3)
    canvas.alpha_composite(mark, (72, 64))
    draw.text((164, 70), 'Benjamin Blériot', font=font('nunito/files/nunito-latin-wght-normal.woff2', 36, 850), fill=(245, 245, 247))
    draw.text((164, 112), role, font=font('inter/files/inter-latin-wght-normal.woff2', 22, 450), fill=(170, 170, 182))

    # Titre
    title = font('nunito/files/nunito-latin-wght-normal.woff2', 66, 900)
    draw.text((72, 206), line1, font=title, fill=(245, 245, 247))
    box = draw.textbbox((0, 0), line2, font=title)
    mask = Image.new('L', (box[2] + 8, box[3] + 16), 0)
    ImageDraw.Draw(mask).text((0, 0), line2, font=title, fill=255)
    colors = gradient(mask.size, [(139, 92, 246), (43, 150, 245), (28, 195, 196), (47, 207, 134)])
    canvas.paste(colors, (72, 288), mask)

    # Icônes des apps, posées sur une barre de verre
    size, gap = 96, 22
    total = len(ICONS) * size + (len(ICONS) - 1) * gap
    x0, y0 = 72, 430
    shelf = Image.new('RGBA', (total + 44, size + 44), (0, 0, 0, 0))
    ImageDraw.Draw(shelf).rounded_rectangle([0, 0, shelf.width - 1, shelf.height - 1], radius=40, fill=(255, 255, 255, 22), outline=(255, 255, 255, 40), width=2)
    canvas.alpha_composite(shelf, (x0 - 22, y0 - 22))
    for index, path in enumerate(ICONS):
        icon = rounded(Image.open(path), size)
        shadow = Image.new('RGBA', (size + 40, size + 40), (0, 0, 0, 0))
        ImageDraw.Draw(shadow).rounded_rectangle([20, 28, size + 20, size + 28], radius=int(size * 0.225), fill=(0, 0, 0, 120))
        shadow = shadow.filter(ImageFilter.GaussianBlur(10))
        x = x0 + index * (size + gap)
        canvas.alpha_composite(shadow, (x - 20, y0 - 20))
        canvas.alpha_composite(icon, (x, y0))

    canvas.convert('RGB').save(ROOT / 'public' / filename, optimize=True)
    print(f'✓ public/{filename}')


if __name__ == '__main__':
    for name, (first, second, role) in TEXTS.items():
        render(name, first, second, role)
