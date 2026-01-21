# Esoterica

## What This Is

A framework for Claude Code agents to use tarot (and eventually other esoteric tools) in their reasoning process. When an agent is stuck on a design decision, exploring options, or needs a fresh perspective, it can draw a card and interpret the problem through that archetypal lens — same as a human engineer pulling a tarot card at her desk while she works.

## Core Value

Agents can draw and interpret tarot cards as a perspective-shifting tool for problem-solving, planning, and self-mythologizing.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] `/tarot` skill invokes tarot reading flow
- [ ] Skill spawns tarot-reader subagent for interpretation
- [ ] Major Arcana deck (22 cards) with meanings and symbolism
- [ ] Two reader voices: Mystic (witchy, evocative) and Grounded (practical archetypal)
- [ ] Global config for voice preference (set once, used always)
- [ ] Both user and Claude can invoke a reading
- [ ] Two modes: quick draw (card + brief insight) and deep reading (full interpretation)
- [ ] Card draw includes "randomness" (bash shuf or intuitive selection)

### Out of Scope

- Minor Arcana (56 cards) — future expansion, not MVP
- Runes, numerology, astrology — future esoteric tools, not MVP
- MCP server — keeping architecture simple with skill + subagent
- Custom user-defined reader personas — ship two voices first, expand later
- Reversed card meanings — start with upright only

## Context

**Existing repo:** Contains plugin configuration stub from 2024. Can throw out anything that doesn't work — this is effectively a fresh start with the esoterica name/location.

**Claude Code ecosystem:** Skills are prompt expansions invoked via `/command`. Subagents are spawned via Task tool with specific agent types. Global config can live in `~/.claude/` or project-level.

**Use cases:**
- Problem-solving: stuck on architecture? Draw The Tower, see destruction/rebuilding lens
- Planning: starting a new phase? Draw to set intention/framing
- Self-mythologizing: Claude narrating its own journey through archetypal language
- Divinatory: "what energy does this codebase need?" style reflection

## Constraints

- **Architecture**: Skill + subagent pattern (no MCP server needed)
- **Platform**: Claude Code CLI — must work with current skill/subagent mechanisms
- **Scope**: MVP is tarot-only; framework should allow future esoteric tools but not over-engineer for them

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Skill + subagent over MCP | No external data/APIs needed; simpler architecture | — Pending |
| Major Arcana only for MVP | 22 cards is tractable; full 78 adds complexity without core value | — Pending |
| Two voices (Mystic/Grounded) | Accommodates different user preferences without over-customization | — Pending |
| Global config for voice | Set once, less friction per invocation | — Pending |

---
*Last updated: 2025-01-21 after initialization*
