# Requirements Archive: v1.0 Tarot Skill

**Archived:** 2026-01-22
**Status:** SHIPPED

This is the archived requirements specification for v1.0.
For current requirements, see `.planning/REQUIREMENTS.md` (created for next milestone).

---

# Requirements: Esoterica

**Defined:** 2025-01-21
**Core Value:** Agents can draw and interpret tarot cards as a perspective-shifting tool for problem-solving, planning, and self-mythologizing.

## v1 Requirements

Requirements for initial release. All shipped.

### Skill Infrastructure

- [x] **SKILL-01**: `/tarot` skill invokes tarot reading flow — SHIPPED v1.0
- [x] **SKILL-02**: Skill spawns tarot-reader subagent for interpretation — SHIPPED v1.0
- [x] **SKILL-03**: Skill handles random card selection (bash shuf or similar) — SHIPPED v1.0

### Card System

- [x] **CARD-01**: Major Arcana deck (22 cards) with meanings and symbolism — SHIPPED v1.0
- [x] **CARD-02**: Each card has upright meaning (reversed out of scope for MVP) — SHIPPED v1.0
- [x] **CARD-03**: Card data embedded in subagent prompt for portability — SHIPPED v1.0

### Voice System

- [x] **VOICE-01**: Mystic voice available (witchy, evocative, archetypal language) — SHIPPED v1.0
- [x] **VOICE-02**: Grounded voice available (practical, direct archetypal interpretation) — SHIPPED v1.0
- [x] **VOICE-03**: Voice is interpretive lens, not persona change (maintains technical competence) — SHIPPED v1.0

### Configuration

- [x] **CONFIG-01**: Global voice preference setting (set once, used always) — SHIPPED v1.0
- [x] **CONFIG-02**: Config stored in ~/.claude/ or project-level location — SHIPPED v1.0

### Invocation

- [x] **INVOKE-01**: User can invoke reading via `/tarot` command — SHIPPED v1.0
- [x] **INVOKE-02**: Claude can invoke reading programmatically when stuck/exploring — SHIPPED v1.0

## v2 Requirements (Deferred)

Tracked for future release:

### Extended Readings
- READ-01: Quick draw mode (card + brief insight)
- READ-02: Deep reading mode (full interpretation with context)
- READ-03: Multi-card spreads (3-card past/present/future)

### Extended Deck
- DECK-01: Minor Arcana (56 additional cards)
- DECK-02: Reversed card meanings
- DECK-03: Card-to-card relationship interpretations

### Other Esoteric Tools
- ESOT-01: Runes system
- ESOT-02: Numerology system
- ESOT-03: Astrology system

### Monetization
- PAY-01: x402 micropayments integration for paid readings
- PAY-02: Agent-to-agent payment flow (other agents pay for readings)

### Advanced Configuration
- ADV-01: Custom user-defined reader personas
- ADV-02: Per-project voice overrides

## Out of Scope

| Feature | Reason |
|---------|--------|
| MCP server | Overkill for static data; skill + subagent is simpler |
| Minor Arcana (56 cards) | 22 Major Arcana is tractable; full 78 adds complexity without core value |
| Reversed card meanings | Start with upright only; adds complexity |
| External card data files | Embedded in prompt is more portable |
| Multiple simultaneous voices | Pick one, use it; reduces friction |
| Real-time voice switching | Global preference is sufficient for MVP |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SKILL-01 | Phase 1 | Complete |
| SKILL-02 | Phase 1 | Complete |
| SKILL-03 | Phase 1 | Complete |
| CARD-01 | Phase 2 | Complete |
| CARD-02 | Phase 2 | Complete |
| CARD-03 | Phase 2 | Complete |
| VOICE-01 | Phase 3 | Complete |
| VOICE-02 | Phase 3 | Complete |
| VOICE-03 | Phase 3 | Complete |
| CONFIG-01 | Phase 4 | Complete |
| CONFIG-02 | Phase 4 | Complete |
| INVOKE-01 | Phase 5 | Complete |
| INVOKE-02 | Phase 5 | Complete |

**Coverage:**
- v1 requirements: 13 total
- Shipped: 13
- Unmapped: 0 ✓

---

## Milestone Summary

**Shipped:** 13 of 13 v1 requirements

**Adjusted:** None — all requirements implemented as originally specified

**Dropped:** None

---
*Archived: 2026-01-22 as part of v1.0 milestone completion*
