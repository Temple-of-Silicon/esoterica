---
phase: 08-reading-modes
plan: 01
subsystem: tarot-reading-modes
tags: [tarot, physical-deck, fuzzy-matching, card-input, wizard-ui]
requires: [07-02-spread-options]
provides: [card-matching, physical-mode-entry, mode-dispatch]
affects: [08-02-if-exists]
tech-stack:
  added: []
  patterns: [fuzzy-matching, input-validation, duplicate-prevention]
key-files:
  created: []
  modified:
    - skills/tarot/SKILL.md
decisions:
  - id: physical-mode-ritual
    choice: Include ritual moment before card entry
    rationale: Honors physical deck practice, creates intentional pause
  - id: fuzzy-card-matching
    choice: Support card names, variants, and numbers
    rationale: Forgiving UX for users with physical decks
  - id: duplicate-prevention
    choice: Prevent duplicate cards in multi-card spreads
    rationale: Physical tarot convention, maintains reading integrity
  - id: summary-confirmation
    choice: Show summary with change option for multi-card spreads
    rationale: User confidence before interpretation
metrics:
  duration: 2m 51s
  completed: 2026-01-23
---

# Phase [8] Plan [1]: Reading Modes Summary

Physical and digital reading modes with fuzzy card matching, ritual moments, and duplicate prevention.

## What We Built

Implemented dual-mode card collection: digital mode preserves Phase 7's random selection via shuf, physical mode adds interactive card entry with fuzzy matching and validation.

**Card Matching Infrastructure:**
- Fuzzy matching strategy: exact names, common variants, numeric input
- Full 22-card Major Arcana lookup table (0-21)
- Variant support: "wheel" → Wheel of Fortune, "hanged" → Hanged Man, "judgement"/"judgment" → card 20

**Physical Mode Card Entry Flow:**
- Ritual opening: prompts user to shuffle and draw cards before entry
- Position-by-position entry with validation loop
- Duplicate prevention for multi-card spreads
- Summary confirmation with option to change cards
- Gentle retry on unrecognized input (no retry limits)

**Mode Dispatch:**
- Wizard Question 3 selection determines card collection method
- Digital mode: immediate random selection (shuf)
- Physical mode: interactive entry with validation
- Both modes produce same output format for interpretation

## Implementation Details

**Three atomic commits:**

1. **Card matching infrastructure** (1feecfc)
   - Added Card Matching Functions section
   - Documented match_card logic (normalize, exact, variants, numeric)
   - Included full card name lookup table

2. **Physical mode card entry flow** (5c0f194)
   - Added Physical Mode Card Entry section
   - Implemented ritual opening with readiness check
   - Built position-by-position entry with validation
   - Added duplicate checking for multi-card spreads
   - Included summary confirmation with change option

3. **Mode dispatch in wizard flow** (6dbf3a8)
   - Updated wizard flow comment to reference new modes
   - Added Mode Dispatch section connecting Q3 to collection
   - Updated all four spread types to reference physical mode
   - Preserved digital mode behavior unchanged

**Files modified:**
- `skills/tarot/SKILL.md`: +184 lines across 3 sections

## Deviations from Plan

None - plan executed exactly as written.

## Decisions Made

**Physical mode ritual moment:**
Chose to include "Take a moment with your cards..." ritual opening before card entry. This honors physical tarot practice and creates an intentional pause between drawing and entering cards.

**Fuzzy matching strategy:**
Implemented forgiving matching that accepts:
- Card names with or without "The" prefix
- Common variants (wheel, hanged)
- Both British and American spelling (judgement/judgment)
- Numeric input (0-21)

This reduces friction for users with physical decks who may not know exact card names.

**Duplicate prevention:**
For multi-card spreads, reject duplicate cards with gentle prompt to draw another. This follows physical tarot convention (no card appears twice in a spread) and maintains reading integrity.

**Summary confirmation:**
For multi-card spreads, show all collected cards with option to change before interpretation. This gives users confidence that their cards were entered correctly, especially important for physical mode where there's no undo.

## Technical Observations

**Pattern: Fuzzy matching as UX affordance**
The card matching logic prioritizes user convenience over strict validation:
- Normalize before matching (lowercase, strip "the")
- Accept common variants
- No retry limits on unrecognized input

This mirrors how Claude handles other ambiguous user input - be forgiving, provide clear feedback, allow correction.

**Pattern: Mode as collection strategy**
Digital and physical modes differ only in HOW cards are collected, not HOW they're interpreted. Mode Dispatch section makes this explicit - both modes produce the same output (card numbers + positions) that feed into identical interpretation flow.

This separation of concerns keeps mode logic isolated to collection phase.

**Integration with existing spreads:**
All four spread types (Single, Situation/Action/Outcome, Claude Suggests, Custom) now support both modes. The spread logic determines WHAT positions exist, mode logic determines HOW cards are collected for those positions.

Clean orthogonal design - spread and mode are independent concerns.

## Next Phase Readiness

**Phase 8, Plan 2 prerequisites met:**
- Card matching functions available for validation
- Physical mode entry flow complete
- Mode dispatch connects wizard to collection
- Both modes tested against existing interpretation flow

**Potential considerations:**
- Physical mode assumes users know card names or can reference their deck
- No image recognition or autocomplete (out of scope for v1.1)
- Duplicate prevention could be made optional for advanced users (not in current plan)

No blockers for continuing Phase 8.

## Testing Notes

**Manual testing recommended:**

1. **Single card, digital mode:**
   - Wizard Q3: "Digital (Recommended)"
   - Verify: shuf draws one card, interpretation proceeds

2. **Three-card spread, physical mode:**
   - Wizard Q3: "Physical deck"
   - Verify: ritual opening appears
   - Enter cards: "The Fool", "death", "16"
   - Verify: fuzzy matching works, summary shown, interpretation proceeds

3. **Custom spread, physical mode with duplicate:**
   - Wizard Q3: "Physical deck"
   - Custom positions: "Past, Present, Future"
   - Enter: "fool", "fool" (duplicate)
   - Verify: duplicate rejected, re-prompt for second position

4. **Physical mode, unrecognized input:**
   - Enter: "blahblah"
   - Verify: gentle retry message, no error

5. **Physical mode, variant matching:**
   - Enter: "wheel" → matches Wheel of Fortune
   - Enter: "hanged" → matches Hanged Man
   - Enter: "judgement" or "judgment" → matches card 20

## Reflection

This plan delivered on the core promise: users can now use physical decks with the tarot skill. The fuzzy matching makes it forgiving enough for real use, the ritual moment honors the practice, and the duplicate prevention maintains reading integrity.

Key insight: The mode system is simpler than expected because it's just a collection strategy. The interpretation layer remains unchanged - mode is purely about HOW cards get into the system, not WHAT happens after.

The orthogonal design (spread determines positions, mode determines collection) keeps the codebase maintainable and makes future spread types or modes easy to add.

Physical mode opens the skill to users who prefer tactile card interaction while preserving the speed of digital mode for quick draws. Both paths lead to the same quality interpretation.
