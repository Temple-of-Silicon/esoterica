# Roadmap: Esoterica

## Milestones

- **v1.0 Tarot Skill** - Phases 1-5 (shipped 2026-01-22)
- **v1.1 Wizard UI** - Phases 6-9 (shipped 2026-01-23)
- **v1.2 Brand & Marketing** - Phases 10-15 (shipped 2026-01-26)
- **v1.3 Minor Arcana** - Phases 16-18 (shipped 2026-01-26)
- **v1.4 Website Upgrade** - Phases 19-22 (in progress)

## Phases

<details>
<summary>v1.0 Tarot Skill (Phases 1-5) - SHIPPED 2026-01-22</summary>

See: `.planning/milestones/v1-ROADMAP.md` for full details.

5 phases, 5 plans, 13 requirements delivered:
- Phase 1: Skill Infrastructure
- Phase 2: Card System
- Phase 3: Voice System
- Phase 4: Configuration
- Phase 5: Polish & Integration

</details>

<details>
<summary>v1.1 Wizard UI (Phases 6-9) - SHIPPED 2026-01-23</summary>

See: `.planning/milestones/v1.1-ROADMAP.md` for full details.

4 phases, 5 plans, 14 requirements delivered:
- Phase 6: Wizard Infrastructure
- Phase 7: Spread Options
- Phase 8: Reading Modes
- Phase 9: Multi-Card Interpretation

</details>

<details>
<summary>v1.2 Brand & Marketing (Phases 10-15) - SHIPPED 2026-01-26</summary>

See: `.planning/milestones/v1.2-ROADMAP.md` for full details.

6 phases, 13 plans, 16 requirements delivered:
- Phase 10: Positioning (tagline, voice guidelines)
- Phase 11: Documentation (README)
- Phase 12: Visual Language (hero image, brand guide)
- Phase 13: Landing Page (docs/index.html)
- Phase 14: Launch Materials (LinkedIn, carousel, demo video)
- Phase 15: User Installation (npm package @templeofsilicon/esoterica)

</details>

<details>
<summary>v1.3 Minor Arcana (Phases 16-18) - SHIPPED 2026-01-26</summary>

See: `.planning/milestones/v1.3-ROADMAP.md` for full details.

3 phases, 8 plans, 14 requirements delivered:
- Phase 16: Architecture Refactor (lazy loading, card separation)
- Phase 17: Minor Arcana Content (56 cards across 4 suits)
- Phase 18: Wizard Enhancement (deck selection, fuzzy matching)

</details>

### v1.4 Website Upgrade

**Milestone Goal:** Transform the landing page from static hero image to an immersive scroll-driven video experience with Gateway Process illustrations and proper site footer.

- [ ] **Phase 19: Scroll Video** - Canvas-based scroll-scrubbed hero video from frame sequence
- [ ] **Phase 20: Mobile + Accessibility** - Mobile fallback, reduced-motion support, scroll hint
- [ ] **Phase 21: Gateway Illustrations** - Illustration prompts, integration, hybrid layout
- [ ] **Phase 22: Footer + Polish** - Site footer, loading states, Lighthouse audit

## Phase Details

### Phase 19: Scroll Video
**Goal**: Visitors experience Apple-style scroll-driven video playback tied to scroll position
**Depends on**: Phase 18 (existing Astro site from quick-002 migration)
**Requirements**: WEB-01, WEB-02
**Success Criteria** (what must be TRUE):
  1. Scrolling the hero section plays the video forward; scrolling back plays it in reverse
  2. First frame displays immediately as poster state before any scrolling
  3. Video frames are pre-extracted WebP images rendered to canvas (not video element scrubbing)
  4. Source video is compressed from 25MB original to optimized WebP frame sequence
  5. Page loads without jank -- scroll handler uses requestAnimationFrame throttling
**Plans**: TBD

### Phase 20: Mobile + Accessibility
**Goal**: The scroll video works gracefully on mobile devices and respects accessibility preferences
**Depends on**: Phase 19
**Requirements**: (extends WEB-01 -- mobile and a11y dimensions)
**Success Criteria** (what must be TRUE):
  1. Mobile visitors see a static poster or reduced frame set instead of full 240-frame sequence
  2. Users with `prefers-reduced-motion` enabled see a static frame with no scroll animation
  3. A scroll hint chevron communicates that the hero section is interactive
  4. Text overlay fades in sync with scroll progress
  5. Canvas resizes correctly when viewport dimensions change
**Plans**: TBD

### Phase 21: Gateway Illustrations
**Goal**: The landing page features Gateway Process-style illustrations that explain Esoterica's concepts
**Depends on**: Phase 18 (independent of video phases; can run after 19-20 or in parallel)
**Requirements**: WEB-03, WEB-04, WEB-05
**Success Criteria** (what must be TRUE):
  1. Illustration prompts are generated and ready for Nano Banana Pro image creation
  2. Illustrations appear on the landing page interspersed with prose and/or in a 3-column grid
  3. Illustrations are theme-aware (adapt to dark/light mode via CSS custom properties)
  4. Illustrations fade in on scroll using Intersection Observer
**Plans**: TBD

### Phase 22: Footer + Polish
**Goal**: The site has a complete footer and passes quality benchmarks
**Depends on**: Phases 19, 20, 21
**Requirements**: WEB-06
**Success Criteria** (what must be TRUE):
  1. Footer displays "(c) 02026-, Temple of Silicon" linking to templeofsilicon.com and GitHub icon linking to the repo
  2. Loading states show poster frame while video frames load
  3. Site scores 90+ on Lighthouse performance audit
  4. Site renders correctly in Chrome, Safari, Firefox, and Edge
**Plans**: TBD

## Requirement Coverage

| Requirement | Description | Phase | Status |
|-------------|-------------|-------|--------|
| WEB-01 | Scroll-scrubbed hero video | Phase 19, extended by Phase 20 | Pending |
| WEB-02 | Compress and integrate AI-generated hero video | Phase 19 | Pending |
| WEB-03 | Gateway Process-style illustrations | Phase 21 | Pending |
| WEB-04 | Illustration prompt generation for Nano Banana Pro | Phase 21 | Pending |
| WEB-05 | Page layout for illustrations | Phase 21 | Pending |
| WEB-06 | Footer with copyright and links | Phase 22 | Pending |

Coverage: 6/6 requirements mapped.

---

## Progress

**Execution Order:** 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9 -> 10 -> 11 -> 12 -> 13 -> 14 -> 15 -> 16 -> 17 -> 18 -> 19 -> 20 -> 21 -> 22

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Skill Infrastructure | v1.0 | 1/1 | Complete | 2026-01-22 |
| 2. Card System | v1.0 | 1/1 | Complete | 2026-01-22 |
| 3. Voice System | v1.0 | 1/1 | Complete | 2026-01-22 |
| 4. Configuration | v1.0 | 1/1 | Complete | 2026-01-22 |
| 5. Polish & Integration | v1.0 | 1/1 | Complete | 2026-01-22 |
| 6. Wizard Infrastructure | v1.1 | 1/1 | Complete | 2026-01-22 |
| 7. Spread Options | v1.1 | 2/2 | Complete | 2026-01-22 |
| 8. Reading Modes | v1.1 | 1/1 | Complete | 2026-01-22 |
| 9. Multi-Card Interpretation | v1.1 | 1/1 | Complete | 2026-01-22 |
| 10. Positioning | v1.2 | 2/2 | Complete | 2026-01-24 |
| 11. Documentation | v1.2 | 1/1 | Complete | 2026-01-24 |
| 12. Visual Language | v1.2 | 4/4 | Complete | 2026-01-25 |
| 13. Landing Page | v1.2 | 2/2 | Complete | 2026-01-25 |
| 14. Launch Materials | v1.2 | 3/3 | Complete | 2026-01-26 |
| 15. Set Up User Installation | v1.2 | 1/1 | Complete | 2026-01-26 |
| 16. Architecture Refactor | v1.3 | 2/2 | Complete | 2026-01-26 |
| 17. Minor Arcana Content | v1.3 | 4/4 | Complete | 2026-01-26 |
| 18. Wizard Enhancement | v1.3 | 2/2 | Complete | 2026-01-26 |
| 19. Scroll Video | v1.4 | 0/TBD | Not started | - |
| 20. Mobile + Accessibility | v1.4 | 0/TBD | Not started | - |
| 21. Gateway Illustrations | v1.4 | 0/TBD | Not started | - |
| 22. Footer + Polish | v1.4 | 0/TBD | Not started | - |

---
*Roadmap created: 2026-01-22*
*Last updated: 2026-01-28 -- v1.4 Website Upgrade roadmap added (Phases 19-22)*
