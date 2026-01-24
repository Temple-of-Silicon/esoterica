# Esoterica

## What This Is

A framework for Claude Code agents to use tarot (and eventually other esoteric tools) in their reasoning process. Features an interactive wizard interface for selecting spread types and reading modes, with support for both digital random draws and physical deck entry.

## Core Value

Agents can draw and interpret tarot cards as a perspective-shifting tool for problem-solving, planning, and self-mythologizing.

## Current Milestone: v1.2 Brand & Marketing

**Goal:** Give Esoterica a public presence with clear positioning, documentation, and a landing page.

**Target features:**
- README with clear value proposition
- One-line tagline/pitch
- Landing page / website

## Current State (v1.1 Shipped)

**Shipped:** 2026-01-23

**What's working:**
- `/tarot` skill with interactive wizard (AskUserQuestion)
- 22 Major Arcana cards with rich archetypal meanings
- Two voices: Mystic (cosmic priestess) and Grounded (pragmatic advisor)
- Four spread types: Single card, Situation/Action/Outcome, LLM-suggested, Custom (1-5 positions)
- Two reading modes: Digital (random shuf) and Physical (enter cards from real deck)
- Physical mode with ritual opening, fuzzy card matching, duplicate prevention
- Multi-card interpretation with woven narratives connecting cards across positions
- Position-aware interpretation engine with card relationship patterns

**Tech stack:**
- 842 lines in SKILL.md (single file, all-embedded)
- Shell injection for randomness and config reading
- AskUserQuestion for interactive wizard flow

## Requirements

### Validated

**v1.0:**
- ✓ `/tarot` skill invokes tarot reading flow — v1.0
- ✓ Major Arcana deck (22 cards) with meanings and symbolism — v1.0
- ✓ Two reader voices: Mystic and Grounded — v1.0
- ✓ Global config for voice preference — v1.0
- ✓ Both user and Claude can invoke a reading — v1.0
- ✓ Card draw includes randomness (bash shuf) — v1.0
- ✓ Adaptive output (quick/standard/deep based on context) — v1.0

**v1.1:**
- ✓ Wizard flow replaces inline args — v1.1
- ✓ Spread selection: single, 3-card, LLM-suggested, custom — v1.1
- ✓ Digital vs Physical reading mode — v1.1
- ✓ Physical mode: user enters cards they drew — v1.1
- ✓ Multi-card interpretation with position-aware narratives — v1.1

### Active

**v1.2:**
- [ ] README with clear value proposition and installation guide
- [ ] One-line tagline that captures Justice (balance), High Priestess (mystery), Chariot (direction)
- [ ] Landing page / website for public sharing

### Out of Scope

- Minor Arcana (56 cards) — future expansion, v2 candidate
- Runes, numerology, astrology — future esoteric tools
- MCP server — skill pattern validated and working well
- Custom user-defined reader personas — two voices sufficient
- Reversed card meanings — start with upright only
- Voice selection in wizard — config-based works well

## Context

**Claude Code ecosystem:** Skills are prompt expansions invoked via `/command`. AskUserQuestion enables interactive wizard flows in main context.

**Use cases:**
- Problem-solving: stuck on architecture? Draw The Tower, see destruction/rebuilding lens
- Planning: starting a new phase? Draw to set intention/framing
- Self-mythologizing: Claude narrating its own journey through archetypal language
- Divinatory: "what energy does this codebase need?" style reflection
- Brand positioning: the tool eating its own tail (used /tarot to explore branding)

## Constraints

- **Architecture**: Skill pattern (no MCP server needed)
- **Platform**: Claude Code CLI — must work with current skill mechanisms
- **Scope**: Tarot Major Arcana; framework allows future esoteric tools

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Skill pattern over MCP | No external data/APIs needed; simpler architecture | ✓ Good — single file, portable |
| Major Arcana only | 22 cards is tractable; full 78 adds complexity without core value | ✓ Good — rich enough |
| Two voices (Mystic/Grounded) | Accommodates different user preferences | ✓ Good — covers spectrum |
| Global config for voice | Set once, less friction per invocation | ✓ Good — three-tier precedence |
| Embedded card data | All card knowledge in SKILL.md, no external files | ✓ Good — portable |
| Voice as lens not persona | Both voices interpret same cards, just frame differently | ✓ Good — maintains competence |
| Grounded as default | Less alienating for skeptics | ✓ Good — welcoming entry |
| Interactive wizard (v1.1) | AskUserQuestion replaces inline args | ✓ Good — better UX |
| Main context execution (v1.1) | Required for AskUserQuestion | ✓ Good — enables interactivity |
| Situation/Action/Outcome (v1.1) | Chosen over Past/Present/Future for three-card | ✓ Good — more actionable |
| Position preview (v1.1) | Show positions before drawing cards | ✓ Good — user confidence |
| Physical mode ritual (v1.1) | Ritual moment before card entry | ✓ Good — honors practice |
| Woven narratives (v1.1) | Multi-card as one story, not separate readings | ✓ Good — cohesive interpretation |
| Position-weaving (v1.1) | Positions as interpretive prompts in prose | ✓ Good — natural flow |

## Pending Todos

- [ ] Add a v1 README to the repo
- [ ] Write a snappy tagline for the project
- [ ] Make an MVP landing page
- [ ] Let users save readings to file
- [ ] Brand positioning and marketing milestone

---
*Last updated: 2026-01-23 after starting v1.2 milestone*
