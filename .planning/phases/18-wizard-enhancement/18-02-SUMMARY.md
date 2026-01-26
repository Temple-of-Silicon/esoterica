---
phase: 18
plan: 02
subsystem: tarot-skill
tags: [card-index, fuzzy-matching, minor-arcana, physical-mode]

dependency-graph:
  requires: [18-01]
  provides: [78-card-index, minor-arcana-matching]
  affects: [18-03]

tech-stack:
  added: []
  patterns: [fuzzy-matching, variant-normalization]

key-files:
  created: []
  modified:
    - skills/tarot/SKILL.md

decisions:
  - title: "Card numbering follows suit-based scheme"
    rationale: "Wands 22-35, Cups 36-49, Swords 50-63, Pentacles 64-77 for logical grouping"
    impact: "Card Index table maps cleanly to suit files"
  - title: "Optional 'of' in Minor Arcana names"
    rationale: "Users naturally say 'three cups' not 'three of cups'"
    impact: "Fuzzy matching accepts both forms equally"
  - title: "Court card abbreviations support natural shortcuts"
    rationale: "Users with physical decks often use shorthand (Q, K, Kn, P)"
    impact: "Physical mode accepts both formal and informal input"

metrics:
  duration: "2 min 13 sec"
  completed: "2026-01-26"
---

# Phase 18 Plan 02: Card Index & Fuzzy Matching Summary

**Expanded card index to 78 cards and updated fuzzy matching to support all Minor Arcana input variations**

## Performance

- **Duration:** 2 min 13 sec
- **Started:** 2026-01-26T17:46:02Z
- **Completed:** 2026-01-26T17:48:15Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments

### Task 1: Expanded Card Index to 78 Cards
- Added 56 Minor Arcana entries (cards 22-77) to Card Index table
- Suit-based numbering: Wands 22-35, Cups 36-49, Swords 50-63, Pentacles 64-77
- Extracted keywords from each suit's card file for index descriptions
- Preserved Major Arcana entries (0-21) exactly as they were

### Task 2: Updated Fuzzy Matching for 78 Cards
- Added comprehensive Minor Arcana matching patterns:
  - Pip cards: number words (three), Arabic numerals (3), Roman numerals (III)
  - Court cards: full form, short form, and abbreviations (Q, Kn, P, K)
  - Suit abbreviations: w, c, s, p, pent
  - Optional "of" in card names (e.g., "three cups" matches "Three of Cups")
- Updated numeric range to 0-77 for Full deck mode (conditional on deck choice)
- Updated Physical Mode Card Entry prompts with Full deck examples
- Replaced redundant card name lookup table with reference to Card Index

## Task Commits

Each task was committed atomically:

1. **Task 1: Expand Card Index to 78 Cards** - `a19aecb` (feat)
   - skills/tarot/SKILL.md: Added 56 Minor Arcana entries to Card Index table

2. **Task 2: Update Fuzzy Matching for 78 Cards** - `7820475` (feat)
   - skills/tarot/SKILL.md: Added Minor Arcana matching patterns, updated numeric ranges

## Technical Details

### Card Index Structure

The Card Index now contains all 78 tarot cards with suit-based numbering:

| Range | Suit | Cards |
|-------|------|-------|
| 0-21 | Major Arcana | The Fool through The World |
| 22-35 | Wands | Ace through King of Wands |
| 36-49 | Cups | Ace through King of Cups |
| 50-63 | Swords | Ace through King of Swords |
| 64-77 | Pentacles | Ace through King of Pentacles |

### Fuzzy Matching Examples

Physical mode now accepts all these input variations:

**Pip cards:**
- "three of cups" → Three of Cups (card 38)
- "three cups" → Three of Cups (card 38)
- "3 of cups" → Three of Cups (card 38)
- "3 cups" → Three of Cups (card 38)
- "III cups" → Three of Cups (card 38)

**Court cards:**
- "queen of cups" → Queen of Cups (card 48)
- "queen cups" → Queen of Cups (card 48)
- "Q cups" → Queen of Cups (card 48)
- "Q of cups" → Queen of Cups (card 48)

**Suit abbreviations:**
- "3 w" → Three of Wands (card 24)
- "Q s" → Queen of Swords (card 62)
- "K pent" → King of Pentacles (card 77)

## Deviations from Plan

None - plan executed exactly as written.

## Dependencies & Integration

**Depends on:**
- Plan 18-01: Deck selection wizard step (provides conditional card pool logic)

**Enables:**
- Plan 18-03: Full wizard testing and documentation updates

**Integration points:**
- Card Index table: Referenced by Card Matching Functions for card name lookup
- Fuzzy matching rules: Applied in Physical Mode Card Entry validation loop
- Numeric ranges: Conditional on deck choice from wizard Question 2.5

## Next Phase Readiness

**Plan 18-03 can proceed:**
- Card Index contains all 78 cards for testing
- Fuzzy matching supports all planned input variations
- Physical mode documentation updated with Full deck examples

**No blockers identified.**

## Success Criteria Met

- [x] Card index contains all 78 cards with correct suit-based numbering
- [x] Physical mode accepts: "three of cups", "3 of cups", "III cups", "3 cups", "three cups"
- [x] Physical mode accepts court card variations: "queen cups", "Q cups", "queen of cups"
- [x] Typo suggestions documented for all 78 cards
- [x] Numeric input 0-77 valid in Full deck mode

## Verification Traces

1. **Card Index completeness:**
   - Table contains 78 entries (verified via grep count)
   - Entry 22: Ace of Wands | Wands
   - Entry 35: King of Wands | Wands
   - Entry 36: Ace of Cups | Cups
   - Entry 77: King of Pentacles | Pentacles

2. **Fuzzy matching coverage:**
   - Minor Arcana pip patterns: number words, numerals, Roman numerals
   - Court card patterns: full, short, abbreviated forms
   - Suit abbreviations: w, c, s, p, pent
   - Optional "of" documented and explained

3. **Mental trace examples:**
   - "3 cups" → normalize → variant match → Three of Cups (card 38)
   - "Q wands" → normalize → court abbreviation + suit abbreviation → Queen of Wands (card 34)
   - "ace pentacles" → normalize → exact match without "of" → Ace of Pentacles (card 64)

---

**Phase 18 Plan 02 complete.** All 78 cards now accessible via physical mode with comprehensive fuzzy matching support.
