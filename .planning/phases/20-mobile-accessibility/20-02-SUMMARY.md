---
phase: 20-mobile-accessibility
plan: 02
subsystem: ui
tags: [scroll-hint, svg, css-animation, reduced-motion, a11y]

# Dependency graph
requires:
  - phase: 20-mobile-accessibility (plan 01)
    provides: Reduced motion CSS overrides, scroll-scrubber.js with motion detection
provides:
  - Scroll hint SVG chevron in hero section
  - CSS appear + bounce animation (motion-allowed only)
  - JS fade-out tied to scroll progress > 20%
  - Reduced-motion hiding via display: none
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Progressive enhancement: animation only in no-preference media query"
    - "Decorative elements use aria-hidden=true"
    - "Inline style override for JS-driven opacity changes"

key-files:
  modified:
    - site/src/pages/index.astro
    - site/src/styles/global.css
    - site/src/scripts/scroll-scrubber.js

key-decisions:
  - "Animation gated behind prefers-reduced-motion: no-preference (not default)"
  - "JS removes inline opacity style to restore CSS animation control when scrolling back up"

patterns-established:
  - "Progressive animation: base state has no animation, media query enables it"

# Metrics
duration: 2min
completed: 2026-01-28
---

# Phase 20 Plan 02: Scroll Hint Summary

**SVG chevron scroll hint with 1.5s delayed appear, bounce animation, and JS fade-out at 20% scroll progress**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-28T22:23:14Z
- **Completed:** 2026-01-28T22:24:49Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- SVG downward chevron positioned bottom-right of hero with aria-hidden="true"
- CSS animation: fades in after 1.5s delay, then gentle bounce (motion-allowed only)
- JS fade-out at >20% scroll progress, restores CSS animation when scrolling back
- Completely hidden for reduced-motion users via display: none

## Task Commits

Each task was committed atomically:

1. **Task 1: Add scroll hint element and CSS styles** - `b1117df` (feat)
2. **Task 2: Add scroll hint fade-out logic to scroll scrubber** - `49c859a` (feat)

## Files Created/Modified
- `site/src/pages/index.astro` - Added .scroll-hint div with SVG chevron inside .hero-sticky
- `site/src/styles/global.css` - Scroll hint positioning, animation keyframes, reduced-motion hiding
- `site/src/scripts/scroll-scrubber.js` - Scroll hint fade-out logic at >20% progress

## Decisions Made
- Animation gated behind `prefers-reduced-motion: no-preference` media query rather than default animation with reduce override -- follows progressive enhancement pattern
- JS uses `style.removeProperty('opacity')` instead of setting opacity back to a value -- this lets the CSS `hint-appear` animation remain in control when user scrolls back up

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Mobile + Accessibility phase complete (both plans shipped)
- Ready for Phase 21 (Illustrations) or Phase 22 (Final Polish)

---
*Phase: 20-mobile-accessibility*
*Completed: 2026-01-28*
