# State: Esoterica

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-28)

**Core value:** Agents can draw and interpret tarot cards as a perspective-shifting tool
**Current focus:** v1.4 Website Upgrade -- Phase 22 in progress

## Current Position

Milestone: v1.4 Website Upgrade
Phase: 22 of 22 (Footer + Polish)
Plan: 01 of 02 (Chrome Scroll Fix)
Status: In progress
Last activity: 2026-01-29 -- Completed 22-01-PLAN.md (Chrome scroll fix)

Progress: [====================] 97% (21/22 phases complete; 37 plans shipped)

## Performance Metrics

**Velocity:**
- Total plans completed: 36 (5 v1.0 + 5 v1.1 + 12 v1.2 + 8 v1.3 + 6 v1.4)
- Average duration (v1.1): 2.4 min
- Average duration (v1.2): 7.6 min
- Average duration (v1.3): 2.0 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| v1.0 Phases 1-5 | 5 | - | - |
| Phase 6 (Wizard Infrastructure) | 1 | 3 min | 3 min |
| Phase 7 (Spread Options) | 2 | 4 min | 2 min |
| Phase 8 (Reading Modes) | 1 | 3 min | 3 min |
| Phase 9 (Multi-Card Interpretation) | 1 | 2 min | 2 min |
| Phase 10 (Positioning) | 2 | ~13 min | ~6.5 min |
| Phase 11 (Documentation) | 1 | 1.4 min | 1.4 min |
| Phase 12 (Visual Language) | 4 | 21.5 min | 5.4 min |
| Phase 13 (Landing Page) | 2 | ~46 min | ~23 min |
| Phase 14 (Launch Materials) | 3 | ~39 min | ~13 min |
| Phase 16 (Architecture Refactor) | 2 | 5 min | 2.5 min |
| Phase 17 (Minor Arcana Content) | 4 | ~12 min | ~3 min |
| Phase 18 (Wizard Enhancement) | 2 | ~3.7 min | ~1.9 min |
| Phase 19 (Scroll Video) | 2 | ~10 min | ~5 min |
| Phase 20 (Mobile + A11y) | 2 | ~4 min | ~2 min |
| Phase 21 (Illustrations) | 2 | ~3 hrs | ~1.5 hrs |
| Phase 22 (Footer + Polish) | 1 | ~1.7 min | ~1.7 min |

## Accumulated Context

### Decisions

All decisions logged in PROJECT.md Key Decisions table.

**v1.4 Roadmap:**
- 4 phases derived from 6 requirements (depth=quick)
- Video element with scroll-driven currentTime (NOT canvas + frame images)
- Vanilla JS only -- zero runtime dependencies preserved
- ffmpeg for video compression
- Phase 21 (illustrations) independent of video phases -- could parallelize
- Source video: /Users/jem/Downloads/weavy-Kling First & Last Frame-2026-01-28 at 11.59.12.mp4

**Phase 19 Scroll Video:**
- CRF 28 yields 1.8MB from 25MB source (93% reduction)
- h264 Main profile, Level 4.0, faststart, no audio
- Video committed to repo (1.8MB, small enough for git — no CI pipeline for generation)
- 300vh hero with sticky inner container, scroll maps to video.currentTime
- BASE_URL trailing slash bug found and fixed

**Phase 20 Mobile + A11y (Plan 01):**
- Poster img hidden by default, shown via CSS reduced-motion query (no JS needed for swap)
- Video src removed via JS for reduced-motion users to prevent 1.8MB download
- Hero collapses to 100vh/100svh in reduced-motion mode
- Resize handler reuses existing ticking flag and updateVideoTime function
- iOS Safari: poster attribute + #t=0.001 for first-frame display

**Phase 20 Mobile + A11y (Plan 02):**
- SVG chevron scroll hint in hero, appears after 1.5s with bounce animation
- Animation gated behind prefers-reduced-motion: no-preference
- JS fades hint at >20% scroll progress, restores CSS animation on scroll-back
- display: none in reduced-motion media query

**Phase 21 Gateway Illustrations:**
- Nano Banana Pro via Replicate API for line art generation (60+ variations)
- Custom stamp-filter.mjs replicates Photoshop Stamp filter (sharp: grayscale → blur → threshold)
- User style suffix: "fineliner line art, heavy stippling texture, imperfect, rough drawings..."
- CSS breakout layout: margin-left 50% + translateX(-50%) pattern
- Dark mode: filter invert(1) on img only (not caption)
- IntersectionObserver scroll reveal with threshold 0.15, rootMargin -50px
- Archive saved to ~/Pictures/esoterica-illustrations-archive/

**Phase 22 Chrome Scroll Fix:**
- Re-encoded hero.mp4 with keyframes every 10 frames (25 I-frames)
- CRF 32 for 2.6MB file size (originally 3.8MB at CRF 28)
- canplaythrough event + 3s timeout fallback for poster hiding
- Video readiness pattern: canplaythrough listener with { once: true }

### Pending Todos

- [x] Debug Chrome scroll animation lag (works fine in Safari) -- FIXED in 22-01
- [ ] Let users save readings to file (future candidate)
- [ ] Debug ugly argument parsing in Skill
- [ ] Explore subagent benefits for tarot skill
- [ ] Integrate tarot with GSD workflow while keeping independence
- [ ] Remove .claude-plugin directory (not configured properly)
- [ ] Add contribution policy - coven members only (no random PRs)

### Blockers/Concerns

None.

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 003 | LinkedIn carousel posts with witchy voice | 2026-01-29 | ee5383f | [003-linkedin-carousel-posts](./quick/003-linkedin-carousel-posts/) |

## Session Continuity

Last session: 2026-01-29
Stopped at: Completed 22-01-PLAN.md (Chrome scroll fix)
Resume file: None

## Next Steps

1. Execute 22-02-PLAN.md (Footer remaining work)

---
*Last updated: 2026-01-29 -- Completed 22-01-PLAN.md (Chrome scroll fix)*
