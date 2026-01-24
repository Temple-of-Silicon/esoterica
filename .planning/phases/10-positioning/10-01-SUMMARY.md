---
phase: 10-positioning
plan: 01
subsystem: brand
tags: [tagline, naming, positioning, brand-identity]

# Dependency graph
requires:
  - phase: 10-positioning
    provides: "CONTEXT.md with tagline approach and audience balance decisions"
provides:
  - "Selected tagline: 'Ancient patterns, new paths'"
  - "Confirmed name: Esoterica"
  - "Brand direction: ancestral wisdom with forward momentum"
affects: [10-02-positioning-statement, 11-documentation, 13-landing-page, 14-launch-materials]

# Tech tracking
tech-stack:
  added: []
  patterns: []

key-files:
  created:
    - .planning/phases/10-positioning/brand/tagline-options.md
    - .planning/phases/10-positioning/brand/name-alternatives.md
  modified: []

key-decisions:
  - "Tagline: 'Ancient patterns, new paths' - balances High Priestess (ancient wisdom) with Chariot (forward momentum)"
  - "Name: Keep 'Esoterica' - none of the alternatives clearly beat the current name"
  - "Direction: Ancestral wisdom theme - timeless, archetypal resonance"

patterns-established:
  - "Tagline structure: evocative but clear, works paired with product name"
  - "Brand balance: intrigue-leaning (35/65) but not confusing"

# Metrics
duration: ~5min (across checkpoint pause)
completed: 2026-01-24
---

# Phase 10 Plan 01: Tagline and Name Selection Summary

**Selected tagline "Ancient patterns, new paths" with confirmed name "Esoterica" - ancestral wisdom direction balancing mystery and forward momentum**

## Performance

- **Duration:** ~5min (execution split across checkpoint)
- **Started:** 2026-01-23
- **Completed:** 2026-01-24
- **Tasks:** 3
- **Files created:** 2

## Accomplishments

- Generated 10 tagline options across clarity-intrigue spectrum with card theme annotations
- Explored 7 name alternatives with honest pros/cons analysis
- Selected final tagline and name direction through user decision checkpoint

## Task Commits

Each task was committed atomically:

1. **Task 1: Generate tagline options** - `44d08c1` (docs)
2. **Task 2: Generate name alternatives** - `56ccc17` (docs)
3. **Task 3: Select tagline and confirm name** - decision checkpoint (no commit - captured in summary)

## Files Created

- `.planning/phases/10-positioning/brand/tagline-options.md` - 10 taglines across clarity-intrigue spectrum with card themes
- `.planning/phases/10-positioning/brand/name-alternatives.md` - 7 alternatives analyzed, recommendation to keep Esoterica

## Decisions Made

### Tagline Selection: "Ancient patterns, new paths"

**Rationale from user:**
- Liked the "ancestral wisdom" direction for its timeless, archetypal resonance
- Balances High Priestess energy (ancient patterns, wisdom) with Chariot energy (new paths, forward momentum)
- Clear enough to understand, evocative enough to intrigue
- Implies depth without being confusing

**Spectrum position:** Intrigue-leaning (~35/65 clarity:intrigue)

**Card themes:** High Priestess (ancient wisdom, patterns) + Chariot (new paths, direction)

### Name Decision: Keep "Esoterica"

**Rationale:**
- After exploring 7 alternatives (Liminal, Parallax, Arcana, Prism, Threshold, Inflection, Vela), none clearly beat current name
- Esoterica already achieves what alternatives attempt: mystery without explicit tarot reference, intellectual resonance for developers, evocative depth for practitioners
- Unique and memorable

**Strongest contender considered:** Liminal (strong threshold energy, but more clinical than Esoterica's intellectual mysticism)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Ready for Plan 02: Positioning Statement and Dual-Audience Framing

**Inputs for Plan 02:**
- Tagline: "Ancient patterns, new paths"
- Name: Esoterica
- Direction: Ancestral wisdom with forward momentum
- Tone: Intrigue-leaning but clear, mystic voice from CONTEXT.md
- Audience balance: Truly equal between curious devs and practitioners

---
*Phase: 10-positioning*
*Completed: 2026-01-24*
