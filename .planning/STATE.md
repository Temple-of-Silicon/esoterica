# State: Esoterica

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-23)

**Core value:** Agents can draw and interpret tarot cards as a perspective-shifting tool
**Current focus:** v1.2 complete — ready for launch or v1.3

## Current Position

Milestone: v1.2 Brand & Marketing — SHIPPED
Phase: All 15 phases complete
Plan: All 23 plans complete
Status: Ready for launch or next milestone
Last activity: 2026-01-26 - v1.2 archived

Progress: [████████████████████] 100% — v1.0, v1.1, v1.2 shipped

## Performance Metrics

**Velocity:**
- Total plans completed: 22 (5 v1.0 + 5 v1.1 + 12 v1.2)
- Average duration (v1.1): 2.4 min
- Average duration (v1.2): 7.6 min
- Total execution time (v1.2): ~84 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| v1.0 Phases 1-5 | 5 | - | - |
| Phase 6 (Wizard Infrastructure) | 1 | 3 min | 3 min |
| Phase 7 (Spread Options) | 2 | 4 min | 2 min |
| Phase 8 (Reading Modes) | 1 | 3 min | 3 min |
| Phase 9 (Multi-Card Interpretation) | 1 | 2 min | 2 min |
| Phase 10 (Positioning) | 2 | ~13 min | ~6.5 min |
| Phase 11 (Documentation) | 1 | 1.4 min | 1.4 min |
| Phase 12 (Visual Language) | 4 | 21.5 min | 5.4 min |
| Phase 13 (Landing Page) | 2 | ~46 min | ~23 min |
| Phase 14 (Launch Materials) | 3 | ~39 min | ~13 min |

## Accumulated Context

### Decisions

All decisions logged in PROJECT.md Key Decisions table.

**Recent (Phase 14 Plan 02):**
- Remotion for programmatic video rendering instead of screen recording
- 60-second demo with hook in first 15 seconds (card draw animation)
- 5-sequence structure: title flash, card draw, interpretation, terminal, end card
- Geist Mono fallback to Menlo/Monaco for terminal font

**Phase 14 Plan 01:**
- Keep announcement post concise at 800 chars instead of LinkedIn max 1,300-1,600 to maintain mystical impact
- Use descriptive OG image alt text mentioning key visual elements for accessibility

**Phase 13 Plan 02:**
- Full-bleed hero image with overlay (not featured image or no-image approach)
- New Spirit Medium (500 weight) for headings via self-hosted woff2
- Geist Mono from Google Fonts for body text
- Whole Earth Catalog aesthetic: warm, minimal, typography-forward
- Witchy mystical tone in prose (20% more than initial draft)
- Dual install CTAs (hero + end of prose)

**Phase 13 Plan 01:**
- Use full hero-primary.png (7.1M) for quality over web performance - GitHub Pages has no bandwidth limits
- GitHub Pages serves from /docs folder on main branch

**Phase 12:**
- Extracted 6 brand colors (Primary, Secondary, Accent, Warm Neutral, Cool Neutral, Dark Base) from hero image
- Typography pairing: Cormorant Garamond (headlines) + Source Sans 3 (body) + JetBrains Mono (code)
- Film aesthetic codified: soft grain, natural lighting, analog warmth, no sharp focus
- Diversity representation explicitly documented: skin tone spectrum, background figures
- Asset generation scripts placed in skills/generate-image/ to leverage existing Sharp dependency
- Sharp's 'attention' positioning for smart cropping social variants
- Minimalist tarot card with star motif for favicon recognition at small sizes
- Instagram story 9:16 aspect ratio crops significantly from 16:9 hero - smart cropping handles automatically
- Background-figures composition chosen for hero image over hands-only or no-people alternatives
- Explicit diversity language required for AI generation: "diverse women" produces homogeneous output
- "Skin tone spectrum" phrasing most effective for global majority representation
- Generation scripts cleaned from repo after completion
- No wizard flow for generate-image - inline parameters for batch generation (differs from tarot skill)
- Immediate image download to avoid 1-hour URL expiration
- 150ms delay between generations for rate limit compliance
- Prompt template locked to eco-futurist aesthetic

**Phase 11:**
- README structure: Opening + What Is This + Quick Start + Usage + Why Tarot + Deck + Philosophy

**Phase 10:**
- Tagline: "Ancient patterns, new paths" - balances High Priestess (ancient wisdom) with Chariot (forward momentum)
- Name: Keep "Esoterica" - none of the alternatives clearly beat the current name
- Direction: Ancestral wisdom theme - timeless, archetypal resonance
- Positioning: Perspective-shifting framework using tarot archetypes for complex decisions
- Dual-audience: True equality - neither developers nor practitioners are primary
- Voice: Cosmic priestess energy - knowledgeable, mysterious, playful, confident

### Phase 14 Deliverables

**Plan 14-01:** LinkedIn launch materials and OG meta tags:
- `brand/launch/linkedin-posts.md` - Teaser (402 chars) and announcement (800 chars) posts in cosmic priestess voice
- `docs/index.html` - Complete OG meta tags (og:image:width, og:image:height, og:image:type, og:image:alt, og:site_name, twitter:image:alt)

**Plan 14-02:** Remotion demo video project:
- `demo/package.json` - Remotion dependencies and build scripts
- `demo/remotion.config.ts` - Video output configuration
- `demo/tsconfig.json` - TypeScript configuration for React JSX
- `demo/src/Root.tsx` - Remotion composition registry (60s at 30fps, 1920x1080)
- `demo/src/Demo.tsx` - Main demo composition with 5 sequences
- `demo/src/WizardFlow.tsx` - Scene components (install, cards, interpretation, endcard)
- `demo/src/styles.ts` - Brand colors and fonts from COLOR_PALETTE.md
- `demo/.gitignore` - Ignore node_modules and out directories

**Plan 14-03:** LinkedIn carousel and launch verification:
- `brand/launch/carousel/slide-01.png` through `slide-06.png` - 1080x1350px carousel slides
- `brand/launch/carousel/generate-slides.sh` - Reproducible slide generation script
- `demo/out/demo.mp4` - Rendered 60-second demo video (3.4MB)
- `demo/out/demo.gif` - Scaled demo GIF (1.04MB)
- Human verification checkpoint passed

### Phase 13 Deliverables

**Plan 13-01:** GitHub Pages directory structure:
- `docs/` - GitHub Pages deployment directory
- `docs/hero-primary.png` - 7.1M hero image from Phase 12
- `docs/og-image.png` - 450K Open Graph social sharing image
- `docs/favicon.svg` - SVG favicon with tarot card star motif
- `docs/favicon-32x32.png`, `docs/favicon-16x16.png` - PNG favicon variants
- `docs/apple-touch-icon.png` - iOS home screen icon

**Plan 13-02:** Complete landing page:
- `docs/index.html` - Full landing page with:
  - Full-bleed hero with dark overlay (theme-aware)
  - New Spirit Medium headings (self-hosted woff2)
  - Geist Mono body text (Google Fonts)
  - ~400 words mystical prose section
  - Dual install CTAs with copy-to-clipboard
  - Light/dark theme toggle with localStorage persistence
- `docs/fonts/NewSpirit-Medium.woff` - Self-hosted webfont
- `docs/fonts/NewSpirit-Medium.woff2` - Self-hosted webfont
- `brand/DESIGN_PROMPT.md` - Reusable design system prompt for AI assistants

### Phase 12 Deliverables

**Plan 12-01:** Generate-image skill for agentic image generation:
- `skills/generate-image/SKILL.md` - Skill documentation with eco-futurist aesthetic guide
- `skills/generate-image/src/replicate-client.ts` - Replicate API client with async polling
- `skills/generate-image/src/prompt-builder.ts` - Eco-futurist prompt templates
- `skills/generate-image/src/index.ts` - Main generateImages function with rate limiting
- HERO_PROMPT_CONFIG with Joshua Tree altar scene and tagline cards

**Plan 12-02:** Hero image with diversity representation:
- `brand/hero/winners/hero-primary.png` - Selected hero image (background-figures skin-tone-spectrum composition)
- Archive of 29 variations preserved locally at ~/Pictures/esoterica-hero-archive/
- Prompt learnings on AI diversity representation (explicit language required)

**Plan 12-03:** Social media & favicon assets from hero image:
- `brand/social/` - 5 social media variants (OG, LinkedIn, Twitter, Instagram square/story)
- `brand/favicon/` - Favicon set (SVG source + 3 PNG sizes)
- `skills/generate-image/generate-social-assets.ts` - Social variant generator with smart cropping
- `skills/generate-image/generate-favicons.ts` - Favicon PNG generator from SVG

**Plan 12-04:** Visual language documentation:
- `brand/COLOR_PALETTE.md` - 6 brand colors extracted from hero with hex/RGB values and usage guidelines
- `brand/BRAND_GUIDE.md` - Comprehensive visual language documentation with typography, imagery rules, asset specs
- `brand/scripts/extract-palette.ts` - TypeScript extraction script template
- `skills/generate-image/extract-palette.mjs` - Working extraction script using get-image-colors

### Phase 11 Deliverables

- `README.md` - 160 lines with Esoterica voice, installation, usage examples

### Phase 10 Deliverables

Complete positioning suite ready for downstream phases:
- `brand/positioning-statement.md` - Four-part framework with tagline and card themes
- `brand/audience-framing.md` - Dual-audience messaging paths with sample content
- `brand/voice-guidelines.md` - Tone spectrum, language rules, 10 example transformations

### Pending Todos

- [ ] Let users save readings to file
- [ ] Debug ugly argument parsing in Skill
- [ ] Split tarot card descriptions from main skill
- [ ] Explore subagent benefits for tarot skill
- [ ] Integrate tarot with GSD workflow while keeping independence
- [ ] Remove .claude-plugin directory (not configured properly)
- [x] Add npx installation support (like get-shit-done) — published as @templeofsilicon/esoterica
- [ ] Add contribution policy - coven members only (no random PRs)

### Blockers/Concerns

None.

### Roadmap Evolution

- Phase 15 added: Set up user installation (npx/npm support)

## Session Continuity

Last session: 2026-01-26
Stopped at: Phase 15 added, needs planning
Resume file: None

## Next Steps

**v1.2 Brand & Marketing — SHIPPED** (6 phases, 13 plans)

### Launch Checklist

- [ ] Enable GitHub Pages (Settings → Pages → main → /docs)
- [ ] Test OG tags at https://metatags.io/
- [ ] Post LinkedIn teaser (brand/launch/linkedin-posts.md)
- [ ] Wait 1-3 days
- [ ] Post LinkedIn announcement with carousel + demo video
- [ ] Share landing page URL: jem-computer.github.io/esoterica

### Assets Ready

| Asset | Location |
|-------|----------|
| npm package | `npx @templeofsilicon/esoterica` |
| LinkedIn posts | `brand/launch/linkedin-posts.md` |
| Carousel slides | `brand/launch/carousel/` (6 slides) |
| Demo video | `demo/out/demo.mp4` |
| Demo GIF | `demo/out/demo.gif` |
| Landing page | `docs/index.html` |
| OG image | `docs/og-image.png` |

### Future Work

See PROJECT.md Pending Todos for v1.3+ ideas.

### Phase 15 Deliverables

**Plan 15-01:** npm package and installer:
- `package.json` - npm package config with scoped name @templeofsilicon/esoterica
- `bin/install.js` - Zero-dependency installer script (copies to ~/.claude/skills/tarot/)
- `LICENSE` - MIT license file
- Updated all marketing assets with new install command (README, landing page, LinkedIn, carousel, demo video)

---
*Last updated: 2026-01-26 — v1.2 milestone archived*
