# Phase 12: Visual Language - Research

**Researched:** 2026-01-24
**Domain:** AI image generation, brand identity, image asset production
**Confidence:** HIGH

## Summary

This phase creates Esoterica's distinctive visual identity using AI-generated imagery via Replicate's Nano Banana Pro model. Research focused on three technical domains: (1) Replicate API integration patterns for Node.js/TypeScript, (2) AI image generation prompt engineering best practices, and (3) web/social media asset specifications and brand guide structure.

The standard approach involves creating a Claude skill (following existing tarot skill pattern) that wraps the Replicate API, enabling agentic image generation. Nano Banana Pro (Google's Gemini 3 Pro Image model) provides photorealistic output with excellent text rendering and multi-image composition capabilities - well-suited for the eco-futurist aesthetic with terminal screens and tarot cards.

Post-processing with Sharp library handles resizing/cropping for social variants. Brand guide documents color palettes, imagery rules, and typography. Color extraction from generated images informs palette specifications.

**Primary recommendation:** Build `/generate-image` skill as TypeScript MCP tool using official Replicate JavaScript client, implement async polling pattern with exponential backoff for rate limit handling, generate 10+ hero variations, select winner for Sharp-based asset generation pipeline.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| replicate | latest (1.x) | Replicate API client | Official Node.js SDK, TypeScript support, works on serverless platforms |
| sharp | latest | Image post-processing | Fastest Node.js image library (4-5x faster than ImageMagick), libvips-based |
| @modelcontextprotocol/sdk | 1.x | MCP skill structure | Official TypeScript SDK for Claude skills, matches existing tarot skill pattern |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| get-image-colors | latest | Color palette extraction | Extract brand colors from generated images, supports PNG/JPG |
| node-vibrant | latest | Advanced color extraction | Alternative if get-image-colors insufficient, prominent color detection |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| replicate (SDK) | Raw HTTP API | SDK provides TypeScript types, error handling, polling logic - HTTP only for custom needs |
| sharp | jimp | Sharp is 4-5x faster, supports more formats, but jimp is pure JS (no native deps) |
| MCP skill | Standalone CLI script | Skill enables agentic invocation during execution, CLI for manual batch generation |

**Installation:**
```bash
npm install replicate sharp get-image-colors
npm install --save-dev @modelcontextprotocol/sdk typescript @types/node
```

## Architecture Patterns

### Recommended Project Structure
```
skills/
├── generate-image/              # New skill for this phase
│   ├── SKILL.md                # Skill invocation documentation (follows tarot pattern)
│   ├── package.json            # Skill-specific dependencies
│   ├── tsconfig.json           # TypeScript configuration
│   └── src/
│       ├── index.ts            # MCP tool registration
│       ├── replicate-client.ts # Replicate API wrapper
│       ├── prompt-builder.ts   # Prompt template logic
│       └── types.ts            # TypeScript interfaces
brand/
├── hero/                        # Generated hero image variations
│   ├── winners/                # Selected final images
│   └── archive/                # All generated variations
├── social/                      # Resized social media assets
│   ├── og-image.png           # 1200x630
│   ├── linkedin.png           # 1200x627
│   ├── twitter.png            # 1200x675
│   ├── instagram-square.png   # 1080x1080
│   └── instagram-story.png    # 1080x1920
├── favicon/                     # Favicon variants
│   ├── favicon.svg            # Vector (preferred)
│   ├── favicon-32x32.png      # Desktop browsers
│   ├── favicon-16x16.png      # Fallback
│   └── apple-touch-icon.png   # 180x180 iOS
└── BRAND_GUIDE.md              # Visual language documentation
```

### Pattern 1: Async Prediction with Polling
**What:** Create prediction, poll for completion, handle rate limits
**When to use:** For all Replicate model runs (Nano Banana Pro takes ~112 seconds)
**Example:**
```typescript
// Source: https://github.com/replicate/replicate-javascript
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function generateImage(prompt: string, aspectRatio: string = "16:9") {
  try {
    // Create prediction
    let prediction = await replicate.predictions.create({
      version: "0785fb14f5aaa30eddf06fd49b6cbdaac4541b8854eb314211666e23a29087e3", // Nano Banana Pro
      input: {
        prompt,
        aspect_ratio: aspectRatio,
        resolution: "2K", // Default to 2K ($0.15/image)
        output_format: "png",
        safety_filter_level: "block_only_high",
      },
    });

    // Poll for completion with exponential backoff
    let attempts = 0;
    const maxAttempts = 60; // ~10 minutes max

    while (prediction.status !== "succeeded" && prediction.status !== "failed") {
      if (attempts >= maxAttempts) {
        throw new Error("Prediction timed out after 10 minutes");
      }

      // Exponential backoff: 2s, 4s, 8s, then 10s
      const delay = Math.min(2000 * Math.pow(2, attempts), 10000);
      await new Promise(resolve => setTimeout(resolve, delay));

      prediction = await replicate.predictions.get(prediction.id);
      attempts++;
    }

    if (prediction.status === "failed") {
      throw new Error(`Prediction failed: ${prediction.error}`);
    }

    return prediction.output; // Array of image URLs
  } catch (error) {
    if (error.message?.includes("429")) {
      // Rate limit: 600 predictions/minute
      console.log("Rate limited, waiting 60 seconds...");
      await new Promise(resolve => setTimeout(resolve, 60000));
      return generateImage(prompt, aspectRatio); // Retry
    }
    throw error;
  }
}
```

### Pattern 2: Prompt Template Builder
**What:** Structured prompt construction with locked aesthetic elements
**When to use:** All image generation requests to maintain visual consistency
**Example:**
```typescript
// Source: User's existing Design Machine prompts
interface PromptConfig {
  sceneDescription: string;
  screenContent?: string;
  figures?: "hands_only" | "no_people" | "background_figures";
  timeOfDay?: string;
}

function buildEsotericaPrompt(config: PromptConfig): string {
  const baseTemplate = `Candid scene from an eco-futurist utopian divine feminine society`;
  const aesthetic = `1980s-meets-2180s. Kodak Eastman 100T 5247 35mm film, grain, halation, faded warm colors, natural lens flares, shallow depth-of-field.`;

  const devices = config.screenContent
    ? `Selenite crystal devices with ${config.screenContent}.`
    : `Selenite crystal devices with glowing screens.`;

  const figures = `Diverse women in flowing white, black, or iridescent gauzey cotton max-dresses, opal, labradorite, moonstone, amethyst jewelry, silver, black, or iridescent fingernails.`;

  const mood = `Soft, peaceful, gentle, pastoral cybernetic merging of femininity & technology.`;

  return [
    baseTemplate,
    config.sceneDescription,
    aesthetic,
    devices,
    figures,
    mood
  ].join(" ");
}

// Hero image specific
const heroPrompt = buildEsotericaPrompt({
  sceneDescription: "at a sacred altar in a sun-drenched Joshua Tree grove at sunrise, three tarot cards (High Priestess, Justice, Chariot) laid beside a selenite crystal-computer showing terminal text '/tarot reading in progress'",
  screenContent: "16:9 screen displaying terminal text with tarot reading output",
  figures: "hands_only", // Test variations
  timeOfDay: "golden hour sunrise, pink-gold morning light"
});
```

### Pattern 3: Social Asset Pipeline with Sharp
**What:** Generate all social media variants from hero image winner
**When to use:** After selecting final hero image
**Example:**
```typescript
// Source: https://sharp.pixelplumbing.com/
import sharp from "sharp";
import path from "path";

interface SocialVariant {
  name: string;
  width: number;
  height: number;
}

const SOCIAL_VARIANTS: SocialVariant[] = [
  { name: "og-image", width: 1200, height: 630 },
  { name: "linkedin", width: 1200, height: 627 },
  { name: "twitter", width: 1200, height: 675 },
  { name: "instagram-square", width: 1080, height: 1080 },
  { name: "instagram-story", width: 1080, height: 1920 },
];

async function generateSocialAssets(heroImagePath: string, outputDir: string) {
  const inputBuffer = await sharp(heroImagePath)
    .png({ quality: 90 })
    .toBuffer();

  for (const variant of SOCIAL_VARIANTS) {
    await sharp(inputBuffer)
      .resize(variant.width, variant.height, {
        fit: "cover",        // Crop to fill
        position: "center",  // Center crop
      })
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(path.join(outputDir, `${variant.name}.png`));

    console.log(`Generated ${variant.name} (${variant.width}x${variant.height})`);
  }
}
```

### Pattern 4: Color Palette Extraction
**What:** Extract brand colors from generated hero image
**When to use:** After selecting hero image winner, before writing brand guide
**Example:**
```typescript
// Source: https://github.com/colorjs/get-image-colors
import getColors from "get-image-colors";

async function extractBrandPalette(imagePath: string) {
  const colors = await getColors(imagePath, "image/png");

  // Convert to hex, sort by vibrancy/prominence
  const palette = colors
    .map(color => ({
      hex: color.hex(),
      rgb: color.rgb().array(),
      // Color Thief returns colors sorted by prominence
    }))
    .slice(0, 6); // Top 6 colors for brand palette

  return {
    primary: palette[0],    // Most prominent
    secondary: palette[1],
    accent: palette[2],
    neutrals: palette.slice(3, 6),
  };
}
```

### Anti-Patterns to Avoid
- **Inline prompt strings:** Don't hardcode prompts - use template builder for consistency
- **Synchronous polling:** Don't use `await replicate.run()` without timeout handling - it blocks indefinitely on failures
- **Single aspect ratio:** Don't generate only 16:9 - test multiple crops during exploration, select best
- **No local archival:** Don't rely only on Replicate's 1-hour storage - download and archive all generations immediately
- **Manual resizing:** Don't resize images in external tools - automate with Sharp for reproducibility

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image resizing | Canvas-based crop/resize | Sharp library | 4-5x faster, handles EXIF, color profiles, supports 10+ formats, production-tested |
| Color extraction | Pixel iteration + k-means | get-image-colors or node-vibrant | LAB color space, perceptual clustering, handles alpha channels |
| Favicon generation | Manual PNG export at sizes | Sharp pipeline + SVG | SVG scales infinitely, Dark Mode support via media queries, one source file |
| Rate limit retry | setTimeout loops | Exponential backoff pattern | Prevents thundering herd, adapts to backpressure, standard practice |
| Prompt versioning | Comments in code | Separate prompt template files | Enables A/B testing, prompt history, non-engineer editing |
| Image format conversion | Third-party services | Sharp built-in conversion | Works offline, no API costs, consistent quality settings |

**Key insight:** Image processing has massive edge case complexity (color spaces, EXIF data, alpha channels, format quirks). Sharp abstracts 15+ years of libvips development. Color extraction requires perceptual color space (LAB) not RGB - libraries handle this correctly.

## Common Pitfalls

### Pitfall 1: Replicate Output URL Expiration
**What goes wrong:** Generated image URLs expire after 1 hour. Downstream tasks fail when referencing expired URLs.
**Why it happens:** Replicate uses temporary delivery URLs (`replicate.delivery` CDN) that automatically purge to save storage costs.
**How to avoid:** Download images immediately after generation completes. Store in brand/ directory with descriptive filenames including timestamp/variant number.
**Warning signs:** 404 errors on image URLs, missing archive folder, relying on Replicate dashboard for image access.

### Pitfall 2: Rate Limit Overwhelm (600 predictions/minute)
**What goes wrong:** Generating 10+ hero variations in rapid succession hits 600/min limit, causing 429 errors and failed generations.
**Why it happens:** Replicate rate limits are per-user across all models. Batch generation without throttling exceeds limits.
**How to avoid:** Add 150ms delay between prediction.create() calls (400/min effective rate with buffer). Implement exponential backoff on 429 responses.
**Warning signs:** "Request was throttled" errors, predictions stuck in "starting" status, inconsistent generation counts.

### Pitfall 3: Prompt Context Length Limits
**What goes wrong:** Overly detailed prompts (>200 words) get truncated or ignored by Nano Banana Pro, losing critical scene details.
**Why it happens:** Image models have token limits. Verbose descriptions dilute key signals.
**How to avoid:** Keep prompts under 75 words total. Use high-signal keywords (e.g., "Kodak Eastman 100T 5247" not "film-like quality"). Test prompt variations to find minimum viable description.
**Warning signs:** Generated images missing specified elements, inconsistent style adherence, generic output.

### Pitfall 4: Terminal Text Illegibility
**What goes wrong:** Despite Nano Banana Pro's text rendering capabilities, small terminal text at 16:9 landscape becomes blurry/illegible.
**Why it happens:** Text rendering works best for large, prominent text. Terminal screens in photorealistic scenes have perspective distortion and shallow DoF.
**How to avoid:** Use placeholder text in prompts (e.g., "glowing terminal screen with mystical symbols"). Plan for manual compositing of real /tarot output in post-processing if needed.
**Warning signs:** Generated text is gibberish, unreadable, or doesn't match prompt specification.

### Pitfall 5: Aspect Ratio Mismatch for Social Variants
**What goes wrong:** 16:9 hero image crops poorly to Instagram square (1:1) or story (9:16), losing critical composition elements.
**Why it happens:** Hero composition assumes landscape framing. Square/portrait crops cut off altar, cards, or key visual elements.
**How to avoid:** Generate 2-3 aspect ratio variations during hero exploration (16:9, 1:1, 9:16). Test Sharp's crop positioning (center, entropy, attention). May need dedicated portrait generation for stories.
**Warning signs:** Social assets have awkward crops, missing focal points, unbalanced composition.

### Pitfall 6: Favicon Unrecognizable at Small Sizes
**What goes wrong:** Detailed tarot card design becomes blob at 16x16 or 32x32 pixels.
**Why it happens:** Favicon requires extreme simplification. Fine lines, small details, and complex shapes don't survive downscaling.
**How to avoid:** Design favicon-specific iconography (simplified card symbol, abstract motif). Test at actual sizes (16x16, 32x32) during design phase. Use SVG with thick strokes, high contrast.
**Warning signs:** Favicon is muddy/unclear in browser tabs, looks like generic placeholder.

### Pitfall 7: Brand Guide Becomes Stale
**What goes wrong:** Brand guide documents initial visual direction but doesn't evolve as project grows (new card designs, expanded color palette).
**Why it happens:** One-time documentation treated as immutable artifact rather than living system.
**How to avoid:** Version brand guide (e.g., BRAND_GUIDE_v1.md), add "Last updated" date, include "How to update this guide" section. Plan quarterly reviews.
**Warning signs:** New assets don't match guide specifications, team deviates from stated rules, guide never referenced.

## Code Examples

Verified patterns from official sources:

### MCP Skill Structure (Following Tarot Pattern)
```typescript
// Source: Existing skills/tarot/SKILL.md pattern
// skills/generate-image/SKILL.md (markdown frontmatter + instructions)
---
name: generate-image
description: Generate images using Replicate's Nano Banana Pro model with Esoterica's eco-futurist aesthetic. Use when creating hero images, social assets, or exploring visual variations.
agent: general-purpose
---

# Generate Image Skill

You are an image generation assistant using Nano Banana Pro (Gemini 3 Pro Image) to create visuals matching Esoterica's brand aesthetic.

## Usage

Invoke with parameters:
- scene: Brief scene description (e.g., "altar with tarot cards at sunrise")
- aspect_ratio: "16:9", "1:1", "9:16", or "match_input_image"
- variations: Number of images to generate (1-10)
- resolution: "1K", "2K", or "4K" (default: "2K")

Example invocation:
/generate-image scene="sacred altar in Joshua Tree at golden hour" aspect_ratio="16:9" variations=5
```

### Error Handling with Retry Logic
```typescript
// Source: https://replicate.com/docs/reference/http (rate limit guidance)
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Check for rate limit
      if (error.response?.status === 429) {
        const retryAfter = error.response.headers?.["retry-after"];
        const delay = retryAfter
          ? parseInt(retryAfter) * 1000
          : baseDelay * Math.pow(2, attempt);

        console.log(`Rate limited, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // Check for start timeout or memory errors
      if (error.message?.includes("start timeout") ||
          error.message?.includes("out of memory")) {
        console.log(`Resource error, retrying with backoff...`);
        await new Promise(resolve => setTimeout(resolve, baseDelay * Math.pow(2, attempt)));
        continue;
      }

      // Non-retryable error
      throw error;
    }
  }

  throw lastError!;
}
```

### Favicon Generation Pipeline
```typescript
// Source: https://sharp.pixelplumbing.com/ + https://kleinbyte.com/blog/the-ultimate-guide-to-favicon-creation-sizes-formats-and-best-practices-2026
import sharp from "sharp";
import { promises as fs } from "fs";

async function generateFavicons(sourceSvgPath: string, outputDir: string) {
  const sizes = [16, 32, 180]; // 16x16, 32x32, 180x180 (Apple touch)

  // Read SVG source
  const svgBuffer = await fs.readFile(sourceSvgPath);

  // Generate PNG variants
  for (const size of sizes) {
    const filename = size === 180
      ? "apple-touch-icon.png"
      : `favicon-${size}x${size}.png`;

    await sharp(svgBuffer)
      .resize(size, size, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent
      })
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(`${outputDir}/${filename}`);
  }

  // Copy SVG as-is (modern browsers)
  await fs.copyFile(sourceSvgPath, `${outputDir}/favicon.svg`);

  console.log("Generated favicons: SVG, 16x16, 32x32, 180x180");
}
```

### Brand Color Extraction
```typescript
// Source: https://www.npmjs.com/package/get-image-colors
import getColors from "get-image-colors";
import { writeFile } from "fs/promises";

interface BrandColor {
  name: string;
  hex: string;
  rgb: number[];
  usage: string;
}

async function generateColorPalette(imagePath: string): Promise<BrandColor[]> {
  const colors = await getColors(imagePath, "image/png");

  // Map prominence to usage
  const brandColors: BrandColor[] = [
    {
      name: "Primary",
      hex: colors[0].hex(),
      rgb: colors[0].rgb().array(),
      usage: "Hero text, primary CTAs, key accent elements"
    },
    {
      name: "Secondary",
      hex: colors[1].hex(),
      rgb: colors[1].rgb().array(),
      usage: "Subheadings, secondary buttons, icon highlights"
    },
    {
      name: "Accent",
      hex: colors[2].hex(),
      rgb: colors[2].rgb().array(),
      usage: "Links, hover states, notification badges"
    },
    // Neutrals (backgrounds, text)
    ...colors.slice(3, 6).map((color, i) => ({
      name: `Neutral ${i + 1}`,
      hex: color.hex(),
      rgb: color.rgb().array(),
      usage: "Backgrounds, borders, secondary text"
    }))
  ];

  // Write to brand guide
  const markdown = `## Color Palette\n\nExtracted from hero image on ${new Date().toISOString().split('T')[0]}:\n\n` +
    brandColors.map(c =>
      `### ${c.name}\n- **Hex:** \`${c.hex}\`\n- **RGB:** \`rgb(${c.rgb.join(', ')})\`\n- **Usage:** ${c.usage}\n`
    ).join('\n');

  await writeFile("brand/COLOR_PALETTE.md", markdown);
  return brandColors;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Stable Diffusion 1.5/2.1 | Gemini 3 Pro Image (Nano Banana Pro) | Nov 2025 | Better text rendering, multi-image composition, real-world knowledge, 4K output |
| Midjourney Discord | Replicate API programmatic access | 2023-2024 | Enables agentic invocation, automation, skill integration |
| Manual favicon sizing | SVG-first with Dark Mode support | 2025 | Single source file, scales infinitely, theme-aware |
| Static brand PDFs | Living digital brand systems | 2025-2026 | Collaborative platforms, real-time updates, interactive templates |
| Complex mega-prompts | High-signal keyword prompts | 2025-2026 | Model-specific optimization (Nano Banana prefers concise structured prompts) |

**Deprecated/outdated:**
- **DALL-E 2:** Superseded by DALL-E 3 and Gemini models for photorealism
- **ICO-only favicons:** Modern browsers support SVG, PNG preferred over ICO for quality
- **Social media sizes pre-2023:** Instagram switched to 4:5 grid display, updated specs required
- **Synchronous prediction.run():** Replicate deprecated in favor of async create/poll pattern

## Open Questions

Things that couldn't be fully resolved:

1. **Nano Banana Pro version pinning**
   - What we know: Current version is `0785fb14f5...`, model was released Nov 2025
   - What's unclear: How often Google updates the model, whether version hash changes with updates
   - Recommendation: Pin to specific version hash for consistency. Monitor Replicate changelog. Re-test prompts if version updates.

2. **Terminal text compositing vs. generation**
   - What we know: Nano Banana Pro has best-in-class text rendering, but terminal screens in photorealistic scenes may blur
   - What's unclear: Whether `/tarot` output will be legible at target resolution without post-processing
   - Recommendation: Generate with placeholder text first. If illegible, plan manual compositing step (overlay real terminal screenshot in post). Test both approaches during exploration.

3. **Color palette extraction accuracy**
   - What we know: get-image-colors and node-vibrant use different algorithms (RGB vs LAB clustering)
   - What's unclear: Which produces more aesthetically cohesive palettes for eco-futurist aesthetic
   - Recommendation: Extract with both libraries, compare results. Manual curation likely needed to select specific hues (e.g., prioritize warm sunrise tones over neutrals).

4. **Skill invocation pattern for multi-variant generation**
   - What we know: Tarot skill uses wizard (AskUserQuestion) for parameter collection
   - What's unclear: Whether generate-image should use wizard or accept inline parameters for 10+ batch generation
   - Recommendation: Support both: wizard for interactive exploration, inline params for batch scripting. Default to wizard when no params provided.

5. **Brand guide versioning strategy**
   - What we know: Visual language will evolve as Esoterica grows (new assets, expanded palette)
   - What's unclear: When to create new versions vs. update in place
   - Recommendation: Version major changes (new hero image, palette shift), update in place for minor additions (new social formats). Include changelog section.

## Sources

### Primary (HIGH confidence)
- **Replicate HTTP API docs** - https://replicate.com/docs/reference/http (authentication, prediction creation, polling, rate limits)
- **Replicate JavaScript SDK** - https://github.com/replicate/replicate-javascript (official client, TypeScript types, examples)
- **Nano Banana Pro model page** - https://replicate.com/google/nano-banana-pro (version ID, input parameters, pricing, capabilities)
- **Sharp documentation** - https://sharp.pixelplumbing.com/ (API reference, performance benchmarks)
- **get-image-colors** - https://www.npmjs.com/package/get-image-colors (color extraction API)

### Secondary (MEDIUM confidence)
- [Buffer: Social Media Image Sizes 2026](https://buffer.com/resources/social-media-image-sizes/) - Verified with multiple sources
- [Kleinbyte: Favicon Creation Best Practices 2026](https://kleinbyte.com/blog/the-ultimate-guide-to-favicon-creation-sizes-formats-and-best-practices-2026) - Comprehensive modern guide
- [Kijo: Brand Guidelines 2026](https://kijo.co.uk/blog/brand-guidelines/) - Current brand guide structure trends
- [Leonardo.ai: AI Image Prompts](https://leonardo.ai/news/ai-image-prompts/) - Prompt engineering patterns verified with IBM guide
- [FreeCodeCamp: MCP Server with TypeScript](https://www.freecodecamp.org/news/how-to-build-a-custom-mcp-server-with-typescript-a-handbook-for-developers/) - MCP development patterns

### Tertiary (LOW confidence)
- WebSearch results for Nano Banana Pro capabilities (Nov 2025 release info) - Not directly verified with Google DeepMind docs, but consistent across multiple sources
- WebSearch results for color extraction libraries - Feature claims not independently verified, rely on npm/GitHub docs
- MCP v2 release timeline (Q1 2026) - Mentioned in search results but not confirmed on official modelcontextprotocol.io roadmap

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official Replicate SDK and Sharp are industry standard, MCP pattern matches existing tarot skill
- Architecture: HIGH - Replicate polling pattern documented in official SDK, Sharp pipeline verified in docs, social specs from multiple authoritative sources
- Pitfalls: MEDIUM-HIGH - Rate limits and URL expiration documented by Replicate, other pitfalls based on general AI image generation experience and verified patterns
- Prompt engineering: MEDIUM - Best practices synthesized from multiple 2026 guides, but Nano Banana Pro-specific optimization requires experimentation

**Research date:** 2026-01-24
**Valid until:** 2026-02-28 (30 days) - AI image generation models evolve rapidly, social media specs stable but review quarterly
