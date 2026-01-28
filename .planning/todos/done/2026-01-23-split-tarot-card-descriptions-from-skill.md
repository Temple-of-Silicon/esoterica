---
created: 2026-01-23T15:32
title: Split tarot card descriptions from main skill
area: feature
files:
  - skills/tarot/SKILL.md
---

## Problem

All 22 Major Arcana card descriptions are embedded in SKILL.md (currently 842 lines). This makes the skill file large and harder to maintain. Card data could be separated for better organization.

## Solution

TBD - Options include:
- Separate CARDS.md file referenced by skill
- JSON/YAML data file for card definitions
- Keep embedded but consider if worth the refactor
