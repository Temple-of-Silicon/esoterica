# Requirements: Esoterica v1.5 Demo Widget

**Defined:** 2026-01-30
**Core Value:** Show esoterica in action through a scroll-triggered terminal demo

## v1.5 Requirements

Requirements for the demo widget milestone. Core features only.

### Terminal Foundation

- [ ] **TERM-01**: Terminal visual frame with dark background and monospace font
- [ ] **TERM-02**: Blinking cursor that shows typing activity
- [ ] **TERM-03**: Sticky terminal container that stays in view during scroll

### Scroll Phases

- [ ] **SCRL-01**: Four scroll-triggered phases (ask -> pull -> interpret -> integrate)
- [ ] **SCRL-02**: IntersectionObserver detects phase transitions
- [ ] **SCRL-03**: Phase persistence — scrolling up shows completed state, not re-animation

### Typewriter Animation

- [ ] **TYPE-01**: Character-by-character text reveal with setTimeout
- [ ] **TYPE-02**: Uniform typing speed (30-50ms per character)
- [ ] **TYPE-03**: Timer cleanup on phase change (no memory leaks)

### Accessibility

- [ ] **A11Y-01**: `prefers-reduced-motion` check shows all content instantly
- [ ] **A11Y-02**: Full text in DOM from start (screen reader accessible)

### Content

- [ ] **CONT-01**: Phase 1 content — User asks a question
- [ ] **CONT-02**: Phase 2 content — Cards are pulled
- [ ] **CONT-03**: Phase 3 content — Interpretation delivered
- [ ] **CONT-04**: Phase 4 content — Agent integrates learnings

## Future Requirements

Deferred features from research — not in this milestone.

### Polish
- **PLSH-01**: Variable typing speed (pauses at punctuation)
- **PLSH-02**: Phase-specific timing (faster questions, slower interpretations)
- **PLSH-03**: Claude Code visual authenticity (status bar, exact colors)
- **PLSH-04**: Semantic content blocks (distinct user vs agent styling)

### Enhancements
- **ENHN-01**: Skip-to-end button
- **ENHN-02**: Scroll progress indicator
- **ENHN-03**: Special card reveal moment

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Interactive input | Creates confusion — this is a recording, not a shell |
| Sound effects | Accessibility nightmare, startles users |
| CRT/retro effects | Distracts from content, performance cost |
| Auto-advancing phases | Removes user agency |
| Replay button | Scroll up = natural replay mechanism |
| Mobile-specific simplification | Scale down gracefully, same content |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| TERM-01 | Phase 23 | Pending |
| TERM-02 | Phase 23 | Pending |
| TERM-03 | Phase 23 | Pending |
| A11Y-02 | Phase 23 | Pending |
| SCRL-01 | Phase 24 | Pending |
| SCRL-02 | Phase 24 | Pending |
| SCRL-03 | Phase 24 | Pending |
| TYPE-01 | Phase 24 | Pending |
| TYPE-02 | Phase 24 | Pending |
| TYPE-03 | Phase 24 | Pending |
| CONT-01 | Phase 25 | Pending |
| CONT-02 | Phase 25 | Pending |
| CONT-03 | Phase 25 | Pending |
| CONT-04 | Phase 25 | Pending |
| A11Y-01 | Phase 25 | Pending |

**Coverage:**
- v1.5 requirements: 15 total
- Mapped to phases: 15
- Unmapped: 0

---
*Requirements defined: 2026-01-30*
*Last updated: 2026-01-30 -- Traceability completed*
