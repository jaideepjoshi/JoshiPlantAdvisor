#!/usr/bin/env python3
"""audit-plates.py — flag Plate I images where the plant illustration
runs into the label overlay area (bottom ~22% of the plate).

Plate I overlays these rows in this vertical range:
  bottom 3.5% – 25%   flags → stats → pollinators → name
So we sample the bottom ~22-25% of each *-front.webp, count "ink"
pixels (anything meaningfully darker/more saturated than the aged
parchment), and report the ones that have too much ink in that band.

Also crops the 14px dark-walnut hairline frame + a small parchment
margin before analysis, so the frame itself doesn't count as ink.
"""

import re
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PLATES = ROOT / "plates"

# Vertical band to inspect: from `TOP_PCT` from the bottom up to `BOT_PCT`
# from the bottom. This roughly matches the label stack.
LABEL_TOP_PCT = 0.12    # bottom 12% (name overlay sits at bottom:14%, so
                        # anything from 12% up is where the script name
                        # renders — the most visually sensitive part)
LABEL_BOT_PCT = 0.26    # up to 26% from the bottom (top of the label block)

# Horizontal margin — exclude the outer 8% on each side (frame + safety).
SIDE_PCT = 0.08

# Parchment is warm cream around (240, 226, 197): luminance ≈ 226, chroma ≈ 43.
# Foxing spots and light aging can dip to lum ~200. Plant ink (greens, browns,
# saturated flower colors) sits well below that. Use luminance only — chroma
# is unreliable because the parchment itself has warm chroma.
LUM_CUTOFF = 190            # pixels darker than this count as plant ink

# Report anything above this fraction as a problem plate.
INK_WARN = 0.10             # 10% of the band is ink → text will read poorly
INK_ALERT = 0.20            # 20%+ is definitely scrambled


def analyse(path: Path):
    with Image.open(path) as im:
        im = im.convert("RGB")
        w, h = im.size
        # Crop to the label band, sides trimmed.
        left = int(w * SIDE_PCT)
        right = int(w * (1 - SIDE_PCT))
        top = h - int(h * LABEL_BOT_PCT)
        bot = h - int(h * LABEL_TOP_PCT)
        band = im.crop((left, top, right, bot))
        px = band.load()
        bw, bh = band.size
        total = bw * bh
        if total == 0:
            return 0.0
        ink = 0
        for y in range(bh):
            for x in range(bw):
                r, g, b = px[x, y]
                lum = (r * 299 + g * 587 + b * 114) // 1000
                if lum < LUM_CUTOFF:
                    ink += 1
        return ink / total


def slug_pretty(name: str) -> str:
    """Turn '028-liatris-blazing-star-front' into 'Liatris Blazing Star'."""
    name = re.sub(r"-front$", "", name)
    parts = name.split("-", 1)
    if len(parts) == 2 and parts[0].isdigit():
        name = parts[1]
    return " ".join(w.capitalize() for w in name.split("-"))


def main():
    fronts = sorted(PLATES.glob("*-front.webp"))
    results = []
    for i, p in enumerate(fronts, 1):
        frac = analyse(p)
        results.append((frac, p))
        # progress
        print(f"[{i:3d}/{len(fronts)}] {p.name:60s} {frac*100:5.1f}% ink", file=sys.stderr)

    results.sort(reverse=True)

    print("\n" + "=" * 76)
    print("PLATES WITH INK IN THE LABEL BAND (worst first)")
    print("=" * 76)
    print(f"{'Ink %':>6}  {'File':50s}  Flag")
    print("-" * 76)
    for frac, p in results:
        if frac < INK_WARN:
            continue
        flag = "🔴 ALERT" if frac >= INK_ALERT else "🟡 warn"
        stem = p.stem
        pretty = slug_pretty(stem)
        print(f"{frac*100:5.1f}%  {stem:50s}  {flag}  {pretty}")

    warn = sum(1 for f, _ in results if f >= INK_WARN)
    alert = sum(1 for f, _ in results if f >= INK_ALERT)
    print("-" * 76)
    print(f"{alert} alert, {warn - alert} warn, {len(results) - warn} clean")

    # Full top-20 for context, so we can see the runners-up.
    print("\nTOP 20 (all plates, worst-to-best):")
    for frac, p in results[:20]:
        print(f"  {frac*100:5.1f}%  {p.stem}")

    # Distribution histogram
    print("\nDistribution:")
    buckets = [0.0, 0.02, 0.04, 0.06, 0.08, 0.10, 0.15, 0.20, 1.0]
    for lo, hi in zip(buckets, buckets[1:]):
        n = sum(1 for f, _ in results if lo <= f < hi)
        bar = "▓" * n
        print(f"  {lo*100:4.1f}% – {hi*100:5.1f}%  {n:3d}  {bar}")


if __name__ == "__main__":
    main()
