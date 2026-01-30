#!/usr/bin/env node
/**
 * Stamp Filter - Photoshop-style stamp/photocopy effect
 *
 * Usage:
 *   node scripts/stamp-filter.mjs <image> [--balance 16] [--smoothness 2]
 *   node scripts/stamp-filter.mjs brand/illustrations/pattern-recognition/my-image.png
 *   node scripts/stamp-filter.mjs my-image.png --balance 20 --smoothness 3
 *
 * Params:
 *   --balance     Light/Dark balance (1-50, default 16) - lower = more black
 *   --smoothness  Smoothness (0-10, default 2) - higher = smoother edges
 *   --invert      Invert the result (swap black/white)
 *   --output      Custom output path (default: input-stamped.png)
 */

import sharp from 'sharp';
import { parseArgs } from 'util';
import { basename, dirname, extname, join } from 'path';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    balance: { type: 'string', default: '16' },
    smoothness: { type: 'string', default: '2' },
    invert: { type: 'boolean', default: false },
    output: { type: 'string' },
    help: { type: 'boolean', short: 'h' },
  },
});

if (values.help || positionals.length === 0) {
  console.log(`
Stamp Filter - Photoshop-style stamp/photocopy effect

Usage:
  node scripts/stamp-filter.mjs <image> [options]

Options:
  --balance <n>     Light/Dark balance, 1-50 (default: 16)
                    Lower = more black, higher = more white
  --smoothness <n>  Edge smoothness, 0-10 (default: 2)
                    Higher = smoother/softer edges
  --invert          Invert black/white
  --output <path>   Custom output path
  -h, --help        Show this help

Examples:
  node scripts/stamp-filter.mjs image.png
  node scripts/stamp-filter.mjs image.png --balance 20 --smoothness 3
  node scripts/stamp-filter.mjs image.png --invert --output stamped.png
`);
  process.exit(0);
}

const inputPath = positionals[0];
const balance = parseInt(values.balance, 10);
const smoothness = parseFloat(values.smoothness);
const invert = values.invert;

// Convert Photoshop's Light/Dark Balance (1-50) to threshold (0-255)
// PS balance 1 = very dark (low threshold ~50), balance 50 = very light (high threshold ~200)
// PS default 16 ≈ threshold 128
const threshold = Math.round(50 + (balance / 50) * 150);

// Convert smoothness to blur sigma (0-10 → 0-3 sigma)
const blurSigma = smoothness * 0.3;

// Generate output path
const ext = extname(inputPath);
const base = basename(inputPath, ext);
const dir = dirname(inputPath);
const outputPath = values.output || join(dir, `${base}-stamped${ext}`);

console.log(`Stamp Filter`);
console.log(`  Input:      ${inputPath}`);
console.log(`  Output:     ${outputPath}`);
console.log(`  Balance:    ${balance} (threshold: ${threshold})`);
console.log(`  Smoothness: ${smoothness} (blur sigma: ${blurSigma.toFixed(2)})`);
console.log(`  Invert:     ${invert}`);
console.log('');

async function applyStampFilter() {
  // Step 1: Create the thresholded black/white image
  let thresholded = sharp(inputPath)
    .grayscale();

  // Apply blur for smoothness (if > 0)
  if (blurSigma > 0.1) {
    thresholded = thresholded.blur(blurSigma);
  }

  // Apply threshold to create stamp effect
  thresholded = thresholded
    .normalize()
    .linear(3, -(threshold * 3 / 255) * 255 + 128)
    .threshold(128);

  if (invert) {
    thresholded = thresholded.negate();
  }

  // Step 2: Convert white background to transparent
  // - Extract as raw pixels
  // - Use the grayscale value as alpha (black = opaque, white = transparent)
  // - Create new image with black fill and alpha from threshold

  const { data, info } = await thresholded.raw().toBuffer({ resolveWithObject: true });

  // Create RGBA buffer: black pixels where original was black, transparent where white
  const rgbaData = Buffer.alloc(info.width * info.height * 4);

  for (let i = 0; i < data.length; i++) {
    const pixelValue = data[i];
    const rgbaIndex = i * 4;

    // Black fill (R=0, G=0, B=0)
    rgbaData[rgbaIndex] = 0;     // R
    rgbaData[rgbaIndex + 1] = 0; // G
    rgbaData[rgbaIndex + 2] = 0; // B
    // Alpha: black pixels (0) become opaque (255), white pixels (255) become transparent (0)
    rgbaData[rgbaIndex + 3] = 255 - pixelValue;
  }

  await sharp(rgbaData, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  })
    .png()
    .toFile(outputPath);

  console.log(`✓ Stamp filter applied (transparent bg): ${outputPath}`);
}

applyStampFilter().catch(err => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
