# Domain Pitfalls: Scroll-Driven Video on Landing Pages

**Milestone:** Adding scroll-driven hero video to Astro static site
**Domain:** Apple-style scroll-driven video animation
**Researched:** 2026-01-28
**Confidence:** HIGH (verified with official docs, WebSearch 2026, MDN)

## Executive Summary

Scroll-driven video is deceptively complex. What looks like "scrub video on scroll" hides critical pitfalls around iOS autoplay policies, video encoding for seekability, mobile performance, and accessibility. Most implementations fail on mobile first, then discover performance issues on desktop.

**Key insight:** Success depends more on video preparation (encoding with dense keyframes) than JavaScript cleverness. The video must be encoded specifically for scrubbing, not streaming.

---

## Critical Pitfalls

Mistakes that cause rewrites, broken mobile experiences, or fundamental feature failure.

### Pitfall 1: Missing Required iOS Autoplay Attributes

**What goes wrong:** Video doesn't play on iOS Safari. User sees black rectangle or poster frame, no animation on scroll.

**Why it happens:** iOS has strict autoplay policies since iOS 10 (2016) that block videos with audio or missing attributes. Developers test on desktop Chrome first, ship, then discover iOS is completely broken.

**Consequences:**
- 40-50% of users (iOS/Safari) see broken hero section
- Video tag exists but does nothing on scroll
- User assumes site is broken, bounces
- Silent failure - no console errors
- Emergency hotfix required post-launch

**Prevention:**

Videos MUST have ALL three attributes to autoplay on iOS:

```html
<video
  muted
  playsinline
  autoplay
  src="hero.mp4">
</video>
```

- **`muted`**: Required. Safari blocks autoplay of videos with audio tracks unless muted
- **`playsinline`**: Required on iPhone. Without this, video enters fullscreen mode on playback
- **`autoplay`**: Actually starts the video (iOS respects this when combined with muted)

**Additional iOS restrictions:**
- Videos only play when visible in viewport (automatically pause when scrolled out)
- Video must have no audio track OR be muted
- If video gains audio track or becomes un-muted without user gesture, playback pauses immediately

**Detection:**
- Test on actual iPhone (iOS Simulator may not catch all issues)
- Check Safari Web Inspector for autoplay policy violations
- Video element exists in DOM but `paused` property is `true`
- Warning signs during development: "I haven't tested on iOS yet"

**Which phase:** Phase 1 (Video setup). Set these attributes from the first commit. Non-negotiable for iOS support.

**Sources:**
- [WebKit Blog: New video Policies for iOS](https://webkit.org/blog/6784/new-video-policies-for-ios/)
- [Cloudinary: Video Autoplay in HTML](https://cloudinary.com/guides/video-effects/video-autoplay-in-html)

---

### Pitfall 2: Video Encoded for Streaming, Not Scrubbing

**What goes wrong:** Scroll-driven video is janky, laggy, or shows wrong frames. Scrubbing by setting `video.currentTime` results in slow seeks and stuttering.

**Why it happens:** Videos are encoded with keyframes every 10 seconds (default MP4 settings) for streaming efficiency. When you seek to arbitrary times via `currentTime`, the decoder must:
1. Find previous keyframe (up to 10 seconds back)
2. Decode all intermediate frames
3. Display target frame

This takes 100-500ms on mobile, causing visible lag during scrolling.

**Why standard encoding fails:**
- **Default H.264 encoding:** Keyframe every 250 frames (~10 seconds at 25fps)
- **Streaming optimization:** Fewer keyframes = smaller file size
- **Scrubbing penalty:** Seeking requires decoding from previous keyframe

**Consequences:**
- Janky scroll animation (frame updates lag behind scroll position)
- Worse on Firefox (needs keyframe every 2 frames for smoothness)
- Unusable on mid-range mobile devices (frame drops, stuttering)
- Video appears to "jump" or "lag" when scrubbing
- High CPU usage during scroll

**Prevention:**

**Encode video with high keyframe frequency using FFmpeg:**

```bash
ffmpeg -i input.mp4 \
  -c:v libx264 \
  -profile:v high \
  -crf 23 \
  -g 30 \
  -keyint_min 30 \
  -sc_threshold 0 \
  -an \
  -movflags +faststart \
  output.mp4
```

**Critical flags explained:**
- **`-g 30`**: Group of Pictures = 30 frames (keyframe every 30 frames / 1 second at 30fps)
- **`-keyint_min 30`**: Minimum keyframe interval (forces consistency)
- **`-sc_threshold 0`**: Disable scene change detection (prevents unexpected keyframes)
- **`-an`**: Remove audio stream (not needed, saves bandwidth)
- **`-movflags +faststart`**: Move metadata to beginning for faster web playback
- **`-crf 23`**: Constant Rate Factor for quality (18-28 range, lower = better quality)

**For ultra-smooth scrubbing (every frame is a keyframe):**

```bash
ffmpeg -i input.mp4 \
  -c:v libx264 \
  -profile:v high \
  -crf 23 \
  -g 1 \
  -an \
  -movflags +faststart \
  output.mp4
```

Warning: `-g 1` creates MUCH larger files (3-5x size increase). Only use if file size is acceptable.

**Browser-specific requirements:**
- Chrome/Safari: Keyframe every 5 frames is acceptable
- Firefox: Needs keyframe every 2 frames to avoid jank
- Mobile: Err toward more keyframes (every 1-2 frames)

**Detection:**
- Scrubbing feels laggy or stuttery
- Frame updates don't match scroll position precisely
- Performance worse on Firefox
- High CPU usage during scroll (decoder working hard)
- Use `ffprobe` to check keyframe interval:

```bash
ffprobe -select_streams v -show_frames input.mp4 | grep key_frame
```

**Which phase:** Phase 1 (Video preparation). Re-encode source video BEFORE implementing scroll logic. Can't fix janky seeks with better JavaScript.

**Sources:**
- [Mux: Optimize Video for Web with FFmpeg](https://www.mux.com/articles/optimize-video-for-web-playback-with-ffmpeg)
- [Scroll-to-Scrub Videos Medium Article](https://medium.com/@chrislhow/scroll-to-scrub-videos-4664c29b4404)
- [Abhishek Ghosh: Playing with Video Scrubbing Animations](https://www.ghosh.dev/posts/playing-with-video-scrubbing-animations-on-the-web/)

---

### Pitfall 3: GitHub Pages File Size Exceeded

**What goes wrong:** Video push fails or site stops deploying. GitHub rejects the commit with "file exceeds 100 MB" error.

**Why it happens:**
- GitHub Pages has 1 GB site limit (soft)
- Individual files must be under 100 MB (hard limit)
- Files over 50 MB trigger warnings
- 10-second AI-generated video easily exceeds 100 MB unoptimized
- Adding dense keyframes (Pitfall 2 solution) increases file size 2-5x

**Math that reveals the trap:**
- 10-second video at 1080p, 30fps, high keyframe density
- Uncompressed: ~3 GB
- Standard H.264 (keyframe every 5 seconds): 15-30 MB
- Scrubbing-optimized H.264 (keyframe every 1 second): 50-80 MB
- Every-frame-keyframe H.264: 150-250 MB ← **EXCEEDS LIMIT**

**Consequences:**
- Can't push video to GitHub
- Must use Git LFS (adds complexity)
- Or must host video externally (CDN costs, deployment complexity)
- Or must aggressively compress (quality suffers)
- Launch blocked by infrastructure issue

**Prevention:**

**Target file size: Under 10 MB for header videos**

1. **Resolution optimization:**
   - Desktop: 1920x1080 max
   - Mobile-first: 1280x720 is sufficient
   - Consider 2 versions: desktop (1080p) + mobile (720p)

2. **Compression optimization:**

```bash
# Aggressive compression for <10 MB target
ffmpeg -i input.mp4 \
  -c:v libx264 \
  -profile:v high \
  -crf 28 \
  -g 30 \
  -preset slow \
  -vf scale=1280:720 \
  -an \
  -movflags +faststart \
  output.mp4
```

**Trade-off calibration:**
- `-crf 18`: Visually lossless, large file
- `-crf 23`: High quality (recommended starting point)
- `-crf 28`: Medium quality, smaller file
- `-crf 32`: Noticeable compression, very small

3. **Alternative: Use WebM (better compression, good browser support):**

```bash
ffmpeg -i input.mp4 \
  -c:v libvpx-vp9 \
  -crf 30 \
  -b:v 0 \
  -vf scale=1280:720 \
  -an \
  output.webm
```

WebM with VP9 achieves 30-40% smaller files than H.264 at same quality.

4. **Fallback strategy: External hosting**
   - GitHub Pages for HTML/CSS/JS
   - Cloudflare R2 / Bunny CDN / Backblaze B2 for video (cheap, fast)
   - Free tier sufficient for landing page traffic

**File size testing:**
```bash
# Check file size before commit
ls -lh output.mp4
# Target: under 10 MB for smooth GitHub Pages experience
```

**Detection:**
- File size check before commit
- GitHub push fails with "file too large" error
- Warning during `git add`: "large files detected"
- Site build fails in GitHub Actions

**Which phase:** Phase 1 (Video preparation). Check file size BEFORE implementing scroll logic. Prevents late-stage scrambling.

**Sources:**
- [GitHub Docs: GitHub Pages Limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [web.dev: Video Performance](https://web.dev/learn/performance/video-performance)

---

### Pitfall 4: Scroll Jank from Expensive JavaScript

**What goes wrong:** Page scrolling feels janky, stuttery, or unresponsive. Scroll events fire but video updates lag behind, creating rubber-banding effect.

**Why it happens:**
- Scroll event listener fires 60+ times per second
- Each scroll event triggers:
  1. Scroll position calculation
  2. Video currentTime update
  3. Possible layout recalculation
  4. Possible style recalculation
- On main thread, blocking rendering

**Scroll event characteristics:**
- Fires irregularly (not synced with frame rendering)
- Can fire multiple times between frames
- Runs on main thread (competes with rendering)
- On high-refresh displays (120Hz), fires 120+ times/sec

**Consequences:**
- Janky scroll experience (users notice immediately)
- Worse on mobile (less CPU overhead budget)
- Bad Core Web Vitals (First Input Delay, Interaction to Next Paint)
- Users think site is broken or low-quality
- Defeats purpose of "smooth Apple-style animation"

**Prevention:**

**Strategy 1: Throttle/debounce scroll events (NOT RECOMMENDED - still janky)**

```javascript
// DON'T: Throttling helps but doesn't solve root cause
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateVideoTime();
      ticking = false;
    });
    ticking = true;
  }
});
```

**Strategy 2: CSS Scroll-Driven Animations (RECOMMENDED - hardware accelerated)**

As of 2026, scroll-driven animations are widely supported (Safari 26+, Chrome 115+, Firefox 132+):

```css
@supports (animation-timeline: scroll()) {
  video {
    animation: scrub-video linear;
    animation-timeline: scroll();
    animation-range: entry 0% exit 100%;
  }
}

@keyframes scrub-video {
  from {
    /* Browser handles video scrubbing natively */
  }
  to {
    /* Much smoother than JavaScript */
  }
}
```

**Benefits:**
- Runs on compositor thread (not main thread)
- No scroll event listeners needed
- Hardware accelerated
- Synced with scroll position at hardware level
- No jank

**Limitation:** CSS scroll-driven animations can't directly control video.currentTime yet. Hybrid approach:

```javascript
// Use Intersection Observer (efficient) to detect scroll range
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Calculate video time based on scroll position
      const scrollFraction = calculateScrollFraction();
      video.currentTime = video.duration * scrollFraction;
    }
  });
}, { threshold: buildThresholdArray() }); // e.g., [0, 0.1, 0.2, ..., 1.0]

function buildThresholdArray() {
  // Create 100 threshold points for smooth updates
  return Array.from({ length: 101 }, (_, i) => i / 100);
}

observer.observe(videoContainer);
```

**Strategy 3: requestVideoFrameCallback (if available, smoother than Intersection Observer)**

```javascript
if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
  function updateVideoFrame() {
    const scrollFraction = calculateScrollFraction();
    video.currentTime = video.duration * scrollFraction;
    video.requestVideoFrameCallback(updateVideoFrame);
  }
  video.requestVideoFrameCallback(updateVideoFrame);
} else {
  // Fallback to Intersection Observer
}
```

**Performance checklist:**
- [ ] No direct scroll event listeners (use Intersection Observer)
- [ ] Video.currentTime updates at most once per frame
- [ ] Use `will-change: transform` on animated elements sparingly
- [ ] Test on 60Hz and 120Hz displays
- [ ] Measure with Chrome DevTools Performance panel

**Detection:**
- Chrome DevTools Performance panel shows long script tasks during scroll
- Lighthouse flags scroll performance issues
- Visual jank visible to naked eye
- High CPU usage during scrolling
- Frame drops in Performance monitor

**Which phase:** Phase 2 (Scroll implementation). Use Intersection Observer or CSS scroll-driven animations from the start. Avoid raw scroll events.

**Sources:**
- [MDN: Optimizing Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)
- [Medium: CSS Scroll-Driven Animations](https://medium.com/@petercoolen/css-scroll-driven-animations-aa9aa198f430)
- [CSS-Tricks: Apple Product Page Scroll Animations](https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/)

---

### Pitfall 5: Ignoring Accessibility (prefers-reduced-motion)

**What goes wrong:** Users with vestibular disorders or motion sensitivity experience dizziness, nausea, or headaches from scroll-driven animations. Site becomes unusable for accessibility needs.

**Why it happens:**
- Developers focus on "wow factor" of animation
- Don't test with `prefers-reduced-motion` enabled
- Assume animation is "just visual polish" (it's not - it's a disability concern)
- April 2026 ADA Title II deadline makes this legally required

**Who is affected:**
- 70+ million people with vestibular disorders
- Users with motion sensitivity
- Users with cognitive disabilities (animation distracts)
- Users who explicitly set "reduce motion" in OS settings

**Consequences:**
- Physical discomfort for users (dizziness, nausea, headaches)
- Site violates WCAG 2.3.3 (Animation from Interactions)
- Legal liability (ADA compliance required by April 2026)
- Users forced to leave site immediately
- Reputational damage ("your site made me sick")

**Prevention:**

**Respect prefers-reduced-motion:**

```css
/* Default: animated video */
video {
  /* scroll-driven animation styles */
}

/* Reduced motion: static or simple fade */
@media (prefers-reduced-motion: reduce) {
  video {
    animation: none !important;
    /* Show static poster or simple fade-in */
  }
}
```

**JavaScript detection:**

```javascript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (prefersReducedMotion) {
  // Show static hero image instead of video
  // Or: simple fade-in without scroll-driven animation
  video.style.display = 'none';
  staticHeroImage.style.display = 'block';
} else {
  // Full scroll-driven video experience
  initializeScrollDrivenVideo();
}
```

**Accessible alternatives:**
1. **Static hero image** (simplest, most accessible)
2. **Simple fade-in** (slight animation, well-tolerated)
3. **Play video on button click** (user-initiated)

**Screen reader considerations:**
- Video needs alt text or aria-label
- Describe what video shows: `aria-label="Hero animation showing product features"`
- Don't rely on video to convey critical information
- Provide text equivalent of visual content

**Testing:**
- Enable "Reduce Motion" in OS settings:
  - macOS: Settings > Accessibility > Display > Reduce motion
  - iOS: Settings > Accessibility > Motion > Reduce Motion
  - Android 9+: Settings > Accessibility > Remove animations
- Test with screen reader (VoiceOver, NVDA, JAWS)
- Verify video doesn't block or obscure critical content

**Detection:**
- Manual testing with reduced motion enabled
- Automated accessibility audits (axe, Lighthouse)
- User complaints about motion sickness
- ADA compliance audit flags animation issues

**Which phase:** Phase 2 (Scroll implementation). Implement reduced-motion check alongside scroll animation. Non-negotiable for accessibility.

**Sources:**
- [CSS-Tricks: prefers-reduced-motion](https://css-tricks.com/almanac/rules/m/media/prefers-reduced-motion/)
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
- [A11y 101: Reduced Motion](https://a11y-101.com/development/reduced-motion)
- [W3C: Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)

---

## Moderate Pitfalls

Mistakes that cause delays, technical debt, or suboptimal UX but are fixable.

### Pitfall 6: Wrong Video Preload Strategy

**What goes wrong:** Video either downloads too early (wasting bandwidth on users who never scroll) or too late (stutter on first scroll).

**Why it happens:**
- Developer doesn't consider preload attribute
- Defaults to `preload="auto"` (downloads entire video immediately)
- Or defaults to `preload="none"` (doesn't download until play, causing stutter)

**Consequences:**
- `preload="auto"`: Wastes bandwidth, slow initial page load
- `preload="none"`: Video stutters when user first scrolls
- `preload="metadata"`: Middle ground but may still cause first-scroll stutter
- Mobile data usage concerns (users on cellular pay for unused video)

**Prevention:**

**Recommended: `preload="metadata"` + Intersection Observer lazy load**

```html
<video
  muted
  playsinline
  preload="metadata"
  poster="hero-poster.jpg"
  src="hero.mp4">
</video>
```

```javascript
// Lazy load full video when viewport approaches hero section
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      video.preload = 'auto'; // Start downloading
      observer.unobserve(video); // Only load once
    }
  });
}, {
  rootMargin: '200px' // Start loading 200px before video enters viewport
});

observer.observe(videoContainer);
```

**Mobile-specific optimization:**

```javascript
// Check connection type before preloading
if ('connection' in navigator) {
  const connection = navigator.connection;
  if (connection.effectiveType === '4g') {
    video.preload = 'auto'; // Fast connection, safe to preload
  } else {
    video.preload = 'metadata'; // Slower connection, wait for user
  }
}
```

**Preload attribute comparison:**

| Value | Behavior | Use Case |
|-------|----------|----------|
| `none` | Nothing downloaded until play() | Save bandwidth, expect stutter |
| `metadata` | Only duration/dimensions loaded | Default recommendation |
| `auto` | Full video downloaded | Only if video is primary content |

**Detection:**
- Network tab shows video downloading on page load (before scroll)
- First scroll stutters (video not loaded yet)
- Mobile users complain about data usage
- Lighthouse flags large initial payload

**Which phase:** Phase 2 (Scroll implementation). Set preload strategy early to balance performance and UX.

**Sources:**
- [web.dev: Fast Playback with Preload](https://web.dev/articles/fast-playback-with-preload)
- [MDN: HTMLMediaElement.preload](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/preload)
- [Clubmate.fi: Video Preload Attribute](https://clubmate.fi/what-does-the-preload-attribute-in-the-video-element-do)

---

### Pitfall 7: No Fallback for Unsupported Browsers

**What goes wrong:** Older browsers or browsers without JavaScript show empty hero section or broken video controls.

**Why it happens:**
- Assumes all users have modern browsers
- Doesn't provide `<source>` fallbacks for different formats
- No poster image for browsers that disable autoplay
- No fallback content inside `<video>` tag

**Consequences:**
- Older browsers (IE11, old Safari) show nothing
- Users with JavaScript disabled see blank space
- Degraded experience instead of graceful degradation

**Prevention:**

**Multiple format fallbacks:**

```html
<video
  muted
  playsinline
  preload="metadata"
  poster="hero-poster.jpg">
  <source src="hero.webm" type="video/webm">
  <source src="hero.mp4" type="video/mp4">

  <!-- Fallback for no video support -->
  <img src="hero-fallback.jpg" alt="Hero section showing product">
  <p>Your browser doesn't support video. <a href="hero.mp4">Download video</a></p>
</video>
```

**Feature detection:**

```javascript
const supportsVideo = !!document.createElement('video').canPlayType;

if (!supportsVideo) {
  // Show static image instead
  videoContainer.innerHTML = '<img src="hero-fallback.jpg" alt="Hero">';
}

// Check for requestVideoFrameCallback support
if (!('requestVideoFrameCallback' in HTMLVideoElement.prototype)) {
  // Fall back to Intersection Observer approach
  useIntersectionObserverFallback();
}
```

**Progressive enhancement layers:**
1. **Base layer**: Static hero image (always works)
2. **Video layer**: Auto-playing muted video (works on modern browsers)
3. **Scroll animation layer**: Scroll-driven scrubbing (works if JS enabled)

**Detection:**
- Test in older browsers (Safari 14, Firefox ESR)
- Test with JavaScript disabled
- Check fallback content actually displays

**Which phase:** Phase 2 (Scroll implementation). Add fallbacks as you build scroll logic.

---

### Pitfall 8: canvas drawImage() Performance on Mobile

**What goes wrong:** If using canvas-based approach (drawing video frames to canvas for effects), performance is terrible on mobile.

**Why it happens:**
- `drawImage()` is expensive when extracting video frames
- Mobile GPUs less powerful than desktop
- Canvas operations may not be hardware accelerated on all mobile browsers
- Resizing video frames to fit canvas adds overhead

**Consequences:**
- Scroll animation stutters on mobile
- High CPU/battery usage
- Dropped frames
- Site feels "janky" compared to native video scrubbing

**Prevention:**

**If using canvas is necessary:**

1. **Use hardware acceleration:**

```javascript
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', {
  alpha: false, // Disable alpha channel if not needed
  desynchronized: true // Allow canvas to be out of sync with DOM
});
```

2. **Round coordinates to avoid sub-pixel rendering:**

```javascript
ctx.drawImage(
  video,
  Math.floor(x),
  Math.floor(y),
  Math.floor(width),
  Math.floor(height)
);
```

3. **Use requestAnimationFrame instead of setInterval:**

```javascript
function updateCanvas() {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  requestAnimationFrame(updateCanvas);
}
requestAnimationFrame(updateCanvas);
```

4. **Consider if canvas is actually needed:**
   - For simple scrubbing: native `<video>` element is faster
   - For filters/effects: consider CSS filters instead
   - Only use canvas if absolutely necessary

**Recommendation:** Avoid canvas unless you need effects that can't be done with video + CSS. Native video scrubbing is hardware-accelerated and much faster.

**Detection:**
- Performance profiling shows drawImage() taking >16ms per frame
- Mobile testing reveals jank
- High CPU usage on mobile devices

**Which phase:** Phase 2 (Scroll implementation). Choose native video over canvas unless effects require it.

**Sources:**
- [MDN: Optimizing Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)
- [HTML5 Doctor: Video + Canvas](http://html5doctor.com/video-canvas-magic/)

---

### Pitfall 9: Not Testing on Real Mobile Devices

**What goes wrong:** Implementation works perfectly on desktop and mobile emulators, but fails on actual iOS/Android devices.

**Why it happens:**
- Developer relies on Chrome DevTools device emulation
- iOS Simulator doesn't perfectly match real device behavior
- Mobile browser autoplay policies stricter than emulated
- Touch scroll behavior differs from emulated scroll

**Consequences:**
- Launch reveals iOS completely broken
- Video doesn't autoplay on real devices
- Scroll performance worse than emulator suggested
- Touch scroll events fire differently than expected
- Emergency fixes post-launch

**Prevention:**

**Test on real devices:**
- Minimum: iPhone (Safari), Android phone (Chrome)
- Ideal: iPhone (Safari), Android (Chrome), Android (Firefox), iPad
- Use BrowserStack or similar for device lab access

**Testing checklist:**
- [ ] Video autoplays on iOS Safari (muted, playsinline, autoplay)
- [ ] Video autoplays on Android Chrome
- [ ] Scroll-driven scrubbing works on touch devices
- [ ] Performance acceptable on mid-range devices (not just flagship)
- [ ] Battery usage reasonable during extended scrolling
- [ ] prefers-reduced-motion respected on iOS/Android
- [ ] Network conditions: Test on throttled 3G/4G

**Remote debugging:**
- iOS Safari: Safari Developer Menu > Connect to iPhone
- Android Chrome: chrome://inspect on desktop
- Firefox Android: about:debugging

**Detection:**
- Real device testing reveals issues emulator missed
- User bug reports from mobile users
- Analytics show high mobile bounce rate

**Which phase:** Phase 3 (Testing). Test on real devices before considering feature complete.

---

### Pitfall 10: Video Encoding Profile Compatibility

**What goes wrong:** Video encoded with High Profile H.264 doesn't play on some older mobile devices or browsers.

**Why it happens:**
- High Profile has better compression but requires more CPU to decode
- Older devices don't support High Profile hardware decoding
- Fallback to software decoding is slow and battery-draining

**Consequences:**
- Video plays on desktop but not on older iOS/Android devices
- Excessive battery drain on devices that software-decode
- Silent failure: video element exists but shows black screen

**Prevention:**

**Use H.264 Constrained Baseline Profile for maximum compatibility:**

```bash
ffmpeg -i input.mp4 \
  -c:v libx264 \
  -profile:v baseline \
  -level 3.0 \
  -crf 23 \
  -g 30 \
  -an \
  -movflags +faststart \
  output.mp4
```

**Profile comparison:**

| Profile | Compression | Compatibility | Use Case |
|---------|-------------|---------------|----------|
| Baseline | Low | Maximum (all devices) | Legacy support |
| Constrained Baseline | Low | High (WebRTC standard) | Web compatibility |
| Main | Medium | High (most devices) | Balanced |
| High | High | Modern devices only | Desktop-first |

**For 2026 web projects:**
- Constrained Baseline: Maximum compatibility (recommended for landing pages)
- High Profile: Better compression if you know audience has modern devices

**Provide multiple sources for progressive enhancement:**

```html
<video muted playsinline preload="metadata">
  <source src="hero-baseline.mp4" type="video/mp4; codecs=avc1.42E01E">
  <source src="hero-high.mp4" type="video/mp4; codecs=avc1.640028">
  <source src="hero.webm" type="video/webm; codecs=vp9">
</video>
```

**Detection:**
- Test on older devices (iPhone 8, older Android)
- Check browser console for codec errors
- Video element shows black screen but no errors

**Which phase:** Phase 1 (Video preparation). Choose profile when encoding, before implementation.

**Sources:**
- [MDN: Web Video Codec Guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Video_codecs)
- [MDN: WebRTC Codecs](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/WebRTC_codecs)

---

## Minor Pitfalls

Mistakes that cause annoyance but are easily fixable.

### Pitfall 11: Missing Poster Image

**What goes wrong:** Blank space or first frame shows before video loads, creating awkward visual experience.

**Why it happens:** Developer forgets to set `poster` attribute on video element.

**Consequences:**
- Flash of blank content on page load
- First frame may not be visually appealing
- Looks unpolished

**Prevention:**

```html
<video
  muted
  playsinline
  preload="metadata"
  poster="hero-poster.jpg"
  src="hero.mp4">
</video>
```

**Poster image guidelines:**
- Export frame from video that represents content
- Optimize as JPG or WebP (10-50 KB)
- Same aspect ratio as video
- Visually appealing starting frame

**Which phase:** Phase 1 (Video setup). Export poster frame when preparing video.

---

### Pitfall 12: No Loading State

**What goes wrong:** Video appears to be broken while loading. User doesn't know if content is loading or failed.

**Why it happens:** No UI feedback for video loading state.

**Consequences:**
- User confusion during slow network
- Appears broken rather than loading

**Prevention:**

```javascript
video.addEventListener('loadstart', () => {
  showLoadingSpinner();
});

video.addEventListener('canplay', () => {
  hideLoadingSpinner();
});

video.addEventListener('error', () => {
  showErrorMessage('Video failed to load');
});
```

**Which phase:** Phase 3 (Polish). Add loading states after core functionality works.

---

### Pitfall 13: No Analytics on Video Performance

**What goes wrong:** Can't measure if video is actually loading/playing for users. No data on real-world performance.

**Why it happens:** Forgot to add event tracking for video metrics.

**Consequences:**
- Can't detect failure rates
- Don't know % of users who see video vs. poster
- Can't optimize based on real data

**Prevention:**

```javascript
// Track video milestones
video.addEventListener('loadeddata', () => {
  analytics.track('video_loaded', { duration: video.duration });
});

video.addEventListener('play', () => {
  analytics.track('video_played');
});

video.addEventListener('error', (e) => {
  analytics.track('video_error', {
    code: video.error.code,
    message: video.error.message
  });
});

// Track scroll interaction
let scrollInteracted = false;
window.addEventListener('scroll', () => {
  if (!scrollInteracted && videoInViewport()) {
    analytics.track('scroll_video_interacted');
    scrollInteracted = true;
  }
}, { once: true });
```

**Key metrics:**
- Video load success rate
- Time to first frame
- Scroll interaction rate
- Error codes and frequency
- Device/browser breakdown

**Which phase:** Phase 3 (Testing). Add analytics before launch to measure real-world performance.

---

## Phase-Specific Warnings

| Phase | Topic | Critical Pitfall | Prevention |
|-------|-------|-----------------|------------|
| Phase 1 | Video preparation | Streaming-optimized encoding (Pitfall 2) | Re-encode with `-g 30` for scrubbing |
| Phase 1 | Video preparation | File size exceeds GitHub limit (Pitfall 3) | Target <10 MB, test file size |
| Phase 1 | Video setup | Missing iOS attributes (Pitfall 1) | Add muted, playsinline, autoplay |
| Phase 2 | Scroll implementation | Scroll event jank (Pitfall 4) | Use Intersection Observer, not scroll events |
| Phase 2 | Scroll implementation | Ignoring reduced motion (Pitfall 5) | Respect prefers-reduced-motion from start |
| Phase 2 | Scroll implementation | Wrong preload strategy (Pitfall 6) | Use preload="metadata" + lazy load |
| Phase 3 | Testing | No real device testing (Pitfall 9) | Test on actual iPhone/Android before launch |
| Phase 3 | Polish | No loading states (Pitfall 12) | Add loadstart/canplay/error handlers |
| Phase 3 | Launch prep | No analytics (Pitfall 13) | Track video load/play/error events |

---

## Quick Reference: Pre-Launch Checklist

Before deploying scroll-driven video to production:

### Video File
- [ ] Re-encoded with keyframe every 30 frames (`-g 30`)
- [ ] Audio track removed (`-an`)
- [ ] FastStart enabled (`-movflags +faststart`)
- [ ] File size under 10 MB (or hosted on CDN)
- [ ] Poster image created and optimized
- [ ] Tested in VLC or browser to verify smooth scrubbing

### HTML/Attributes
- [ ] `muted` attribute present
- [ ] `playsinline` attribute present (iOS requirement)
- [ ] `autoplay` attribute present
- [ ] `preload="metadata"` set
- [ ] `poster` attribute with optimized image
- [ ] Multiple `<source>` elements for fallback

### JavaScript/Implementation
- [ ] No direct scroll event listeners (use Intersection Observer)
- [ ] Intersection Observer or requestVideoFrameCallback for scroll
- [ ] Respects `prefers-reduced-motion`
- [ ] Feature detection for requestVideoFrameCallback
- [ ] Loading states (loadstart, canplay, error)
- [ ] Analytics events tracked

### Testing
- [ ] Tested on real iPhone (Safari)
- [ ] Tested on real Android (Chrome)
- [ ] Tested with "Reduce Motion" enabled
- [ ] Tested with slow network (throttled 3G)
- [ ] Tested with JavaScript disabled (graceful degradation)
- [ ] Lighthouse audit passed (performance, accessibility)
- [ ] No console errors on iOS/Android

### Accessibility
- [ ] prefers-reduced-motion respected
- [ ] aria-label or alt text on video
- [ ] Video doesn't block critical content
- [ ] Fallback content provided
- [ ] Tested with screen reader

---

## Confidence Assessment

| Area | Confidence | Sources |
|------|------------|---------|
| iOS autoplay policies | HIGH | Official WebKit blog, verified 2026 |
| Video encoding for scrubbing | HIGH | FFmpeg docs, developer articles 2026 |
| GitHub Pages limits | HIGH | Official GitHub documentation 2026 |
| Scroll performance | HIGH | MDN, web.dev, CSS-Tricks verified 2026 |
| Accessibility (prefers-reduced-motion) | HIGH | MDN, W3C WCAG, A11y resources 2026 |
| Mobile browser differences | MEDIUM | WebSearch 2026, some gaps in iOS-specific details |
| Canvas performance | MEDIUM | MDN verified, mobile-specific details from articles |
| requestVideoFrameCallback support | HIGH | MDN verified, caniuse data October 2024 baseline |

---

## Sources

### iOS Autoplay Policies
- [WebKit Blog: New video Policies for iOS](https://webkit.org/blog/6784/new-video-policies-for-ios/)
- [Cloudinary: Video Autoplay in HTML](https://cloudinary.com/guides/video-effects/video-autoplay-in-html)
- [Bitmovin: Autoplay Policies Safari 14 & Chrome 64](https://bitmovin.com/autoplay-policies-safari-14-chrome-64/)

### Video Encoding & Optimization
- [Mux: Optimize Video for Web Playback with FFmpeg](https://www.mux.com/articles/optimize-video-for-web-playback-with-ffmpeg)
- [web.dev: Video Performance](https://web.dev/learn/performance/video-performance)
- [MDN: Multimedia Video](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Performance/video)
- [Smashing Magazine: Optimizing Video for Size and Quality](https://www.smashingmagazine.com/2021/02/optimizing-video-size-quality/)

### Scroll-Driven Video Implementation
- [CSS-Tricks: Apple Product Page Scroll Animations](https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/)
- [Medium: Scroll to Scrub Videos](https://medium.com/@chrislhow/scroll-to-scrub-videos-4664c29b4404)
- [Abhishek Ghosh: Playing with Video Scrubbing Animations](https://www.ghosh.dev/posts/playing-with-video-scrubbing-animations-on-the-web/)

### Performance & Scroll Jank
- [MDN: Optimizing Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)
- [Medium: CSS Scroll-Driven Animations](https://medium.com/@petercoolen/css-scroll-driven-animations-aa9aa198f430)
- [Apple Developer: UI Animation Hitches and the Render Loop](https://developer.apple.com/videos/play/tech-talks/10855/)

### GitHub Pages
- [GitHub Docs: GitHub Pages Limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)

### Accessibility
- [CSS-Tricks: prefers-reduced-motion](https://css-tricks.com/almanac/rules/m/media/prefers-reduced-motion/)
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
- [A11y 101: Reduced Motion](https://a11y-101.com/development/reduced-motion)
- [W3C WCAG: Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)

### Browser APIs
- [MDN: requestVideoFrameCallback](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestVideoFrameCallback)
- [Can I Use: requestVideoFrameCallback](https://caniuse.com/?search=requestVideoFrameCallback)
- [MDN: Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)

### Video Preloading
- [web.dev: Fast Playback with Preload](https://web.dev/articles/fast-playback-with-preload)
- [MDN: HTMLMediaElement.preload](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/preload)
- [Clubmate.fi: Video Preload Attribute](https://clubmate.fi/what-does-the-preload-attribute-in-the-video-element-do)

### Codec Compatibility
- [MDN: Web Video Codec Guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Video_codecs)
- [MDN: WebRTC Codecs](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/WebRTC_codecs)
