# Roadmap: Esoterica

## Milestones

- **v1.0 Tarot Skill** - Phases 1-5 (shipped 2026-01-22)
- **v1.1 Wizard UI** - Phases 6-9 (shipped 2026-01-23)
- **v1.2 Brand & Marketing** - Phases 10-15 (shipped 2026-01-26)
- **v1.3 Minor Arcana** - Phases 16-18 (active)

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

### v1.3 Minor Arcana (Phases 16-18)

**Goal:** Complete the 78-card deck with 56 Minor Arcana cards at full interpretive depth.

#### Phase 16: Architecture Refactor

**Goal:** Card data lives in separate files, SKILL.md becomes lean orchestration layer

**Dependencies:** None (foundation for v1.3)

**Requirements:**
- ARCH-01: Card data separated from SKILL.md into suit-based files
- ARCH-02: SKILL.md contains wizard flow, interpretation logic, and card index only
- ARCH-03: Card index includes name, suit, and keywords for all 78 cards
- ARCH-04: Read tool fetches only drawn cards' full meanings after selection
- ARCH-05: Five card data files: major-arcana.md, wands.md, cups.md, swords.md, pentacles.md

**Success Criteria:**
1. Agent can invoke `/tarot` and complete a reading using extracted major-arcana.md
2. SKILL.md contains card index (name, suit, keywords) but not full card meanings
3. Agent reads only the specific card file(s) needed after cards are drawn
4. All 22 Major Arcana cards work identically to v1.2 behavior

**Plans:** 2 plans

Plans:
- [x] 16-01-PLAN.md - Create card data files (major-arcana.md + suit placeholders)
- [x] 16-02-PLAN.md - Refactor SKILL.md with card index and loading instructions

---

#### Phase 17: Minor Arcana Content

**Goal:** All 56 Minor Arcana cards exist with full interpretive depth

**Dependencies:** Phase 16 (architecture must support separate card files)

**Requirements:**
- CARD-01: Wands suit - 14 cards with full depth
- CARD-02: Cups suit - 14 cards with full depth
- CARD-03: Swords suit - 14 cards with full depth
- CARD-04: Pentacles suit - 14 cards with full depth
- CARD-05: Each card has themes, situations, shadows, symbols
- CARD-06: Court cards have archetypal personality interpretations

**Success Criteria:**
1. User can draw any of 56 Minor Arcana cards and receive full interpretation
2. Each pip card (Ace-10) includes themes, situations where it applies, shadow aspects, and symbols
3. Each court card (Page, Knight, Queen, King) includes personality archetype interpretation
4. Suit elemental associations are consistent (Wands=fire/will, Cups=water/emotion, Swords=air/intellect, Pentacles=earth/material)

**Plans:** 4 plans

Plans:
- [x] 17-01-PLAN.md — Complete Wands suit (14 cards)
- [x] 17-02-PLAN.md — Complete Cups suit (14 cards)
- [x] 17-03-PLAN.md — Complete Swords suit (14 cards)
- [x] 17-04-PLAN.md — Complete Pentacles suit (14 cards)

---

#### Phase 18: Wizard Enhancement

**Goal:** Users can choose between Major-only and Full 78-card deck

**Dependencies:** Phase 16 (architecture), Phase 17 (content must exist)

**Requirements:**
- WIZD-01: Deck selection step in wizard
- WIZD-02: Deck choice affects card pool for random draw
- WIZD-03: Physical mode supports all 78 cards with fuzzy matching

**Success Criteria:**
1. Wizard presents deck choice before spread selection (Major Arcana only / Full 78-card deck)
2. Digital mode random draw pulls only from selected deck
3. Physical mode fuzzy matching recognizes all 78 card names (e.g., "3 of cups", "three cups", "III Cups")
4. Default deck selection preserves backwards compatibility (Major-only as default)

**Plans:** 2 plans

Plans:
- [ ] 18-01-PLAN.md — Add deck selection wizard step and conditional mode dispatch
- [ ] 18-02-PLAN.md — Expand card index to 78 cards and update fuzzy matching

---

## Progress

**Execution Order:** 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9 -> 10 -> 11 -> 12 -> 13 -> 14 -> 15 -> 16 -> 17 -> 18

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
| 18. Wizard Enhancement | v1.3 | 0/2 | Pending | - |

---
*Roadmap created: 2026-01-22*
*Last updated: 2026-01-26 - Phase 18 planned*
