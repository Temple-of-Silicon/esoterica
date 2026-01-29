---
created: 2026-01-29T10:11
title: Debug Chrome scroll animation lag
area: ui
files:
  - site/src/scripts/scroll-scrubber.js
  - site/src/pages/index.astro
  - site/src/styles/global.css
---

## Problem

The hero scroll animation (video currentTime driven by scroll position) is laggy in Chrome but works perfectly in Safari (both macOS and iOS). This is a browser-specific performance issue affecting Phase 19/20's scroll-scrubbed video hero.

Chrome-specific suspects:
- requestAnimationFrame throttling differences
- Video decode performance (h264 handling)
- Scroll event handling or passive listener behavior
- Compositor thread differences between browsers

## Solution

TBD - needs research into:
1. Chrome DevTools Performance profiling of scroll handler
2. Check if `will-change` or `transform: translateZ(0)` GPU hints help
3. Investigate if Chrome's video decode is blocking main thread
4. Compare rAF timing between browsers
5. Check if scroll-timeline CSS API is better supported in Chrome now
