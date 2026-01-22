# Milestone v1.0: Tarot Skill

**Status:** SHIPPED 2026-01-22
**Phases:** 1-5
**Total Plans:** 5

## Overview

5 phases building toward a working `/tarot` skill with two voice options.

```
Phase 1: Skill Infrastructure    → /tarot invokes, spawns subagent
Phase 2: Card System            → 22 Major Arcana with meanings
Phase 3: Voice System           → Mystic and Grounded interpretive lenses
Phase 4: Configuration          → Global voice preference
Phase 5: Polish & Integration   → Both invocation paths working
```

## Phases

### Phase 1: Skill Infrastructure

**Goal**: `/tarot` command invokes skill and spawns tarot-reader subagent
**Depends on**: None (first phase)
**Plans**: 1 plan

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

**Requirements covered:** SKILL-01, SKILL-02, SKILL-03

---

### Phase 2: Card System

**Goal**: 22 Major Arcana cards with rich meanings embedded in subagent
**Depends on**: Phase 1 (skill infrastructure exists)
**Plans**: 1 plan

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

**Requirements covered:** CARD-01, CARD-02, CARD-03

---

### Phase 3: Voice System

**Goal**: Two interpretive voices - Mystic and Grounded
**Depends on**: Phase 2 (cards to interpret)
**Plans**: 1 plan

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

**Requirements covered:** VOICE-01, VOICE-02, VOICE-03

---

### Phase 4: Configuration

**Goal**: Global voice preference that persists
**Depends on**: Phase 3 (voices to choose from)
**Plans**: 1 plan

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

**Requirements covered:** CONFIG-01, CONFIG-02

---

### Phase 5: Polish & Integration

**Goal**: Both user and Claude can invoke readings smoothly
**Depends on**: Phases 1-4 complete
**Plans**: 1 plan

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

**Requirements covered:** INVOKE-01, INVOKE-02

---

## Milestone Summary

**Key Decisions:**

| Decision | Phase | Context | Rationale |
|----------|-------|---------|-----------|
| Context isolation via fork | 01-01 | Tarot skill | Prevents reading context bleeding into main session |
| Card numbering 0-21 | 01-01 | Major Arcana | Matches canonical tarot deck (The Fool = 0) |
| Shell injection for randomness | 01-01 | Card selection | Uses system entropy for true random selection |
| Embedded card data in prompt | 02-01 | Card meanings | All card knowledge in SKILL.md, no external files |
| 4-section card structure | 02-01 | Card definitions | Themes/Situations/Shadows/Symbols for each card |
| Subagent as tarot reader | 02-01 | Interpretation | Directs subagent to interpret FOR user, not provide lookup |
| Voice as lens not persona | 03-01 | Voice system | Both voices interpret same cards, just frame differently |
| --voice flag for selection | 03-01 | Argument parsing | Enables immediate voice choice |
| Grounded as default | 03-01 | Voice default | Less alienating for skeptics |
| Config file format | 04-01 | Configuration | Simple key=value (voice=mystic), easy to grep |
| Safe config parsing | 04-01 | Configuration | grep+cut only (no eval/source), validates values |
| Three-tier precedence | 04-01 | Configuration | flag > project .tarot > global ~/.claude/tarot/config > default |
| Enable self-invocation | 05-01 | Claude invocation | Tarot has no side effects; safe for Claude to invoke autonomously |

**Issues Resolved:**
- None (clean development)

**Issues Deferred:**
- Minor Arcana (56 cards) — deferred to v2
- Multi-card spreads — deferred to v2
- x402 micropayments — deferred to v2

**Technical Debt Incurred:**
- None identified

---

_For current project status, see .planning/ROADMAP.md (created for next milestone)_

---
*Archived: 2026-01-22 as part of v1.0 milestone completion*
