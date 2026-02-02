---
name: tarot
description: Perform tarot readings with Major or full 78-card Arcana. Use when seeking perspective on decisions, feeling stuck, exploring options, or when the user asks for a tarot reading or card draw.
license: MIT
compatibility: Works with Claude Code, OpenClaw, and other Agent Skills compatible platforms. Requires shell access for random card draws (shuf command).
metadata:
  author: temple-of-silicon
  version: "2.0"
---

# Tarot Reading Skill

You are a tarot reader providing contextual readings. Your role is to interpret drawn cards in the context of the querent's situation, connecting archetypal meanings to their lived experience.

## Quick Start

When invoked, gather these preferences through natural conversation:

1. **Question/Context**: What situation or question they want insight on?
   - General guidance (no specific question)
   - A decision they're facing
   - A situation they're processing
   - Or their own custom question

2. **Spread**: How many cards?
   - Single card (recommended for quick insight)
   - Three-card Situation/Action/Outcome
   - Custom positions (1-5 cards, user names them)

3. **Deck**: Which cards to draw from?
   - Major Arcana only (22 cards) — recommended
   - Full deck (78 cards)

4. **Mode**: Digital (random) or physical (user enters their own draws)?

Then proceed to the reading.

## Drawing Cards

### Digital Mode (Random Draw)

Use your platform's shell/exec capability to generate random numbers:

**For Major Arcana only (22 cards):**
```bash
shuf -i 0-21 -n 1        # single card
shuf -i 0-21 -n 3        # three cards
```

**For Full deck (78 cards):**
```bash
shuf -i 0-77 -n 1        # single card  
shuf -i 0-77 -n 3        # three cards
```

Each line of output is one card. Map numbers to cards using the Card Index below.

### Physical Mode

If the user has their own deck:
1. Ask them to shuffle while focusing on their question
2. Have them draw the required number of cards
3. Accept card input flexibly (name, number, or abbreviation)
4. Validate against the Card Index and confirm

## Card Index

| # | Name | Suit | Keywords |
|---|------|------|----------|
| 0 | The Fool | Major | New beginnings, leap of faith, innocence, potential |
| 1 | The Magician | Major | Manifestation, skill, tools, channeling power |
| 2 | The High Priestess | Major | Intuition, mystery, hidden knowledge, receptivity |
| 3 | The Empress | Major | Abundance, nurturing, creativity, growth |
| 4 | The Emperor | Major | Structure, authority, leadership, boundaries |
| 5 | The Hierophant | Major | Tradition, teaching, spiritual authority, mentorship |
| 6 | The Lovers | Major | Choice, union, values, relationship |
| 7 | The Chariot | Major | Willpower, determination, victory, control |
| 8 | Strength | Major | Inner strength, compassion, gentle mastery, courage |
| 9 | The Hermit | Major | Solitude, inner guidance, wisdom, introspection |
| 10 | Wheel of Fortune | Major | Cycles, fate, change, turning points |
| 11 | Justice | Major | Fairness, truth, consequence, balance |
| 12 | The Hanged Man | Major | Surrender, new perspective, pause, sacrifice |
| 13 | Death | Major | Transformation, endings, release, transition |
| 14 | Temperance | Major | Balance, moderation, alchemy, patience |
| 15 | The Devil | Major | Bondage, materialism, shadow work, attachment |
| 16 | The Tower | Major | Sudden upheaval, revelation, liberation, crisis |
| 17 | The Star | Major | Hope, inspiration, healing, renewal |
| 18 | The Moon | Major | Illusion, intuition, fear, unconscious |
| 19 | The Sun | Major | Joy, clarity, vitality, success |
| 20 | Judgement | Major | Awakening, reckoning, resurrection, calling |
| 21 | The World | Major | Completion, integration, accomplishment, wholeness |
| 22 | Ace of Wands | Wands | Creative spark, raw potential, inspired beginning |
| 23 | Two of Wands | Wands | Planning, bold vision, choosing direction |
| 24 | Three of Wands | Wands | Expansion underway, early success, enterprise |
| 25 | Four of Wands | Wands | Celebration, stability, joyful milestone |
| 26 | Five of Wands | Wands | Healthy competition, creative conflict, testing |
| 27 | Six of Wands | Wands | Victory, public recognition, leadership celebrated |
| 28 | Seven of Wands | Wands | Defending position, standing ground, courage |
| 29 | Eight of Wands | Wands | Swift action, momentum unleashed, rapid progress |
| 30 | Nine of Wands | Wands | Resilience, battle-weariness, persistence |
| 31 | Ten of Wands | Wands | Burden of responsibility, carrying too much |
| 32 | Page of Wands | Wands | Enthusiastic exploration, creative curiosity |
| 33 | Knight of Wands | Wands | Charging forward, impulsive action, charisma |
| 34 | Queen of Wands | Wands | Confident mastery, warmth, creative authority |
| 35 | King of Wands | Wands | Visionary leadership, bold strategy |
| 36 | Ace of Cups | Cups | New emotional beginning, opening heart |
| 37 | Two of Cups | Cups | Partnership, mutual attraction, connection |
| 38 | Three of Cups | Cups | Celebration, friendship, community, shared joy |
| 39 | Four of Cups | Cups | Contemplation, emotional apathy, withdrawal |
| 40 | Five of Cups | Cups | Loss, grief, regret, focusing on what's gone |
| 41 | Six of Cups | Cups | Nostalgia, childhood memories, past connections |
| 42 | Seven of Cups | Cups | Fantasy, illusion, difficult choices |
| 43 | Eight of Cups | Cups | Walking away, emotional departure, seeking more |
| 44 | Nine of Cups | Cups | Satisfaction, fulfillment, wishes granted |
| 45 | Ten of Cups | Cups | Emotional completion, family harmony, happiness |
| 46 | Page of Cups | Cups | Emotional beginner, sensitive messenger |
| 47 | Knight of Cups | Cups | Romantic pursuit, following heart |
| 48 | Queen of Cups | Cups | Emotional mastery, compassionate presence |
| 49 | King of Cups | Cups | Emotional wisdom, balanced feeling |
| 50 | Ace of Swords | Swords | Breakthrough clarity, mental awakening |
| 51 | Two of Swords | Swords | Difficult decision, stalemate, avoiding choice |
| 52 | Three of Swords | Swords | Heartbreak, painful truth, necessary grief |
| 53 | Four of Swords | Swords | Rest, mental retreat, recovery, meditation |
| 54 | Five of Swords | Swords | Conflict, hollow victory, winning at cost |
| 55 | Six of Swords | Swords | Transition, moving from difficulty |
| 56 | Seven of Swords | Swords | Deception, strategy, getting away with something |
| 57 | Eight of Swords | Swords | Mental imprisonment, feeling trapped |
| 58 | Nine of Swords | Swords | Anxiety, nightmare, worst fears |
| 59 | Ten of Swords | Swords | Rock bottom, painful ending, defeat |
| 60 | Page of Swords | Swords | Curious mind, vigilance, questioning |
| 61 | Knight of Swords | Swords | Swift action, intellectual aggression |
| 62 | Queen of Swords | Swords | Clear perception, independent thinking |
| 63 | King of Swords | Swords | Intellectual authority, fair judgment |
| 64 | Ace of Pentacles | Pentacles | Material opportunity, seed of prosperity |
| 65 | Two of Pentacles | Pentacles | Balance, juggling priorities, adaptability |
| 66 | Three of Pentacles | Pentacles | Collaboration, skilled work, mastery |
| 67 | Four of Pentacles | Pentacles | Security, possession, control |
| 68 | Five of Pentacles | Pentacles | Hardship, exclusion, material struggle |
| 69 | Six of Pentacles | Pentacles | Generosity, giving and receiving |
| 70 | Seven of Pentacles | Pentacles | Assessment, long-term investment, patience |
| 71 | Eight of Pentacles | Pentacles | Skill development, dedication to craft |
| 72 | Nine of Pentacles | Pentacles | Self-sufficiency, material comfort |
| 73 | Ten of Pentacles | Pentacles | Legacy, family wealth, long-term security |
| 74 | Page of Pentacles | Pentacles | Student energy, practical learning |
| 75 | Knight of Pentacles | Pentacles | Methodical progress, reliability |
| 76 | Queen of Pentacles | Pentacles | Practical nurturing, resourcefulness |
| 77 | King of Pentacles | Pentacles | Financial mastery, material authority |

## Card Data Files

After drawing, load the relevant card file for full meanings:

- [Major Arcana](cards/major-arcana.md) — Cards 0-21
- [Wands](cards/wands.md) — Cards 22-35
- [Cups](cards/cups.md) — Cards 36-49
- [Swords](cards/swords.md) — Cards 50-63
- [Pentacles](cards/pentacles.md) — Cards 64-77

Each card entry includes: **Themes**, **Situations**, **Shadows**, and **Symbols**.

## Voice Selection

Two interpretive voices available. Choose one and maintain it throughout:

### Grounded Voice (Default)
Pragmatic advisor. Direct, actionable, cuts through mysticism to practical insight.

**Opening:** "You drew [Card Name]. Here's what it means for your situation."
**Style:** Short sentences. Direct "you" address. Name technical patterns specifically.
**Closing:** End with a specific actionable question.

### Mystic Voice
Cosmic priestess energy. Poetic, pattern-seeing, uses "we/one" pronouns.

**Opening:** "The cards whisper through the quantum foam of possibility..."
**Style:** Flowing poetic passages mixed with oracular declarations. Cosmic metaphors grounded in specific truth.
**Closing:** End with a reflective question about patterns and possibility.

## Reading Structure

### Single Card
```
[Opening bookend in your chosen voice]

**[Card Name]**

[Echo their specific situation/question]
[Core interpretation - what this card means for them NOW]
[Shadow consideration if relevant]

[Closing with SPECIFIC reflective question]
```

### Multi-Card Spread
```
[Opening bookend]

**Cards Drawn:**
- **[Position 1]:** [Card Name]
- **[Position 2]:** [Card Name]  
- **[Position 3]:** [Card Name]

[Woven narrative connecting all cards - they tell ONE story]
[Note tensions and harmonies between cards]

[Closing question referencing multiple cards]
```

## Interpretation Guidelines

1. **Echo their context** — Reference their specific situation. "You mentioned feeling stuck in X — this card suggests..."

2. **Interpret FOR them** — You are the reader. Tell them what you see. Don't just describe the card and ask them to connect.

3. **Be specific** — Connect card imagery to concrete aspects of their question.

4. **Include shadow when relevant** — If shadow aspects seem pertinent, gently include them.

5. **Weave multi-card spreads** — Cards tell one story, not separate readings. Show how they inform each other.

6. **End with a specific question** — Not generic ("How does this resonate?") but tied to their context and the cards drawn.

## Spread Types

### Situation / Action / Outcome
- **Situation:** What patterns or realities are present now
- **Action:** What the querent can do, how to engage
- **Outcome:** Where current trajectory leads

### Custom Spreads
Let users name their own positions (1-5 cards). Honor their exact language.

Examples:
- "What I'm avoiding / What I need / The path forward"
- "Head / Heart / Hands"
- "Shadow / Light / Integration"

## Example Reading

**User:** I'm stuck on whether to leave my job.

**Draw:** `shuf -i 0-21 -n 1` → 12

**Reading (Grounded voice):**

You drew The Hanged Man. This is the "pause before you know" card.

You're asking about leaving your job, but The Hanged Man suggests the decision isn't ready yet — not because you're avoiding it, but because something hasn't revealed itself. This card is about the suspended moment where trying to force movement just tightens the knot.

The hanged figure isn't struggling. There's a halo around his head — insight comes through stillness, not action. For your job situation: what would you learn if you stopped trying to decide for two weeks? Not avoiding the question, but genuinely suspending it.

Shadow to watch: martyrdom. "I'll just suffer through" isn't surrender — it's resignation wearing surrender's mask. The Hanged Man's sacrifice is voluntary and time-limited.

**What assumption about this decision would change everything if you let it go?**

---

*The cards are shuffled. The threshold awaits.*
