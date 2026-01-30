---
phase: 22-footer-polish
plan: 01
subsystem: ui
tags: [video, ffmpeg, scroll, performance, chrome]

# Dependency graph
requires:
  - phase: 19-scroll-video
    provides: hero.mp4 and scroll-scrubber.js
provides:
  - Re-encoded hero.mp4 with 25 keyframes for smooth Chrome seeking
  - Video loading state detection with poster hiding
affects: [none - polish phase, no downstream dependencies]

# Tech tracking
tech-stack:
  added: []
  patterns: [canplaythrough event for video readiness detection, timeout fallback for iOS Safari]

key-files:
  created: []
  modified:
    - site/public/video/hero.mp4
    - site/src/scripts/scroll-scrubber.js

key-decisions:
  - "CRF 32 instead of CRF 28 to keep file under 3MB (2.6MB vs 3.8MB)"

patterns-established:
  - "Video readiness: canplaythrough + timeout fallback for cross-browser reliability"

# Metrics
duration: 1.7min
completed: 2026-01-29
---

# Phase 22 Plan 01: Chrome Scroll Fix Summary

**Re-encoded hero.mp4 with 25 keyframes for smooth Chrome scroll seeking, plus canplaythrough-based poster hiding**

## Performance

- **Duration:** 1.7 min
- **Started:** 2026-01-30T01:36:03Z
- **Completed:** 2026-01-30T01:37:45Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Fixed Chrome scroll animation lag by adding keyframes every 10 frames (25 I-frames total)
- File size kept under 3MB (2.6MB with CRF 32)
- Added video loading state detection to hide poster when video ready for seeking
- Cross-browser fallback with 3-second timeout for Safari iOS edge case

## Task Commits

Each task was committed atomically:

1. **Task 1: Re-encode video with frequent keyframes** - `176b2f6` (perf)
2. **Task 2: Add video loading state detection** - `7c7adfc` (feat)

## Files Created/Modified
- `site/public/video/hero.mp4` - Re-encoded with keyframes every 10 frames (25 I-frames, 2.6MB)
- `site/src/scripts/scroll-scrubber.js` - Added hidePoster() with canplaythrough listener and timeout fallback

## Decisions Made
- **CRF 32 vs CRF 28:** Plan suggested CRF 28 but file was 3.8MB. Increased to CRF 32 to get 2.6MB (under 3MB target). Visual quality remains acceptable for background scroll video.

## Deviations from Plan

None - plan executed exactly as written. CRF adjustment was within plan's acceptable tradeoff guidance.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Chrome scroll animation should now be smooth (no keyframe decode lag)
- Poster hiding works automatically when video is buffered
- Ready for remaining Phase 22 plans

---
*Phase: 22-footer-polish*
*Completed: 2026-01-29*
