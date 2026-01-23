# Roadmap: Esoterica

## Milestones

- **v1.0 Tarot Skill** - Phases 1-5 (shipped 2026-01-22)
- **v1.1 Wizard UI** - Phases 6-9 (in progress)

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

### v1.1 Wizard UI (In Progress)

**Milestone Goal:** Replace inline args with interactive wizard flow, add spread selection and physical reading mode.

```
Phase 6: Wizard Infrastructure  -> AskUserQuestion replaces inline args
Phase 7: Spread Options         -> Single, 3-card, LLM-suggested, custom
Phase 8: Reading Modes          -> Digital vs physical card selection
Phase 9: Multi-Card Interpretation -> Position-aware multi-card readings
```

- [x] **Phase 6: Wizard Infrastructure** - AskUserQuestion wizard replaces inline args
- [x] **Phase 7: Spread Options** - Four spread types available in wizard
- [x] **Phase 8: Reading Modes** - Digital and physical reading modes
- [ ] **Phase 9: Multi-Card Interpretation** - Position-aware interpretation engine

## Phase Details

### Phase 6: Wizard Infrastructure

**Goal**: `/tarot` launches interactive wizard instead of accepting inline arguments
**Depends on**: Phase 5 (working skill infrastructure from v1.0)
**Requirements**: WIZ-01, WIZ-02, WIZ-03, WIZ-04
**Success Criteria** (what must be TRUE):
  1. Running `/tarot` opens a tabbed wizard interface (not inline args)
  2. Tab 1 collects user's question or context for the reading
  3. Tab 2 presents spread selection (options can be placeholder for now)
  4. Tab 3 presents mode selection (options can be placeholder for now)
  5. Completing wizard triggers reading flow with collected inputs
**Plans**: 1 plan

Plans:
- [x] 06-01-PLAN.md — Add AskUserQuestion wizard, remove context fork, update reading flow

---

### Phase 7: Spread Options

**Goal**: Users can choose from four spread types when requesting a reading
**Depends on**: Phase 6 (wizard infrastructure)
**Requirements**: SPREAD-01, SPREAD-02, SPREAD-03, SPREAD-04
**Success Criteria** (what must be TRUE):
  1. User can select single card spread (current behavior preserved)
  2. User can select Situation/Action/Outcome 3-card spread
  3. User can select "Claude suggests" and LLM generates contextual positions
  4. User can select custom spread and type their own position names
  5. Selected spread passes position names to card selection flow
**Plans**: 2 plans

Plans:
- [x] 07-01-PLAN.md — Wizard options update, spread dispatch, three-card preset implementation
- [x] 07-02-PLAN.md — LLM-suggested and custom spread implementations

---

### Phase 8: Reading Modes

**Goal**: Users can choose between digital (random) and physical (enter cards) modes
**Depends on**: Phase 6 (wizard infrastructure)
**Requirements**: MODE-01, MODE-02, MODE-03
**Success Criteria** (what must be TRUE):
  1. Digital mode performs random card selection (current shuf behavior)
  2. Physical mode prompts user to enter cards they drew from real deck
  3. Physical mode accepts card names ("The Tower") or numbers (16)
  4. Both modes work with any spread type (1 card or multiple)
**Plans**: 1 plan

Plans:
- [x] 08-01-PLAN.md - Card matching infrastructure, physical mode entry flow, mode dispatch

---

### Phase 9: Multi-Card Interpretation

**Goal**: Subagent interprets multi-card spreads with position awareness
**Depends on**: Phase 7 (spreads), Phase 8 (modes)
**Requirements**: INTERP-01, INTERP-02, INTERP-03
**Success Criteria** (what must be TRUE):
  1. Single card interpretation works as before (regression check)
  2. Multi-card readings connect meaning across positions (not just 3 separate interpretations)
  3. Position names ("Problem", "Solution", "Synthesis") inform how each card is interpreted
  4. LLM-suggested and custom position names work with interpretation engine
**Plans**: TBD

Plans:
- [ ] 09-01: Extend subagent prompt for multi-card position-aware interpretation

---

## Progress

**Execution Order:** 6 -> 7 -> 8 -> 9

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
| 9. Multi-Card Interpretation | v1.1 | 0/1 | Not started | - |

---
*Roadmap created: 2026-01-22*
*Last updated: 2026-01-22 - Phase 8 complete*
