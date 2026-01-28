# Phase 20: Mobile + Accessibility - Research

**Researched:** 2026-01-28
**Domain:** CSS media queries, HTML5 video accessibility, scroll UX
**Confidence:** HIGH

## Summary

Phase 20 makes the existing scroll-driven video hero (Phase 19) accessible and mobile-friendly. The implementation touches three areas: (1) `prefers-reduced-motion` support that replaces the video with a static poster and collapses the hero, (2) a scroll-hint element that fades in after a delay and fades out as the user scrolls, and (3) viewport resize handling.

The existing video (1.8MB, h264 Main, 242 frames at 24fps, 10.08s) has only one I-frame (the first frame), which means scrubbing already works via `currentTime` but may exhibit some choppiness on certain browsers. Per CONTEXT.md, the scroll-driven video is kept on mobile (not replaced with a poster). The main mobile concern is that the video scrubbing already works via touch scrolling with `currentTime` mapping -- no change needed to the core scrub logic. The reduced-motion path completely replaces the video with a static poster image and collapses the 300vh hero to 100vh.

**Primary recommendation:** Use CSS `@media (prefers-reduced-motion: reduce)` for all visual changes (collapse hero, hide scroll hint, disable transitions) plus JavaScript `matchMedia` detection to skip the scroll-scrubber entirely and swap the video element for a poster image.

## Standard Stack

### Core

No external libraries needed. This phase uses only built-in web platform APIs.

| API / Feature | Purpose | Why Standard |
|---------------|---------|--------------|
| `prefers-reduced-motion` CSS media query | Detect user motion preference in CSS | W3C WCAG 2.1 technique C39; Baseline since Jan 2020 |
| `window.matchMedia()` | Detect motion preference in JavaScript | Universal browser support; W3C technique SCR40 |
| `ffmpeg` (build tool) | Extract poster frame from video | Standard video processing tool; already used in Phase 19 |
| `ResizeObserver` / `window.resize` | Handle viewport dimension changes | Baseline since 2020; 95%+ browser support |

### Supporting

| Tool | Purpose | When to Use |
|------|---------|-------------|
| CSS `@media (max-width: 640px)` | Mobile-specific adjustments (if any scroll depth change) | Already exists in global.css for responsive styling |
| `#t=0.001` URL fragment | iOS Safari first-frame display fix | On the video `src` to guarantee first frame shows |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Static poster image file | `<video poster="...">` attribute alone | The poster attribute cannot respond to media queries; need actual `<img>` swap for reduced-motion |
| Extracted JPEG poster | WebP poster | WebP is smaller but JPEG has universal support; WebP is fine since the site already serves WebP via Astro image optimization |
| `ResizeObserver` | `window.resize` event | For this use case (full viewport resize), `window.resize` is sufficient since we care about viewport changes, not individual element resizing |
| Re-encoding video with `-g 1` (all keyframes) | Keeping current encoding | All-keyframe encoding would balloon file size from 1.8MB to ~15MB+; current encoding is acceptable per CONTEXT.md (mobile keeps video scrubbing) |

## Architecture Patterns

### Pattern 1: Reduced-Motion-First CSS

**What:** Define static (no-motion) styles as the default, then add animations only inside `@media (prefers-reduced-motion: no-preference)`. This is the W3C WAI recommended pattern.

**When to use:** For this phase, we can use the inverse approach instead (add overrides inside `reduce`), because the existing codebase already has transitions defined and refactoring to motion-first would be a larger scope change. The key is to ensure ALL existing transitions are disabled.

**Recommendation for this phase:** Use `@media (prefers-reduced-motion: reduce)` to override existing transitions, since the codebase is small (only 5 transition declarations) and this approach is minimally invasive.

**Example:**
```css
/* Source: W3C WAI Technique C39 */
@media (prefers-reduced-motion: reduce) {
  /* Kill all transitions site-wide */
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }

  /* Collapse hero to static viewport */
  .hero {
    height: 100vh;
    height: 100svh;
  }

  /* Hide scroll hint */
  .scroll-hint {
    display: none;
  }
}
```

### Pattern 2: JavaScript Motion Detection with matchMedia

**What:** Detect reduced-motion preference in JavaScript to skip scroll-scrubber initialization and swap video for poster image.

**When to use:** When CSS alone cannot handle the change (swapping a `<video>` for an `<img>`, preventing JS scroll handler registration).

**Example:**
```javascript
// Source: W3C WAI Technique SCR40
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
  // Don't initialize scroll scrubber
  // Swap video for static poster
  return;
}

// Normal scroll-driven video setup...
```

### Pattern 3: Poster Frame Extraction at Build/Dev Time

**What:** Use ffmpeg to extract a JPEG/WebP still from the first frame of the video, committed alongside the video.

**When to use:** One-time build step to create the static fallback image for reduced-motion users.

**Example:**
```bash
# Extract first frame as high-quality JPEG
ffmpeg -i site/public/video/hero.mp4 -frames:v 1 -q:v 2 site/public/video/hero-poster.jpg

# Or as WebP (smaller file)
ffmpeg -i site/public/video/hero.mp4 -frames:v 1 site/public/video/hero-poster.webp
```

### Pattern 4: Scroll Hint with Delayed Appearance and Scroll-Driven Fade

**What:** A positioned element that appears after a delay and fades out as the user begins scrolling.

**When to use:** To communicate that the hero section is interactive (scrollable).

**Example approach:**
```css
.scroll-hint {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  z-index: 10;
  opacity: 0;
  animation: scroll-hint-appear 0.6s ease forwards;
  animation-delay: 1.5s;
}

@keyframes scroll-hint-appear {
  to { opacity: 1; }
}
```

```javascript
// Fade out scroll hint as user scrolls (within the existing scroll handler)
const scrollHint = document.querySelector('.scroll-hint');
if (scrollHint && progress > 0.2) {
  scrollHint.style.opacity = '0';
} else if (scrollHint && progress <= 0.05) {
  // Let CSS animation control appearance
}
```

### Anti-Patterns to Avoid

- **Removing the video element entirely via CSS `display: none` for reduced-motion:** The video still downloads. Must handle in JavaScript to prevent the network request, or use the `poster` attribute as the visual and simply don't load the video `src`.
- **Using `autoplay` to show the first frame:** The video already uses `preload="auto"` which handles loading. Never add autoplay -- it defeats the scroll-driven purpose.
- **Listening for `change` on matchMedia without cleanup:** Always remove event listeners if the component could be destroyed, though for a static Astro site this is less of a concern.
- **Relying solely on CSS to handle the video-to-poster swap:** CSS cannot change a `<video>` element's behavior -- JavaScript is needed to either remove the video `src` or replace the element.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Detecting reduced motion | Custom OS detection | `matchMedia('(prefers-reduced-motion: reduce)')` | W3C standard, universal support, listens for changes |
| Scroll progress calculation | New scroll math | Existing `scroll-scrubber.js` progress variable | Already calculates 0-1 progress; extend it for scroll hint fade |
| Throttled scroll handler | Second scroll listener | Extend existing rAF-throttled handler | Adding a second scroll listener wastes CPU; share the one in scroll-scrubber.js |
| Poster image | Manual screenshot | `ffmpeg -frames:v 1` extraction | Guaranteed to match video frame exactly |
| Mobile detection | User-agent sniffing | CSS `@media (max-width: 640px)` | User-agent is unreliable; CSS breakpoints match the existing responsive pattern |

**Key insight:** Almost all Phase 20 changes are additions to existing files (scroll-scrubber.js, global.css, ScrollVideo.astro), not new files. The scroll hint is the only new DOM element.

## Common Pitfalls

### Pitfall 1: Video Still Downloads for Reduced-Motion Users

**What goes wrong:** Adding `display: none` to the video via CSS hides it visually but the browser still fetches the 1.8MB file.
**Why it happens:** CSS visibility/display does not prevent resource loading for `<video>` elements with `src` or `preload` attributes.
**How to avoid:** In JavaScript, detect `prefers-reduced-motion` BEFORE setting the video `src`, or remove the `src` attribute and load a poster `<img>` instead. Alternatively, conditionally render the video element only when motion is allowed (requires Astro component changes or JS DOM manipulation).
**Warning signs:** Network tab shows hero.mp4 downloaded even when reduced-motion is enabled.

**Recommended approach:** Keep the `<video>` element in HTML (for simplicity) but in `scroll-scrubber.js`, check for reduced-motion at the top. If reduced, remove the video `src` attribute (prevents download), hide the video element, and inject/show a poster `<img>` instead. OR: keep the video element with just the `poster` attribute set and remove the `src` -- the poster image will display without downloading the full video.

### Pitfall 2: iOS Safari Does Not Show First Frame Without Poster

**What goes wrong:** On iOS Safari, a `<video>` without a `poster` attribute displays a blank/black rectangle until user interaction.
**Why it happens:** iOS Safari deliberately does not render the first frame as a preview for non-autoplaying videos.
**How to avoid:** Always set the `poster` attribute on the video element, or use the `#t=0.001` fragment on the source URL.
**Warning signs:** Black rectangle on iPhone before scrolling.

**Recommended approach:** Add a `poster` attribute pointing to the extracted poster image. This also serves double duty as the reduced-motion fallback visual.

### Pitfall 3: Hero Height Not Collapsing Under Reduced Motion

**What goes wrong:** The 300vh hero stays tall even when scroll animation is disabled, creating a huge blank scroll gap.
**Why it happens:** CSS `height: 300vh` is still applied; the sticky container still pins content.
**How to avoid:** Use `@media (prefers-reduced-motion: reduce) { .hero { height: 100vh; height: 100svh; } }` to collapse the hero.
**Warning signs:** Users with reduced motion enabled see an oversized hero section with no scroll effect.

### Pitfall 4: Scroll Hint Not Hidden for Reduced-Motion Users

**What goes wrong:** The scroll hint appears and animates even when there's nothing to scroll through.
**Why it happens:** CSS animation delay and appearance runs regardless of user preference.
**How to avoid:** Either use `@media (prefers-reduced-motion: reduce) { .scroll-hint { display: none; } }` or wrap the animation in `@media (prefers-reduced-motion: no-preference)`.
**Warning signs:** Reduced-motion users see a bouncing/pulsing hint on a non-scrollable section.

### Pitfall 5: matchMedia Change Listener Not Wired

**What goes wrong:** User toggles reduced-motion setting mid-session; page doesn't respond.
**Why it happens:** Only checked `matchMedia.matches` at page load, not listening for `change` events.
**How to avoid:** Add `matchMedia.addEventListener('change', handler)` to respond to preference changes. However, for a static page, this is a minor edge case -- most users don't toggle this setting while browsing.
**Warning signs:** Developer testing by toggling OS setting sees no change until page refresh.

### Pitfall 6: Video with Only 1 Keyframe Causes Choppy Scrubbing

**What goes wrong:** The current video has only 1 I-frame (first frame). All other 241 frames are B/P-frames. Browsers must decode from the nearest keyframe to display any intermediate frame.
**Why it happens:** Phase 19 encoding used default GOP settings, not scroll-optimized encoding.
**How to avoid:** Re-encode with `-g 1` (every frame is a keyframe) for perfectly smooth scrubbing, or `-g 10` as a balanced compromise. Note: `-g 1` will significantly increase file size (potentially 5-10x).
**Warning signs:** Visible frame tearing or stuttering during scroll, especially on Firefox and mobile.
**NOTE:** This is a pre-existing issue from Phase 19, not a Phase 20 issue. It may or may not be in scope. If scrubbing feels choppy on mobile testing, re-encoding is the fix. CONTEXT.md says mobile keeps scroll-driven video, so this matters.

## Code Examples

### Example 1: Complete Reduced-Motion CSS Block

```css
/* Source: W3C WAI Technique C39 + project-specific overrides */
@media (prefers-reduced-motion: reduce) {
  /* Kill all transitions and animations site-wide */
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }

  /* Collapse hero to single viewport */
  .hero {
    height: 100vh;
    height: 100svh;
  }

  /* Hide video, show poster */
  .hero-bg-video {
    display: none;
  }

  .hero-bg-poster {
    display: block;
  }

  /* Hide scroll hint entirely */
  .scroll-hint {
    display: none;
  }

  /* Ensure all text is immediately visible */
  .tagline, .description, .install {
    opacity: 1;
    transform: none;
  }
}
```

### Example 2: JavaScript Motion Detection in scroll-scrubber.js

```javascript
// Source: W3C WAI Technique SCR40
(function() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Early exit: no scroll animation for reduced-motion users
  if (prefersReducedMotion.matches) {
    // Remove video src to prevent download (optional if poster handles display)
    const video = document.getElementById('scroll-video');
    if (video) {
      video.removeAttribute('src');
      video.load(); // Reset the video element
      video.style.display = 'none';
    }
    return;
  }

  // ... existing scroll-scrubber.js code ...
})();
```

### Example 3: Poster Frame Extraction Command

```bash
# Extract first frame as JPEG (high quality)
ffmpeg -i site/public/video/hero.mp4 -frames:v 1 -q:v 2 site/public/video/hero-poster.jpg

# File size will be approximately 80-150KB for 1920x1068 JPEG at quality 2
```

### Example 4: Scroll Hint Chevron with Delayed Fade-In

```html
<!-- SVG chevron pointing down -->
<div class="scroll-hint" aria-hidden="true">
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none"
       stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
</div>
```

```css
.scroll-hint {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  z-index: 10;
  color: var(--text-hero-muted);
  opacity: 0;
  pointer-events: none;
}

/* Only animate when motion is allowed */
@media (prefers-reduced-motion: no-preference) {
  .scroll-hint {
    animation: hint-appear 0.6s ease 1.5s forwards,
               hint-bounce 2s ease-in-out 2.1s infinite;
  }
}

@keyframes hint-appear {
  to { opacity: 0.7; }
}

@keyframes hint-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}
```

### Example 5: Viewport Resize Handling

```javascript
// Inside scroll-scrubber.js -- recalculate on resize
// Use the existing rAF pattern for consistency
window.addEventListener('resize', function() {
  // The existing updateVideoTime() already reads live dimensions:
  //   hero.getBoundingClientRect() and hero.offsetHeight
  // So it naturally handles resize. Just trigger a recalc.
  updateVideoTime();
}, { passive: true });
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Canvas + image sequence for scroll animation | `<video>` with `currentTime` scrubbing | Widely adopted ~2020 | Simpler implementation, smaller payload (video vs 240 images) |
| `@media (prefers-reduced-motion)` override approach | Motion-first approach (add animation inside `no-preference`) | W3C recommended ~2021 | Better progressive enhancement; non-supporting browsers get safe default |
| `window.resize` for all resize detection | `ResizeObserver` for element-level, `resize` for viewport | ResizeObserver Baseline 2020 | For viewport-level changes, `window.resize` is still correct |
| CSS Scroll-driven Animations (Safari 26, Chrome 145) | New CSS-native alternative | 2025-2026 | Could replace JS scroll-scrubber entirely, but Safari 26+ only; too new for production fallback |

**Deprecated/outdated:**
- `fastSeek()`: Non-standard, limited browser support. Stick with `currentTime` assignment.
- User-agent sniffing for mobile detection: Use CSS breakpoints and feature queries instead.
- `@supports (-webkit-touch-callout: none)` Safari detection: Unreliable; use feature detection or media queries.

## Open Questions

1. **Video re-encoding for smoother scrubbing**
   - What we know: Current video has only 1 keyframe across 242 frames. This causes choppiness on some browsers (especially Firefox) when scrubbing via `currentTime`.
   - What's unclear: Whether the user considers this in-scope for Phase 20 or a separate improvement.
   - Recommendation: If mobile scrubbing feels choppy during testing, re-encode with `-g 24` (keyframe every second at 24fps) as a balanced compromise. This is an encoding change, not a code change. Flag for testing.

2. **Poster image format**
   - What we know: JPEG is universally supported. WebP is smaller. The site already uses WebP via Astro image optimization for the noscript fallback.
   - What's unclear: Whether to use JPEG or WebP for the poster image in `site/public/video/`.
   - Recommendation: Use JPEG for the poster. It's placed in `public/` (not processed by Astro), and JPEG has zero edge cases. A 1920x1068 JPEG at quality 2 will be ~100-150KB, which is fine.

3. **Mobile scroll depth (300vh vs reduced)**
   - What we know: CONTEXT.md lists this as Claude's discretion. The video is 10 seconds at 300vh, meaning ~5 seconds of video per 100vh of scroll.
   - What's unclear: Whether mobile users need faster video pacing (less scroll).
   - Recommendation: Keep 300vh on mobile initially. The touch scrolling speed is naturally faster than mouse scroll, so pacing will feel different but still good. Can be adjusted later if testing reveals issues.

4. **matchMedia `change` listener for live preference toggling**
   - What we know: The W3C recommends listening for changes, not just checking once.
   - What's unclear: Whether the added complexity is justified for a static site where preference changes mid-session are extremely rare.
   - Recommendation: Skip the `change` listener. Check once at page load. A page refresh handles the edge case. This keeps the code simple per the project's vanilla-JS-minimal philosophy.

## Sources

### Primary (HIGH confidence)
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) - Values, browser support, JS detection
- [W3C WAI Technique C39](https://www.w3.org/WAI/WCAG21/Techniques/css/C39) - CSS reduced-motion pattern
- [W3C WAI Technique SCR40](https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR40) - JavaScript reduced-motion detection
- [MDN: HTMLMediaElement.fastSeek()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/fastSeek) - fastSeek API (limited support, not recommended)
- [MDN: ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) - Resize observation API
- Local codebase analysis: `site/public/video/hero.mp4` has 242 frames, 1 keyframe, 24fps, 10.08s, 1.8MB

### Secondary (MEDIUM confidence)
- [SiteLint: iOS Safari video fixes](https://www.sitelint.com/blog/fixing-html-video-autoplay-blank-poster-first-frame-and-improving-performance-in-safari-and-ios-devices) - `#t=0.001` trick and poster attribute behavior
- [CSS-Tricks: Reduced Motion Picture Technique](https://css-tricks.com/reduced-motion-picture-technique-take-two/) - `<picture>` element approach for motion-sensitive content
- [Muffin Man: Scrubbing videos with JS](https://muffinman.io/blog/scrubbing-videos-using-javascript/) - Keyframe encoding for smooth scrubbing
- [CSS Animation: Scroll Cue](https://cssanimation.rocks/scroll-cue/) - Chevron scroll cue animation pattern
- [web.dev: prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion) - Comprehensive guide with examples

### Tertiary (LOW confidence)
- [WebKit Bug #184025](https://bugs.webkit.org/show_bug.cgi?id=184025) - iOS scroll flickering with video elements (historical, may be fixed)
- WebSearch results on CSS scroll-state queries (Chrome 145, Safari 26) - too new for production use but worth monitoring

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All APIs are W3C standards with universal browser support
- Architecture: HIGH - Patterns verified against W3C techniques and MDN documentation
- Pitfalls: HIGH - Video encoding analysis done locally (ffprobe), iOS Safari issues documented across multiple authoritative sources
- Scroll hint: MEDIUM - CSS animation patterns are well-established but specific chevron design is discretionary

**Research date:** 2026-01-28
**Valid until:** 2026-02-28 (stable domain; browser APIs are mature)
