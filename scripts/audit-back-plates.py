#!/usr/bin/env python3
"""audit-back-plates.py — flag Plate II images that have plant content
outside the intended top-right inset.

Plate II (back) is supposed to be blank parchment with ONE small
inset in the top-right corner containing 2 tiny botanical details.
Everything else should be empty parchment so the app's HTML overlay
(Bloom Calendar, Foliage, Companions, Care Tips) reads cleanly on top.

Broken back plates have a big illustration painted onto the empty
area — usually a full second plant in the lower half. The app's
overlay ends up on top of it.

Method:
  1. Crop the ~14px walnut frame + small safety margin.
  2. Punch out the top-right inset region (upper 22% vertical, right
     30% horizontal).
  3. Count "ink" pixels (luminance < 190) in the remaining area.
     Anything above 3% is unusual for a proper blank back plate; 6%+
     definitely means an extra illustration.

Usage:
  python3 scripts/audit-back-plates.py          # scan all back plates
"""

import re
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PLATES = ROOT / "plates"

# Trim the walnut hairline frame + safe margin.
SIDE_PCT_TRIM = 0.04
TOP_PCT_TRIM  = 0.03
BOT_PCT_TRIM  = 0.03

# Rectangular carve-out for the legitimate inset (relative to the
# trimmed image).
INSET_TOP    = 0.00
INSET_BOTTOM = 0.22
INSET_LEFT   = 0.65
INSET_RIGHT  = 1.00

LUM_CUTOFF = 190

INK_WARN  = 0.03
INK_ALERT = 0.06


def analyse(path: Path):
    with Image.open(path) as im:
        im = im.convert("RGB")
        w, h = im.size
        left  = int(w * SIDE_PCT_TRIM)
        right = int(w * (1 - SIDE_PCT_TRIM))
        top   = int(h * TOP_PCT_TRIM)
        bot   = int(h * (1 - BOT_PCT_TRIM))
        body  = im.crop((left, top, right, bot))
        bw, bh = body.size
        px = body.load()

        it = int(bh * INSET_TOP)
        ib = int(bh * INSET_BOTTOM)
        il = int(bw * INSET_LEFT)
        ir = int(bw * INSET_RIGHT)

        ink = 0
        counted = 0
        for y in range(bh):
            for x in range(bw):
                if it <= y < ib and il <= x < ir:
                    continue  # skip the inset region
                counted += 1
                r, g, b = px[x, y]
                lum = (r * 299 + g * 587 + b * 114) // 1000
                if lum < LUM_CUTOFF:
                    ink += 1
        return ink / counted if counted else 0.0


def pretty(stem: str) -> str:
    stem = re.sub(r"-back$", "", stem)
    parts = stem.split("-", 1)
    if len(parts) == 2 and parts[0].isdigit():
        stem = parts[1]
    return " ".join(w.capitalize() for w in stem.split("-"))


def main():
    fronts = sorted(PLATES.glob("*-back.webp"))
    results = []
    for i, p in enumerate(fronts, 1):
        try:
            frac = analyse(p)
        except Exception as e:
            print(f"[{i:3d}/{len(fronts)}] {p.name:60s} ERROR: {e}", file=sys.stderr)
            continue
        results.append((frac, p))
        print(f"[{i:3d}/{len(fronts)}] {p.name:60s} {frac*100:5.1f}% ink outside inset", file=sys.stderr)

    results.sort(reverse=True)

    print("\n" + "=" * 78)
    print("PLATE II PLATES WITH STRAY CONTENT OUTSIDE THE TOP-RIGHT INSET")
    print("=" * 78)
    print(f"{'Ink %':>6}  {'File':50s}  Flag  Plant")
    print("-" * 78)
    warn = alert = 0
    for frac, p in results:
        if frac < INK_WARN:
            continue
        flag = "🔴 ALERT" if frac >= INK_ALERT else "🟡 warn"
        if frac >= INK_ALERT: alert += 1
        else: warn += 1
        print(f"{frac*100:5.1f}%  {p.stem:50s}  {flag}  {pretty(p.stem)}")
    print("-" * 78)
    print(f"{alert} alert, {warn} warn, {len(results) - alert - warn} clean")


if __name__ == "__main__":
    main()
