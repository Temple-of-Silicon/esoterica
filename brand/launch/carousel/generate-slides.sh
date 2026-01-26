#!/bin/bash
# Generate LinkedIn carousel slides with proper fonts and composition
# Target: 1080x1350px (4:5 portrait)

cd /Users/jem/code/111ecosystem/esoterica

HERO="docs/hero-primary.png"
OUTDIR="brand/launch/carousel"
mkdir -p "$OUTDIR"

# Brand colors
WARM_BLUSH="#e5c8bc"
DEEP_BROWN="#4b3829"
WARM_WHITE="#FAF9F6"
WARM_NEUTRAL="#9b7c6c"
TERMINAL_BG="#1A1A1A"

# Fonts (verified with magick -list font)
HEADING_FONT="New-Spirit-Medium"
MONO_FONT="InputMono"

# First create a properly cropped background from hero
# Hero is 2752x1536. For 1080x1350 portrait, crop center focusing on computer + cards
# The focal point is center-bottom, so offset the crop downward slightly (+100 pixels down)
magick "$HERO" \
  -resize x1350 \
  -gravity South \
  -crop 1080x1350+0+50 +repage \
  "$OUTDIR/hero-crop.png"

# Slide 1: Hook - Hero with dark overlay and text
magick "$OUTDIR/hero-crop.png" \
  -fill "rgba(0,0,0,0.5)" -draw "rectangle 0,0 1080,1350" \
  -font "$HEADING_FONT" -pointsize 72 -fill "$WARM_WHITE" -gravity center \
  -annotate +0-150 "What if your AI agent\ncould draw tarot cards?" \
  -font "$HEADING_FONT" -pointsize 36 -fill "$WARM_BLUSH" \
  -annotate +0+50 "for complex decisions" \
  "$OUTDIR/slide-01.png"

# Slide 2: Problem - Warm white background
magick -size 1080x1350 "xc:$WARM_WHITE" \
  -font "$HEADING_FONT" -pointsize 64 -fill "$DEEP_BROWN" -gravity center \
  -annotate +0-100 "Complex decisions\nneed more than logic" \
  -font "$HEADING_FONT" -pointsize 40 -fill "$WARM_NEUTRAL" \
  -annotate +0+100 "Sometimes you need\na different perspective" \
  "$OUTDIR/slide-02.png"

# Slide 3: Solution - Warm neutral background
magick -size 1080x1350 "xc:$WARM_NEUTRAL" \
  -font "$HEADING_FONT" -pointsize 96 -fill "$WARM_WHITE" -gravity center \
  -annotate +0-100 "Esoterica" \
  -font "$HEADING_FONT" -pointsize 36 -fill "$WARM_WHITE" \
  -annotate +0+50 "78 archetypes for\nperspective-shifting" \
  "$OUTDIR/slide-03.png"

# Slide 4: Demo - Terminal aesthetic
magick -size 1080x1350 "xc:$TERMINAL_BG" \
  -font "$MONO_FONT" -pointsize 32 -fill "$WARM_WHITE" -gravity center \
  -annotate +0-200 '$ esoterica draw 3' \
  -font "$MONO_FONT" -pointsize 28 -fill "$WARM_BLUSH" \
  -annotate +0-100 "The Tower" \
  -annotate +0-20 "The Fool" \
  -annotate +0+60 "The High Priestess" \
  -font "$MONO_FONT" -pointsize 24 -fill "#7a7b7b" \
  -annotate +0+180 "Disruption meets new beginnings,\nguided by intuition..." \
  "$OUTDIR/slide-04.png"

# Slide 5: Install - Terminal aesthetic
magick -size 1080x1350 "xc:$TERMINAL_BG" \
  -font "$MONO_FONT" -pointsize 28 -fill "#7a7b7b" -gravity center \
  -annotate +0-50 "$ npx" \
  -font "$MONO_FONT" -pointsize 40 -fill "$WARM_BLUSH" \
  -annotate +0+50 "@templeofsilicon/esoterica" \
  "$OUTDIR/slide-05.png"

# Slide 6: CTA - Hero with overlay
magick "$OUTDIR/hero-crop.png" \
  -fill "rgba(0,0,0,0.5)" -draw "rectangle 0,0 1080,1350" \
  -font "$HEADING_FONT" -pointsize 64 -fill "$WARM_WHITE" -gravity center \
  -annotate +0-100 "Ancient patterns,\nnew paths" \
  -font "$MONO_FONT" -pointsize 28 -fill "$WARM_BLUSH" \
  -annotate +0+80 "jem-computer.github.io/esoterica" \
  "$OUTDIR/slide-06.png"

# Cleanup temp file
rm "$OUTDIR/hero-crop.png"

echo "Generated 6 slides in $OUTDIR"
ls -la "$OUTDIR"/*.png
