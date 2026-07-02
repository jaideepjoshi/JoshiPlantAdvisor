#!/usr/bin/env node
// generate-blank.mjs
// One-off: generate a blank aged parchment page matching the pipeline style,
// used as the background for Plates III and IV when no per-plant illustration
// is set. Writes plates/plate-blank.webp (padded to plate-container aspect
// ratio like the other plate files) and archives the raw PNG under plates/png/.
//
// Usage:
//   node scripts/generate-blank.mjs [--quality high|medium|low]

import fs from 'node:fs/promises';
import path from 'node:path';
import OpenAI from 'openai';
import sharp from 'sharp';

const ROOT = path.resolve(new URL(import.meta.url).pathname, '../..');
const API_KEY_PATH = path.join(ROOT, '.openai/api-key');
const PROMPT_PATH = path.join(ROOT, 'scripts/prompts/blank.txt');
const OUT_WEBP = path.join(ROOT, 'plates/plate-blank.webp');
const OUT_PNG  = path.join(ROOT, 'plates/png/plate-blank.png');

async function expandPrompt(openai, promptText) {
  const chat = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an art director rewriting botanical plate prompts.
Rewrite the user's prompt into a more vivid image-generation prompt while preserving every constraint.

CRITICAL:
- If the user's prompt says the page must be EMPTY of illustration, the rewrite must add NO plant, NO flower, NO leaf, NO inset, NO detail vignette, NO figure, NO text.
- Preserve the "Avoid" list exactly.
- You may add richer language about paper aging, watercolor paper texture, and the character of the border.

Return ONLY the rewritten prompt.`
      },
      { role: 'user', content: promptText },
    ],
    temperature: 0.5,
  });
  return chat.choices[0].message.content.trim();
}

async function main() {
  const args = process.argv.slice(2);
  const q = (args[args.indexOf('--quality') + 1]) || 'high';
  const apiKey = (await fs.readFile(API_KEY_PATH, 'utf8')).trim();
  const openai = new OpenAI({ apiKey });
  const prompt = await fs.readFile(PROMPT_PATH, 'utf8');

  console.log(`Generating blank plate at quality=${q}…`);
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

  // Same encoder recipe as the plate images: 14px dark-walnut hairline frame
  // on all four sides so background-size:cover shows the antique border.
  await sharp(pngBuffer)
    .extend({ top: 14, bottom: 14, left: 14, right: 14, background: { r: 102, g: 73, b: 35, alpha: 1 } })
    .webp({ quality: 85 })
    .toFile(OUT_WEBP);

  const stat = await fs.stat(OUT_WEBP);
  console.log(`✓ wrote ${OUT_WEBP} (${(stat.size / 1024).toFixed(0)} KB)`);
  console.log(`  archive: ${OUT_PNG}`);
}

main().catch(e => { console.error(e); process.exit(1); });
