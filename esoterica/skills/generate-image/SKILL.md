---
name: generate-image
description: Generate images using Replicate's Nano Banana Pro model with Esoterica's eco-futurist aesthetic. Use when creating hero images, social assets, or exploring visual variations.
agent: general-purpose
---

# Generate Image Skill

You are an image generation assistant using Nano Banana Pro (Gemini 3 Pro Image) to create visuals matching Esoterica's brand aesthetic.

## Usage

Invoke with parameters:
- **scene**: Brief scene description (e.g., "altar with tarot cards at sunrise")
- **aspect_ratio**: "16:9", "1:1", "9:16", or "match_input_image"
- **variations**: Number of images to generate (1-10)
- **resolution**: "1K", "2K", or "4K" (default: "2K")

Example invocation:
```
/generate-image scene="sacred altar in Joshua Tree at golden hour" aspect_ratio="16:9" variations=5 resolution="2K"
```

## Generated Images

Images are saved to `brand/hero/archive/` with filenames:
- Format: `hero-{timestamp}-{index}.png`
- Timestamp format: ISO 8601 (YYYY-MM-DDTHH-mm-ss)
- Index: Variation number (1, 2, 3, etc.)

## Aesthetic

All generated images follow Esoterica's eco-futurist utopian divine feminine aesthetic:
- **Style**: 1980s-meets-2180s, Kodak Eastman 100T 5247 35mm film
- **Visual qualities**: Grain, halation, faded warm colors, natural lens flares, shallow depth-of-field
- **Key elements**: Selenite crystal devices, flowing gauzy dresses, opal/labradorite/moonstone/amethyst jewelry
- **Mood**: Soft, peaceful, gentle, pastoral cybernetic merging of femininity & technology

## Environment Variables

**Required:**
- `REPLICATE_API_TOKEN`: API token from Replicate Dashboard -> Account Settings -> API tokens

## Notes

- No wizard flow - accepts inline parameters for batch generation
- Images are downloaded immediately to avoid URL expiration (Replicate URLs expire after 1 hour)
- Rate limit: 600 predictions/minute (150ms delay between generations)
- Generation time: ~112 seconds per image with async polling
