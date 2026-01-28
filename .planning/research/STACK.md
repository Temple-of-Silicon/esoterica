# Technology Stack: Scroll-Driven Video Enhancement

**Project:** Esoterica Landing Page
**Milestone:** Scroll-driven hero video, Gateway Process illustrations, footer
**Researched:** 2026-01-28
**Confidence:** HIGH

## Executive Summary

For Apple-style scroll-driven video on a static Astro site, **canvas with image sequences outperforms video elements** by eliminating seek delays (250-500ms per frame). The recommended approach: extract video frames to WebP sequence, preload critical frames, lazy-load remainder, and use Intersection Observer + requestAnimationFrame for scroll synchronization. No external libraries needed - vanilla JavaScript handles this efficiently.

## Recommended Stack Additions

### Video Processing (Build-time)

| Tool | Version | Purpose | Why |
|------|---------|---------|-----|
| ffmpeg | 7.x+ | Frame extraction and compression | Industry standard, precise frame extraction, excellent WebP output quality |

**Installation:**
```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg
```

### Runtime (Client-side)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Vanilla JavaScript | ES2020+ | Scroll synchronization | No framework needed, maximum performance, already using vanilla JS |
| Canvas API | Native | Frame rendering | Smooth rendering, 60fps capable, no video seek delays |
| Intersection Observer | Native | Viewport detection | Universal browser support (since 2019), efficient viewport tracking |
| requestAnimationFrame | Native | Scroll smoothing | Syncs with browser paint cycle, prevents jank |

### Assets Format

| Asset Type | Format | Why |
|------------|--------|-----|
| Image sequence | WebP | 26% smaller than PNG, 25-34% smaller than JPEG, native browser support |
| Fallback (optional) | MP4 h.264 | Universal compatibility for browsers without canvas support |

## NO Additional npm Packages Needed

**Do NOT add:**
- ❌ GSAP ScrollTrigger (48KB) - Overkill for single scroll video, adds unnecessary weight
- ❌ scrolly-video library - Adds abstraction layer, native APIs sufficient
- ❌ Video processing libraries - ffmpeg handles all needs at build time

**Why native-only approach:**
- Site currently has zero runtime dependencies beyond Astro framework
- Intersection Observer + requestAnimationFrame provide all needed functionality
- Canvas API is well-optimized in modern browsers
- Adds zero bundle size

## Integration with Existing Astro Stack

### Current Stack (Validated)
- Astro 5.0 static site generator
- Sharp 0.33.0 for image optimization
- Builds to `docs/` directory for GitHub Pages
- Site: `jem-computer.github.io/esoterica`

### How Video Enhancement Integrates

**Build Process:**
1. Source video (25MB h.264) placed in `public/video/` directory
2. Build script extracts frames using ffmpeg
3. Frames optimized to WebP sequence in `public/frames/`
4. Astro copies static assets to `docs/` during build

**Runtime Process:**
1. HTML canvas element in hero section
2. Vanilla JS preloads first 10-15 frames (above-fold)
3. Lazy-loads remaining frames as user scrolls
4. Intersection Observer detects when video section enters viewport
5. requestAnimationFrame syncs canvas drawing to scroll position

**File Structure:**
```
site/
├── public/
│   ├── video/
│   │   └── hero-source.mp4 (25MB, not deployed)
│   └── frames/
│       ├── frame-0001.webp
│       ├── frame-0002.webp
│       └── ... (240 frames for 10s @ 24fps)
├── src/
│   ├── components/
│   │   └── ScrollVideo.astro
│   └── scripts/
│       └── scroll-video.js (vanilla JS)
└── scripts/
    └── extract-frames.sh (ffmpeg wrapper)
```

## Video Processing Pipeline

### Step 1: Frame Extraction

**Command:**
```bash
ffmpeg -i hero-source.mp4 -vf fps=24 -q:v 1 frame-%04d.jpg
```

**Why this approach:**
- `fps=24`: Maintain source frame rate (smooth scrubbing)
- `-q:v 1`: Highest JPEG quality for intermediate frames
- `%04d`: Zero-padded numbering (frame-0001, frame-0002...)

### Step 2: WebP Conversion

**Command:**
```bash
for file in frame-*.jpg; do
  ffmpeg -i "$file" -quality 80 -resize 1920x1080 "${file%.jpg}.webp"
done
```

**Why this approach:**
- `quality 80`: Optimal balance (imperceptible quality loss, 25-34% smaller than JPEG)
- `resize 1920x1080`: Desktop-appropriate resolution (1928x1072 source close enough)
- WebP animated format (`img2webp`) NOT used - individual frames allow selective loading

**Expected output:**
- 240 frames (10s × 24fps)
- ~50-80KB per WebP frame
- Total sequence: ~12-19MB (vs 25MB source video)
- First 15 frames: ~750KB-1.2MB (preload budget)

### Step 3: Mobile-Optimized Variant (Optional but Recommended)

**Command:**
```bash
for file in frame-*.jpg; do
  ffmpeg -i "$file" -quality 75 -resize 960x540 "mobile-${file%.jpg}.webp"
done
```

**Why:**
- 960x540 appropriate for mobile screens
- ~20-30KB per frame
- Total mobile sequence: ~5-7MB
- Serve via media query or user agent detection

## Scroll Synchronization Implementation

### Approach: Canvas + Image Sequence

**Why NOT video.currentTime approach:**
- Video seek has 250-500ms latency per frame
- Requires keyframe=1 encoding (bloats file size or reduces quality)
- Backward scrubbing unreliable
- Frame drops on mobile devices

**Why Canvas + Image Sequence:**
- Zero latency frame switching
- Precise scroll-to-frame mapping
- Reliable backward/forward scrubbing
- Consistent performance across devices

### Technical Architecture

**1. Preload Critical Frames**
```javascript
// Preload first 15 frames (above-fold, ~1MB budget)
const preloadFrames = Array.from({length: 15}, (_, i) => {
  const img = new Image();
  img.src = `/esoterica/frames/frame-${String(i+1).padStart(4, '0')}.webp`;
  return img;
});
```

**2. Lazy Load Remaining Frames**
```javascript
// Load on demand as user scrolls
const lazyLoadFrame = (index) => {
  if (!frameCache[index]) {
    frameCache[index] = new Image();
    frameCache[index].src = `/esoterica/frames/frame-${String(index+1).padStart(4, '0')}.webp`;
  }
  return frameCache[index];
};
```

**3. Intersection Observer Setup**
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Start scroll sync
      window.addEventListener('scroll', handleScroll, {passive: true});
    } else {
      // Pause when off-screen
      window.removeEventListener('scroll', handleScroll);
    }
  });
}, {threshold: 0.1});

observer.observe(canvasElement);
```

**4. Scroll-to-Frame Mapping**
```javascript
let ticking = false;

const handleScroll = () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const scrollTop = window.scrollY;
      const scrollHeight = videoSection.offsetHeight;
      const progress = Math.min(Math.max(scrollTop / scrollHeight, 0), 1);

      const frameIndex = Math.floor(progress * (totalFrames - 1));
      const frame = lazyLoadFrame(frameIndex);

      if (frame.complete) {
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
      }

      ticking = false;
    });
    ticking = true;
  }
};
```

**Why this implementation:**
- `passive: true`: Allows browser to optimize scroll performance
- requestAnimationFrame: Syncs drawing with browser paint cycle (60fps max)
- Ticking flag: Prevents multiple rAF calls per frame
- Intersection Observer: Only processes scroll when video visible

## Mobile Performance Considerations

### Responsive Loading Strategy

**Approach:**
```javascript
const isMobile = window.matchMedia('(max-width: 768px)').matches;
const framePrefix = isMobile ? 'mobile-frame-' : 'frame-';
const totalFrames = 240; // Same count, different resolution
```

**Why:**
- Serve 960x540 to mobile, 1920x1080 to desktop
- Reduces mobile bandwidth by ~60%
- Maintains same frame count (consistent scroll experience)

### Preload Budget Optimization

**Desktop:** Preload 15 frames (~1MB)
**Mobile:** Preload 10 frames (~300KB)

**Why:**
- Mobile networks slower, smaller preload critical
- Smaller screen needs fewer pixels loaded immediately
- Lazy loading covers the rest efficiently

### Intersection Observer Threshold

**Desktop:** `threshold: 0.1` (trigger when 10% visible)
**Mobile:** `threshold: 0.2` (trigger when 20% visible)

**Why:**
- Mobile viewport smaller, 20% gives more load time
- Reduces likelihood of janky first frames

## GitHub Pages Asset Hosting

### Recommendations

**DO:**
- ✅ Host image sequence in repository (12-19MB acceptable for static assets)
- ✅ Commit extracted frames to `site/public/frames/`
- ✅ Include frames in Astro build output (`docs/` directory)
- ✅ Leverage GitHub's CDN for frame delivery

**DO NOT:**
- ❌ Commit source 25MB video to repository
- ❌ Use GitHub Issues for video hosting (workaround, not reliable)
- ❌ Exceed 1GB repository size limit (12-19MB frames well within)

**Why this approach works:**
- GitHub Pages soft limit: 100GB bandwidth/month
- 240 frames × ~70KB = ~17MB per full sequence view
- ~5,880 full video views per month before soft limit
- Realistic traffic: <1,000 views/month = well within limits

**Alternative if traffic exceeds GitHub limits:**
- Cloudflare Pages (unlimited bandwidth, same static hosting)
- Cloudinary (optimized image delivery, has free tier)
- Not needed for typical landing page traffic

## Compression Settings Deep Dive

### ffmpeg H.264 Settings (Fallback Video)

**If you need MP4 fallback:**
```bash
ffmpeg -i hero-source.mp4 \
  -c:v libx264 \
  -crf 23 \
  -preset medium \
  -movflags +faststart \
  -an \
  -vf scale=1920:1080 \
  hero-optimized.mp4
```

**Settings explained:**
- `libx264`: H.264 codec (universal browser support)
- `crf 23`: Constant Rate Factor (sweet spot for web, 18-28 range)
- `preset medium`: Balance of encoding speed and compression
- `movflags +faststart`: Moves metadata to file start (enables streaming playback)
- `-an`: Removes audio track (videos should autoplay silently)
- `scale=1920:1080`: Web-appropriate resolution

**Expected result:** 3-5MB MP4 (vs 25MB source)

### WebP Quality Settings by Use Case

| Use Case | Quality | File Size (per frame) | Total Sequence | Visual Quality |
|----------|---------|----------------------|----------------|----------------|
| Desktop standard | 80 | ~70KB | ~17MB | Imperceptible loss |
| Desktop high-quality | 90 | ~120KB | ~29MB | Near-lossless |
| Mobile standard | 75 | ~30KB | ~7MB | Appropriate for small screens |
| Mobile low-bandwidth | 65 | ~20KB | ~5MB | Minor artifacts, acceptable |

**Recommendation:** Start with quality 80 for desktop, 75 for mobile. Test on actual devices.

### Why NOT VP9/WebM or AVIF

**VP9/WebM:**
- Excellent compression (30% better than H.264)
- 2-pass encoding slow for 240 individual frames
- WebP simpler for static frame extraction

**AVIF:**
- Best compression (50% smaller than JPEG)
- Encoding extremely slow (not practical for 240 frames)
- Browser support still maturing (Safari 16.4+, not universal)
- WebP offers better speed-to-compression trade-off

## Illustration Integration (Secondary Feature)

### Gateway Process-Style Illustrations

**Format recommendation:**
- SVG for geometric/abstract illustrations (scalable, small file size)
- WebP for raster/photographic illustrations (quality + compression)

**Integration:**
```astro
---
import { Image } from 'astro:assets';
import illustration from '../assets/gateway-process-1.webp';
---

<Image
  src={illustration}
  alt="Gateway Process illustration"
  loading="lazy"
  widths={[400, 800, 1200]}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

**Why:**
- Astro Image component handles optimization automatically
- Sharp (already installed) generates responsive variants
- `loading="lazy"`: Defers off-screen images
- `sizes`: Browser selects appropriate resolution

**No additional stack changes needed** - existing Astro + Sharp setup handles this perfectly.

## Alternative Approaches Considered

### Rejected: Video Element with currentTime

**Why rejected:**
- 250-500ms seek latency per frame (source: [Behind the scenes of an award-winning web page](https://medium.com/swissquote-engineering/behind-the-scene-of-an-award-winning-web-page-c93b5349ec4a))
- Requires keyframe=1 encoding (bloats file or reduces quality)
- Unreliable backward scrubbing
- Frame drops on mid-range devices
- Not used by Apple or high-end product pages

### Rejected: GSAP ScrollTrigger

**Why rejected:**
- 48KB library for single feature
- Adds dependency to zero-dependency site
- Native Intersection Observer + rAF achieve same result
- GSAP best for complex multi-timeline animations (not needed here)

**When GSAP makes sense:**
- Multiple coordinated scroll animations
- Timeline sequencing
- Advanced easing functions
- This project: single video scrub, native APIs sufficient

### Rejected: WebCodecs API

**Why rejected:**
- Cutting-edge API (limited browser support)
- Complexity overhead (frame decoding, memory management)
- Better performance than video.currentTime, but canvas+images simpler
- Requires video codec knowledge

**When WebCodecs makes sense:**
- Very large frame counts (1000+ frames)
- Real-time video manipulation
- Advanced use cases beyond simple scroll scrub

### Rejected: Animated WebP Single File

**Why rejected:**
- img2webp creates single animated file from sequence
- Cannot selectively load frames (all-or-nothing download)
- No control over which frame displays (relies on playback)
- Preloading strategy impossible

**When animated WebP makes sense:**
- Small looping animations (GIF replacement)
- Autoplay animations
- Not scroll-driven content

## Implementation Checklist

- [ ] Install ffmpeg on build machine
- [ ] Create `site/scripts/extract-frames.sh` script
- [ ] Extract frames from source video (240 WebP files)
- [ ] Create mobile-optimized frame set (optional but recommended)
- [ ] Add frames to `site/public/frames/` directory
- [ ] Create `ScrollVideo.astro` component with canvas element
- [ ] Create `scroll-video.js` with Intersection Observer + rAF
- [ ] Implement preload for first 10-15 frames
- [ ] Implement lazy loading for remaining frames
- [ ] Test on mobile devices (iOS Safari, Android Chrome)
- [ ] Verify frame scrubbing smoothness
- [ ] Check GitHub Pages bandwidth usage
- [ ] Add fallback for non-canvas browsers (static poster image)

## Browser Compatibility

| Feature | Chrome | Safari | Firefox | Edge | Notes |
|---------|--------|--------|---------|------|-------|
| Canvas API | 4+ | 3.1+ | 3.6+ | 12+ | Universal support |
| Intersection Observer | 51+ | 12.1+ | 55+ | 15+ | [Baseline since 2019](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) |
| requestAnimationFrame | 24+ | 6.1+ | 23+ | 10+ | Universal support |
| WebP | 32+ | 14+ | 65+ | 18+ | [97%+ global support](https://caniuse.com/webp) |
| Passive listeners | 51+ | 10+ | 49+ | 79+ | Falls back gracefully |

**Minimum browser support:** All modern browsers from 2019+

**Fallback strategy:**
```javascript
if (!('IntersectionObserver' in window)) {
  // Show static poster image
  canvasElement.style.display = 'none';
  posterImage.style.display = 'block';
}
```

## Performance Benchmarks

**Expected performance (real-world):**

| Metric | Desktop | Mobile | Notes |
|--------|---------|--------|-------|
| Initial load (preload) | ~1MB (15 frames) | ~300KB (10 frames) | First contentful paint |
| Full sequence load | ~17MB (240 frames) | ~7MB (240 frames) | Lazy-loaded progressively |
| Frame switching latency | <16ms (60fps) | <33ms (30fps) | Canvas draw time |
| Scroll smoothness | 60fps | 30-60fps | Device-dependent |
| Memory usage | ~50-80MB | ~20-30MB | Decoded image cache |

**Optimization notes:**
- Canvas operates at 60fps on modern desktops
- Mobile may throttle to 30fps (still smooth)
- requestAnimationFrame prevents overdraw
- Passive scroll listeners enable compositor-side scrolling

## Cost Analysis

**Build-time cost:**
- ffmpeg frame extraction: ~30 seconds (one-time)
- WebP conversion: ~2 minutes for 240 frames (one-time)
- Mobile variant: +2 minutes (one-time, optional)

**Runtime cost:**
- Initial page load: +1MB (desktop) / +300KB (mobile)
- Full interaction: +17MB (desktop) / +7MB (mobile)
- CPU usage: Minimal (canvas draws are hardware-accelerated)
- Memory: Moderate (~50MB peak on desktop)

**Developer experience:**
- No new frameworks to learn
- Vanilla JavaScript (maintainable, clear)
- ffmpeg scripts (standard, well-documented)
- Astro integration (no build changes needed)

## Monitoring & Validation

**Key metrics to track:**
- Largest Contentful Paint (LCP) - should remain <2.5s
- First Input Delay (FID) - scroll responsiveness
- Cumulative Layout Shift (CLS) - canvas sizing stable
- GitHub Pages bandwidth usage - monitor in repo settings

**Validation tests:**
- Lighthouse performance audit (target: 90+ score)
- WebPageTest on 3G connection (mobile experience)
- Cross-browser testing (Chrome, Safari, Firefox, Edge)
- Device testing (iPhone, Android, desktop)

## Sources & References

### Technical Documentation
- [Intersection Observer API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [Canvas API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [WebP Format - Google Developers](https://developers.google.com/speed/webp)

### Implementation Patterns
- [Scroll Effects on Videos with JavaScript](https://blog.openreplay.com/scroll-effects-on-videos-with-javascript/)
- [Scroll-Driven Image Sequence Animation](https://dev.to/pipscript/creating-a-png-sequence-animation-using-react-and-scss-k71)
- [Behind the scenes of an award-winning web page](https://medium.com/swissquote-engineering/behind-the-scene-of-an-award-winning-web-page-c93b5349ec4a)

### Video Compression
- [Creating web optimized video with ffmpeg - Pixel Point](https://pixelpoint.io/blog/web-optimized-video-ffmpeg/)
- [How to Extract Images from a Video Using FFmpeg - Bannerbear](https://www.bannerbear.com/blog/how-to-extract-images-from-a-video-using-ffmpeg/)
- [Use FFmpeg to extract frames from video - Shotstack](https://shotstack.io/learn/ffmpeg-extract-frames/)

### Performance Optimization
- [Handling Scroll Events Efficiently with Passive Listeners](https://medium.com/@AlexanderObregon/handling-scroll-events-efficiently-with-passive-listeners-in-javascript-bd7d463a5871)
- [Lazy loading - MDN Performance Guide](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Lazy_loading)
- [Mobile Video Optimization Guide](https://motioncue.com/mobile-video-optimization/)

### Hosting Considerations
- [GitHub Pages Best Practices - Kinsta](https://kinsta.com/blog/github-pages/)
- [How to embed videos in GitHub pages without growing repository](https://www.cazzulino.com/github-pages-embed-video.html)

## Confidence Assessment

| Area | Confidence | Justification |
|------|------------|--------------|
| Canvas approach | HIGH | Multiple authoritative sources confirm superior performance vs video element |
| WebP format | HIGH | Official Google documentation, browser support data from caniuse.com |
| ffmpeg commands | HIGH | Official ffmpeg documentation, verified community tutorials |
| Native APIs | HIGH | MDN documentation, Baseline features since 2019 |
| GitHub Pages hosting | MEDIUM | Calculated from documented limits, but traffic assumptions need validation |
| Mobile performance | MEDIUM | Based on general best practices, actual device testing required |

## Next Steps for Implementation

1. **Prototype first** - Test frame extraction and canvas rendering with 24 frames (1 second) before processing full 10-second video
2. **Measure actual file sizes** - Quality settings may need adjustment based on content characteristics
3. **Device test early** - Validate performance on target devices (iPhone, Android) before committing to full sequence
4. **Monitor bandwidth** - Track GitHub Pages usage in first month to validate hosting assumptions
5. **Consider CDN later** - If traffic exceeds 5,000 views/month, evaluate Cloudflare Pages or dedicated image CDN

## Summary: What Gets Added

**Build dependencies:**
- ffmpeg (system install, not npm)

**Runtime dependencies:**
- None (zero new npm packages)

**New files:**
- `site/scripts/extract-frames.sh` (build script)
- `site/src/components/ScrollVideo.astro` (component)
- `site/src/scripts/scroll-video.js` (vanilla JS)
- `site/public/frames/` (240 WebP files, ~17MB)

**Total added weight:**
- Initial load: +1MB (preloaded frames)
- Full experience: +17MB (lazy-loaded)
- Bundle size: +0KB (vanilla JS, no libraries)

**Development effort:**
- Frame extraction setup: 1-2 hours
- Component implementation: 2-4 hours
- Testing and refinement: 2-4 hours
- Total: 1 day for experienced developer
