# Esoterica

## What This Is

A framework for Claude Code agents to use tarot (and eventually other esoteric tools) in their reasoning process. When an agent is stuck on a design decision, exploring options, or needs a fresh perspective, it can draw a card and interpret the problem through that archetypal lens — same as a human engineer pulling a tarot card at her desk while she works.

## Core Value

Agents can draw and interpret tarot cards as a perspective-shifting tool for problem-solving, planning, and self-mythologizing.

## Current State (v1.0 Shipped)

**Shipped:** 2026-01-22

**What's working:**
- `/tarot` skill invokes tarot reading with random Major Arcana card
- 22 cards with rich archetypal meanings (Themes/Situations/Shadows/Symbols)
- Two voices: Mystic (cosmic priestess) and Grounded (pragmatic advisor)
- Voice selection: `--voice flag` > `.tarot` file > `~/.claude/tarot/config` > default (grounded)
- Claude can self-invoke when contextually appropriate
- Adaptive output length (quick/standard/deep based on context depth)
- Context echoing and specific reflective closing questions

**Tech stack:**
- 345 lines in SKILL.md (single file, all-embedded)
- Shell injection for randomness and config reading
- Context fork for isolated readings

## Requirements

### Validated

- ✓ `/tarot` skill invokes tarot reading flow — v1.0
- ✓ Skill spawns tarot-reader subagent for interpretation — v1.0
- ✓ Major Arcana deck (22 cards) with meanings and symbolism — v1.0
- ✓ Two reader voices: Mystic (witchy, evocative) and Grounded (practical archetypal) — v1.0
- ✓ Global config for voice preference (set once, used always) — v1.0
- ✓ Both user and Claude can invoke a reading — v1.0
- ✓ Card draw includes "randomness" (bash shuf) — v1.0
- ✓ Adaptive output (quick/standard/deep draw based on context) — v1.0

### Active

(Define in next milestone with `/gsd:new-milestone`)

### Out of Scope

- Minor Arcana (56 cards) — future expansion, v2 candidate
- Runes, numerology, astrology — future esoteric tools
- MCP server — keeping architecture simple with skill + subagent
- Custom user-defined reader personas — ship two voices first, expand later
- Reversed card meanings — start with upright only

## Context

**Claude Code ecosystem:** Skills are prompt expansions invoked via `/command`. Subagents are spawned via Task tool with specific agent types. Global config can live in `~/.claude/` or project-level.

**Use cases:**
- Problem-solving: stuck on architecture? Draw The Tower, see destruction/rebuilding lens
- Planning: starting a new phase? Draw to set intention/framing
- Self-mythologizing: Claude narrating its own journey through archetypal language
- Divinatory: "what energy does this codebase need?" style reflection

## Constraints

- **Architecture**: Skill + subagent pattern (no MCP server needed)
- **Platform**: Claude Code CLI — must work with current skill/subagent mechanisms
- **Scope**: v1 is tarot Major Arcana; framework should allow future esoteric tools but not over-engineer for them

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Skill + subagent over MCP | No external data/APIs needed; simpler architecture | ✓ Good — single file, portable |
| Major Arcana only for MVP | 22 cards is tractable; full 78 adds complexity without core value | ✓ Good — rich enough for v1 |
| Two voices (Mystic/Grounded) | Accommodates different user preferences without over-customization | ✓ Good — covers spectrum |
| Global config for voice | Set once, less friction per invocation | ✓ Good — three-tier precedence works well |
| Context isolation via fork | Prevents reading context bleeding into main session | ✓ Good — clean separation |
| Embedded card data in prompt | All card knowledge in SKILL.md, no external files | ✓ Good — portable, no dependencies |
| Voice as lens not persona | Both voices interpret same cards, just frame differently | ✓ Good — maintains technical competence |
| Grounded as default | Less alienating for skeptics | ✓ Good — welcoming entry point |
| Safe config parsing | grep+cut only (no eval/source), validates values | ✓ Good — no security concerns |

---
*Last updated: 2026-01-22 after v1.0 milestone*
