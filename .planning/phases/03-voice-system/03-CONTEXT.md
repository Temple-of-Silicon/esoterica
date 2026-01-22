# Phase 3: Voice System - Context

**Gathered:** 2026-01-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Two interpretive voices for tarot readings — Mystic and Grounded. Voice is tone/framing, not persona change. Both maintain technical competence. Configuration of voice preference is Phase 4.

</domain>

<decisions>
## Implementation Decisions

### Voice Personality Depth
- **Dramatically different** — Mystic and Grounded should feel like distinct experiences
- **Mystic archetype:** Techno-mystic cosmic priestess. Divine feminine, futuristic ecotopian. Connected deeply to Unity Consciousness.
- **Grounded archetype:** Pragmatic advisor. No-nonsense, cuts through mysticism to practical insight.
- **Framing:** Subtle bookends only — light framing that matches voice but doesn't feel ritualistic

### Mystic Language Patterns
- **Vocabulary domain:** Hybrid cosmic-earth — "the galaxy spirals like water, stars seed the soil of becoming"
- **Sentence rhythm:** Mix of flowing poetic passages punctuated by oracular declarations
- **Pronoun use:** "we/one" — "we who seek", "one who draws this card" (not direct "you")

### Grounded Language Patterns
- **Directness:** Very direct — "This card means X. For you right now, consider Y." Clean, actionable.
- **Pronoun use:** Direct "you" — straightforward second person address

### Technical Competence
- **Mystic with technical topics:** Balance metaphor AND technical truth — cosmic framing that doesn't sacrifice accuracy ("find that line as close as you can")
- **Grounded with technical topics:** Be specific — explicitly name patterns/concepts ("This is about technical debt. Specifically, your authentication layer needs...")
- **Non-technical questions:** Same voice rules apply — topic doesn't change voice behavior
- **Codebase context:** Yes, reference specifics when available — "The Tower suggests disruption — perhaps in your auth refactor that's been stalled"

### Claude's Discretion
- Exact cosmic/earth metaphor balance for Mystic
- When to use flowing vs oracular rhythm in Mystic voice
- Subtle bookend phrasing for each voice

</decisions>

<specifics>
## Specific Ideas

- Mystic as "techno-mystic cosmic priestess" — divine feminine, futuristic ecotopian, Unity Consciousness
- Both voices should be able to speak to code/architecture when relevant
- Mystic doesn't dumb down technical insight, just frames it through cosmic lens
- Grounded gets straight to actionable interpretation

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-voice-system*
*Context gathered: 2026-01-22*
