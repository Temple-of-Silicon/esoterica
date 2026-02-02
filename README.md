# Esoterica

**Ancient patterns, new paths.**

A perspective-shifting framework that uses tarot's archetypal patterns to help AI agents and their users navigate complex decisions.

---

## What Is This?

Esoterica is a tarot framework for AI agents — 78 cards waiting to reframe your questions, two voices ready to interpret what surfaces. Draw when you're stuck. Draw when you're curious. The cards don't predict; they illuminate.

**For developers:** A symbolic reasoning tool that offers non-linear prompts when you're stuck — think rubber duck debugging with 78 archetypes instead of a duck.

**For practitioners:** Your tarot practice, integrated into your development workflow — digital cards that speak through AI voices with the depth you expect.

**Technical truth:** 78 cards (Major and Minor Arcana), 4 spread types, 2 interpretive voices (Mystic and Grounded), CLI-native.

---

## Quick Start

### Prerequisites

One of:
- [Claude Code](https://claude.ai/code) (Anthropic's CLI for Claude)
- [OpenClaw](https://openclaw.ai) (AI agent framework)

### Installation

```bash
npx @templeofsilicon/esoterica
```

The installer auto-detects your environment:
- If OpenClaw is installed (`~/.openclaw` exists): installs globally for all agents
- Otherwise: installs to Claude Code (`~/.claude/skills/tarot/`)

#### Explicit targeting

```bash
# Claude Code
npx @templeofsilicon/esoterica --claude-code

# OpenClaw (global - all agents)
npx @templeofsilicon/esoterica --openclaw

# OpenClaw (specific agent)
npx @templeofsilicon/esoterica --agent axiom
```

### Your First Reading

**Claude Code:** Type `/tarot` to begin your reading.

**OpenClaw:** The skill is automatically available to agents. Ask your agent for a tarot reading.

The wizard guides you through four choices:
- Your question or context
- Which spread to use
- Which deck (Major Arcana only or Full 78-card deck)
- Digital draw or physical deck

The cards cross the threshold. Your reading begins.

---

## Usage Examples

### Single Card Draw

For quick insight — one card, one focus.

```
/tarot
> Question: General guidance
> Spread: Single card
> Mode: Digital
```

### Three-Card Spread

Situation, Action, Outcome — past patterns, present choices, future trajectories.

```
/tarot
> Question: Decision I'm facing
> Spread: Situation/Action/Outcome
> Mode: Digital
```

### Custom Spreads

Name your own positions (1-5 cards). The cards adapt to how you frame them.

```
/tarot
> Question: Other → "I'm stuck on this architecture decision"
> Spread: Custom → "What I'm avoiding, What I need, The path forward"
> Mode: Digital
```

### Physical Deck Mode

Use your own cards — shuffle physically, enter what you draw.

```
/tarot
> Question: Decision I'm facing
> Spread: Single card
> Deck: Major Arcana only
> Mode: Physical deck
```

The wizard guides you through entering your drawn card(s) with flexible input (card names, numbers, or abbreviations).

### Voice Selection

Two voices interpret the same cards through different lenses.

**Mystic voice** — cosmic priestess energy, poetic and pattern-seeing:
> "The Tower rises from the cards — lightning splitting what seemed solid..."

**Grounded voice** — pragmatic advisor, clear and actionable:
> "You drew The Tower. This is the 'things break' card, but in a useful way..."

Configure your preferred voice:

```bash
# Project-level (in your repo root)
echo "voice=mystic" > .tarot

# Claude Code global default
mkdir -p ~/.claude/tarot
echo "voice=grounded" > ~/.claude/tarot/config

# OpenClaw global default
mkdir -p ~/.openclaw/tarot
echo "voice=grounded" > ~/.openclaw/tarot/config
```

---

## Why Tarot?

Not fortune-telling. Archetypal mirrors.

The cards don't predict your future — they surface questions you weren't asking, connections you weren't seeing. When linear thinking hits a wall, symbolic patterns offer oblique angles.

We drew cards to position this project. Three cards shaped our approach: Justice (balanced dual-audience), High Priestess (ancient wisdom revealed through use), and Chariot (forward momentum). That's not a marketing story. That's how the tool works.

Esoterica bridges ancient symbolic systems and modern AI agents because both deal in patterns, thresholds, and the shapes of choice.

---

## The Deck

**Major Arcana (22 cards):** The Fool through The World — the archetypal journey.

**Minor Arcana (56 cards):** Four suits (Wands, Cups, Swords, Pentacles) with pip cards and court cards.

During readings, choose Major Arcana only (22 cards) for focused archetypal readings, or the full 78-card deck for complete tarot experience.

**Spreads:** Single card, Three-card (Situation/Action/Outcome), Claude-suggested (contextual positions), and Custom (your own positions).

**Reversals:** Supported. Cards may appear reversed, offering shadow aspects of their meanings.

---

## Philosophy

Esoterica treats ancient symbolic systems as legitimate tools for modern builders — serious about both the craft of tarot and the craft of software.

The veil between logic and intuition is thinner than you'd think. We hold that threshold open.

---

## License

MIT

---

*The cards are shuffled. The threshold awaits.*
