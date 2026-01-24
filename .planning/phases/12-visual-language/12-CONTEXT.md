# Phase 12: Visual Language - Context

**Gathered:** 2026-01-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Create distinctive visual identity for Esoterica with "eco-futurist utopian divine feminine" aesthetic. Produce hero image, social variants, favicon, and comprehensive brand guide. Establish image generation workflow via Replicate API skill.

</domain>

<decisions>
## Implementation Decisions

### Image Generation Approach
- Use Replicate.com API (not Weavy/AI Design Machine — no API available)
- Model: Nano Banana Pro (consistent with existing Design Machine work)
- Create a `/generate-image` or similar skill in Esoterica repo for invocation
- Skill enables agentic image generation during execution

### Hero Image Direction
- **Setting:** Joshua Tree sunrise, altar scene
- **Focal point:** Intimate shot of altar + cards (not wide landscape)
- **Crystal-computer:** Selenite crystalline case with 16:9 screen, terminal text showing /tarot output
- **Tarot cards:** High Priestess, Justice, Chariot (the tagline trio), stylized RWS-inspired
- **Figures:** Explore variations — hands only, no people, soft background figures (iterate to find best)
- **CalEarth domes:** Optional element if composition allows
- **Color:** Joshua Tree sunrise warmth (pink-gold morning light)
- **Style:** Photorealistic with Kodak Eastman 100T 5247 35mm film aesthetic (grain, halation, faded warm colors, lens flares, shallow DoF)
- **Aspect ratio:** 16:9 landscape
- **Iterations:** 10+ variations, all focused on this single concept
- **Terminal fallback:** If /tarot output doesn't render well, use placeholder for later compositing

### Prompt Template (Adapt for Hero)
Core structure from existing Design Machine prompts:
```
Candid scene from an eco-futurist utopian divine feminine society [SCENE DESCRIPTION], 1980s-meets-2180s. Kodak Eastman 100T 5247 35mm film, grain, halation, faded warm colors, natural lens flares, shallow depth-of-field. Selenite crystal devices with [SCREEN CONTENT]. Diverse women in flowing white, black, or iridescent gauzey cotton max-dresses, opal, labradorite, moonstone, amethyst jewelry, silver, black, or iridescent fingernails. Soft, peaceful, gentle, pastoral cybernetic merging of femininity & technology.
```

For hero, adapt SCENE DESCRIPTION to: "at a sacred altar in a sun-drenched Joshua Tree grove at sunrise, three tarot cards (High Priestess, Justice, Chariot) laid beside a selenite crystal-computer"

### Visual Language Scope
- **Full visual kit:**
  - Hero image (16:9)
  - OG/link preview image (1200x630)
  - LinkedIn (1200x627)
  - Twitter/X (1200x675)
  - Instagram square (1080x1080)
  - Instagram stories (1080x1920)
  - Favicon (tarot card motif, recognizable at small sizes)
- **Documentation:** Full brand guide (colors, imagery rules, typography with specific font recommendations)
- **Storage:** brand/ folder (winners in repo, full archive locally)

### Brand Consistency
- Visuals separate but consistent with positioning (no tagline text in images)
- Lead with mystical — practitioners feel at home, developers drawn by curiosity
- Subtle blend of traditional tarot elements abstracted into eco-futurist aesthetic
- Direct match to "cosmic priestess energy" from voice guidelines — women, ritual, mysticism
- Color palette extracted from existing Nano Banana reference images

### Claude's Discretion
- Exact prompt tuning for best results
- Specific font selections within the established aesthetic
- Favicon design details (card shape, symbolism)
- How to handle terminal text legibility vs aesthetic

</decisions>

<specifics>
## Specific Ideas

**Reference image:** `/Users/jem/Downloads/weavy-Gemini 2.5 Flash (Nano Banana)-generations-2025-12-17 at 14.01.12/weavy-Gemini 2.5 Flash (Nano Banana)-0011.png` — women in flowing robes gathered around crystalline computer-terminals in Joshua Tree desert, golden hour

**Aesthetic keywords:**
- "Eco-futurist utopian divine feminine society"
- "1980s-meets-2180s"
- "Pastoral cybernetic merging of femininity & technology"
- "Soft, peaceful, gentle"

**Visual elements:**
- Selenite crystal devices with embedded screens
- Flowing white/black/iridescent gauzy cotton dresses
- Opal, labradorite, moonstone, amethyst jewelry
- Silver, black, or iridescent fingernails
- Joshua Trees, possibly CalEarth superadobe domes

</specifics>

<deferred>
## Deferred Ideas

- Full custom tarot deck with stylized RWS imagery — future expansion, significant scope

</deferred>

---

*Phase: 12-visual-language*
*Context gathered: 2026-01-24*
