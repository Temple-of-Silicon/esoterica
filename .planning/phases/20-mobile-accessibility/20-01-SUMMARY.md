---
phase: 20-mobile-accessibility
plan: 01
subsystem: ui
tags: [a11y, prefers-reduced-motion, wcag, css-media-query, scroll-video, poster, ios-safari, resize]

# Dependency graph
requires:
  - phase: 19-scroll-video
    provides: Scroll-driven video hero with scroll-scrubber.js and ScrollVideo.astro
provides:
  - hero-poster.jpg static fallback extracted from hero.mp4 first frame
  - prefers-reduced-motion CSS overrides (hero collapse, video hide, poster show, transitions killed)
  - JS motion detection with video src removal to prevent download
  - Viewport resize handler for scroll-to-video recalculation
affects: [20-02 touch targets and mobile viewport]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "prefers-reduced-motion media query for WCAG 2.1 compliance"
    - "JS matchMedia early-exit pattern to prevent resource download"
    - "iOS Safari #t=0.001 video first-frame fix"
    - "Passive resize listener reusing existing RAF ticking flag"

key-files:
  created:
    - site/public/video/hero-poster.jpg
  modified:
    - site/src/components/ScrollVideo.astro
    - site/src/scripts/scroll-scrubber.js
    - site/src/styles/global.css

key-decisions:
  - "Poster img element hidden by default, shown via CSS reduced-motion query (no JS needed for swap)"
  - "Video src removed via JS for reduced-motion users to prevent 1.8MB download"
  - "Hero collapses to 100vh/100svh in reduced-motion mode, eliminating blank scroll gap"
  - "Resize handler reuses existing ticking flag and updateVideoTime function"

patterns-established:
  - "Reduced-motion: CSS hides motion elements, JS prevents resource download, both independent"
  - "iOS Safari video: poster attribute + #t=0.001 src suffix for first-frame display"

# Metrics
duration: 2min
completed: 2026-01-28
---

# Phase 20 Plan 01: Reduced Motion + Resize Summary

**prefers-reduced-motion support with static poster fallback, video src removal to prevent download, and passive resize handler for viewport changes**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-28T22:18:25Z
- **Completed:** 2026-01-28T22:20:05Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Extracted hero-poster.jpg (1920x1068, 266KB) from hero.mp4 first frame via ffmpeg
- Added prefers-reduced-motion CSS overrides: hero collapses to 100vh, video hidden, poster shown, all transitions killed, text forced visible
- JS motion detection removes video src attribute to prevent 1.8MB download for reduced-motion users
- Passive resize listener recalculates scroll-to-video time mapping on viewport change

## Task Commits

Each task was committed atomically:

1. **Task 1: Extract poster frame and add poster attribute to video** - `2012976` (feat)
2. **Task 2: Add reduced-motion CSS overrides, JS motion detection, and resize handler** - `e4864d0` (feat)

## Files Created/Modified
- `site/public/video/hero-poster.jpg` - Static poster frame extracted from hero.mp4 first frame (1920x1068, 266KB JPEG)
- `site/src/components/ScrollVideo.astro` - Video element with poster attribute, #t=0.001 iOS fix, hidden poster img for reduced-motion swap
- `site/src/scripts/scroll-scrubber.js` - Reduced-motion early exit (removes video src, prevents scroll handler), passive resize listener
- `site/src/styles/global.css` - Default .hero-bg-poster hidden rule, @media (prefers-reduced-motion: reduce) block with hero collapse, video/poster swap, transition kill, text visibility

## Decisions Made
- Poster img element hidden by default via CSS, shown in reduced-motion media query -- no JS needed for the visual swap, CSS handles it independently
- Video src removed via JS `removeAttribute('src')` + `video.load()` to cancel the 1.8MB network request for reduced-motion users
- Hero collapses from 300vh to 100vh/100svh in reduced-motion mode, eliminating the blank scroll gap that would exist without the video progression
- Resize handler reuses existing `ticking` flag and `updateVideoTime()` function rather than introducing new state

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Reduced-motion and resize handling complete, ready for Plan 02 (touch targets and mobile viewport)
- All existing functionality preserved for motion-enabled users
- No blockers

---
*Phase: 20-mobile-accessibility*
*Completed: 2026-01-28*
