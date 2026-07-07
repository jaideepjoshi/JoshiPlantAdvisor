#!/usr/bin/env node
// generate-images.mjs
// Phase 1: for each plant in plants-to-generate.txt, produce two vintage
// botanical plate images (front + back-with-inset) via OpenAI gpt-image-1,
// save the original PNG under plates/png/ AND encode a quality-85 WEBP under
// plates/{padded-id}-{slug}-{front|back}.webp for the app.
//
// The plant must already exist in the PLANTS array inside index.html — the
// script reads that array to look up the plant's id, botanical, and common
// name. Plants whose plate images already exist are skipped (safe to re-run).
//
// Batches 5 plants at a time and prompts for y/n before starting the next
// batch, so you can preview freshly-generated images in Finder before spending
// more API credit.
//
// Usage:
//   node scripts/generate-images.mjs               # run through the whole list
//   node scripts/generate-images.mjs --only "Bleeding Heart"   # single plant test
//   node scripts/generate-images.mjs --first 1     # first uncompleted plant only
//   node scripts/generate-images.mjs --dry-run     # print what it would do, no API calls
//   node scripts/generate-images.mjs --hd          # high quality (~$0.50/plant)
//   node scripts/generate-images.mjs --medium      # default (~$0.13/plant)
//   node scripts/generate-images.mjs --low         # cheap draft (~$0.03/plant)
//
// gpt-image-1 pricing (1024x1536 portrait, 9:16-ish aspect):
//   low    = ~$0.016/image × 2 = ~$0.03 per plant
//   medium = ~$0.063/image × 2 = ~$0.13 per plant
//   high   = ~$0.25/image × 2  = ~$0.50 per plant

import fs from 'node:fs/promises';
import fss from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import OpenAI from 'openai';
import sharp from 'sharp';

const ROOT = path.resolve(new URL(import.meta.url).pathname, '../..');
const API_KEY_PATH = path.join(ROOT, '.openai/api-key');
const PROMPTS_DIR = path.join(ROOT, 'scripts/prompts');
const INPUT_PATH = path.join(ROOT, 'plants-to-generate.txt');
const PLATES_DIR = path.join(ROOT, 'plates');
const INDEX_HTML = path.join(ROOT, 'index.html');
const AUDIT_CACHE = path.join(ROOT, 'scripts/audit-accuracy.json');

const BATCH_SIZE = 5;

// Load the accuracy-audit cache once. It's an id-keyed dict of
// { brief, scores, ... }. We reuse the `brief` field so we don't pay
// gpt-4o-mini twice for the same plant.
let _auditCache = null;
async function loadAuditCache() {
  if (_auditCache !== null) return _auditCache;
  try { _auditCache = JSON.parse(await fs.readFile(AUDIT_CACHE, 'utf8')); }
  catch { _auditCache = {}; }
  return _auditCache;
}
async function saveAuditCache() {
  if (_auditCache) await fs.writeFile(AUDIT_CACHE, JSON.stringify(_auditCache, null, 2));
}

// Fetch a compact botanical fact-sheet for the plant. Cached in the same
// JSON file the accuracy auditor writes to, so the two scripts share data.
async function botanicalBrief(openai, plant) {
  const cache = await loadAuditCache();
  if (cache[plant.id]?.brief) return cache[plant.id].brief;
  const chat = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content:
`You write concise botanical fact-sheets for horticultural illustration reference.
Return ONLY compact JSON matching this shape (no markdown, no prose):
{
  "growth_habit": "one of: upright-clumping | mounding | groundcover-trailing | vine-climbing | shrub | tree | grass-tuft | rosette | bulb-emerging",
  "mature_height": "e.g. 3-6 in / 24-36 in / 4-6 ft",
  "leaf_shape": "e.g. rounded / ovate / lanceolate / linear-needle / palmately-lobed / pinnately-compound / heart-shaped / strap-like",
  "leaf_arrangement": "e.g. opposite / alternate / basal-rosette / whorled / clasping",
  "leaf_color": "e.g. medium green / silvery-gray / blue-green / variegated",
  "leaf_size": "e.g. tiny (<1cm) / small (1-3cm) / medium (3-8cm) / large (>8cm)",
  "flower_shape": "e.g. daisy-composite / bell / trumpet / spike / umbel / cross-4-petal / five-star",
  "flower_color": "e.g. deep purple / white / pale blue / bicolor pink-yellow",
  "distinctive_notes": "one sentence of visual identifiers a botanical artist should nail"
}` },
      { role: 'user', content: `${plant.name} — ${plant.botanical || 'unknown botanical'} — ${plant.type || 'unknown type'}` },
    ],
    temperature: 0.2,
    response_format: { type: 'json_object' },
  });
  const brief = JSON.parse(chat.choices[0].message.content);
  cache[plant.id] = { ...(cache[plant.id] || {}), id: plant.id, name: plant.name, botanical: plant.botanical, brief };
  await saveAuditCache();
  return brief;
}

// -----------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { only: null, first: null, dryRun: false, quality: 'medium', yes: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--only') args.only = argv[++i];
    else if (a === '--first') args.first = Number(argv[++i]);
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '--yes' || a === '-y') args.yes = true;
    else if (a === '--high' || a === '--hd') args.quality = 'high';
    else if (a === '--medium') args.quality = 'medium';
    else if (a === '--low' || a === '--standard') args.quality = 'low';
    else if (a === '--help' || a === '-h') { printHelp(); process.exit(0); }
    else console.warn(`ignoring unknown arg: ${a}`);
  }
  return args;
}

const COST_PER_PLANT = { low: 0.03, medium: 0.13, high: 0.50 };

function printHelp() {
  console.log(`
Usage:
  node scripts/generate-images.mjs [options]

Options:
  --only "<name>"    Process a single plant matched against seed list / PLANTS
  --first N          Process only the first N uncompleted plants
  --dry-run          Print the plan without calling the API
  --standard         Use standard quality (~$0.16/plant); default is HD (~$0.24/plant)
  --help             Show this message
`);
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function padId(id) {
  return String(id).padStart(3, '0');
}

// Load PLANTS array from index.html so we can look up id + botanical + name.
async function loadPlants() {
  const html = await fs.readFile(INDEX_HTML, 'utf8');
  const m = html.match(/const PLANTS = (\[[\s\S]*?\]);/);
  if (!m) throw new Error('PLANTS array not found in index.html');
  return eval(m[1]);
}

// Parse a seed-list line: "Botanical (Common)" → { botanical, common }.
function parseSeed(line) {
  const m = line.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
  if (!m) return { botanical: line.trim(), common: line.trim() };
  return { botanical: m[1].trim(), common: m[2].trim() };
}

// Fuzzy-match a seed entry against PLANTS by botanical, then by common name.
function matchPlant(seed, PLANTS) {
  const botKey = seed.botanical.toLowerCase();
  const comKey = seed.common.toLowerCase();
  const botGenus = botKey.split(/\s+/)[0];

  // Best-effort priority: exact botanical → botanical genus → common substring.
  return (
    PLANTS.find(p => (p.botanical || '').toLowerCase() === botKey) ||
    PLANTS.find(p => (p.botanical || '').toLowerCase().startsWith(botKey)) ||
    PLANTS.find(p => (p.botanical || '').toLowerCase().split(/\s+/)[0] === botGenus &&
                     (p.name || '').toLowerCase().includes(comKey)) ||
    PLANTS.find(p => (p.name || '').toLowerCase().includes(comKey)) ||
    PLANTS.find(p => (p.botanical || '').toLowerCase().split(/\s+/)[0] === botGenus)
  );
}

async function readInputList() {
  const raw = await fs.readFile(INPUT_PATH, 'utf8');
  return raw
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('#'));
}

// Two templates — front.txt (whole-plant portrait) and back.txt (empty page
// with a small square inset in the top-right). Loaded once and cached.
async function readPromptTemplates() {
  const [front, back] = await Promise.all([
    fs.readFile(path.join(PROMPTS_DIR, 'front.txt'), 'utf8'),
    fs.readFile(path.join(PROMPTS_DIR, 'back.txt'), 'utf8'),
  ]);
  return { front, back };
}

function askYesNo(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(question, ans => { rl.close(); resolve(ans.trim().toLowerCase()); });
  });
}

// -----------------------------------------------------------------------------

// Mimic ChatGPT web's silent prompt expansion. Sends the user-authored prompt
// to gpt-4o-mini (cheap, fast) with instructions to rewrite it into a more
// vivid, model-friendly description while preserving every constraint. This
// is the single biggest quality lift for image-generation from the API —
// without it, you're sending the raw prompt while ChatGPT web is sending a
// professionally-rewritten expansion under the hood.
async function expandPrompt(openai, promptText, seed, side, brief) {
  const systemMsg = `You are an art director rewriting botanical illustration prompts.
Take the user's prompt and rewrite it into a more vivid, specific image-generation prompt.

CRITICAL preservation rules — obey these exactly:
- If the original says "NO TEXT" or "no lettering", the rewrite must NOT introduce any text, labels, captions, scientific names, or descriptive paragraphs on the page. NEVER add a "title" or "scientific name label" section.
- If the original says "no closeups" or "no detail vignettes", the rewrite must NOT introduce any callouts, seed-pod diagrams, cross-sections, or inset details. NEVER add these even if botanical plates traditionally include them.
- Preserve the exact composition footprint the original specifies (which part of the page is filled, which is blank).
- Preserve the "Avoid" list — never contradict it.

BOTANICAL ACCURACY — obey the fact-sheet exactly:
- The GROWTH HABIT from the fact-sheet is not negotiable. If it says "groundcover-trailing" the plant must be low, spreading horizontally along the ground, NOT upright. If it says "vine-climbing" it must climb. If it says "shrub" it is woody and rounded. Depict what the fact-sheet says even if botanical plates traditionally show plants upright.
- LEAF SHAPE from the fact-sheet must be honoured — "rounded" means rounded, "linear-needle" means needle-like. Do not draw pointy lanceolate leaves for a plant whose leaves are described as rounded.
- LEAF ARRANGEMENT (opposite / alternate / basal-rosette / etc.) must match.
- FLOWER SHAPE and COLOR must match.

What TO add:
- Watercolor pigment behavior, paper texture nuances.
- Species-specific colouring and structural detail that anchors the fact-sheet.

Format:
- Keep the same overall structure and section headers as the original.
- Return ONLY the rewritten prompt. No explanation, no preamble.`;
  const briefBlock = brief ? `

FACT-SHEET FOR THIS PLANT — bind the rewrite to these:
${JSON.stringify(brief, null, 2)}` : '';

  // Habit-specific staging. gpt-image-2 tends to default to "single upright
  // plant portrait" regardless of what the prompt says — for vines and
  // groundcovers we have to spell out CONCRETE staging (what's it climbing
  // on, what angle we view from) or we get an upright shrub anyway.
  const habit = (brief?.growth_habit || '').toLowerCase();
  let stagingBlock = '';
  if (habit === 'vine-climbing') {
    stagingBlock = `

VINE-STAGING (must appear in the rewrite for the front image):
The plant is a CLIMBING VINE, not a standalone shrub. Depict it clearly
climbing / twining on a support: a slender wooden lattice trellis, a
thin garden stake, a bare weathered branch, or draped over a low stone
wall. The support is minimal — just enough to establish the vine's
climbing habit — and rendered in the same aged watercolor style. The
plant must show:
  • long twining stems that grasp the support with tendrils or leaf petioles
  • foliage trailing sideways off the support, not standing upright
  • the vine's characteristic reach — noticeably taller/longer than wide
Do NOT paint this as a compact free-standing bush.`;
  } else if (habit === 'groundcover-trailing') {
    stagingBlock = `

GROUNDCOVER-STAGING (must appear in the rewrite for the front image):
The plant is a LOW SPREADING MAT, not an upright plant. Depict it from
a slightly-elevated three-quarter angle showing:
  • a wide horizontal carpet of foliage hugging the ground plane
  • the plant spreading outward as a mat — noticeably wider than tall
  • stems creeping sideways and rooting where they touch soil
  • any flowers standing only a few inches above the leafy mat
Total plant height in the illustration should look like a soft cushion
of leaves, not a bushy upright specimen. Do NOT centre a tall plant on
the page — spread the foliage horizontally across the middle band.`;
  }

  const userMsg = `Rewrite this ${side === 'front' ? 'plant-portrait (single plant, blank page around it, no text, no closeups)' : 'empty-page-with-top-right-inset'} prompt for a "${seed.common} (${seed.botanical})" plate.${briefBlock}${stagingBlock}

--- ORIGINAL PROMPT ---
${promptText}
--- END ---`;
  const chat = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemMsg },
      { role: 'user', content: userMsg },
    ],
    temperature: 0.7,
  });
  return chat.choices[0].message.content.trim();
}

// Encode a raw PNG buffer to a plate WEBP with a framed book-page appearance:
//   Add a hairline dark-walnut band (14px) around ALL FOUR sides of the image.
//   The illustration content is untouched — the antique border stays fully
//   intact inside the dark walnut frame. Result: 1024+28 × 1792+28 = 1052 × 1820,
//   aspect ratio 0.578 (matches the plate CSS aspect below).
async function encodePlateWebp(pngBuffer, outWebp) {
  const dark = { r: 102, g: 73, b: 35, alpha: 1 };   // #664923 — dark walnut brown
  const band = 14;                                    // hairline band thickness
  await sharp(pngBuffer)
    .extend({ top: band, bottom: band, left: band, right: band, background: dark })
    .webp({ quality: 85 })
    .toFile(outWebp);
}

async function generateOneSide(openai, plant, seed, side, templates, opts) {
  const id = padId(plant.id);
  const slug = slugify(plant.name.replace(/[^\w\s-]/g, '').trim());
  const outWebp = path.join(PLATES_DIR, `${id}-${slug}-${side}.webp`);
  const outPng  = path.join(PLATES_DIR, 'png', `${id}-${slug}-${side}.png`);

  if (fss.existsSync(outWebp)) {
    return { plant: plant.name, side, status: 'skipped-exists', outPath: outWebp };
  }

  // If we already have the PNG archive from a previous run, re-encode the WEBP
  // (with padding) without spending another API credit.
  if (fss.existsSync(outPng)) {
    const pngBuffer = await fs.readFile(outPng);
    await encodePlateWebp(pngBuffer, outWebp);
    const stat = await fs.stat(outWebp);
    return { plant: plant.name, side, status: 'ok-reencoded', outPath: outWebp, bytes: stat.size };
  }

  const prompt = templates[side]
    .replaceAll('{{COMMON}}', seed.common)
    .replaceAll('{{LATIN}}', seed.botanical);

  if (opts.dryRun) {
    return { plant: plant.name, side, status: 'dry-run', outPath: outWebp, prompt: prompt.slice(0, 80) + '…' };
  }

  // ChatGPT web silently expands the user's prompt via GPT-4 before sending
  // it to the image model — that's why the same prompt produces richer output
  // in ChatGPT web than a raw API call. Replicate that pattern: expand first,
  // then render. We also pull a botanical fact-sheet for the plant so the
  // expansion is fact-anchored (habit / leaf shape / flower shape) instead
  // of leaning on the image model's guess about the species.
  const brief = await botanicalBrief(openai, plant);
  const expanded = await expandPrompt(openai, prompt, seed, side, brief);

  const response = await openai.images.generate({
    model: 'gpt-image-2',
    prompt: expanded,
    n: 1,
    size: '1024x1792',               // 4:7 = 0.571, very close to 9:16 = 0.5625
    quality: opts.quality,           // 'low' | 'medium' | 'high'
  });

  // gpt-image-2 always returns base64-encoded PNG bytes directly.
  const b64 = response.data[0].b64_json;
  if (!b64) throw new Error('OpenAI response missing b64_json');
  const pngBuffer = Buffer.from(b64, 'base64');

  // Save the original PNG as an archive under plates/png/ (so we can regenerate
  // WEBP variants later without another API call), then encode a padded WEBP.
  await fs.mkdir(path.dirname(outPng), { recursive: true });
  await fs.writeFile(outPng, pngBuffer);
  await encodePlateWebp(pngBuffer, outWebp);
  const stat = await fs.stat(outWebp);
  return { plant: plant.name, side, status: 'ok', outPath: outWebp, bytes: stat.size };
}

async function processPlant(openai, seed, PLANTS, templates, opts) {
  const plant = matchPlant(seed, PLANTS);
  if (!plant) {
    return [{ plant: seed.botanical, side: '-', status: 'no-plants-entry', warning: `no PLANTS entry for "${seed.botanical} (${seed.common})"` }];
  }
  const results = [];
  for (const side of ['front', 'back']) {
    try {
      results.push(await generateOneSide(openai, plant, seed, side, templates, opts));
    } catch (err) {
      results.push({ plant: plant.name, side, status: 'error', error: String(err.message || err) });
    }
  }
  return results;
}

function formatResultsRow(r) {
  const tag =
    r.status === 'ok' ? '✓' :
    r.status === 'ok-reencoded' ? '↻' :
    r.status === 'skipped-exists' ? '·' :
    r.status === 'dry-run' ? '?' :
    r.status === 'no-plants-entry' ? '⚠' :
    '✗';
  const detail =
    r.status === 'ok' ? `${(r.bytes/1024).toFixed(0)} KB → ${path.basename(r.outPath)}` :
    r.status === 'ok-reencoded' ? `${(r.bytes/1024).toFixed(0)} KB → ${path.basename(r.outPath)} (from cached PNG, no API call)` :
    r.status === 'skipped-exists' ? `already exists: ${path.basename(r.outPath)}` :
    r.status === 'dry-run' ? `would write ${path.basename(r.outPath)}` :
    r.status === 'no-plants-entry' ? r.warning :
    r.error || '';
  return `  ${tag} ${r.plant} (${r.side})  ${detail}`;
}

// -----------------------------------------------------------------------------

async function main() {
  const opts = parseArgs(process.argv);
  const apiKey = (await fs.readFile(API_KEY_PATH, 'utf8')).trim();
  const openai = new OpenAI({ apiKey });
  const templates = await readPromptTemplates();
  const PLANTS = await loadPlants();
  const rawList = await readInputList();

  let seeds = rawList.map(parseSeed);
  if (opts.only) {
    const q = opts.only.toLowerCase();
    seeds = seeds.filter(s =>
      s.botanical.toLowerCase().includes(q) || s.common.toLowerCase().includes(q)
    );
    if (!seeds.length) {
      console.log(`No seed matched --only "${opts.only}".`);
      process.exit(1);
    }
  } else {
    // Skip seeds whose plates already exist — so --first N always advances
    // through fresh work instead of counting already-completed plants.
    seeds = seeds.filter(seed => {
      const plant = matchPlant(seed, PLANTS);
      if (!plant) return true;   // surface as no-plants-entry warning
      const id = padId(plant.id);
      const slug = slugify(plant.name.replace(/[^\w\s-]/g, '').trim());
      const front = path.join(PLATES_DIR, `${id}-${slug}-front.webp`);
      const back  = path.join(PLATES_DIR, `${id}-${slug}-back.webp`);
      return !fss.existsSync(front) || !fss.existsSync(back);
    });
    if (opts.first) seeds = seeds.slice(0, opts.first);
  }

  console.log(`\nPipeline summary`);
  console.log(`  input list:     ${INPUT_PATH}`);
  console.log(`  plates dir:     ${PLATES_DIR}`);
  console.log(`  model:          gpt-image-2 (1024x1536, portrait) + gpt-4o-mini prompt expansion`);
  console.log(`  quality:        ${opts.quality}`);
  console.log(`  batch size:     ${BATCH_SIZE} plants (${BATCH_SIZE*2} images) per batch`);
  console.log(`  plants queued:  ${seeds.length}`);
  console.log(`  est. cost:      ~$${(seeds.length * COST_PER_PLANT[opts.quality]).toFixed(2)}\n`);

  if (!opts.dryRun && !opts.yes) {
    const ans = await askYesNo('Proceed? [y/N] ');
    if (ans !== 'y' && ans !== 'yes') { console.log('Aborted.'); return; }
  }

  const startTime = Date.now();
  const allResults = [];
  for (let bi = 0; bi < seeds.length; bi += BATCH_SIZE) {
    const batch = seeds.slice(bi, bi + BATCH_SIZE);
    const batchNum = Math.floor(bi / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(seeds.length / BATCH_SIZE);
    console.log(`\n── Batch ${batchNum}/${totalBatches} — ${batch.length} plant${batch.length===1?'':'s'} ──`);
    const batchResults = (await Promise.all(
      batch.map(seed => processPlant(openai, seed, PLANTS, templates, opts))
    )).flat();
    batchResults.forEach(r => console.log(formatResultsRow(r)));
    allResults.push(...batchResults);

    // Between-batch approval prompt (skipped on dry-run, --yes, or last batch).
    if (!opts.dryRun && !opts.yes && bi + BATCH_SIZE < seeds.length) {
      console.log(`\nPreview the images above in Finder (plates/), then choose:`);
      const ans = await askYesNo(`  Continue with batch ${batchNum + 1}? [y/N] `);
      if (ans !== 'y' && ans !== 'yes') {
        console.log(`Stopping after batch ${batchNum}. Re-run to continue — completed plants will be skipped.`);
        break;
      }
    }
  }

  const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
  const ok = allResults.filter(r => r.status === 'ok').length;
  const reencoded = allResults.filter(r => r.status === 'ok-reencoded').length;
  const skipped = allResults.filter(r => r.status === 'skipped-exists').length;
  const missing = allResults.filter(r => r.status === 'no-plants-entry').length;
  const errors = allResults.filter(r => r.status === 'error').length;
  console.log(`\nDone in ${elapsedSec}s.  ${ok} generated, ${reencoded} re-encoded from cached PNG, ${skipped} skipped, ${missing} no PLANTS entry, ${errors} errors.`);
  if (errors) {
    console.log(`Retry: re-run the same command. Existing files won't be re-generated.`);
    process.exit(1);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
