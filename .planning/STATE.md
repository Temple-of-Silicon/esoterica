# State: Esoterica

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-28)

**Core value:** Agents can draw and interpret tarot cards as a perspective-shifting tool
**Current focus:** v1.4 Website Upgrade -- Phase 20 (Mobile + Accessibility)

## Current Position

Milestone: v1.4 Website Upgrade
Phase: 20 of 22 (Mobile + Accessibility)
Plan: --
Status: Ready to plan
Last activity: 2026-01-28 -- Completed Phase 19 (Scroll Video)

Progress: [===================.] 90% (19/22 phases complete; 32 plans shipped)

## Performance Metrics

**Velocity:**
- Total plans completed: 32 (5 v1.0 + 5 v1.1 + 12 v1.2 + 8 v1.3 + 2 v1.4)
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

### Pending Todos

- [ ] Let users save readings to file (future candidate)
- [ ] Debug ugly argument parsing in Skill
- [ ] Explore subagent benefits for tarot skill
- [ ] Integrate tarot with GSD workflow while keeping independence
- [ ] Remove .claude-plugin directory (not configured properly)
- [ ] Add contribution policy - coven members only (no random PRs)

### Blockers/Concerns

None.

## Session Continuity

Last session: 2026-01-28
Stopped at: Phase 19 complete -- ready to plan Phase 20
Resume file: None

## Next Steps

1. Plan Phase 20 (Mobile + Accessibility)

---
*Last updated: 2026-01-28 -- Phase 19 complete*
