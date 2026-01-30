# Phase 23: Terminal Foundation - Context

**Gathered:** 2026-01-30
**Status:** Ready for planning

<domain>
## Phase Boundary

Build a static terminal container with all demo text in the DOM. Terminal sticks in viewport during scroll. Visual foundation only — animation and content are later phases.

</domain>

<decisions>
## Implementation Decisions

### Terminal Styling
- Classic green-on-black color scheme — match the exact green from the hero image
- Witchy retro frame with minimal accents (runes/unicode stars as decorative buttons)
- Text glow + scanline effects for CRT aesthetic (Claude tunes intensity for readability/vibe balance)
- Prompt characters ($, >) in a different shade of green to distinguish from output

### Page Placement
- Position after hero section, before features — early visibility
- Terminal sticks to upper portion of viewport during demo scroll
- Narrow/focused width — feels like an actual terminal window, not full-width
- Phase indicators (dots/markers) to show progress through the 4 demo phases

### Cursor Design
- Block cursor style — classic terminal look
- Slow pulse animation (fade in/out) — softer than harsh blink
- Cursor positioning and color at Claude's discretion

### Claude's Discretion
- Exact scanline/glow intensity balance
- Cursor behavior during animation phases
- Cursor color (likely same green or slightly brighter)
- Font choice (system monospace assumed)

</decisions>

<specifics>
## Specific Ideas

- "The hero image uses green text on black — keep her classic"
- Witchy accents should riff on the vibe of the hero images — runes, stars, mystical feel
- The terminal should feel like a statement piece but not overwhelm

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 23-terminal-foundation*
*Context gathered: 2026-01-30*
