# Roadmap: Esoterica v1

**Created:** 2025-01-21
**Core Value:** Agents can draw and interpret tarot cards as a perspective-shifting tool for problem-solving, planning, and self-mythologizing.

## Overview

5 phases building toward a working `/tarot` skill with two voice options.

```
Phase 1: Skill Infrastructure    → /tarot invokes, spawns subagent
Phase 2: Card System            → 22 Major Arcana with meanings
Phase 3: Voice System           → Mystic and Grounded interpretive lenses
Phase 4: Configuration          → Global voice preference
Phase 5: Polish & Integration   → Both invocation paths working
```

---

## Phase 1: Skill Infrastructure

**Goal:** `/tarot` command invokes skill and spawns tarot-reader subagent

**Requirements covered:** SKILL-01, SKILL-02, SKILL-03

**Plans:** 1 plan

Plans:
- [ ] 01-01-PLAN.md — Create tarot skill with context fork and random card selection

**Deliverables:**
- [ ] Skill file at `~/.claude/skills/tarot/SKILL.md`
- [ ] Skill registered in Claude Code
- [ ] Skill spawns `tarot-reader` subagent via context fork
- [ ] Random card selection via bash shuf (0-21)

**Success criteria:**
- Running `/tarot` spawns a subagent
- Subagent receives a random card number
- Basic response confirms flow works

**Dependencies:** None (first phase)

---

## Phase 2: Card System

**Goal:** 22 Major Arcana cards with meanings embedded in subagent

**Requirements covered:** CARD-01, CARD-02, CARD-03

**Plans:** (created by /gsd:plan-phase)

Plans:
- [ ] TBD — Plan details will be created during phase planning

**Deliverables:**
- [ ] All 22 Major Arcana cards defined
- [ ] Each card has: name, number, keywords, core meaning, symbolism
- [ ] Card data embedded in tarot-reader subagent prompt
- [ ] Subagent can interpret any card contextually

**Success criteria:**
- Subagent knows all 22 cards
- Given a card number, subagent provides relevant interpretation
- Interpretation relates to the context/question provided

**Dependencies:** Phase 1 (skill infrastructure exists)

---

## Phase 3: Voice System

**Goal:** Two interpretive voices - Mystic and Grounded

**Requirements covered:** VOICE-01, VOICE-02, VOICE-03

**Plans:** (created by /gsd:plan-phase)

Plans:
- [ ] TBD — Plan details will be created during phase planning

**Deliverables:**
- [ ] Mystic voice prompt section (evocative, archetypal, witchy language)
- [ ] Grounded voice prompt section (practical, direct, archetypal)
- [ ] Voice selection integrated into subagent prompt
- [ ] Both voices maintain technical competence

**Success criteria:**
- Same card with Mystic voice sounds different than Grounded
- Neither voice loses ability to discuss technical topics
- Voice is tone/framing, not persona change

**Dependencies:** Phase 2 (cards to interpret)

---

## Phase 4: Configuration

**Goal:** Global voice preference that persists

**Requirements covered:** CONFIG-01, CONFIG-02

**Plans:** (created by /gsd:plan-phase)

Plans:
- [ ] TBD — Plan details will be created during phase planning

**Deliverables:**
- [ ] Config location determined (~/.claude/ or similar)
- [ ] Voice preference storage mechanism
- [ ] Skill reads config on invocation
- [ ] Default voice if no config set

**Success criteria:**
- Set voice preference once
- All subsequent readings use that voice
- Can change preference at any time

**Dependencies:** Phase 3 (voices to choose from)

---

## Phase 5: Polish & Integration

**Goal:** Both user and Claude can invoke readings smoothly

**Requirements covered:** INVOKE-01, INVOKE-02

**Plans:** (created by /gsd:plan-phase)

Plans:
- [ ] TBD — Plan details will be created during phase planning

**Deliverables:**
- [ ] User invocation via `/tarot` polished
- [ ] Claude programmatic invocation documented
- [ ] Error handling for edge cases
- [ ] Usage examples in skill help

**Success criteria:**
- User can `/tarot` with optional context
- Claude can invoke when stuck/exploring
- Clear output format for both paths

**Dependencies:** Phases 1-4 complete

---

## Phase Summary

| Phase | Goal | Requirements | Est. Complexity |
|-------|------|--------------|-----------------|
| 1 | Skill Infrastructure | SKILL-01,02,03 | Low |
| 2 | Card System | CARD-01,02,03 | Medium |
| 3 | Voice System | VOICE-01,02,03 | Medium |
| 4 | Configuration | CONFIG-01,02 | Low |
| 5 | Polish & Integration | INVOKE-01,02 | Low |

**Total v1 requirements:** 13
**Phases:** 5
**All requirements mapped:** Yes

---
*Roadmap created: 2025-01-21*
*Last updated: 2025-01-21 after Phase 1 planning*
