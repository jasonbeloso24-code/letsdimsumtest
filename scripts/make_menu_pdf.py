"""Build the downloadable menu PDF from the two printed menu boards.

Run with: python scripts/make_menu_pdf.py   (needs Python 3 + Pillow)
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
pages = [Image.open(ROOT / "source-assets/branding" / n).convert("RGB") for n in ("menu.jpg", "menu2.jpg")]
dest = ROOT / "public/menu/lets-dimsum-menu.pdf"
dest.parent.mkdir(parents=True, exist_ok=True)
pages[0].save(dest, "PDF", save_all=True, append_images=pages[1:], resolution=150, title="Let's Dimsum menu")
print(dest.relative_to(ROOT), dest.stat().st_size // 1024, "KB")
