#!/usr/bin/env node
// link-plates.mjs
// Phase 2: after you visually approve generated images in plates/, this script
// wires each pair of {id-slug-front.webp, id-slug-back.webp} into its PLANTS
// entry inside index.html by setting:
//   - plateImage: "plates/{id}-{slug}-front.webp?v=1"
//   - plateBack:  "plates/{id}-{slug}-back.webp?v=1"
//   - plateNo:    "{id}"                 (zero-padded, e.g. "042")
//   - plates:     ["habit","particulars","seasons","companions","journal"]
//
// Idempotent — plants that already point to their image files are left alone.
// Prints a diff-style summary and bumps the SW cache. Add --commit to auto
// commit + push both main and vintage-theme.
//
// Usage:
//   node scripts/link-plates.mjs                   # link all matching pairs
//   node scripts/link-plates.mjs --only "042"      # only plants matching id or name
//   node scripts/link-plates.mjs --dry-run         # print planned changes, don't write
//   node scripts/link-plates.mjs --commit          # after writing, git add/commit/push

import fs from 'node:fs/promises';
import fss from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(new URL(import.meta.url).pathname, '../..');
const INDEX_HTML = path.join(ROOT, 'index.html');
const SW_JS = path.join(ROOT, 'sw.js');
const PLATES_DIR = path.join(ROOT, 'plates');

function parseArgs(argv) {
  const args = { only: null, dryRun: false, commit: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--only') args.only = argv[++i];
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '--commit') args.commit = true;
    else if (a === '--help' || a === '-h') { console.log(`Usage: node link-plates.mjs [--only <query>] [--dry-run] [--commit]`); process.exit(0); }
    else console.warn(`ignoring unknown arg: ${a}`);
  }
  return args;
}

// Read the PLANTS array as a raw string (not eval'd) so we can patch it in place.
async function readIndexAndPlants() {
  const html = await fs.readFile(INDEX_HTML, 'utf8');
  const m = html.match(/const PLANTS = (\[[\s\S]*?\]);/);
  if (!m) throw new Error('PLANTS array not found in index.html');
  return { html, matchText: m[0], arrayText: m[1], PLANTS: eval(m[1]) };
}

function padId(id) { return String(id).padStart(3, '0'); }

// Scan plates/ for matching {id-*-front.webp, id-*-back.webp} pairs.
function scanImagePairs() {
  const files = fss.readdirSync(PLATES_DIR).filter(f => /^\d{3}-.+-(front|back)\.webp$/.test(f));
  const pairs = new Map(); // key = "id-slug" (without side) → { id, slug, front, back }
  for (const f of files) {
    const m = f.match(/^(\d{3})-(.+)-(front|back)\.webp$/);
    if (!m) continue;
    const [, id, slug, side] = m;
    const key = `${id}-${slug}`;
    if (!pairs.has(key)) pairs.set(key, { id, slug, front: null, back: null });
    pairs.get(key)[side] = f;
  }
  return [...pairs.values()].filter(p => p.front && p.back);
}

function needsUpdate(plant, pair) {
  const wantFront = `plates/${pair.id}-${pair.slug}-front.webp?v=1`;
  const wantBack = `plates/${pair.id}-${pair.slug}-back.webp?v=1`;
  const wantNo = pair.id;
  const wantPlates = ['habit','particulars','seasons','companions','journal'];
  const platesOk = Array.isArray(plant.plates) && plant.plates.length === wantPlates.length &&
    plant.plates.every((v,i) => v === wantPlates[i]);
  return {
    plateImage: (plant.plateImage || '').split('?')[0] !== wantFront.split('?')[0] ? { was: plant.plateImage, will: wantFront } : null,
    plateBack:  (plant.plateBack  || '').split('?')[0] !== wantBack.split('?')[0]  ? { was: plant.plateBack,  will: wantBack  } : null,
    plateNo:    plant.plateNo !== wantNo ? { was: plant.plateNo, will: wantNo } : null,
    plates:     !platesOk ? { was: plant.plates, will: wantPlates } : null,
  };
}

function applyUpdatesToPlant(plant, updates) {
  if (updates.plateImage) plant.plateImage = updates.plateImage.will;
  if (updates.plateBack)  plant.plateBack  = updates.plateBack.will;
  if (updates.plateNo)    plant.plateNo    = updates.plateNo.will;
  if (updates.plates)     plant.plates     = updates.plates.will;
}

function stringifyPlants(PLANTS) {
  // Match the compact JSON.stringify style already used elsewhere in the app
  // (no spacing, keys unsorted so we don't reorder fields the user has hand-set).
  return JSON.stringify(PLANTS);
}

async function bumpSwCache() {
  const sw = await fs.readFile(SW_JS, 'utf8');
  const m = sw.match(/const CACHE = '([^']+)'/);
  if (!m) return null;
  const old = m[1];
  const today = new Date().toISOString().slice(0,10);
  // Preserve the "-suffix" letter increment scheme used so far.
  let next;
  if (old.startsWith(`plant-buddy-${today}`)) {
    const tail = old.slice(`plant-buddy-${today}`.length);   // "" or "a".."z" or "aa"…
    next = `plant-buddy-${today}${incrementSuffix(tail)}`;
  } else {
    next = `plant-buddy-${today}a`;
  }
  const patched = sw.replace(m[0], `const CACHE = '${next}'`);
  await fs.writeFile(SW_JS, patched);
  return { old, next };
}

function incrementSuffix(s) {
  if (!s) return 'a';
  // 'a'..'z' → 'b'..'aa'; 'aa'..'zz' → similar. Keep it simple.
  const last = s.charCodeAt(s.length-1);
  if (last < 122) return s.slice(0,-1) + String.fromCharCode(last+1);
  return s + 'a';
}

async function main() {
  const opts = parseArgs(process.argv);
  const { html, matchText, PLANTS } = await readIndexAndPlants();
  const pairs = scanImagePairs();

  let pairsToLink = pairs;
  if (opts.only) {
    const q = opts.only.toLowerCase();
    pairsToLink = pairs.filter(p => p.id.includes(q) || p.slug.toLowerCase().includes(q));
  }

  let changed = 0;
  const rows = [];
  for (const pair of pairsToLink) {
    const idNum = parseInt(pair.id, 10);
    const plant = PLANTS.find(p => p.id === idNum);
    if (!plant) { rows.push(`  ⚠ id ${pair.id} (${pair.slug}) — no PLANTS entry with this id, skipping`); continue; }
    const updates = needsUpdate(plant, pair);
    const anyChange = Object.values(updates).some(Boolean);
    if (!anyChange) { rows.push(`  · ${pair.id} ${plant.name} — already linked`); continue; }
    rows.push(`  ✓ ${pair.id} ${plant.name}`);
    if (updates.plateImage) rows.push(`      plateImage: ${JSON.stringify(updates.plateImage.was)} → ${JSON.stringify(updates.plateImage.will)}`);
    if (updates.plateBack)  rows.push(`      plateBack:  ${JSON.stringify(updates.plateBack.was)} → ${JSON.stringify(updates.plateBack.will)}`);
    if (updates.plateNo)    rows.push(`      plateNo:    ${JSON.stringify(updates.plateNo.was)} → ${JSON.stringify(updates.plateNo.will)}`);
    if (updates.plates)     rows.push(`      plates:     ${JSON.stringify(updates.plates.was)} → ${JSON.stringify(updates.plates.will)}`);
    applyUpdatesToPlant(plant, updates);
    changed++;
  }

  console.log(`\nLink summary (${pairsToLink.length} image pair${pairsToLink.length===1?'':'s'} scanned):`);
  rows.forEach(r => console.log(r));
  console.log(`\n${changed} plant${changed===1?'':'s'} updated in memory.\n`);

  if (!changed) { console.log('Nothing to write.'); return; }
  if (opts.dryRun) { console.log('Dry-run: no files written.'); return; }

  const newArrayText = stringifyPlants(PLANTS);
  const newHtml = html.replace(matchText, `const PLANTS = ${newArrayText};`);
  await fs.writeFile(INDEX_HTML, newHtml);
  const bump = await bumpSwCache();
  console.log(`Wrote ${INDEX_HTML}`);
  if (bump) console.log(`Bumped sw.js CACHE:  ${bump.old} → ${bump.next}`);

  if (opts.commit) {
    console.log('\nCommitting + pushing…');
    const msg = `Link ${changed} plate image pair${changed===1?'':'s'} into PLANTS`;
    // Also stage any new plate files that are now referenced.
    execSync('git add index.html sw.js plates/*.webp', { stdio: 'inherit', cwd: ROOT });
    execSync(`git commit -m "${msg}\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"`, { stdio: 'inherit', cwd: ROOT });
    execSync('git push origin main', { stdio: 'inherit', cwd: ROOT });
    // Best-effort sync of vintage-theme.
    try {
      execSync('git checkout vintage-theme && git merge main --ff-only && git push origin vintage-theme && git checkout main',
        { stdio: 'inherit', cwd: ROOT });
    } catch (e) {
      console.warn('vintage-theme sync failed:', e.message);
    }
    console.log('Pushed.');
  } else {
    console.log('\nNext steps:');
    console.log('  - Reload your local server to inspect the new plates');
    console.log('  - When happy: git add index.html sw.js plates/ && git commit && git push');
    console.log('  - Or re-run with --commit to do that automatically.');
  }
}

main().catch(err => { console.error(err); process.exit(1); });
