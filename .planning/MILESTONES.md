# Project Milestones: Esoterica

## v1.4 Website Upgrade (Shipped: 2026-01-29)

**Delivered:** Immersive scroll-driven video hero, Gateway Process-style illustrations, and semantic footer with Lighthouse score of 94.

**Phases completed:** 19-22 (8 plans total)

**Key accomplishments:**

- Apple-style scroll-driven video hero (video.currentTime mapped to scroll position)
- Video compressed from 25MB to 2.6MB with keyframe optimization for smooth Chrome seeking
- Reduced-motion accessibility (static poster, no video download, collapsed hero)
- Three Gateway Process-style line art illustrations with scroll reveal
- Custom stamp-filter.mjs replicating Photoshop Stamp filter
- Semantic footer with copyright and GitHub links
- Lighthouse performance score 94 (exceeds 90+ target)

**Stats:**

- 53 files created/modified
- 4,289 lines added
- 4 phases, 8 plans, 6 requirements
- 2 days from start to ship (2026-01-28 → 2026-01-29)

**Git range:** `docs(19): research` → `docs(22): complete`

**What's next:** Next milestone TBD — skill features (save readings, reversed meanings) or new esoteric tools

---

## v1.3 Minor Arcana (Shipped: 2026-01-26)

**Delivered:** Complete 78-card tarot deck with 56 Minor Arcana cards at full interpretive depth, deck selection in wizard, and fuzzy matching for physical mode.

**Phases completed:** 16-18 (8 plans total)

**Key accomplishments:**

- Lazy loading architecture: Card data separated into 5 files (major-arcana + 4 suits)
- 56 Minor Arcana cards with full depth (Themes/Situations/Shadows/Symbols)
- Deck selection wizard step: Major Arcana only (22 cards) vs Full deck (78 cards)
- 78-card index with suit-based numbering (Wands 22-35, Cups 36-49, Swords 50-63, Pentacles 64-77)
- Fuzzy matching for all 78 cards: "3 cups", "three of cups", "III cups", "Q wands"
- Backwards compatible: Major Arcana only remains default

**Stats:**

- 6 files created/modified
- 1,579 lines of tarot content (860 SKILL.md + 719 card files)
- 3 phases, 8 plans, 14 requirements
- Same day execution (2026-01-26)

**Git range:** `feat(16-01)` → `docs(v1.3)`

**What's next:** v1.4 features (save readings, reversed meanings) or new esoteric tools

---

## v1.2 Brand & Marketing (Shipped: 2026-01-26)

**Delivered:** Public presence with positioning, landing page, marketing assets, and npm package for easy installation.

**Phases completed:** 10-15 (13 plans total)

**Key accomplishments:**

- Tagline "Ancient patterns, new paths" and cosmic priestess voice guidelines
- README with mystical-but-grounded documentation tone
- Hero image (Joshua Tree eco-futurist aesthetic) and full brand guide
- Landing page at docs/index.html with New Spirit + Geist Mono typography
- LinkedIn posts, 6-slide carousel, 60-second demo video
- npm package published as @templeofsilicon/esoterica

**Stats:**

- 97 files created/modified
- 11,440 lines added
- 6 phases, 13 plans, 16 requirements
- 4 days from start to ship (2026-01-23 → 2026-01-26)

**Git range:** `feat(10-01)` → `feat(15-01)`

**What's next:** Launch (enable GitHub Pages, post to LinkedIn), then v1.3 features or new esoteric tools

---

## v1.1 Wizard UI (Shipped: 2026-01-23)

**Delivered:** Interactive wizard flow with spread selection, physical card entry mode, and position-aware multi-card interpretation.

**Phases completed:** 6-9 (5 plans total)

**Key accomplishments:**

- Interactive wizard (AskUserQuestion) replaces inline argument parsing
- Four spread types: Single card, Situation/Action/Outcome, LLM-suggested, Custom (1-5 positions)
- Physical mode with ritual opening, fuzzy card matching, duplicate prevention
- Multi-card interpretation with woven narratives connecting cards across positions
- Position-aware interpretation engine with card relationship patterns (tension/harmony)
- Voice-consistent examples for both Mystic and Grounded interpretive styles

**Stats:**

- 1 file modified (SKILL.md)
- 842 lines in SKILL.md (up from 345 in v1.0)
- 4 phases, 5 plans, 14 requirements
- ~5 hours from start to ship (2026-01-22)

**Git range:** `0539c98` → `122a18c`

**What's next:** Brand positioning, README, landing page, or v1.2 features (preset spreads, deck expansion)

---

## v1.0 Tarot Skill (Shipped: 2026-01-22)

**Delivered:** A working `/tarot` skill for Claude Code agents to draw and interpret Major Arcana cards as a perspective-shifting tool for problem-solving, planning, and self-mythologizing.

**Phases completed:** 1-5 (5 plans total)

**Key accomplishments:**

- Working `/tarot` skill with context fork and random card selection
- Complete 22 Major Arcana with rich archetypal meanings (Themes/Situations/Shadows/Symbols)
- Two interpretive voices: Mystic (cosmic priestess) and Grounded (pragmatic advisor)
- Persistent voice preference via config files (flag > project > global > default)
- Claude self-invocation enabled with adaptive output formatting
- Context echoing and specific reflective closing questions

**Stats:**

- 34 files created/modified
- 345 lines in SKILL.md (7,127 total insertions)
- 5 phases, 5 plans
- ~20 hours from start to ship (2026-01-21 → 2026-01-22)

**Git range:** `dd9a7fd` → `b443617`

**What's next:** v2 features (Minor Arcana, spreads, monetization) or new esoteric tools

---
