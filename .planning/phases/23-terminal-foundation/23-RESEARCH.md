# Phase 23: Terminal Foundation - Research

**Researched:** 2026-01-30
**Domain:** CSS Terminal UI / Sticky Scroll / Accessibility
**Confidence:** HIGH

## Summary

This phase implements a static terminal container with CRT-style visual effects, sticky scroll behavior, and full accessibility compliance. The terminal displays all demo text in the DOM from page load (for screen readers) while providing visual flair through CSS effects like text glow and scanlines.

The project already uses Astro with vanilla JS and CSS. The existing `global.css` provides CSS variables and theming infrastructure. The hero section demonstrates a similar sticky-scroll pattern that can be adapted. Geist Mono is already loaded via Google Fonts - this is an excellent choice for terminal text.

**Primary recommendation:** Use CSS-only effects (text-shadow for glow, repeating-linear-gradient for scanlines, CSS animation for cursor pulse) with no JavaScript. All visual effects respect `prefers-reduced-motion`. Text is in DOM from start with CSS `visibility` toggling for typewriter reveal in later phases.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vanilla CSS | N/A | All styling and effects | No build complexity, matches project |
| CSS Custom Properties | N/A | Theming, color tokens | Already in use, enables dark/light modes |
| Geist Mono | 1.6+ | Terminal font | Already loaded, designed for terminals |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| CSS `@container scroll-state()` | N/A | Detect sticky state | Optional: style differently when stuck |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS scanlines | WebGL CRTFilter | Overkill for subtle effect, performance cost |
| CSS text-shadow glow | SVG filters | More complex, less performant |
| CSS animation for cursor | JS setInterval | Unnecessary complexity |

**Installation:**
```bash
# No additional dependencies - pure CSS
```

## Architecture Patterns

### Recommended Project Structure
```
site/src/
├── styles/
│   └── global.css           # Add terminal CSS variables
├── components/
│   └── Terminal.astro       # New: terminal container component
└── pages/
    └── index.astro          # Insert Terminal after hero, before prose
```

### Pattern 1: Semantic Terminal Markup
**What:** Use semantic HTML with ARIA roles for accessibility
**When to use:** Always for terminal-style output
**Example:**
```html
<!-- Source: WCAG 2.1 / ARIA best practices -->
<section class="terminal" aria-label="Esoterica demo">
  <div class="terminal-chrome">
    <span class="terminal-btn" aria-hidden="true">&#x2726;</span>
    <span class="terminal-btn" aria-hidden="true">&#x2605;</span>
    <span class="terminal-btn" aria-hidden="true">&#x273B;</span>
  </div>
  <div class="terminal-screen" role="log" aria-live="polite" aria-atomic="false">
    <pre class="terminal-content">
      <!-- All text in DOM from start -->
      <span class="terminal-line" data-phase="1">
        <span class="terminal-prompt">$</span>
        <span class="terminal-text">esoterica</span>
      </span>
    </pre>
    <span class="terminal-cursor" aria-hidden="true"></span>
  </div>
  <nav class="terminal-indicators" aria-label="Demo progress">
    <span class="indicator active" aria-current="step">Phase 1</span>
    <span class="indicator">Phase 2</span>
    <span class="indicator">Phase 3</span>
    <span class="indicator">Phase 4</span>
  </nav>
</section>
```

### Pattern 2: Sticky Terminal Container
**What:** Terminal sticks to viewport during scroll through dedicated scroll height
**When to use:** For scroll-driven demos
**Example:**
```css
/* Source: MDN position: sticky / existing hero pattern */
.terminal-container {
  position: relative;
  height: 400vh; /* Scroll height for 4 phases */
}

.terminal {
  position: sticky;
  top: 2rem; /* Upper portion of viewport */
  max-width: 42rem;
  margin: 0 auto;
}
```

### Pattern 3: CRT Visual Effects
**What:** Text glow + scanlines for retro aesthetic
**When to use:** When user explicitly requests CRT effects
**Example:**
```css
/* Source: CSS-Tricks old-timey terminal styling */
.terminal-screen {
  background: #0a0a0a;
  color: var(--terminal-green);
  text-shadow:
    0 0 2px var(--terminal-green),
    0 0 8px var(--terminal-glow);
}

/* Scanline overlay */
.terminal-screen::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0.1) 1px,
    transparent 1px,
    transparent 2px
  );
  opacity: 0.3; /* Subtle, not overwhelming */
}
```

### Anti-Patterns to Avoid
- **JavaScript-based effects:** CSS handles glow/scanlines better, no timer management
- **Animating scanlines:** Static scanlines are sufficient, animation causes motion sickness
- **Full-width terminal:** Breaks the "actual terminal window" feel
- **Hidden text for animation:** Screen readers can't access; use CSS visibility instead

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Cursor blink | JS setInterval | CSS animation | Simpler, auto-handles reduced motion |
| Sticky detection | IntersectionObserver | CSS scroll-state() | Native, no JS needed (with fallback) |
| Glow effect | Canvas/WebGL | CSS text-shadow | Browser-optimized, GPU-accelerated |
| Scanlines | JS canvas | CSS linear-gradient | Declarative, respects reduced motion |

**Key insight:** The entire visual layer (glow, scanlines, cursor) should be CSS-only. JavaScript is only needed for scroll-triggered content changes (Phase 24).

## Common Pitfalls

### Pitfall 1: Inaccessible Animated Text
**What goes wrong:** Typewriter effect hides text from screen readers
**Why it happens:** Using JS to inject text character-by-character
**How to avoid:** All text in DOM from start. Use CSS to control visibility. Later phases reveal via `visibility: visible` / `opacity: 1`
**Warning signs:** Content not in View Source, aria-live not announcing

### Pitfall 2: Sticky Element Won't Stick
**What goes wrong:** `position: sticky` appears to have no effect
**Why it happens:** Parent has `overflow: hidden/auto`, or no scroll container height
**How to avoid:**
- Ensure parent has explicit height (e.g., `400vh` for 4 phases)
- Remove any `overflow: hidden` from ancestors
- Set `top` value for stick point
**Warning signs:** Element scrolls normally instead of sticking

### Pitfall 3: Motion Sensitivity Issues
**What goes wrong:** Blinking cursor triggers vestibular disorders
**Why it happens:** Rapid on/off blink animation, especially with glow
**How to avoid:**
- Use slow pulse (2s+ duration) instead of harsh blink
- Use opacity fade instead of visibility toggle
- Respect `prefers-reduced-motion: reduce` - disable all animation
**Warning signs:** Animation faster than 1s, harsh transitions

### Pitfall 4: Scanline Performance
**What goes wrong:** Janky scroll, high GPU usage
**Why it happens:** Complex CSS filters, animated scanlines, large gradient
**How to avoid:**
- Use `pointer-events: none` on overlay
- Keep gradient simple (2px repeat)
- Low opacity (0.2-0.3)
- No animation on scanlines
**Warning signs:** Paint flashing in DevTools, scroll jank

### Pitfall 5: Wrong Green Color
**What goes wrong:** Terminal green clashes with hero image
**Why it happens:** Using generic "terminal green" instead of matching hero
**How to avoid:** Extract exact green from hero video/poster. Classic P1 phosphor green is approximately `#33ff66` but the hero appears more muted around `#00c850` to `#40ff40` range
**Warning signs:** Visual disconnect between hero and terminal

## Code Examples

Verified patterns from official sources:

### Terminal Color Variables
```css
/* Source: Hero image analysis + CRT phosphor research */
:root {
  /* Primary terminal green - match hero image */
  --terminal-green: #33ff66;
  --terminal-green-dim: #22aa44;   /* Prompt prefix */
  --terminal-glow: rgba(51, 255, 102, 0.4);
  --terminal-bg: #0a0a0a;
  --terminal-chrome: #1a1a1a;
}
```

### Blinking Cursor (Slow Pulse)
```css
/* Source: CSS-Tricks / DEV Community cursor tutorials */
.terminal-cursor {
  display: inline-block;
  width: 0.6em;
  height: 1.2em;
  background: var(--terminal-green);
  vertical-align: text-bottom;
  animation: cursor-pulse 2s ease-in-out infinite;
}

@keyframes cursor-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .terminal-cursor {
    animation: none;
    opacity: 1;
  }
}
```

### Witchy Decorative Buttons (Unicode)
```css
/* Source: Unicode Miscellaneous Symbols research */
.terminal-btn {
  color: var(--terminal-green-dim);
  opacity: 0.6;
  font-size: 0.75rem;
}

/* Unicode characters for witchy accents:
   ✦ U+2726 (four-pointed star)
   ★ U+2605 (black star)
   ✻ U+273B (teardrop-spoked asterisk)
   ☆ U+2606 (white star)
   ⁂ U+2042 (asterism)
   ✧ U+2727 (white four-pointed star)
   ᚦ U+16A6 (runic letter thurisaz)
   ᛟ U+16DF (runic letter othalan)
*/
```

### Accessible Pre-loaded Content
```html
<!-- Source: WCAG ARIA19 / Sara Soueidan live regions -->
<div class="terminal-screen" role="log" aria-live="polite">
  <div class="terminal-line" data-phase="1">
    <span class="terminal-prompt" aria-hidden="true">$</span>
    <span class="terminal-text">esoterica</span>
  </div>
  <div class="terminal-line" data-phase="2" hidden>
    <!-- Hidden but in DOM for screen readers with aria-hidden="false" -->
  </div>
</div>
```

### Reduced Motion Styles
```css
/* Source: MDN prefers-reduced-motion / W3C WCAG C39 */
@media (prefers-reduced-motion: reduce) {
  .terminal-cursor {
    animation: none;
  }

  .terminal-screen::after {
    /* Keep static scanlines - they don't animate */
    opacity: 0.15; /* Reduce intensity */
  }

  /* If using any transition effects */
  .terminal * {
    transition-duration: 0.001ms !important;
  }
}
```

### Phase Indicators
```css
/* Source: Common UI pattern */
.terminal-indicators {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  padding: 1rem;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--terminal-green-dim);
  opacity: 0.3;
}

.indicator.active {
  opacity: 1;
  box-shadow: 0 0 4px var(--terminal-glow);
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| JS cursor blink | CSS animation | 2020+ | Simpler, automatic reduced-motion |
| IntersectionObserver for sticky | CSS scroll-state() | 2025+ | Native CSS, no JS needed |
| Canvas scanlines | CSS gradient | Always CSS | Better performance |
| JS text injection | DOM + CSS visibility | Always | Accessibility compliant |

**Deprecated/outdated:**
- WebGL CRT filters for simple effects: Overkill, use CSS
- `step-end` cursor blink: Harsh, prefer smooth pulse

## Open Questions

Things that couldn't be fully resolved:

1. **Exact hero green color**
   - What we know: Classic P1 phosphor is around #33ff66
   - What's unclear: Exact hex from hero video varies by frame
   - Recommendation: Use #33ff66 as base, may need tuning after visual testing

2. **CSS scroll-state() browser support**
   - What we know: Chrome 129+, feature is shipping
   - What's unclear: Safari/Firefox support timeline
   - Recommendation: Don't rely on it for Phase 23 foundation; add as enhancement if needed in Phase 24

3. **Ideal scanline intensity**
   - What we know: Too strong distracts, too weak invisible
   - What's unclear: User's preferred balance
   - Recommendation: Start at opacity 0.2-0.3, user said Claude can tune

## Sources

### Primary (HIGH confidence)
- MDN Web Docs - CSS `position: sticky` documentation
- MDN Web Docs - CSS `prefers-reduced-motion` media query
- MDN Web Docs - CSS `scroll-state()` container queries
- W3C WCAG 2.1 Technique ARIA19 - Live regions for errors
- W3C WCAG 2.1 Technique C39 - prefers-reduced-motion

### Secondary (MEDIUM confidence)
- CSS-Tricks - [Old Timey Terminal Styling](https://css-tricks.com/old-timey-terminal-styling/)
- Sara Soueidan - [Accessible notifications with ARIA Live Regions](https://www.sarasoueidan.com/blog/accessible-notifications-with-aria-live-regions-part-1/)
- Vercel - [Geist Font](https://vercel.com/font) - Geist Mono documentation

### Tertiary (LOW confidence)
- Various CodePen examples for cursor and scanline effects
- Hacker News discussion on monochrome terminal colors
- Color-hex.com vintage terminal palette

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Vanilla CSS is well-documented, project already uses this pattern
- Architecture: HIGH - Sticky scroll pattern exists in hero, well-documented
- Pitfalls: HIGH - Accessibility and sticky issues are well-documented
- Visual effects: MEDIUM - CRT aesthetics are subjective, may need tuning

**Research date:** 2026-01-30
**Valid until:** 60 days (stable CSS features, no fast-moving dependencies)
