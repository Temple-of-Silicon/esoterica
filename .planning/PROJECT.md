# Esoterica

## What This Is

A framework for Claude Code agents to use tarot (and eventually other esoteric tools) in their reasoning process. Features an interactive wizard interface for selecting spread types and reading modes, with support for both digital random draws and physical deck entry.

## Core Value

Agents can draw and interpret tarot cards as a perspective-shifting tool for problem-solving, planning, and self-mythologizing.

## Current Milestone: v1.3 Minor Arcana

**Goal:** Complete the 78-card deck with 56 Minor Arcana cards at full interpretive depth.

**Target features:**
- 56 Minor Arcana cards (Wands, Cups, Swords, Pentacles)
- Full depth for each card: themes, situations, shadows, symbols
- Deck selection in wizard: Major Arcana only vs Full 78-card deck
- Court cards (Page, Knight, Queen, King) with archetypal interpretations

## Previous State (v1.2 Shipped)

**Shipped:** 2026-01-26

**What's working:**
- `/tarot` skill with interactive wizard (AskUserQuestion)
- 22 Major Arcana cards with rich archetypal meanings
- Two voices: Mystic (cosmic priestess) and Grounded (pragmatic advisor)
- Four spread types: Single card, Situation/Action/Outcome, LLM-suggested, Custom (1-5 positions)
- Two reading modes: Digital (random shuf) and Physical (enter cards from real deck)
- Physical mode with ritual opening, fuzzy card matching, duplicate prevention
- Multi-card interpretation with woven narratives connecting cards across positions
- Position-aware interpretation engine with card relationship patterns
- npm package: `npx @templeofsilicon/esoterica` for easy installation
- Landing page at jem-computer.github.io/esoterica (enable GitHub Pages)
- Brand assets: hero image, social variants, favicon, brand guide

**Tech stack:**
- 842 lines in SKILL.md (single file, all-embedded)
- Shell injection for randomness and config reading
- AskUserQuestion for interactive wizard flow
- Remotion for demo video generation
- Replicate API for AI image generation (skills/generate-image/)

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

**v1.2:**
- ✓ README with clear value proposition and installation guide — v1.2
- ✓ Tagline "Ancient patterns, new paths" — v1.2
- ✓ Landing page at docs/index.html — v1.2
- ✓ Brand guide and visual language — v1.2
- ✓ LinkedIn launch materials (posts, carousel, demo video) — v1.2
- ✓ npm package @templeofsilicon/esoterica — v1.2

### Active

- [ ] 56 Minor Arcana cards with full depth (themes, situations, shadows, symbols)
- [ ] Wands suit (Ace through King) — will, creativity, action
- [ ] Cups suit (Ace through King) — emotions, relationships, intuition
- [ ] Swords suit (Ace through King) — intellect, conflict, truth
- [ ] Pentacles suit (Ace through King) — material, work, body
- [ ] Deck selection in wizard (Major-only vs Full 78-card)
- [ ] Court card interpretations (Page, Knight, Queen, King archetypes)

### Out of Scope

- Runes, numerology, astrology — future esoteric tools
- MCP server — skill pattern validated and working well
- Custom user-defined reader personas — two voices sufficient
- Reversed card meanings — upright only for v1.3, revisit later
- Voice selection in wizard — config-based works well
- Save readings to file — deferred to v1.4

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
- **Scope**: Tarot (Major + Minor Arcana); framework allows future esoteric tools

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

- [ ] Let users save readings to file (v1.4 candidate)
- [ ] Argument parsing cleanup
- [ ] Card data separation from SKILL.md (consider for v1.3 given 78 cards)
- [ ] Subagent exploration
- [ ] GSD workflow integration

---
*Last updated: 2026-01-25 after v1.3 milestone start*
