---
phase: 14
plan: 01
subsystem: Marketing
tags: [linkedin, social-media, og-tags, launch-content, brand-voice]

dependency-graph:
  requires:
    - phase: 13
      plan: 02
      artifact: docs/index.html
      reason: Landing page needs complete OG tags for social sharing
    - phase: 10
      plan: 02
      artifact: brand/voice-guidelines.md
      reason: Voice consistency for LinkedIn posts
  provides:
    - artifact: brand/launch/linkedin-posts.md
      purpose: Ready-to-publish LinkedIn content in cosmic priestess voice
    - artifact: docs/index.html (updated OG tags)
      purpose: Complete social sharing meta tags with image dimensions
  affects:
    - phase: 14
      plan: 02+
      reason: Launch posts reference landing page URL and install command

tech-stack:
  added: []
  patterns:
    - Social media content creation with voice consistency validation
    - Open Graph meta tag implementation per OG Protocol specification

key-files:
  created:
    - brand/launch/linkedin-posts.md
  modified:
    - docs/index.html

decisions:
  - decision: Keep announcement post concise at 800 chars instead of LinkedIn max 1,300-1,600
    rationale: Shorter post maintains mystical impact without diluting voice
    considered: ["Expand to 1,300+ chars with more features", "Add carousel slide descriptions"]
    context: Phase 14 Plan 01 Task 1
  - decision: Use descriptive OG image alt text mentioning key visual elements
    rationale: Accessibility and context for social platforms when image fails to load
    considered: ["Generic 'Esoterica hero image'", "Minimal 'Tarot reading interface'"]
    context: Phase 14 Plan 01 Task 2

metrics:
  duration: 1.2 min
  completed: 2026-01-26
---

# Phase 14 Plan 01: LinkedIn Posts & OG Meta Tags

**One-liner:** LinkedIn launch posts in cosmic priestess voice with complete OG meta tags for clean social sharing

## What Was Built

Created launch materials for social media announcement:

**LinkedIn Posts (brand/launch/linkedin-posts.md):**
- **Teaser post:** 402 characters with hook in first 140 chars ("What if your AI agent could draw tarot cards for complex decisions?")
- **Announcement post:** 800 characters including install command and landing page link
- **Voice:** Cosmic priestess energy verified - uses threshold, veil, draw, reading, illuminates, reveals
- **No corporate jargon:** Verified no instances of leverage, synergy, optimize, solution, just, simply

**OG Meta Tags (docs/index.html):**
- Added `og:image:width` (1200) and `og:image:height` (630) to prevent cropping
- Added `og:image:type` (image/png) for platform compatibility
- Added `og:image:alt` with descriptive text for accessibility
- Added `og:site_name` (Esoterica) for richer social cards
- Added `twitter:image:alt` for Twitter/X accessibility

## Decisions Made

### Voice Consistency Over Character Count
The announcement post sits at 800 characters instead of LinkedIn's recommended 1,300-1,600 range. The research suggested longer posts perform better, but extending the post to hit that range would have diluted the mystical voice with feature lists or technical details. The cosmic priestess speaks concisely - intrigue first, utility embedded, not explained.

**Impact:** May see lower engagement metrics than longer posts, but maintains brand differentiation. The voice IS the differentiator.

### Descriptive Alt Text Over Minimal
OG image alt text describes the actual scene ("Sacred altar in Joshua Tree with tarot cards and crystal-computer") rather than generic labeling ("Esoterica hero image"). This serves both accessibility and provides context when images fail to load on slower connections.

**Impact:** Slightly longer meta tag, but significantly better for screen readers and image load failures.

## Implementation Notes

### LinkedIn Post Hook Strategy
Both posts frontload value in the first 140 characters to handle LinkedIn mobile "see more" cutoff:

- **Teaser:** "What if your AI agent could draw tarot cards for complex decisions? Not for fortune-telling—for reframing. For breaking the spell of"
- **Announcement:** "Esoterica is live. Tarot readings for Claude agents.\n\nNot a novelty—a perspective-shifting framework. 78 cards waiting to reframe your ques"

Each hook works as a standalone statement even when truncated.

### Voice Validation
Ran grep check against forbidden words from voice-guidelines.md:
- Corporate jargon: No instances of leverage, synergy, optimize, solution, just, simply
- Cliched mysticism: No instances of unlock potential, manifest destiny, divine guidance
- Tarot terminology: Confirmed use of "draw" (not "select"), "reading" (not "session")

### OG Meta Tag Order
Added new tags immediately after `og:image` following Open Graph Protocol recommendations:
1. og:image (URL)
2. og:image:width
3. og:image:height
4. og:image:type
5. og:image:alt

This order ensures platforms that read tags sequentially get all image metadata before moving to other properties.

## What Changed From Plan

None - plan executed exactly as written.

## Next Phase Readiness

**Ready to launch:**
- LinkedIn posts ready to copy-paste
- Landing page URL confirmed working: https://jem-computer.github.io/esoterica/
- Install command verified: `npm install -g esoterica`
- OG tags ready for validation at metatags.io after GitHub Pages deployment

**Note for next plan:** Demo GIF/video should show 60-90 second wizard flow with first 15 seconds being most compelling visual (card draw animation).

**Testing recommendations:**
1. Test OG tags at https://metatags.io/ with landing page URL
2. Share landing page link on LinkedIn/Twitter to verify image displays correctly
3. Check mobile preview to confirm first 140 chars of posts work as hooks

**No blockers.**

---

## Task Breakdown

| Task | Type | Duration | Commit |
|------|------|----------|--------|
| 1. Write LinkedIn posts | auto | ~0.6 min | 386f0ad |
| 2. Complete OG meta tags | auto | ~0.6 min | a799cd7 |

**Total execution time:** ~1.2 minutes

## Commits

1. `386f0ad` - feat(14-01): write LinkedIn teaser and announcement posts
2. `a799cd7` - feat(14-01): complete OG meta tags with image dimensions

## Files Modified

**Created:**
- `brand/launch/linkedin-posts.md` - Teaser and announcement posts (34 lines)

**Modified:**
- `docs/index.html` - Added 6 OG meta tag lines (12 → 18, 19 → 25)

---

*Phase 14 Plan 01 complete - LinkedIn launch materials ready, OG tags complete for clean social sharing*
