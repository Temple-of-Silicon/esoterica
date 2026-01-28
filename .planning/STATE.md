# State: Esoterica

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-26)

**Core value:** Agents can draw and interpret tarot cards as a perspective-shifting tool
**Current focus:** Planning next milestone

## Current Position

Milestone: v1.3 Minor Arcana — ARCHIVED
Phase: Ready for v1.4
Plan: Not started
Status: Milestone complete and archived
Last activity: 2026-01-27 — Completed quick task 002: Astro migration with 96% hero image reduction

Progress: Ready for new milestone

## Performance Metrics

**Velocity:**
- Total plans completed: 30 (5 v1.0 + 5 v1.1 + 12 v1.2 + 8 v1.3)
- Average duration (v1.1): 2.4 min
- Average duration (v1.2): 7.6 min
- Average duration (v1.3): 2.0 min
- Total execution time (v1.2): ~84 min
- Total execution time (v1.3): ~16.7 min

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
| Phase 17 (Minor Arcana Content) | 4/4 | ~12 min | ~3 min |
| Phase 18 (Wizard Enhancement) | 2/2 | ~3.7 min | ~1.9 min |

## v1.3 Phase Status

| Phase | Goal | Requirements | Status |
|-------|------|--------------|--------|
| 16 | Architecture Refactor | ARCH-01 through ARCH-05 | Complete ✓ |
| 17 | Minor Arcana Content | CARD-01 through CARD-06 | Complete ✓ |
| 18 | Wizard Enhancement | WIZD-01 through WIZD-03 | Complete ✓ |

## Accumulated Context

### Decisions

All decisions logged in PROJECT.md Key Decisions table.

**v1.3 Planning:**
- 3 phases derived from 14 requirements (depth=quick)
- Architecture refactor first to enable lazy card loading
- Card content as single phase (4 suits share same structure)
- Wizard enhancement last (depends on content existing)

**Phase 16-01 Decisions:**
- Extract card data to separate files for lazy loading after draw
- Use horizontal rules (---) as visual separators between cards
- Document elemental associations in Minor Arcana placeholder files
- Card data format: "## Card N: Name" for easy Claude Read tool lookup

**Phase 16-02 Decisions:**
- Card Index table format: # | Name | Suit | Keywords for quick lookup
- Loading instructions explicitly reference cards/major-arcana.md
- Maintainer notes updated to reflect lazy loading architecture
- Orchestration pattern: Index → Identify → Load → Interpret

**Phase 17-01 Decisions:**
- All 14 Wands cards express Fire element (will, action, creativity, passion)
- Pip cards (Ace-10) follow journey progression narrative through numbered meanings
- Court cards embed archetypal personality in Themes field (no separate sections)
- Situations field contains concrete scenarios, not abstract keywords

**Phase 17-02 Decisions:**
- Water element expressed through emotion/relationship domain across all 14 Cups cards
- Court cards use standard format with archetypal personality embedded in Themes
- Pip cards follow narrative journey: Ace (seed) → 10 (completion)
- Situations are concrete scenarios not abstract keywords

**Phase 17-03 Decisions:**
- Balanced difficult cards (3, 9, 10) with constructive perspective while honoring pain
- Emphasized concrete situations over abstract keywords throughout Swords suit
- Maintained voice consistency with Major Arcana quality

**Phase 17-04 Decisions:**
- Pip cards (Ace-10) follow journey progression narrative
- Court cards embed archetypal personality in Themes rather than separate section
- All situations are concrete scenarios (e.g., "Starting a business") not abstract keywords
- Earth element expressed through material/work/body/finances/practical concerns

**Phase 18-01 Decisions:**
- Major Arcana only listed first and described as "recommended" for backwards compatibility
- Question 2.5 inserted between spread and mode for logical flow
- Conditional shuf ranges applied across all spread types (Single, Three-Card, Claude Suggests, Custom)
- Deck choice determines card pool range consistently across all spread/mode combinations

**Phase 18-02 Decisions:**
- Card numbering follows suit-based scheme (Wands 22-35, Cups 36-49, Swords 50-63, Pentacles 64-77)
- Optional 'of' in Minor Arcana names (users naturally say 'three cups' not 'three of cups')
- Court card abbreviations support natural shortcuts (Q, K, Kn, P) for physical deck users

### Previous Milestone Deliverables

**v1.2 Shipped 2026-01-26:**
- npm package: `npx @templeofsilicon/esoterica`
- Landing page: `docs/index.html`
- Brand assets: hero image, social variants, favicon, brand guide
- Launch materials: LinkedIn posts, carousel, demo video

### Pending Todos

- [ ] Let users save readings to file (v1.4 candidate)
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
| 001 | Review README and update for current feature set | 2026-01-27 | 16113db | [001-review-readme-and-update-for-current-fea](./quick/001-review-readme-and-update-for-current-fea/) |
| 002 | Migrate landing page to Astro (hero 7.1MB → 268KB) | 2026-01-27 | 50316e9 | [002-migrate-landing-page-to-astro](./quick/002-migrate-landing-page-to-astro/) |

## Session Continuity

Last session: 2026-01-27
Stopped at: Quick task 002 complete — Astro migration
Resume file: None

## Next Steps

1. `/gsd:new-milestone` — Start v1.4 planning (questioning → research → requirements → roadmap)

### v1.2 Launch Checklist (Still Active)

- [ ] Enable GitHub Pages (Settings → Pages → Source: GitHub Actions)
- [ ] Test OG tags at https://metatags.io/
- [ ] Post LinkedIn teaser (brand/launch/linkedin-posts.md)
- [ ] Wait 1-3 days
- [ ] Post LinkedIn announcement with carousel + demo video
- [ ] Share landing page URL: jem-computer.github.io/esoterica

---
*Last updated: 2026-01-27 — quick-002 completed*
