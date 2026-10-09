"""Crop the original photos in source-assets/ into src/assets/photos/ for Astro Image.

Run with: npm run images   (needs Python 3 + Pillow)
Astro Image (Sharp) handles resizing and AVIF/WebP at build time, so this only crops.
Crop boxes are (left, top, right, bottom) in source pixels.
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "source-assets"
OUT = ROOT / "src" / "assets" / "photos"
OUT.mkdir(parents=True, exist_ok=True)

JOBS = [
    # name, source, crop box or None
    ("hero-table", "images/food.jpg", None),
    ("dish-siomai", "images/food2.jpg", (481, 230, 973, 722)),
    ("dish-ube-pao", "images/food.jpg", (1034, 881, 1536, 1382)),
    ("dish-chili-dumplings", "images/food.jpg", (1049, 1561, 1536, 2048)),
    ("dish-sesame", "images/food.jpg", (241, 292, 937, 988)),
    ("dish-wonton-soup", "images/food2.jpg", (1024, 901, 1536, 1454)),
    ("place-corner", "place/place3.jpg", None),
    ("place-window", "place/place2.jpg", None),
    ("place-room", "place/place4.jpg", None),
    ("place-storefront", "place/place.jpg", None),
    ("place-table", "place/place2.jpg", (560, 820, 1536, 1800)),
    ("place-booths", "place/place4.jpg", (1413, 461, 2048, 1280)),
]


def main():
    for name, src, box in JOBS:
        im = ImageOps.exif_transpose(Image.open(SRC / src)).convert("RGB")
        if box:
            im = im.crop(box)
        dest = OUT / f"{name}.jpg"
        # No exif= argument, so EXIF (including any GPS data) is stripped.
        im.save(dest, "JPEG", quality=92, optimize=True)
        print(f"{dest.relative_to(ROOT)}  {im.width}x{im.height}")


if __name__ == "__main__":
    main()
