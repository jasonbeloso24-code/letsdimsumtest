"""Trim the Fontsource variable fonts to the axes the design actually uses.

Run with: python scripts/subset_fonts.py   (needs: pip install fonttools brotli)
Fraunces: SOFT pinned to 100 and WONK to 0 (every use sets them), weight limited to 300-400, opsz kept.
Figtree: weight limited to 400-600. Glyph coverage (latin / latin-ext) is unchanged.
Outputs go to src/assets/fonts/ and are referenced from src/styles/fonts.css.
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "node_modules" / "@fontsource-variable"
OUT = ROOT / "src" / "assets" / "fonts"
OUT.mkdir(parents=True, exist_ok=True)

JOBS = [
    ("fraunces/files/fraunces-latin-full-normal.woff2", "fraunces-latin.woff2", {"SOFT": 100, "WONK": 0, "wght": (300, 400)}),
    ("fraunces/files/fraunces-latin-ext-full-normal.woff2", "fraunces-latin-ext.woff2", {"SOFT": 100, "WONK": 0, "wght": (300, 400)}),
    ("figtree/files/figtree-latin-wght-normal.woff2", "figtree-latin.woff2", {"wght": (400, 600)}),
    ("figtree/files/figtree-latin-ext-wght-normal.woff2", "figtree-latin-ext.woff2", {"wght": (400, 600)}),
]

for src, dest, axes in JOBS:
    font = instancer.instantiateVariableFont(TTFont(SRC / src), axes, updateFontNames=False)
    font.flavor = "woff2"
    font.save(OUT / dest)
    before, after = (SRC / src).stat().st_size, (OUT / dest).stat().st_size
    print(f"{dest}: {before // 1024} KB -> {after // 1024} KB")
