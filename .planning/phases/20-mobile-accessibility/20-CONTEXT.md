# Phase 20: Mobile + Accessibility - Context

**Gathered:** 2026-01-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Ensure the scroll-driven video hero (Phase 19) degrades gracefully on mobile and respects accessibility preferences. Add a scroll hint to communicate interactivity. No new page sections or features — this is about making the existing hero work for everyone.

</domain>

<decisions>
## Implementation Decisions

### Mobile fallback strategy
- Keep scroll-driven video on mobile — do NOT replace with static poster on mobile
- The scroll-to-currentTime scrubbing works on mobile touch scrolling
- Mobile breakpoint: 640px (phones only; tablets keep full desktop experience)
- Poster image still needed as a fallback for reduced-motion (see below), not for mobile specifically

### Reduced-motion behavior
- `prefers-reduced-motion: reduce` users see a static first frame — no scroll animation at all
- Hero collapses to 100vh (no 300vh scroll space) when reduced-motion is active
- All text content (tagline, description, install command) immediately visible — zero animation
- All CSS transitions disabled site-wide (including theme toggle 0.3s transition)
- Scroll hint hidden entirely when reduced-motion is active
- Video element replaced with static poster image

### Scroll hint design
- Positioned bottom-right of the hero viewport
- Appears after a ~1-2 second delay on page load (let the hero visual breathe)
- Fades out at approximately 20% scroll progress through the hero
- Hidden for reduced-motion users (no scroll interaction to hint at)

### Claude's Discretion
- Scroll hint visual style (chevron, mouse icon, or text — whatever fits the aesthetic)
- Scroll depth on mobile (keep 300vh or reduce — based on how the video pacing feels)
- Poster image approach (extracted JPEG/WebP still vs video poster attribute)
- Which video frame to extract for poster (first frame specified, method is flexible)
- Scroll hint animation style (bounce, pulse, etc.)
- Viewport resize handling approach

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 20-mobile-accessibility*
*Context gathered: 2026-01-28*
