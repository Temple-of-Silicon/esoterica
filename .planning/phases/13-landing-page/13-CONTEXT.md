# Phase 13: Landing Page - Context

**Gathered:** 2026-01-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Public web presence where people discover and understand Esoterica. A minimal landing page with hero, value proposition, and install command. Interactive demos and comprehensive marketing content are out of scope.

</domain>

<decisions>
## Implementation Decisions

### Page Structure
- Minimal single-page design: hero + value prop + install command + footer
- No scrolling required for core experience
- Minimal nav: logo left, GitHub link right (no menu)
- Hosted on GitHub Pages from /docs folder on main branch

### Visual Treatment
- Full-bleed hero image as background with text overlaid
- Light and dark mode with toggle
- Same hero image for both modes — light mode uses lighter overlay for readability
- Typography hierarchy: tagline ("Ancient patterns, new paths") as hero headline, "Esoterica" name secondary

### Call to Action
- Primary (only) CTA: install command
- No secondary action — GitHub link lives in nav, not as CTA
- Install command displayed inline with "Copy" button beside it (not code block)
- Copy feedback: button text changes to "Copied!" briefly

### Claude's Discretion
- Exact overlay treatment for light/dark modes
- Footer content and links
- Responsive breakpoints
- Animation/transitions (if any)
- Favicon and meta tag integration

</decisions>

<specifics>
## Specific Ideas

- Hero headline first, name secondary — leads with the value proposition
- Keep it focused — single install command, no distractions
- Button text change for copy confirmation (not toast)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 13-landing-page*
*Context gathered: 2026-01-24*
