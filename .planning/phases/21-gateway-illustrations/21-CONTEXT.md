# Phase 21: Gateway Illustrations - Context

**Gathered:** 2026-01-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Landing page illustrations that explain Esoterica's concepts using Gateway Process-style visuals. Covers: prompt generation for Nano Banana Pro, integration into the existing prose section, theme adaptation (light/dark), and scroll-triggered fade-in reveals. The illustrations complement existing prose content — no new copy or page sections are being added.

</domain>

<decisions>
## Implementation Decisions

### Illustration subject matter
- Line art / geometric style — clean lines, sacred geometry, minimal color
- 3 illustrations total, one per key prose theme
- Concepts mapped to existing prose sections: pattern recognition, interrupting linear thinking, ancient-meets-modern
- Visual references: Gateway Process diagrams (Monroe Institute focus levels, concentric rings, energy fields), sacred geometry (Vesica piscis, Flower of Life, hexagrams), tarot iconography (Fool's journey, major arcana symbols)
- Tone: subtle nod to Gateway Process — not overt, just a wink for those who recognize it

### Page layout integration
- Interspersed in prose — each illustration appears between paragraph groups
- Break out wider than the 38rem prose column (roughly 60-70rem) to create visual breathing room
- PNG with transparency — preserving exact Nano Banana Pro output
- No background container — transparent PNGs sit directly on page background
- Subtle captions beneath each illustration in muted text (e.g., "Pattern Recognition")

### Theme adaptation
- Base illustrations: dark lines on light/transparent background (standard for line art)
- Dark mode: CSS `filter: invert()` approach — start with this, generate separate dark-mode assets only if inversion doesn't work
- No background treatment — relies on transparent PNG against `--bg-page`

### Scroll reveal behavior
- Fade + slide up entrance (opacity 0→1 combined with subtle upward translate)
- Independent Intersection Observer triggers — each illustration fades in when it enters the viewport
- Reduced-motion: illustrations visible immediately, no animation (consistent with Phase 20 patterns)

### Claude's Discretion
- Exact filter formula (straight `invert(1)` vs `invert(1) hue-rotate(180deg)`) — pick what looks best
- Intersection Observer threshold — pick what feels right with existing scroll pacing
- Exact breakout width for illustrations
- Animation duration and easing curve
- Which prose paragraphs each illustration sits between

</decisions>

<specifics>
## Specific Ideas

- "Not OVERTLY Gateway-y, just a lil wink to those who get it" — the illustrations should reward recognition without being on-the-nose
- Blend Gateway Process consciousness diagrams with sacred geometry and tarot symbols into a cohesive line-art style
- Existing prose themes to map to: (1) pattern recognition / tarot as pattern interruption, (2) interrupting linear thinking / randomness as tool, (3) ancient wisdom meets modern technology

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 21-gateway-illustrations*
*Context gathered: 2026-01-28*
