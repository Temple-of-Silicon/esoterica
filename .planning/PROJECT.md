# Esoterica

## What This Is

A framework for Claude Code agents to use tarot (and eventually other esoteric tools) in their reasoning process. Features an interactive wizard interface for selecting spread types and reading modes, with support for both digital random draws and physical deck entry.

## Core Value

Agents can draw and interpret tarot cards as a perspective-shifting tool for problem-solving, planning, and self-mythologizing.

## Current State (v1.3 Shipped)

**Shipped:** 2026-01-26

**What's working:**
- `/tarot` skill with interactive wizard (AskUserQuestion)
- **78-card deck:** 22 Major Arcana + 56 Minor Arcana with full interpretive depth
- **Deck selection:** Choose Major-only (22) or Full deck (78) in wizard
- **Lazy loading:** Card data in separate files, loaded only after draw
- Two voices: Mystic (cosmic priestess) and Grounded (pragmatic advisor)
- Four spread types: Single card, Situation/Action/Outcome, LLM-suggested, Custom (1-5 positions)
- Two reading modes: Digital (random shuf) and Physical (enter cards from real deck)
- Physical mode with ritual opening, fuzzy card matching (supports "3 cups", "queen wands", "Q s")
- Multi-card interpretation with woven narratives connecting cards across positions
- npm package: `npx @templeofsilicon/esoterica` for easy installation
- Landing page at jem-computer.github.io/esoterica

**Tech stack:**
- 860 lines in SKILL.md (orchestration + card index)
- 719 lines in card data files (5 files: major-arcana + 4 suits)
- Shell injection for randomness and config reading
- AskUserQuestion for interactive wizard flow

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

**v1.3:**
- ✓ 56 Minor Arcana cards with full depth — v1.3
- ✓ Wands suit (Ace through King) — v1.3
- ✓ Cups suit (Ace through King) — v1.3
- ✓ Swords suit (Ace through King) — v1.3
- ✓ Pentacles suit (Ace through King) — v1.3
- ✓ Deck selection in wizard (Major-only vs Full 78-card) — v1.3
- ✓ Court card interpretations (Page, Knight, Queen, King archetypes) — v1.3
- ✓ Lazy loading architecture (card files separate from SKILL.md) — v1.3
- ✓ Fuzzy matching for all 78 cards in physical mode — v1.3

### Active

**v1.4 -- Website Upgrade:**
- [ ] WEB-01: Scroll-scrubbed hero video (Apple-style, playback tied to scroll position) -- Phase 19
- [ ] WEB-02: Compress and integrate AI-generated hero video -- Phase 19
- [ ] WEB-03: Gateway Process-style illustrations for landing page -- Phase 21
- [ ] WEB-04: Illustration prompt generation for Nano Banana Pro -- Phase 21
- [ ] WEB-05: Page layout for illustrations (interspersed with prose or 3-col grid) -- Phase 21
- [ ] WEB-06: Footer with copyright and links -- Phase 22

### Out of Scope

- Runes, numerology, astrology -- future esoteric tools
- MCP server -- skill pattern validated and working well
- Custom user-defined reader personas -- two voices sufficient
- Reversed card meanings -- upright only for v1.3, revisit later
- Voice selection in wizard -- config-based works well
- Save readings to file -- deferred to v1.4

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
- **Platform**: Claude Code CLI -- must work with current skill mechanisms
- **Scope**: Tarot (Major + Minor Arcana); framework allows future esoteric tools

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Skill pattern over MCP | No external data/APIs needed; simpler architecture | ✓ Good -- single file, portable |
| Major Arcana only | 22 cards is tractable; full 78 adds complexity without core value | ✓ Good -- rich enough |
| Two voices (Mystic/Grounded) | Accommodates different user preferences | ✓ Good -- covers spectrum |
| Global config for voice | Set once, less friction per invocation | ✓ Good -- three-tier precedence |
| Embedded card data | All card knowledge in SKILL.md, no external files | ✓ Good -- portable |
| Voice as lens not persona | Both voices interpret same cards, just frame differently | ✓ Good -- maintains competence |
| Grounded as default | Less alienating for skeptics | ✓ Good -- welcoming entry |
| Interactive wizard (v1.1) | AskUserQuestion replaces inline args | ✓ Good -- better UX |
| Main context execution (v1.1) | Required for AskUserQuestion | ✓ Good -- enables interactivity |
| Situation/Action/Outcome (v1.1) | Chosen over Past/Present/Future for three-card | ✓ Good -- more actionable |
| Position preview (v1.1) | Show positions before drawing cards | ✓ Good -- user confidence |
| Physical mode ritual (v1.1) | Ritual moment before card entry | ✓ Good -- honors practice |
| Woven narratives (v1.1) | Multi-card as one story, not separate readings | ✓ Good -- cohesive interpretation |
| Position-weaving (v1.1) | Positions as interpretive prompts in prose | ✓ Good -- natural flow |
| Lazy loading (v1.3) | Card data in separate files, loaded after draw | ✓ Good -- context efficient |
| Suit-based numbering (v1.3) | Wands 22-35, Cups 36-49, Swords 50-63, Pentacles 64-77 | ✓ Good -- clear structure |
| Major-only default (v1.3) | Backwards compatible deck selection | ✓ Good -- preserves behavior |
| Optional "of" (v1.3) | "three cups" = "three of cups" | ✓ Good -- natural input |
| Canvas + WebP frames (v1.4) | Eliminates video.currentTime seek lag; zero runtime deps | Pending |

## Pending Todos

- [ ] Let users save readings to file (v1.4 candidate)
- [ ] Argument parsing cleanup
- [x] Card data separation from SKILL.md -- v1.3
- [ ] Subagent exploration
- [ ] GSD workflow integration
- [ ] Reversed card meanings (v1.4 candidate)

---
*Last updated: 2026-01-28 -- v1.4 roadmap created*
