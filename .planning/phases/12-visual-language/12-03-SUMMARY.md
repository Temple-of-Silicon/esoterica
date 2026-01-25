---
phase: 12-visual-language
plan: 03
subsystem: brand
tags: [sharp, image-processing, social-media, favicon, visual-assets]

# Dependency graph
requires:
  - phase: 12-02
    provides: Hero image (hero-primary.png) as source for asset variants
provides:
  - Social media asset kit (5 formats: OG, LinkedIn, Twitter, Instagram)
  - Favicon set (SVG source + 3 PNG sizes)
  - Image generation scripts for asset creation
affects: [13-landing-page, brand-assets, web-integration]

# Tech tracking
tech-stack:
  added: []
  patterns: ["Sharp-based asset generation from single source", "Smart crop with attention positioning"]

key-files:
  created:
    - brand/social/og-image.png
    - brand/social/linkedin.png
    - brand/social/twitter.png
    - brand/social/instagram-square.png
    - brand/social/instagram-story.png
    - brand/favicon/favicon.svg
    - brand/favicon/favicon-16x16.png
    - brand/favicon/favicon-32x32.png
    - brand/favicon/apple-touch-icon.png
    - skills/generate-image/generate-social-assets.ts
    - skills/generate-image/generate-favicons.ts
  modified: []

key-decisions:
  - "Placed generation scripts in skills/generate-image/ to leverage existing Sharp dependency"
  - "Used Sharp's 'attention' positioning for smart cropping social variants"
  - "Minimalist tarot card with star motif for favicon recognition at small sizes"

patterns-established:
  - "Asset generation scripts colocated with dependencies"
  - "Single source of truth (hero-primary.png) for all social variants"

# Metrics
duration: 4.3min
completed: 2026-01-24
---

# Phase 12 Plan 03: Social Media & Favicon Assets Summary

**Complete social media kit (5 formats) and favicon set (4 files) generated from hero image with smart cropping and brand-consistent tarot motif**

## Performance

- **Duration:** 4.3 min
- **Started:** 2026-01-25T00:48:07Z
- **Completed:** 2026-01-25T00:52:25Z
- **Tasks:** 2
- **Files created:** 11

## Accomplishments
- 5 social media variants with platform-specific dimensions and smart cropping
- SVG favicon source with minimalist tarot card and mystical star design
- 3 PNG favicon variants (16x16, 32x32, 180x180) for cross-platform browser support
- Reusable generation scripts for future asset updates

## Task Commits

Each task was committed atomically:

1. **Task 1: Generate social media asset variants** - `a0997ca` (feat)
2. **Task 2: Create favicon** - `d860923` (feat)

## Files Created/Modified

**Social media assets:**
- `brand/social/og-image.png` - Open Graph (1200x630) for website sharing
- `brand/social/linkedin.png` - LinkedIn (1200x627) for professional network
- `brand/social/twitter.png` - Twitter/X (1200x675) for social sharing
- `brand/social/instagram-square.png` - Instagram feed (1080x1080) for visual posts
- `brand/social/instagram-story.png` - Instagram story (1080x1920) for vertical content

**Favicon files:**
- `brand/favicon/favicon.svg` - Vector source with tarot card and star motif
- `brand/favicon/favicon-16x16.png` - Browser tab favicon
- `brand/favicon/favicon-32x32.png` - Standard favicon
- `brand/favicon/apple-touch-icon.png` - iOS home screen icon (180x180)

**Generation scripts:**
- `skills/generate-image/generate-social-assets.ts` - Social media variant generator with Sharp
- `skills/generate-image/generate-favicons.ts` - Favicon PNG generator from SVG source

## Decisions Made

**Script location:** Placed generation scripts in `skills/generate-image/` to leverage existing Sharp dependency rather than creating root-level package.json. This avoids dependency duplication and follows the existing project structure where Sharp is already installed.

**Smart cropping:** Used Sharp's `position: "attention"` parameter for social media variants, which analyzes image content and crops to preserve important areas rather than simple center crop. This ensures faces and key visual elements remain visible across different aspect ratios.

**Favicon design:** Created minimalist tarot card with star motif that remains recognizable at 16x16 pixels. Dark card (#1a1a2e) with golden accents (#c9a87c) matches eco-futurist aesthetic from hero image while providing sufficient contrast for browser tabs.

**Instagram story consideration:** 9:16 aspect ratio for Instagram stories crops significantly from 16:9 hero image. Smart cropping handles this automatically, but future dedicated vertical compositions may be considered if vertical social content becomes priority.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added __dirname polyfill for ESM modules**
- **Found during:** Task 1 (running generate-social-assets.ts)
- **Issue:** Script used `__dirname` which doesn't exist in ESM modules, causing `ReferenceError: __dirname is not defined`
- **Fix:** Added ESM-compatible `__dirname` using `path.dirname(fileURLToPath(import.meta.url))`
- **Files modified:** skills/generate-image/generate-social-assets.ts, skills/generate-image/generate-favicons.ts
- **Verification:** Scripts run successfully with tsx
- **Committed in:** a0997ca, d860923 (task commits)

**2. [Rule 3 - Blocking] Updated paths to use path.resolve() for module resolution**
- **Found during:** Task 1 (initial script run from brand/scripts/)
- **Issue:** Script couldn't find Sharp module due to being outside skills/generate-image/ directory
- **Fix:** Moved scripts to skills/generate-image/ and used absolute paths with `path.resolve(__dirname, "../../brand/...")`
- **Files modified:** Script location changed from brand/scripts/ to skills/generate-image/
- **Verification:** Sharp imports successfully, all assets generated
- **Committed in:** a0997ca, d860923 (task commits)

---

**Total deviations:** 2 auto-fixed (2 blocking - module resolution issues)
**Impact on plan:** Both fixes necessary for script execution. No scope creep - all planned assets delivered.

## Issues Encountered

**Module resolution in TypeScript:** Initial plan placed scripts in `brand/scripts/` but Sharp dependency is in `skills/generate-image/package.json`. Rather than duplicating dependencies, moved scripts to where Sharp is installed. This is cleaner and follows existing project structure.

**ESM vs CommonJS:** tsx runs scripts in ESM mode, requiring `__dirname` polyfill. This is standard ESM pattern and improves compatibility.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for landing page integration:**
- All social meta tags can reference `brand/social/og-image.png`, `brand/social/twitter.png`
- Favicon files ready for `<link>` tags in HTML head
- Assets maintain visual consistency with hero image
- File sizes optimized (compression level 9 for social assets)

**Potential future improvements:**
- Instagram story (9:16) may benefit from dedicated vertical composition if vertical social content becomes priority
- Additional social formats (Facebook, Pinterest) can be added to generation scripts using same pattern

**No blockers.**

---
*Phase: 12-visual-language*
*Completed: 2026-01-24*
