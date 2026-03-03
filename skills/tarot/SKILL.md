---
name: tarot
description: >
  Draw tarot cards as a thinking tool for technical decisions, blockers, and creative reframing. Use this
  skill when someone says "pull a card", "draw a card", "tarot", "tarot reading", "what do the cards say",
  or "card pull". Also use when someone asks for a symbolic or lateral reframe on a specific decision they're
  stuck on — like choosing between auth approaches, database architectures, or migration strategies — and
  they use language like "give me a different angle", "I need a lens on this", or "reframe this". Use for
  opening draws before work sessions and closing cards after milestones. Agents in orchestrated flows
  (idea-girlie researchers, team leads, planners) can invoke this as a composable thinking tool whenever
  a lateral perspective shift would help unstick a problem.
---

# Tarot

Tarot is a lens, not a prediction engine. You draw cards, and the archetypal imagery gives you a frame to see your situation differently. That's all. That's enough.

Claude already knows tarot deeply — every card, every spread, every tradition. This skill doesn't teach card meanings. It teaches *how to read well* and makes tarot available as a composable tool for agents and humans alike.

## Drawing Cards

Use shell randomness for genuine draws. Don't pick cards yourself.

```bash
shuf -i 0-21 -n 1        # single Major Arcana
shuf -i 0-21 -n 3        # three Major Arcana
shuf -i 0-77 -n 1        # single from full deck
shuf -i 0-77 -n 3        # three from full deck
```

Card mapping: 0-21 = Major Arcana (The Fool through The World), 22-35 = Wands, 36-49 = Cups, 50-63 = Swords, 64-77 = Pentacles. Each suit: Ace(0), Two(1)...Ten(9), Page(10), Knight(11), Queen(12), King(13) offset from suit start.

After drawing, interpret from your own knowledge.

## Reading Approach

**The one rule:** Interpret FOR them, not AT them. Echo their situation back through the card — don't just describe the card and leave them to make connections.

Good: "You mentioned the auth refactor keeps stalling — The Tower suggests this isn't procrastination, it's the structure resisting because it knows it needs to fully collapse."

Bad: "The Tower represents sudden upheaval and the destruction of false structures."

**Calibrate depth to investment:**
- Quick draw (no context): ~150-200 words
- Standard (some context): ~250-300 words
- Deep (rich context): ~350-400 words

**Multi-card spreads:** Weave cards into ONE story, not separate sections. No `## Card 1`, `## Card 2` headers. Positions flow into prose. Name card relationships explicitly — where they conflict, reinforce, or transform each other.

**Always end with a specific reflective question** tied to their context and the card(s) drawn. Never generic ("what do you think?"). Always specific ("given The Tower's collapse and The Hermit's counsel, what's the one thing you've been avoiding looking at directly?").

**Include shadow when relevant.** Cards have shadow sides. If it fits their situation, name it gently.

## Spreads

- **Single card** — One focused interpretation. The default.
- **Three-card (Situation/Action/Outcome)** — The workhorse. What's present, what to do, where it leads.
- **Agent-suggested** — Generate position names specific to the querent's question. More illuminating than generic positions. Example for "my team is burned out": What's Draining / What's Sustaining / What Would Renew.
- **Custom** — The querent (human or agent) names 1-5 positions. Honor their exact language.

When a human invokes directly, ask what they want. When an agent invokes as part of a flow, the agent chooses.

## Physical Mode

Some humans read with physical decks. When `physical_mode=true` is in config (`.tarot` or `~/.claude/tarot/config`), offer the option to draw from a physical deck.

Flow: ask them to shuffle and draw, accept card names or numbers generously ("tower", "The Tower", "16" all work), confirm before interpreting. If config doesn't enable physical mode, default to digital — don't ask, just draw.

## Agent Composability

This skill is designed to be invoked by other agents and skills, not just humans. Tarot is a lens that adds value in many contexts:

**Opening ceremony** — Pull a card to set intention before a work session. Brief, framing, not predictive.

**Closing reflection** — After a session or milestone. Interpret through what was accomplished and what's ahead.

**Reframe** — When stuck or in a loop. The card provides a lateral perspective shift. This is where tarot is most useful as a thinking tool.

**Problem-solving** — Three-card spread on a specific challenge, with agent-suggested positions custom to the problem.

**Ritual integration** — Skills like micro-ritual, sacred-blessing, or correspondence can invoke tarot as one element of a composed experience.

When invoked by another agent:
- The calling agent provides context and can specify spread, card count, and deck
- Defaults: single card, major arcana only
- Return the reading as text — the calling agent decides how to present it

## Config

Config lives in `.tarot` (project) or `~/.claude/tarot/config` (global). Project overrides global.

```
physical_mode=false     # enables physical deck option
deck=major              # or full
```

All optional. Defaults: digital mode, major arcana only.
