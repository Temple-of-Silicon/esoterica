# Phase 18: Wizard Enhancement - Context

**Gathered:** 2026-01-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can choose between Major Arcana only and Full 78-card deck in the wizard flow. Deck selection affects card pool for random draw. Physical mode supports all 78 cards with fuzzy matching.

</domain>

<decisions>
## Implementation Decisions

### Fuzzy Matching Rules
- Accept all common input variations: "3 of cups", "three of cups", "III cups", "3 cups", "three cups"
- Court cards accept shortened forms: "queen cups", "Q cups", "queen of cups" all valid
- Case-insensitive matching throughout
- Minor typos handled with suggestion: "Did you mean 'Three of Cups'?" with confirmation
- When input is ambiguous or no match found: suggest closest match for confirmation

### Claude's Discretion
- Wizard flow placement (when deck selection appears relative to spread selection)
- Deck choice presentation (how options are worded, default selection)
- Backwards compatibility approach (whether Major-only is default)
- Specific fuzzy matching algorithm implementation

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches for wizard flow and deck selection. User focused on fuzzy matching behavior.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 18-wizard-enhancement*
*Context gathered: 2026-01-26*
