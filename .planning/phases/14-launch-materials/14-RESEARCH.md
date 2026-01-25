# Phase 14: Launch Materials - Research

**Researched:** 2026-01-25
**Domain:** Product launch marketing, social media content creation, demo video production
**Confidence:** MEDIUM

## Summary

Launch materials for developer tools in 2026 emphasize authenticity over polish, with LinkedIn as the primary B2B platform for technical product announcements. The research covers four key areas: LinkedIn post strategy (teaser + announcement sequence), imagery generation from existing assets, open graph meta tag implementation, and demo GIF/video creation.

LinkedIn's algorithm in 2026 favors meaningful engagement over vanity metrics, with carousel posts (via PDF upload) achieving 3x higher engagement than single images. The platform discontinued native multi-image carousels in 2024, so PDF carousels (1080x1350px, 6-10 slides) are now standard. Posts should frontload value in the first 140 characters due to mobile "see more" cutoff, with optimal length of 1,300-1,600 characters using strategic line breaks for readability.

For demo content, the standard is 60-90 second videos with the first 15 seconds being critical for retention. Tools like Kap (open-source, Mac), FFmpeg (command-line), and ezgif (web-based) handle screen recording and GIF conversion. Open graph images follow the 1200x630px standard with specific meta tag structure for optimal social sharing.

**Primary recommendation:** Use PDF carousel format for LinkedIn announcement with 6-8 slides, frontload hook in first 140 characters, create 60-90 second demo GIF using existing screen recording tools, and implement complete open graph meta tags with existing 1200x630px OG image.

## Standard Stack

The established tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Sharp | Latest | Image processing/resizing | Already in project, fast Node.js image manipulation |
| FFmpeg | 6.x+ | Screen recording to GIF conversion | Industry standard for video/GIF processing, command-line |
| HTML meta tags | N/A | Open Graph implementation | Native web standard, no library needed |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Kap | Latest | Mac screen recording | Open-source, developer-friendly, exports to multiple formats |
| ezgif | Web-based | Online GIF optimization | No install needed, good for one-off conversions |
| Canva | Web-based | PDF carousel design | Quick slide creation if not coding slides |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| FFmpeg CLI | gifski | Smaller file sizes, less control over palette |
| Kap | LICEcap | Simpler but fewer export formats, older tool |
| PDF carousel | Single image | 3x less engagement according to 2026 data |
| Sharp | ImageMagick | Sharp already in project, faster for Node.js |

**Installation:**
```bash
# Already in project
npm install sharp

# System tools (Mac)
brew install ffmpeg kap

# Or use web-based tools (ezgif.com, canva.com) - no install
```

## Architecture Patterns

### Recommended Asset Structure
```
brand/
├── social/                    # Existing social assets
│   ├── og-image.png          # 1200x630 (already exists)
│   ├── linkedin.png          # 1200x627 (already exists)
│   └── ...
├── launch/                    # New launch materials
│   ├── linkedin-teaser.pdf   # 6-8 slides, 1080x1350px each
│   ├── linkedin-announce.pdf # 6-8 slides, 1080x1350px each
│   └── demo.gif              # 60-90s, optimized <5MB
└── scripts/
    └── generate-launch-assets.ts  # Automation script
```

### Pattern 1: LinkedIn Two-Post Launch Sequence
**What:** Teaser post 1-3 days before launch, full announcement on launch day
**When to use:** Creating anticipation for developer tool launches
**Structure:**

**Teaser Post (1-3 days before):**
- **Hook (first 140 chars):** Cryptic intrigue - "What if your AI agent could draw tarot cards for complex decisions?"
- **Body:** Brief tease of problem/solution without full reveal
- **CTA:** "More coming [date]" or "Watch this space"
- **Visual:** Single hero image or 3-slide PDF carousel (problem → hint → coming soon)
- **Timing:** Post during peak LinkedIn hours (morning for professional audiences)

**Announcement Post (launch day):**
- **Hook (first 140 chars):** Direct value statement - "Esoterica is live. Tarot readings for Claude agents."
- **Body (1,300-1,600 chars):**
  - What it is (1 sentence)
  - Why it matters (problem/insight)
  - How to use it (installation command)
  - Where to learn more (links)
- **Visual:** 6-8 slide PDF carousel showing wizard flow
- **CTA:** Clear installation command in both post and last slide

### Pattern 2: Open Graph Meta Tag Implementation
**What:** Complete meta tag structure for social sharing
**When to use:** Any page that will be shared on social media
**Example:**
```html
<!-- In <head> of docs/index.html -->
<meta property="og:title" content="Esoterica — Ancient patterns, new paths" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://[domain]/esoterica/" />
<meta property="og:image" content="https://[domain]/esoterica/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/png" />
<meta property="og:image:alt" content="Esoterica tarot reading interface in Joshua Tree setting" />
<meta property="og:description" content="A tarot reading skill for Claude agents. Draw cards, interpret archetypes, shift perspectives on complex decisions." />
<meta property="og:site_name" content="Esoterica" />

<!-- Twitter Card (additional) -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Esoterica — Ancient patterns, new paths" />
<meta name="twitter:description" content="A tarot reading skill for Claude agents. Draw cards, interpret archetypes, shift perspectives on complex decisions." />
<meta name="twitter:image" content="https://[domain]/esoterica/og-image.png" />
```

**Source:** [Open Graph Protocol specification](https://ogp.me/)

### Pattern 3: Demo GIF Creation Workflow
**What:** Screen recording → video → optimized GIF
**When to use:** Showing wizard flow or interactive features
**Workflow:**

1. **Record screen** (60-90 seconds max):
```bash
# Option A: Use Kap (GUI, Mac) - export to MP4
# Option B: Use QuickTime (Cmd+Shift+5) - saves as .mov
# Option C: Use FFmpeg directly
ffmpeg -f avfoundation -i "1:0" -t 90 -r 30 recording.mov
```

2. **Convert to optimized GIF** (two-pass with palette):
```bash
# Generate palette
ffmpeg -i recording.mov -vf "fps=10,scale=800:-1:flags=lanczos,palettegen" palette.png

# Create GIF using palette
ffmpeg -i recording.mov -i palette.png -filter_complex \
  "fps=10,scale=800:-1:flags=lanczos[x];[x][1:v]paletteuse" demo.gif
```

3. **Optimize file size** (if needed):
```bash
# Further reduce with gifsicle
gifsicle -O3 --lossy=80 demo.gif -o demo-optimized.gif
```

**Source:** [GIPHY Engineering - How to make GIFs with FFmpeg](https://engineering.giphy.com/how-to-make-gifs-with-ffmpeg/)

### Pattern 4: LinkedIn PDF Carousel Slide Design
**What:** Multi-slide PDF formatted for LinkedIn carousel
**When to use:** Announcement posts requiring multiple screens or steps
**Specifications:**
- **Size:** 1080x1350px per slide (4:5 portrait) or 1080x1080px (square)
- **Length:** 6-10 slides (sweet spot: 6-8)
- **File format:** PDF, PPTX, or DOCX
- **File size:** Under 100MB (typically <5MB)
- **Design:** Consistent with brand (Whole Earth aesthetic, New Spirit + Input Mono fonts)

**Content structure:**
1. Hook slide (the first 140 chars equivalent)
2. Problem statement
3. Solution overview
4. Key features (1-2 slides)
5. Demo screenshot or flow
6. Installation/CTA
7. (Optional) Additional resources

**Source:** [LinkedIn Carousels 2026 Guide](https://nealschaffer.com/linkedin-carousel/)

### Anti-Patterns to Avoid
- **Generic promotional copy:** LinkedIn's 2026 algorithm favors authentic expertise over marketing speak. Use developer voice.
- **Dense text blocks:** Mobile "see more" cutoff at 140 chars means frontloading is critical. Don't bury the lead.
- **Low-quality GIFs:** Unoptimized screen recordings create 50MB+ files. Always use palette generation for GIFs.
- **Missing og:image dimensions:** Without width/height meta tags, platforms may not display images correctly.
- **Native multi-image posts:** LinkedIn discontinued this format in 2024. Use PDF carousels instead.
- **Long demo videos:** Attention drops after 90 seconds. First 15 seconds are critical for retention.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| GIF optimization | Custom palette generator | FFmpeg palettegen + paletteuse | Industry-standard, handles color quantization correctly |
| Image resizing | Manual Photoshop exports | Sharp (already in project) | Automated, consistent, fast batch processing |
| OG tag validation | Manual testing in social platforms | metatags.io or Facebook Debugger | Shows exactly what platforms will display, catches errors |
| LinkedIn carousel creation | Custom slide generator | Canva or Figma → Export PDF | Design tools handle layout better, faster iteration |
| Screen recording | Browser-based recorders | Kap or QuickTime (native Mac) | Better quality, more control, local processing |

**Key insight:** Launch materials involve many small technical details (image dimensions, meta tag order, GIF palette optimization). Using established tools prevents edge cases and ensures compatibility across platforms. The existing project already has Sharp for image processing - extend that pattern rather than adding new dependencies.

## Common Pitfalls

### Pitfall 1: LinkedIn Mobile "See More" Cutoff
**What goes wrong:** Key message buried after 140 characters, users scroll past without engaging
**Why it happens:** Desktop view shows more text, easy to miss mobile truncation during drafting
**How to avoid:** Write hook first, ensure it works standalone, test on mobile device
**Warning signs:** Engagement metrics low despite good content, comments asking "what is this?"

### Pitfall 2: Unoptimized Demo GIFs
**What goes wrong:** 50MB+ file sizes, slow loading, platforms reject or compress poorly
**Why it happens:** Direct screen recording to GIF without palette optimization
**How to avoid:** Always use two-pass FFmpeg conversion (palettegen → paletteuse), reduce frame rate to 10fps, scale to 800px width max
**Warning signs:** Files over 10MB, color banding, slow upload times

### Pitfall 3: Missing Open Graph Dimensions
**What goes wrong:** Social platforms display broken images or wrong aspect ratios
**Why it happens:** Only including og:image URL without width/height meta tags
**How to avoid:** Always include og:image:width and og:image:height (1200 and 630 for standard OG images)
**Warning signs:** LinkedIn/Twitter shows blank preview or crops image incorrectly

### Pitfall 4: Teaser Without Clear Follow-up Date
**What goes wrong:** Audience interest dissipates, teaser feels like incomplete content
**Why it happens:** Building anticipation without anchoring to specific launch timing
**How to avoid:** Include explicit date in teaser ("Launching January 28"), schedule announcement post in advance
**Warning signs:** Teaser gets engagement but announcement post flops

### Pitfall 5: PDF Carousel File Format Issues
**What goes wrong:** LinkedIn rejects upload or displays slides incorrectly
**Why it happens:** Using unsupported format (JPG sequence) instead of PDF/PPTX/DOCX, wrong dimensions
**How to avoid:** Export as PDF with 1080x1350px slides, test upload before scheduled post time
**Warning signs:** Upload fails with generic error, slides appear cropped

### Pitfall 6: Demo Shows Too Much Too Fast
**What goes wrong:** Users can't follow the flow, demo feels overwhelming
**Why it happens:** Recording full feature set instead of focused wizard path
**How to avoid:** Script the demo - show single focused flow (e.g., just the 3-card reading), add pauses between steps, reduce playback speed if needed
**Warning signs:** Demo GIF is 90+ seconds but still feels rushed, feedback is "I don't understand what this does"

## Code Examples

Verified patterns from official sources:

### Generate LinkedIn-Optimized Images from Existing Assets
```typescript
// Source: Existing brand/scripts/generate-social-assets.ts + Sharp docs
import sharp from "sharp";
import path from "path";

interface CarouselSlide {
  text: string;
  imagePath?: string;
  position: 'top' | 'bottom' | 'center';
}

async function generateLinkedInCarouselSlides(slides: CarouselSlide[]) {
  const SLIDE_WIDTH = 1080;
  const SLIDE_HEIGHT = 1350; // 4:5 portrait ratio
  const outputDir = path.resolve(__dirname, "../brand/launch");

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const outputPath = path.join(outputDir, `linkedin-slide-${i + 1}.png`);

    // Create base slide with brand background
    let image = sharp({
      create: {
        width: SLIDE_WIDTH,
        height: SLIDE_HEIGHT,
        channels: 4,
        background: { r: 250, g: 249, b: 246, alpha: 1 } // --bg-page from design system
      }
    });

    // If slide includes image, composite it
    if (slide.imagePath) {
      const heroImage = await sharp(slide.imagePath)
        .resize(SLIDE_WIDTH, Math.floor(SLIDE_HEIGHT * 0.6), {
          fit: "cover",
          position: "attention"
        })
        .toBuffer();

      image = image.composite([{
        input: heroImage,
        top: slide.position === 'top' ? 0 : SLIDE_HEIGHT - Math.floor(SLIDE_HEIGHT * 0.6),
        left: 0
      }]);
    }

    // Note: Text overlay requires additional library (e.g., node-canvas)
    // For production, use Figma/Canva for text layout, then process with Sharp

    await image
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(outputPath);

    console.log(`Generated slide ${i + 1}: ${outputPath}`);
  }
}

// Example usage
const announcementSlides: CarouselSlide[] = [
  { text: "Esoterica is live.\nTarot readings for Claude agents.", position: 'center' },
  { text: "Draw cards for complex decisions", imagePath: "./docs/hero-primary.png", position: 'top' },
  { text: "npm install -g esoterica", position: 'center' },
  // ... more slides
];

generateLinkedInCarouselSlides(announcementSlides);
```

### Open Graph Meta Tags (Complete Implementation)
```html
<!-- Source: https://ogp.me/ + https://myogimage.com/blog/og-image-size-meta-tags-complete-guide -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Required Open Graph Properties -->
  <meta property="og:title" content="Esoterica — Ancient patterns, new paths" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://example.com/esoterica/" />
  <meta property="og:image" content="https://example.com/esoterica/og-image.png" />

  <!-- Strongly Recommended OG Properties -->
  <meta property="og:description" content="A tarot reading skill for Claude agents. Draw cards, interpret archetypes, shift perspectives on complex decisions." />
  <meta property="og:site_name" content="Esoterica" />
  <meta property="og:locale" content="en_US" />

  <!-- Image Details (prevents cropping issues) -->
  <meta property="og:image:url" content="https://example.com/esoterica/og-image.png" />
  <meta property="og:image:secure_url" content="https://example.com/esoterica/og-image.png" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Sacred altar in Joshua Tree with tarot cards and crystal-computer displaying esoterica interface" />

  <!-- Twitter Card (uses OG as fallback but specific tags improve display) -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Esoterica — Ancient patterns, new paths" />
  <meta name="twitter:description" content="A tarot reading skill for Claude agents. Draw cards, interpret archetypes, shift perspectives on complex decisions." />
  <meta name="twitter:image" content="https://example.com/esoterica/og-image.png" />
  <meta name="twitter:image:alt" content="Sacred altar in Joshua Tree with tarot cards and crystal-computer" />

  <title>Esoterica — Ancient patterns, new paths</title>
</head>
<body>
  <!-- Page content -->
</body>
</html>
```

### FFmpeg Demo GIF Creation Script
```bash
#!/bin/bash
# Source: https://engineering.giphy.com/how-to-make-gifs-with-ffmpeg/
# Source: https://www.bannerbear.com/blog/how-to-make-a-gif-from-a-video-using-ffmpeg/

INPUT="demo-recording.mov"
OUTPUT="demo.gif"
FPS=10           # Lower FPS = smaller file size
WIDTH=800        # Max width in pixels (-1 preserves aspect ratio)

# Step 1: Generate optimized color palette from video
echo "Generating palette..."
ffmpeg -i "$INPUT" \
  -vf "fps=$FPS,scale=$WIDTH:-1:flags=lanczos,palettegen=stats_mode=diff" \
  -y palette.png

# Step 2: Create GIF using the palette
echo "Creating GIF..."
ffmpeg -i "$INPUT" -i palette.png \
  -filter_complex "[0:v]fps=$FPS,scale=$WIDTH:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5" \
  -y "$OUTPUT"

# Step 3: Optimize with gifsicle (if installed)
if command -v gifsicle &> /dev/null; then
  echo "Optimizing with gifsicle..."
  gifsicle -O3 --lossy=80 "$OUTPUT" -o "${OUTPUT%.gif}-optimized.gif"
  echo "Final optimized GIF: ${OUTPUT%.gif}-optimized.gif"
else
  echo "Final GIF: $OUTPUT (install gifsicle for further optimization)"
fi

# Cleanup
rm palette.png

echo "Done! File size:"
ls -lh "$OUTPUT" 2>/dev/null || ls -lh "${OUTPUT%.gif}-optimized.gif"
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Native multi-image carousels | PDF/PPTX carousel uploads | December 2023 | Must export slides as documents, not individual images |
| Generic marketing copy | Authentic expertise sharing | 2025-2026 algorithm update | Posts need developer voice, not SaaS marketing speak |
| 3000-char LinkedIn posts | 1,300-1,600 chars with frontloaded hook | Ongoing (mobile-first) | First 140 characters determine success |
| Static images | Interactive carousels (PDF) | 2024-2026 | 3x engagement improvement for carousels |
| Large video files for demos | Optimized GIFs <5MB | Ongoing | Faster loading, works inline without play button |
| Manual OG tag testing | Automated validators | Ongoing | Tools like metatags.io catch errors before publishing |

**Deprecated/outdated:**
- **LinkedIn native multi-image posts:** Discontinued December 2023. Must use PDF carousel instead.
- **Twitter name:** Now "X" but "Twitter Card" meta tags still use twitter: namespace (unchanged as of 2026).
- **Old FFmpeg GIF method:** Direct conversion without palettegen creates large, low-quality GIFs. Always use two-pass method.

## User Direction

**Use Remotion for demo video:** User specified Remotion (React-based programmatic video framework) instead of screen recording + FFmpeg. Benefits:
- Video as code - reproducible, version-controlled
- React components for consistent branding (New Spirit font, colors)
- Smooth animations without screen recording artifacts
- Export to MP4, GIF, or WebM
- Easy iteration on timing and content
- No manual recording required

This replaces the FFmpeg-based GIF workflow in Pattern 3. The Remotion composition would render the wizard flow programmatically rather than capturing screen recordings.

## Open Questions

Things that couldn't be fully resolved:

1. **Replicate API imagery for LinkedIn**
   - What we know: Phase 12 established Replicate.com workflow with Nano Banana Pro model for generating brand imagery
   - What's unclear: Whether to generate new LinkedIn-specific imagery or reuse/crop existing hero-primary.png (7.1M file)
   - Recommendation: Start with existing hero-primary.png cropped to carousel slides (already 1080px width compatible). Generate new imagery only if specific LinkedIn content needs different composition than hero image. Existing image matches brand perfectly.

2. **Demo video scope - full wizard vs. single reading**
   - What we know: Requirement says "demo GIF or video shows wizard flow", 60-90 second standard
   - What's unclear: Does "wizard flow" mean end-to-end (install → run → interpret) or just the card drawing interaction?
   - Recommendation: Show focused 60-second flow: command invocation → card draw animation → interpretation display → closing. Exclude installation/setup (that's for docs). First 15 seconds should show the most compelling visual (card draw).

3. **LinkedIn teaser vs announcement timing**
   - What we know: Industry pattern is 1-3 days between teaser and announcement, builds anticipation
   - What's unclear: For developer tools (less hype-driven), is teaser necessary or just go straight to announcement?
   - Recommendation: For Esoterica's niche audience, single strong announcement post may outperform teaser sequence. Teaser makes sense if building waiting list or coordinating with specific event. Default to single launch post unless building pre-launch momentum.

4. **Voice consistency - technical vs mystical for LinkedIn**
   - What we know: Brand voice is "cosmic priestess energy" with dual-audience equality (developers + practitioners)
   - What's unclear: LinkedIn's professional context may skew more technical - should posts lean developer-focused?
   - Recommendation: Keep the mystical. LinkedIn in 2026 rewards authentic voice over generic B2B speak. Lead with intrigue ("What if your AI agent could draw tarot cards?") then explain technical implementation. The mystique is the differentiator.

## Sources

### Primary (HIGH confidence)
- [Open Graph Protocol specification](https://ogp.me/) - Official OG meta tag documentation
- [LinkedIn Carousels 2026 Complete Guide](https://nealschaffer.com/linkedin-carousel/) - Current LinkedIn format requirements
- [LinkedIn Post Character Limits 2026](https://socialrails.com/blog/linkedin-post-character-limits) - Platform specs and best practices
- [OG Image Size Guide 2026](https://myogimage.com/blog/og-image-size-meta-tags-complete-guide) - Image dimensions and meta tag specs
- [GIPHY Engineering: How to make GIFs with FFmpeg](https://engineering.giphy.com/how-to-make-gifs-with-ffmpeg/) - Official palette generation technique
- Existing project files: `brand/scripts/generate-social-assets.ts`, `brand/DESIGN_PROMPT.md`, `.planning/phases/12-visual-language/12-CONTEXT.md`

### Secondary (MEDIUM confidence)
- [LinkedIn Marketing in 2026: New Tools and Tactics](https://thebusinesstycoonmagazine.com/linkedin-marketing-in-2026-new-tools-and-tactics/) - Algorithm behavior (verified across multiple sources)
- [How to Build a Developer LinkedIn Presence in 2026](https://columncontent.com/developer-linkedin-presence/) - Developer-specific best practices
- [Creating the Perfect Software Product Demo Video](https://hilomedia.com/blog/creating-the-perfect-software-product-demo-video/) - Demo video length recommendations (60-90s standard confirmed by multiple sources)
- [Kap - Capture your screen](https://getkap.co/) - Open-source screen recorder official site
- [Screen Recording to GIF workflow](https://www.baeldung.com/linux/gif-screen-recording) - Technical implementation patterns

### Secondary (MEDIUM confidence - continued)
- [LinkedIn Carousel Engagement Stats 2025](https://postnitro.ai/blog/post/linkedin-carousel-engagement-stats-2025) - 3x engagement data (verified by Socialinsider report)
- [FFmpeg: MP4 to GIF guide](https://shotstack.io/learn/convert-video-gif-ffmpeg/) - Two-pass conversion method
- [Meta Tags Validation Tools](https://metatags.io/) - Testing/validation recommendations
- [Social Media Marketing Trends 2026](https://www.heygen.com/blog/social-media-marketing-trends-2026-harnessing-innovation) - AI tool launch patterns
- [Proven Social Media Strategy for Product Launch](https://sociallyin.com/resources/social-media-strategy-for-product-launch/) - Teaser timing guidelines

### Tertiary (LOW confidence - marked for validation)
- WebSearch results on "AI Design Machine" - No authoritative source found. Interpreted from Phase 12 context as Replicate.com workflow with Nano Banana Pro model.
- Multiple blog sources on LinkedIn algorithm changes - Consistent patterns but no official LinkedIn documentation found for 2026 specifics.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Sharp already in project, FFmpeg is industry standard, OG tags are native HTML
- Architecture (LinkedIn strategy): MEDIUM - Based on multiple 2026 sources showing consistent patterns, but platform algorithms change frequently
- Architecture (technical specs): HIGH - OG image dimensions and carousel sizes are platform requirements, verified across official docs
- Pitfalls: MEDIUM - Common issues identified across multiple sources, but specific to 2026 ecosystem state
- Code examples: HIGH - FFmpeg commands from official GIPHY engineering blog, OG tags from official spec, Sharp patterns from existing project

**Research date:** 2026-01-25
**Valid until:** 2026-04-25 (90 days for stable technical specs like OG tags, 30 days for social platform algorithm behavior)

**Notes:**
- LinkedIn algorithm behavior is the fastest-moving area - carousel engagement data and character limits are stable, but what content performs well may shift
- Demo GIF technical specs are very stable (FFmpeg palette generation method unchanged for years)
- Open Graph specification is stable since 2010 with minor additions (og:image:alt added later)
- Existing project assets significantly reduce scope - no need to generate new social images, hero-primary.png already optimized
