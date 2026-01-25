---
phase: 12-visual-language
plan: 02
subsystem: brand
tags: [replicate, flux-pro, hero-image, visual-identity, diversity, eco-futurism]

# Dependency graph
requires:
  - phase: 12-01
    provides: generate-image skill with eco-futurist prompt templates
provides:
  - Hero image winner (background-figures diversity composition)
  - Visual identity foundation for social assets and brand guide
  - Prompt learnings on diversity representation
affects: [12-03-social-assets, brand-guide, landing-page]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Explicit diversity language ("skin tone spectrum") for global majority representation
    - Multi-batch iterative generation with prompt refinement
    - Archive preservation for rejected variations

key-files:
  created:
    - brand/hero/winners/hero-primary.png
  modified:
    - brand/hero/archive/ (29 images generated, archived locally)
    - .gitignore (brand/hero/archive exclusion)

key-decisions:
  - "Background-figures composition chosen over hands-only or no-people alternatives"
  - "Explicit diversity language required: 'diverse women' produced all-white figures"
  - "Skin tone spectrum phrasing most effective for global majority representation"
  - "Generation scripts and process docs removed from repo after completion"

patterns-established:
  - "Hero image selection: iterative generation with prompt refinement based on output"
  - "Archive management: preserve all variations locally, commit winners only"
  - "Diversity in AI generation: explicit skin tone language required, generic diversity fails"

# Metrics
duration: ~90min
completed: 2026-01-24
---

# Phase 12 Plan 02: Hero Image Generation Summary

**29 hero variations generated exploring figure presence and diversity; selected background-figures skin-tone-spectrum composition as primary hero image**

## Performance

- **Duration:** ~90 minutes (across multiple generation batches)
- **Started:** 2026-01-24T15:11:00Z
- **Completed:** 2026-01-25T00:45:00Z (user selection checkpoint)
- **Tasks:** 3
- **Files modified:** 2 (brand directory, .gitignore)

## Accomplishments

- Generated 29 hero image variations across 5 batches exploring:
  - Figure presence (hands-only, no-people, background-figures)
  - Terminal text visibility variations
  - Diversity representation approaches
- Discovered and resolved AI diversity representation issue (generic "diverse" language produces homogeneous output)
- Selected winner: background-figures composition with explicit skin tone spectrum
- Preserved archive of 29 images to ~/Pictures/esoterica-hero-archive/
- Cleaned up generation scripts and process docs from repo

## Task Commits

Each task was committed atomically:

1. **Task 1: Create brand directory structure** - `fccd21c` (feat)
2. **Task 2: Generate hero image variations** - Multiple commits:
   - `c26353e` - Initial 11 variations (hands-only, no-people, background-figures)
   - `80be89c` - Fix GenerateOptions interface for prompt variations
   - `4990c18` - Add .env file loading
   - `057a14e` - Terminal text variation generator
   - `1311cde` - Terminal variations comparison guide
   - `fd69c25` - Diversity emphasis variations (6 images)
   - `ecefef8` - Diversity variations summary
   - `267d042` - Diversity images review guide
3. **Task 3: Select hero image winner(s)** - User checkpoint resolved (hero-2026-01-25T00-33-39-diversity.png selected)

## Files Created/Modified

**Created:**
- `brand/hero/archive/.gitkeep` - Archive directory for all generated variations
- `brand/hero/winners/.gitkeep` - Winners directory for selected images
- `brand/hero/winners/hero-primary.png` - Selected hero image (7.4MB, skin-tone-spectrum diversity variation)
- `brand/social/.gitkeep` - Future social media assets
- `brand/favicon/.gitkeep` - Future favicon variants
- `~/Pictures/esoterica-hero-archive/` - Preserved archive of 29 rejected variations

**Modified:**
- `.gitignore` - Added brand/hero/archive/*.png exclusion (large files tracked locally only)

**Removed (cleanup after selection):**
- `brand/hero/generate-variations.ts` - Initial generation script
- `brand/hero/generate-terminal-variations.ts` - Terminal text variation script
- `brand/hero/generate-diversity-variations.ts` - Diversity variation script
- `brand/hero/GENERATION_LOG.md` - Generation process log
- `brand/hero/TERMINAL_VARIATIONS_COMPARISON.md` - Terminal text analysis
- `brand/hero/DIVERSITY_VARIATIONS_SUMMARY.md` - Diversity approach summary
- `brand/hero/REVIEW_DIVERSITY_IMAGES.md` - Diversity review guide

## Decisions Made

**1. Figure presence: Background-figures composition**
- Hands-only: Too intimate/close, lost environmental context
- No-people: Pure environment felt too sterile
- Background-figures: Best balance - human presence without portrait focus

**2. Diversity representation requires explicit language**
- Initial prompt: "Diverse women of color in flowing robes" → produced all-white figures
- Generic "diverse" language fails with AI image generation
- Solution: Explicit skin tone spectrum language

**3. Skin tone spectrum phrasing most effective**
- Tested variations: "Diverse women", "Women of color", "Global majority women"
- Winner prompt: "Women with skin tones ranging from deep ebony to warm mahogany to golden brown to olive to tan"
- Explicit spectrum language produced actual diversity

**4. Archive preservation vs repo cleanup**
- Keep all 29 variations locally for potential future reference
- Commit only winner to repo (avoid large file bloat)
- Remove generation scripts after completion (artifacts, not source)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Extended generation beyond planned 10 images**
- **Found during:** Task 2 (Initial batch evaluation)
- **Issue:** First 11 variations didn't achieve diversity goal; all figures appeared white despite "diverse women" prompt
- **Fix:** Generated additional batches with refined diversity prompts (5 batches total, 29 images)
- **Files modified:** Multiple generation scripts and summary docs
- **Verification:** Final batch with "skin tone spectrum" language achieved desired diversity
- **Committed in:** fd69c25 (Task 2 diversity generation)

**2. [Rule 3 - Blocking] Added .env file loading to generation script**
- **Found during:** Task 2 (First generation attempt)
- **Issue:** REPLICATE_API_TOKEN not found, generation failing
- **Fix:** Added dotenv.config() to generation script
- **Files modified:** brand/hero/generate-variations.ts
- **Verification:** Script successfully read API token from .env
- **Committed in:** 4990c18 (Task 2 commit)

**3. [Rule 2 - Missing Critical] Extended GenerateOptions interface**
- **Found during:** Task 2 (Prompt variation attempts)
- **Issue:** TypeScript error - prompt variation parameters not in GenerateOptions type
- **Fix:** Extended interface to include timeOfDay, figures, terminalText optional parameters
- **Files modified:** skills/generate-image/src/index.ts
- **Verification:** TypeScript compilation passed
- **Committed in:** 80be89c (Task 2 commit)

---

**Total deviations:** 3 auto-fixed (2 missing critical, 1 blocking)
**Impact on plan:** All fixes necessary for task completion. Diversity iteration essential to achieve Esoterica's global majority representation values - generic AI diversity prompts fail without explicit skin tone language.

## Issues Encountered

**AI diversity representation challenge:**
- Generic diversity language ("diverse women") produces homogeneous output
- Required iterative prompt refinement to achieve actual diversity
- Solution: Explicit skin tone spectrum language in prompts
- Learning applies to all future AI image generation for Esoterica

## User Setup Required

None - no external service configuration required.

## Prompt Learnings

**What worked:**
- Explicit skin tone spectrum: "deep ebony to warm mahogany to golden brown to olive to tan"
- Background figures composition (soft blur maintains focus on altar)
- Joshua Tree sunrise setting with warm golden light
- Tarot cards showing tagline text

**What didn't work:**
- Generic "diverse" language (produced all-white figures)
- "Women of color" (still homogeneous output)
- "Global majority women" (insufficient specificity)
- Hands-only composition (too close, lost context)
- No-people composition (too sterile, lost human element)

## Next Phase Readiness

**Ready for downstream phases:**
- Hero image selected and available at brand/hero/winners/hero-primary.png
- 7.4MB PNG suitable for web hero use and social media source
- Composition supports text overlay (soft background figures)
- Diversity representation aligns with Esoterica values

**For Plan 12-03 (Social Assets):**
- Source hero image ready for resizing
- Established visual language (eco-futurist, Joshua Tree, warm light, diverse figures)
- Prompt patterns for additional asset generation if needed

**Blockers/Concerns:**
None. Hero image selection complete.

---
*Phase: 12-visual-language*
*Completed: 2026-01-24*
