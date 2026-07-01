# Plate generator scripts

Two-phase pipeline for adding vintage botanical plate art to plants that
already exist in the `PLANTS` array of `index.html`.

## Files

    scripts/
    ├── generate-images.mjs    Phase 1: DALL-E 3 → PNG → WEBP → plates/
    ├── link-plates.mjs        Phase 2: wire images into PLANTS entries
    ├── build-seed-list.mjs    Convert my-garden CSV → plants-to-generate.txt
    ├── prompts/
    │   ├── front.txt          Prompt for the plant-portrait image (Plate I)
    │   └── back.txt           Prompt for the empty page + top-right inset (Plate II bg)
    ├── package.json           Deps: openai, sharp
    └── README.md

At the repo root:

    plants-to-generate.txt     One plant per line: "<Botanical> (<Common>)"
    .openai/api-key            Your OpenAI API key (chmod 600)

## One-time setup

    cd scripts
    npm install

## Phase 1 — generate images

Preview cost + count without hitting the API:

    node scripts/generate-images.mjs --dry-run

Single-plant test (recommended first run):

    node scripts/generate-images.mjs --only "Bleeding Heart"

Full run — batches of 5 plants (10 images), asks to continue after each batch:

    node scripts/generate-images.mjs

Quality flags:
- `--hd` (default) — DALL-E 3 HD, ~$0.24/plant
- `--standard` — cheaper, ~$0.16/plant

Skips plants whose plate files already exist, so it's safe to re-run.

## Phase 2 — link images into PLANTS

After reviewing images in Finder (`plates/`), wire them into PLANTS entries:

    node scripts/link-plates.mjs --dry-run     # preview changes
    node scripts/link-plates.mjs               # write index.html + bump sw.js
    node scripts/link-plates.mjs --commit      # + git add/commit/push

Sets `plateImage`, `plateBack`, `plateNo`, and `plates: ["habit","particulars","seasons","companions","journal"]` on each matched entry.

## Regenerating the seed list

If your `my-garden-YYYY-MM-DD.csv` export changes:

    node scripts/build-seed-list.mjs my-garden-2026-07-01.csv
