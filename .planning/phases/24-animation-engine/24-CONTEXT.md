# Phase 24: Animation Engine - Context

**Gathered:** 2026-01-30
**Status:** Ready for planning

<domain>
## Phase Boundary

Scrolling through the demo section triggers phase transitions with typewriter text reveal. Four scroll zones map to four demo phases (ask -> pull -> interpret -> integrate). IntersectionObserver detects phase changes, setTimeout drives character-by-character animation.

</domain>

<decisions>
## Implementation Decisions

### Phase Transitions
- Previous phase text fades to dim when entering a new phase (bright text = active phase)
- Cursor follows the last typed character, blinks at end of active line
- Text completes instantly if user scrolls away mid-typing (no partial states)

### Typewriter Timing
- Fast base speed: 20-30ms per character
- Brief pauses at punctuation (periods, commas, ellipses) for natural typing rhythm
- Scrolling away mid-animation: text completes instantly

### Progress Indicators
- Active dot has terminal green glow (matches cursor aesthetic)
- Completed dots glow but dimmer than active dot
- Future/pending dots are hollow/unlit

### Claude's Discretion
- Scroll-back behavior: how text re-highlights when scrolling up through completed phases
- Pause timing between phases before typing starts
- Phase-specific typing speeds (faster for commands, slower for interpretations)
- Whether active dot pulses like the cursor or stays static
- Whether indicator dots are clickable to jump between phases

</decisions>

<specifics>
## Specific Ideas

- Glow effect on active indicator dot should match terminal green glow from Phase 23
- "Fades to dim" means previous text grays out but remains visible (log-style accumulation)
- Fast typing (20-30ms) feels like a skilled developer, not dramatic slow reveal

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 24-animation-engine*
*Context gathered: 2026-01-30*
