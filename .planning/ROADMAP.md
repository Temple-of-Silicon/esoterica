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

## Phase 1: Skill Infrastructure ✓

**Goal:** `/tarot` command invokes skill and spawns tarot-reader subagent

**Status:** Complete (2026-01-22)

**Requirements covered:** SKILL-01, SKILL-02, SKILL-03

**Plans:** 1 plan

Plans:
- [x] 01-01-PLAN.md — Create tarot skill with context fork and random card selection

**Deliverables:**
- [x] Skill file at `~/.claude/skills/tarot/SKILL.md`
- [x] Skill registered in Claude Code
- [x] Skill spawns `tarot-reader` subagent via context fork
- [x] Random card selection via bash shuf (0-21)

**Success criteria:**
- Running `/tarot` spawns a subagent ✓
- Subagent receives a random card number ✓
- Basic response confirms flow works ✓

**Dependencies:** None (first phase)

---

## Phase 2: Card System ✓

**Goal:** 22 Major Arcana cards with rich meanings embedded in subagent

**Status:** Complete (2026-01-22)

**Requirements covered:** CARD-01, CARD-02, CARD-03

**Plans:** 1 plan

Plans:
- [x] 02-01-PLAN.md — Embed complete Major Arcana meanings with contextual interpretation

**Deliverables:**
- [x] All 22 Major Arcana cards defined
- [x] Each card has: name, number, keywords, core meaning, symbolism
- [x] Card data embedded in tarot-reader subagent prompt
- [x] Subagent can interpret any card contextually

**Success criteria:**
- Subagent knows all 22 cards ✓
- Given a card number, subagent provides relevant interpretation ✓
- Interpretation relates to the context/question provided ✓

**Dependencies:** Phase 1 (skill infrastructure exists)

---

## Phase 3: Voice System ✓

**Goal:** Two interpretive voices - Mystic and Grounded

**Status:** Complete (2026-01-22)

**Requirements covered:** VOICE-01, VOICE-02, VOICE-03

**Plans:** 1 plan

Plans:
- [x] 03-01-PLAN.md — Add Mystic and Grounded voice definitions with examples and consistency instructions

**Deliverables:**
- [x] Mystic voice prompt section (evocative, archetypal, witchy language)
- [x] Grounded voice prompt section (practical, direct, archetypal)
- [x] Voice selection integrated into subagent prompt (`--voice` flag)
- [x] Both voices maintain technical competence

**Success criteria:**
- Same card with Mystic voice sounds different than Grounded ✓
- Neither voice loses ability to discuss technical topics ✓
- Voice is tone/framing, not persona change ✓

**Dependencies:** Phase 2 (cards to interpret)

---

## Phase 4: Configuration ✓

**Goal:** Global voice preference that persists

**Status:** Complete (2026-01-22)

**Requirements covered:** CONFIG-01, CONFIG-02

**Plans:** 1 plan

Plans:
- [x] 04-01-PLAN.md — Add config file reading for persistent voice preference

**Deliverables:**
- [x] Config location determined (~/.claude/tarot/config and .tarot)
- [x] Voice preference storage mechanism (key=value format)
- [x] Skill reads config on invocation
- [x] Default voice if no config set (grounded)

**Success criteria:**
- Set voice preference once ✓
- All subsequent readings use that voice ✓
- Can change preference at any time ✓

**Dependencies:** Phase 3 (voices to choose from)

---

## Phase 5: Polish & Integration ✓

**Goal:** Both user and Claude can invoke readings smoothly

**Status:** Complete (2026-01-22)

**Requirements covered:** INVOKE-01, INVOKE-02

**Plans:** 1 plan

Plans:
- [x] 05-01-PLAN.md — Enable Claude self-invocation and add adaptive output formatting

**Deliverables:**
- [x] User invocation via `/tarot` polished
- [x] Claude programmatic invocation enabled (disable-model-invocation removed)
- [x] Adaptive output length (quick/standard/deep draw)
- [x] Context echoing in readings
- [x] Reflective closing questions

**Success criteria:**
- User can `/tarot` with optional context ✓
- Claude can invoke when stuck/exploring ✓
- Clear output format for both paths ✓

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
*Last updated: 2026-01-22 — Milestone v1 complete*
