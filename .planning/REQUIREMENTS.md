# Requirements: Esoterica

**Defined:** 2026-01-22
**Core Value:** Agents can draw and interpret tarot cards as a perspective-shifting tool for problem-solving, planning, and self-mythologizing.

## v1.1 Requirements

Requirements for Wizard UI milestone. Each maps to roadmap phases.

### Wizard UI

- [ ] **WIZ-01**: `/tarot` invokes AskUserQuestion wizard instead of accepting inline args
- [ ] **WIZ-02**: Tab 1 collects user's question/context
- [ ] **WIZ-03**: Tab 2 presents spread selection options
- [ ] **WIZ-04**: Tab 3 presents digital vs physical mode selection

### Spreads

- [ ] **SPREAD-01**: Single card spread option (current behavior)
- [ ] **SPREAD-02**: Problem/Solution/Synthesis 3-card spread
- [ ] **SPREAD-03**: "Suggest a spread" option — LLM generates contextual positions based on question
- [ ] **SPREAD-04**: Custom spread option — user types their own position names

### Reading Modes

- [ ] **MODE-01**: Digital mode performs random card selection (current behavior)
- [ ] **MODE-02**: Physical mode prompts user to enter cards they drew
- [ ] **MODE-03**: Physical mode accepts card names/numbers from real deck

### Interpretation

- [ ] **INTERP-01**: Single card interpretation works as before
- [ ] **INTERP-02**: Multi-card interpretation connects cards across positions
- [ ] **INTERP-03**: Position names inform interpretation (e.g., "Problem" vs "Solution")

## Future Requirements

Tracked for future milestones. Not in current roadmap.

### Extended Deck

- **DECK-01**: Minor Arcana (56 additional cards)
- **DECK-02**: Reversed card meanings
- **DECK-03**: Card-to-card relationship interpretations

### Other Esoteric Tools

- **ESOT-01**: Runes system
- **ESOT-02**: Numerology system
- **ESOT-03**: Astrology system

### Monetization

- **PAY-01**: x402 micropayments integration for paid readings
- **PAY-02**: Agent-to-agent payment flow (other agents pay for readings)

### Preset Spreads Library

- **PRESET-01**: Technical Debt Assessment spread
- **PRESET-02**: Feature Direction spread
- **PRESET-03**: Bug Investigation spread
- **PRESET-04**: Architecture Decision spread
- **PRESET-05**: Sprint Planning spread
- **PRESET-06**: Refactor or Rewrite spread
- **PRESET-07**: API Design spread
- **PRESET-08**: Code Review spread
- **PRESET-09**: Performance Optimization spread
- **PRESET-10**: Launch Readiness spread

## Out of Scope

Explicitly excluded for v1.1. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Voice selection in wizard | Keep config-based (current behavior works well) |
| Preset spread library | Start with LLM-suggested; presets are v1.2 |
| Minor Arcana | Keep 22 Major Arcana for v1.1; deck expansion is v2 |
| MCP server | Skill + subagent pattern validated in v1.0 |

## Traceability

Which phases cover which requirements.

| Requirement | Phase | Status |
|-------------|-------|--------|
| WIZ-01 | Phase 6 | Pending |
| WIZ-02 | Phase 6 | Pending |
| WIZ-03 | Phase 6 | Pending |
| WIZ-04 | Phase 6 | Pending |
| SPREAD-01 | Phase 7 | Pending |
| SPREAD-02 | Phase 7 | Pending |
| SPREAD-03 | Phase 7 | Pending |
| SPREAD-04 | Phase 7 | Pending |
| MODE-01 | Phase 8 | Pending |
| MODE-02 | Phase 8 | Pending |
| MODE-03 | Phase 8 | Pending |
| INTERP-01 | Phase 9 | Pending |
| INTERP-02 | Phase 9 | Pending |
| INTERP-03 | Phase 9 | Pending |

**Coverage:**
- v1.1 requirements: 14 total
- Mapped to phases: 14
- Unmapped: 0

---
*Requirements defined: 2026-01-22*
*Last updated: 2026-01-22 after v1.1 roadmap creation*
