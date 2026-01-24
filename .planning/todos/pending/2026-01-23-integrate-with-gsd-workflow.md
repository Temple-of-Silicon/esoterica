---
created: 2026-01-23T15:35
title: Integrate tarot with GSD workflow while keeping independence
area: feature
files:
  - skills/tarot/SKILL.md
---

## Problem

The tarot skill currently works standalone via `/tarot`. Question: can it integrate with GSD's workflow (e.g., draw cards during planning, retrospectives, milestone starts) while still being usable independently without GSD installed?

Considerations:
- GSD hooks/triggers for automatic invocation
- Conditional behavior if GSD present vs not
- Keep `/tarot` working standalone for non-GSD users

## Solution

TBD - Research GSD extension points and design optional integration layer.
