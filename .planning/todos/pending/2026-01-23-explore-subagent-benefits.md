---
created: 2026-01-23T15:33
title: Explore subagent benefits for tarot skill
area: feature
files:
  - skills/tarot/SKILL.md
---

## Problem

Currently the tarot skill runs in main context. Question: would running as a subagent provide benefits? Considerations:
- Context isolation (doesn't pollute main conversation)
- Potential for parallel/background readings
- Trade-offs with AskUserQuestion (may not work in subagent)

## Solution

TBD - Research subagent pattern in Claude Code and evaluate trade-offs.
