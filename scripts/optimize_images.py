"""Crop and convert the source photos in public/ to WebP in public/img/.

Run with: npm run images   (needs Python 3 + Pillow)
Crop boxes are (left, top, right, bottom) in source pixels.
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public"
OUT = SRC / "img"
OUT.mkdir(exist_ok=True)

JOBS = [
    # name, source, crop box or None, max width, quality
    ("hero-table", "images/food.jpg", None, 1400, 80),
    ("dish-siomai", "images/food2.jpg", (481, 230, 973, 722), 800, 82),
    ("dish-ube-pao", "images/food.jpg", (1034, 881, 1536, 1382), 800, 82),
    ("dish-chili-dumplings", "images/food.jpg", (1049, 1561, 1536, 2048), 800, 82),
    ("dish-sesame", "images/food.jpg", (241, 292, 937, 988), 800, 82),
    ("dish-wonton-soup", "images/food2.jpg", (1024, 901, 1536, 1454), 900, 82),
    ("place-corner", "place/place3.jpg", None, 1000, 78),
    ("place-window", "place/place2.jpg", None, 1000, 78),
    ("place-room", "place/place4.jpg", None, 1600, 78),
    ("place-storefront", "place/place.jpg", None, 1600, 78),
    ("place-table", "place/place2.jpg", (560, 820, 1536, 1800), 1000, 78),
    ("place-booths", "place/place4.jpg", (1413, 461, 2048, 1280), 1000, 78),
]


def main():
    for name, src, box, max_w, q in JOBS:
        im = ImageOps.exif_transpose(Image.open(SRC / src)).convert("RGB")
        if box:
            im = im.crop(box)
        if im.width > max_w:
            im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
        dest = OUT / f"{name}.webp"
        im.save(dest, "WEBP", quality=q, method=6)
        print(f"{dest.relative_to(ROOT)}  {im.width}x{im.height}  {dest.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
