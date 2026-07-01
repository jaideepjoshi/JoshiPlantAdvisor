#!/usr/bin/env node
// build-seed-list.mjs
// Reads my-garden-YYYY-MM-DD.csv (columns: Name, Botanical, ...) and produces
// plants-to-generate.txt with one line per plant in the "Botanical (Common)" format
// used by the image-generation prompt template.
//
// Usage:
//   node scripts/build-seed-list.mjs my-garden-2026-07-01.csv

import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(new URL(import.meta.url).pathname, '../..');
const inputArg = process.argv[2] || 'my-garden-2026-07-01.csv';
const csvPath = path.isAbsolute(inputArg) ? inputArg : path.join(ROOT, inputArg);
const outPath = path.join(ROOT, 'plants-to-generate.txt');

// Minimal CSV parser — the export writes RFC-4180 quoting so this handles it.
function parseCsvRow(line) {
  const cells = [];
  let cell = '';
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuote) {
      if (ch === '"' && line[i+1] === '"') { cell += '"'; i++; }
      else if (ch === '"') inQuote = false;
      else cell += ch;
    } else {
      if (ch === '"') inQuote = true;
      else if (ch === ',') { cells.push(cell); cell = ''; }
      else cell += ch;
    }
  }
  cells.push(cell);
  return cells;
}

function extractCommon(nameCell) {
  // Prefer text INSIDE parens if present: "Acorus (Sweet Flag)" → "Sweet Flag"
  const m = nameCell.match(/\(([^)]+)\)/);
  if (m) return m[1].trim();
  // Otherwise use the whole name field — for entries like "Bleeding Heart".
  return nameCell.trim();
}

const raw = await fs.readFile(csvPath, 'utf8');
const lines = raw.replace(/^﻿/, '').split('\n').filter(l => l.trim());
const [header, ...rows] = lines;

const out = [];
out.push('# plants-to-generate.txt — one plant per line');
out.push('# Format: <Botanical> (<Common>)');
out.push('# The image-generation script matches these to entries in the PLANTS array.');
out.push('# Comment out a line with # to skip it. Delete a line once processed.');
out.push('');

for (const line of rows) {
  const cells = parseCsvRow(line);
  const nameCell = (cells[0] || '').trim();
  const botCell = (cells[1] || '').trim();
  if (!nameCell || !botCell) continue;
  const common = extractCommon(nameCell);
  out.push(`${botCell} (${common})`);
}

await fs.writeFile(outPath, out.join('\n') + '\n');
console.log(`Wrote ${out.length - 5} plants to ${outPath}`);
