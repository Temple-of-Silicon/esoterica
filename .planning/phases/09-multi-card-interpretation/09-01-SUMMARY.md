---
phase: 09-multi-card-interpretation
plan: 01
subsystem: interpretation
tags: [tarot, multi-card, narrative-weaving, voice-system, llm-prompting]

# Dependency graph
requires:
  - phase: 08-reading-modes
    provides: "Physical and digital mode card collection complete"
  - phase: 07-spread-options
    provides: "Spread selection with position tracking"
  - phase: 06-wizard-infrastructure
    provides: "Interactive wizard collecting reading parameters"
provides:
  - "Position-aware multi-card interpretation with woven narrative format"
  - "Position-weaving language patterns for natural prose integration"
  - "Card relationship templates (tensions, harmonies, imagery)"
  - "Voice-aware multi-card examples (Mystic and Grounded)"
affects: [phase-10-integration-polish, future-interpretation-enhancements]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Woven narrative interpretation (positions in prose, not headers)"
    - "Card relationship synthesis (explicit tensions/harmonies)"
    - "Closing question synthesis (referencing multiple cards)"

key-files:
  created: []
  modified:
    - "skills/tarot/SKILL.md"

key-decisions:
  - "Multi-card uses woven narrative, single-card preserves v1.0 format"
  - "Position names woven into prose as interpretive prompts, not section headers"
  - "Card relationships explicitly called out (tensions/harmonies/imagery)"
  - "Closing questions must reference multiple cards/positions from reading"

patterns-established:
  - "Position-weaving: 'What's present in your situation is...' vs '**Situation:** The Tower...'"
  - "Card relationships: 'The Tower disrupts what The Empress nurtures...'"
  - "Narrative length scales with context depth (2-5 paragraphs, 200-600 words)"

# Metrics
duration: 2min
completed: 2026-01-23
---

# Phase 09 Plan 01: Multi-Card Interpretation Summary

**Position-aware woven narrative interpretation for multi-card spreads with explicit card relationships and voice-consistent examples**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-23T02:08:49Z
- **Completed:** 2026-01-23T02:10:40Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments
- Extended Reading Instructions with woven narrative format for multi-card interpretation
- Added position-weaving language patterns (integrate position names into prose naturally)
- Added card relationship patterns (tensions, harmonies, visual/imagery references)
- Created complete voice-aware multi-card examples (both Mystic and Grounded voices)
- Preserved single-card interpretation format exactly as-is (v1.0 format unchanged)

## Task Commits

Each task was committed atomically:

1. **Task 1: Rewrite multi-card interpretation section with woven narrative format** - `3e2200b` (feat)
2. **Task 2: Add voice-aware multi-card interpretation examples** - `122a18c` (feat)

## Files Created/Modified
- `skills/tarot/SKILL.md` - Extended Reading Instructions with multi-card woven narrative guidance; added Multi-Card Voice Examples section demonstrating position-aware interpretation for both voices

## Decisions Made

**Multi-card format distinction:**
- Multi-card readings use woven narrative (positions integrated into prose, not as headers)
- Single-card readings preserve v1.0 format exactly (card name header, direct interpretation)
- Format dispatch based on card count ensures no regression in single-card behavior

**Position integration approach:**
- Position names are interpretive prompts woven into narrative prose
- NOT used as section headers (**[Card] as [Position]** pattern explicitly avoided)
- Language patterns documented for common positions (Situation/Action/Outcome, Problem/Solution, custom)
- Custom position names honored exactly as user provides them

**Card relationship synthesis:**
- Explicit tensions documented ("The Tower disrupts what The Empress nurtures...")
- Explicit harmonies documented ("The Magician's skill flows into The Sun's clarity...")
- Visual/imagery references used when grounding abstract concepts
- Relationships strengthen narrative coherence, not forced if cards independent

**Closing question requirements:**
- Must reference specific cards/positions from the reading
- Generic questions ("What resonates?") explicitly flagged as anti-pattern
- Questions should synthesize multiple cards, not isolate one
- Voice-appropriate framing (mystic reflective, grounded actionable)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## Next Phase Readiness

Multi-card interpretation infrastructure complete. Phase 10 (Integration & Polish) can now:
- Test full wizard → spread → mode → interpretation flow
- Verify single-card regression (INTERP-01)
- Verify multi-card woven narrative (INTERP-02)
- Verify position awareness (INTERP-03)
- Polish any edge cases or UX improvements

All core interpretation capabilities (single-card, multi-card, position-aware, voice-aware, digital/physical modes) implemented and ready for integration testing.

---
*Phase: 09-multi-card-interpretation*
*Completed: 2026-01-23*
