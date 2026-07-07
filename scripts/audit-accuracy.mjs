#!/usr/bin/env node
// audit-accuracy.mjs — score each plate's botanical accuracy.
//
// For each *-front.webp:
//   1. Generate a botanical fact-sheet from PLANTS[i].botanical (gpt-4o-mini)
//   2. Send plate image + fact-sheet to gpt-4o-mini vision, ask it to score
//      growth habit / leaf shape / leaf arrangement / flower / overall
//      each 1-5, plus a recommend_regenerate flag and a short list of issues.
//   3. Cache the result to scripts/audit-accuracy.json — re-runs skip cached
//      plates so an interrupted audit is cheap to resume.
//
// Prints a ranked report (worst first) at the end.
//
// Usage:
//   node scripts/audit-accuracy.mjs               # audit anything not cached
//   node scripts/audit-accuracy.mjs --only 213    # audit a single plant id
//   node scripts/audit-accuracy.mjs --refresh     # ignore cache, re-audit all
//   node scripts/audit-accuracy.mjs --limit 10    # audit at most N new plates

import fs from 'node:fs/promises';
import path from 'node:path';
import OpenAI from 'openai';

const ROOT = path.resolve(new URL(import.meta.url).pathname, '../..');
const API_KEY_PATH = path.join(ROOT, '.openai/api-key');
const INDEX_HTML   = path.join(ROOT, 'index.html');
const PLATES_DIR   = path.join(ROOT, 'plates');
const CACHE_PATH   = path.join(ROOT, 'scripts/audit-accuracy.json');

// --------------------------------------------------------- CLI

const argv = process.argv.slice(2);
const flags = {
  only: null,
  refresh: false,
  limit: null,
};
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--only')    flags.only = argv[++i];
  else if (a === '--refresh') flags.refresh = true;
  else if (a === '--limit')   flags.limit = parseInt(argv[++i], 10);
  else if (a === '--help' || a === '-h') {
    console.log(`Usage:
  node scripts/audit-accuracy.mjs               audit anything not cached
  node scripts/audit-accuracy.mjs --only <id>   audit one plant by id
  node scripts/audit-accuracy.mjs --refresh     ignore cache, re-audit all
  node scripts/audit-accuracy.mjs --limit N     audit at most N new plates`);
    process.exit(0);
  }
}

// --------------------------------------------------------- setup

async function loadPlants() {
  const html = await fs.readFile(INDEX_HTML, 'utf8');
  const m = html.match(/const PLANTS = (\[[\s\S]*?\]);/);
  if (!m) throw new Error('Could not find PLANTS array in index.html');
  return JSON.parse(m[1]);
}

async function loadCache() {
  try { return JSON.parse(await fs.readFile(CACHE_PATH, 'utf8')); }
  catch { return {}; }
}
async function saveCache(cache) {
  await fs.writeFile(CACHE_PATH, JSON.stringify(cache, null, 2));
}

// --------------------------------------------------------- fact-sheet

async function factSheet(openai, plant) {
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
  return JSON.parse(chat.choices[0].message.content);
}

// --------------------------------------------------------- vision score

async function scoreImage(openai, plant, fs_brief, imageB64) {
  const chat = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content:
`You are a strict botanical illustration reviewer. You are shown ONE
vintage-style plate illustration of a plant, along with a botanical
fact-sheet the artist was supposed to depict. Compare the illustration
to the fact-sheet on five axes and rate each 1 (wrong) to 5 (nailed it).

Scoring rubric — apply STRICTLY:
  5 = matches the fact-sheet exactly
  4 = essentially correct, minor artistic license
  3 = recognisably related but with a real error
  2 = mostly wrong, but genus-family flavor present
  1 = the illustration depicts a fundamentally different kind of plant

Wrong growth habit (upright vs groundcover, tree vs shrub, etc.) = score 1
for growth_habit and cap overall at 3.
Wrong leaf shape category (pointy vs rounded, needle vs broadleaf, etc.) =
score 1-2 for leaf_shape.
Right species overall but weak execution = 4-5 range.

Return ONLY compact JSON:
{
  "growth_habit":     {"score": 1-5, "note": "short reason"},
  "leaf_shape":       {"score": 1-5, "note": "short reason"},
  "leaf_arrangement": {"score": 1-5, "note": "short reason"},
  "flower":           {"score": 1-5, "note": "short reason"},
  "overall":          {"score": 1-5, "note": "short reason"},
  "recommend_regenerate": true|false,
  "issues": ["short bullet", "short bullet"]
}
Recommend regenerate when any single axis is <=2, OR overall <=3.` },
      { role: 'user', content: [
        { type: 'text', text:
`Plant: ${plant.name} (${plant.botanical || '?'})
Fact-sheet:
${JSON.stringify(fs_brief, null, 2)}

Illustration:` },
        { type: 'image_url', image_url: { url: `data:image/webp;base64,${imageB64}` } },
      ] },
    ],
    temperature: 0.1,
    response_format: { type: 'json_object' },
  });
  return JSON.parse(chat.choices[0].message.content);
}

// --------------------------------------------------------- main

async function main() {
  const apiKey = (await fs.readFile(API_KEY_PATH, 'utf8')).trim();
  const openai = new OpenAI({ apiKey });
  const plants = await loadPlants();
  const cache = flags.refresh ? {} : await loadCache();

  // Which plates exist?
  const files = await fs.readdir(PLATES_DIR);
  const plateById = {};
  for (const f of files) {
    const m = f.match(/^(\d{3})-.*-front\.webp$/);
    if (m) plateById[String(parseInt(m[1], 10))] = path.join(PLATES_DIR, f);
  }

  // Which plants to audit?
  let queue = plants.filter(p => plateById[String(p.id)]);
  if (flags.only) queue = queue.filter(p => String(p.id) === String(flags.only));
  if (!flags.refresh) queue = queue.filter(p => !cache[p.id]);
  if (flags.limit)   queue = queue.slice(0, flags.limit);

  console.log(`Auditing ${queue.length} plate(s); ${Object.keys(cache).length} already cached.`);

  for (let i = 0; i < queue.length; i++) {
    const p = queue[i];
    const platePath = plateById[String(p.id)];
    process.stdout.write(`[${i+1}/${queue.length}] ${String(p.id).padStart(3,'0')} ${p.name} ... `);
    try {
      const brief = await factSheet(openai, p);
      const b64 = (await fs.readFile(platePath)).toString('base64');
      const scores = await scoreImage(openai, p, brief, b64);
      cache[p.id] = {
        id: p.id,
        name: p.name,
        botanical: p.botanical,
        plate: path.basename(platePath),
        brief,
        scores,
        ts: new Date().toISOString(),
      };
      await saveCache(cache);
      const s = scores.overall?.score ?? 0;
      const flag = scores.recommend_regenerate ? '🔴' : (s <= 3 ? '🟡' : '✓ ');
      console.log(`${flag} overall=${s} (habit ${scores.growth_habit?.score}, leaf ${scores.leaf_shape?.score}, arr ${scores.leaf_arrangement?.score}, flower ${scores.flower?.score})`);
    } catch (e) {
      console.log(`ERROR: ${e.message}`);
    }
  }

  // --------------------------------------------------------- report
  const all = Object.values(cache);
  all.sort((a, b) => {
    // Recommend-regenerate first, then lowest overall score, then lowest axis min.
    const ra = a.scores?.recommend_regenerate ? 0 : 1;
    const rb = b.scores?.recommend_regenerate ? 0 : 1;
    if (ra !== rb) return ra - rb;
    const oa = a.scores?.overall?.score ?? 0;
    const ob = b.scores?.overall?.score ?? 0;
    if (oa !== ob) return oa - ob;
    const axisMin = s => Math.min(
      s?.growth_habit?.score ?? 5,
      s?.leaf_shape?.score ?? 5,
      s?.leaf_arrangement?.score ?? 5,
      s?.flower?.score ?? 5
    );
    return axisMin(a.scores) - axisMin(b.scores);
  });

  console.log('\n' + '='.repeat(78));
  console.log('ACCURACY REPORT (worst first)');
  console.log('='.repeat(78));
  console.log(`${'Ovr'.padStart(3)} ${'Hbt'.padStart(3)} ${'Lf'.padStart(2)} ${'Arr'.padStart(3)} ${'Flr'.padStart(3)}  Flag  Plant`);
  console.log('-'.repeat(78));
  let toRegen = 0;
  for (const r of all) {
    const s = r.scores || {};
    const ov = s.overall?.score ?? 0;
    const flag = s.recommend_regenerate ? '🔴' : (ov <= 3 ? '🟡' : '✓ ');
    if (s.recommend_regenerate) toRegen++;
    console.log(
      `${String(ov).padStart(3)} ${String(s.growth_habit?.score ?? '?').padStart(3)} ${String(s.leaf_shape?.score ?? '?').padStart(2)} ${String(s.leaf_arrangement?.score ?? '?').padStart(3)} ${String(s.flower?.score ?? '?').padStart(3)}  ${flag}  ${String(r.id).padStart(3,'0')} ${r.name}`
    );
  }
  console.log('-'.repeat(78));
  console.log(`${toRegen} recommended for regeneration; ${all.length - toRegen} kept`);
  console.log(`Full details cached at ${CACHE_PATH}`);
}

main().catch(e => { console.error(e); process.exit(1); });
