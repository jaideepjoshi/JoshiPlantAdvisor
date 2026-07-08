#!/usr/bin/env node
// generate-leather.mjs
// One-off: generate the vintage worn leather-bound journal cover image
// used as the launch screen background. Writes plates/leather-cover.webp
// and archives the raw PNG under plates/png/.
//
// The image includes: leather texture, gold frame with corner filigree,
// silk crimson bookmark ribbon — but NO center text. The garden name /
// Volume label / etc. are overlaid as HTML on top of the image.
//
// Usage:
//   node scripts/generate-leather.mjs [--quality high|medium|low]

import fs from 'node:fs/promises';
import path from 'node:path';
import OpenAI from 'openai';
import sharp from 'sharp';

const ROOT = path.resolve(new URL(import.meta.url).pathname, '../..');
const API_KEY_PATH = path.join(ROOT, '.openai/api-key');
const PROMPT_PATH = path.join(ROOT, 'scripts/prompts/leather.txt');
const OUT_WEBP = path.join(ROOT, 'plates/leather-cover.webp');
const OUT_PNG  = path.join(ROOT, 'plates/png/leather-cover.png');

async function expandPrompt(openai, promptText) {
  const chat = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an art director rewriting cover-art prompts.
Rewrite the user's prompt into a more vivid image-generation prompt while preserving every constraint EXACTLY.

CRITICAL:
- The center of the cover must be COMPLETELY EMPTY leather — NO text, NO monogram, NO crest, NO title, NO lettering, NO numerals, NO signature, NO symbol whatsoever. Do NOT add these even if leather-bound journals traditionally have them.
- Preserve the "Avoid" list exactly.
- Preserve the described positioning of the frame, bookmark ribbon, and leather character.
- Add richer language about leather grain, age patina, and the antique gold's tarnish variations.

Return ONLY the rewritten prompt.`
      },
      { role: 'user', content: promptText },
    ],
    temperature: 0.4,
  });
  return chat.choices[0].message.content.trim();
}

async function main() {
  const args = process.argv.slice(2);
  const qi = args.indexOf('--quality');
  const q = qi >= 0 ? args[qi + 1] : 'high';
  const apiKey = (await fs.readFile(API_KEY_PATH, 'utf8')).trim();
  const openai = new OpenAI({ apiKey });
  const prompt = await fs.readFile(PROMPT_PATH, 'utf8');

  console.log(`Generating leather cover at quality=${q}…`);
  const expanded = await expandPrompt(openai, prompt);
  const response = await openai.images.generate({
    model: 'gpt-image-2',
    prompt: expanded,
    n: 1,
    size: '1024x1792',
    quality: q,
  });
  const b64 = response.data[0].b64_json;
  const pngBuffer = Buffer.from(b64, 'base64');

  await fs.mkdir(path.dirname(OUT_PNG), { recursive: true });
  await fs.writeFile(OUT_PNG, pngBuffer);

  // No walnut frame padding — the leather is meant to fill the cover
  // completely and read as the physical book itself.
  await sharp(pngBuffer)
    .webp({ quality: 88 })
    .toFile(OUT_WEBP);

  const stat = await fs.stat(OUT_WEBP);
  console.log(`✓ wrote ${OUT_WEBP} (${(stat.size / 1024).toFixed(0)} KB)`);
  console.log(`  archive: ${OUT_PNG}`);
}

main().catch(e => { console.error(e); process.exit(1); });
