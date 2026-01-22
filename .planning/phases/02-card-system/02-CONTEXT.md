# Phase 2: Card System - Context

**Gathered:** 2026-01-22
**Status:** Ready for planning

<domain>
## Phase Boundary

22 Major Arcana cards with rich meanings embedded in the tarot-reader subagent. The subagent acts as the interpreter — a tarot reader who receives context about the querent's situation and provides personalized interpretations through the archetypal lens of the drawn card.

</domain>

<decisions>
## Implementation Decisions

### Card meaning depth
- Rich archetypal meanings, not just keywords
- Each card needs enough depth to enable contextual interpretation
- Meanings should support direct mapping to user's questions/situations

### Card content structure
Each card should include:
- **Core themes** — Central meanings (e.g., The Fool = new beginnings, innocence, leap of faith)
- **Life situations** — When this card applies (starting a project, facing uncertainty, making decisions)
- **Shadow aspects** — Challenges or warnings the card suggests (even without full reversed meanings)
- **Symbolic imagery** — Key symbols and their meaning (cliff, white rose, small dog, etc.)

### Interpretation style
- **Direct mapping** — The subagent explicitly connects card themes to the user's context
- Not suggestive/traditional style where querent draws their own connections
- The subagent IS the tarot reader, interpreting FOR the user

### Context handling
- When question provided: Interpret card through lens of that question
- When no question: Relate to session context (what user is working on)
- Subagent reads the room, connects card to situation

### Claude's Discretion
- Exact wording and tone of card meanings
- How much symbolic detail per card
- Balance between universal meanings and tech/work applicability

</decisions>

<specifics>
## Specific Ideas

- "You're asking a tarot reader for a reading and telling them a lil about your life and then they're giving you their interpretation"
- The subagent is the interpreter, not a reference lookup
- Contextual readings are the goal — `/tarot what are the tradeoffs for X` should get a reading that speaks to that question

</specifics>

<deferred>
## Deferred Ideas

- **Question-based invocation with file references** (e.g., `/tarot what should I know about @plan.md`) — Phase 5: Polish & Integration (INVOKE-01, INVOKE-02)
- Passing explicit questions via `/tarot [question]` syntax — Phase 5

</deferred>

---

*Phase: 02-card-system*
*Context gathered: 2026-01-22*
