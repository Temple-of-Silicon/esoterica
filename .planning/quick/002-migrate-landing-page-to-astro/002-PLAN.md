---
quick: 002
type: execute
wave: 1
files_modified:
  - site/astro.config.mjs
  - site/package.json
  - site/tsconfig.json
  - site/public/fonts/NewSpirit-Medium.woff2
  - site/public/fonts/NewSpirit-Medium.woff
  - site/public/favicon.svg
  - site/public/favicon-16x16.png
  - site/public/favicon-32x32.png
  - site/public/apple-touch-icon.png
  - site/public/og-image.png
  - site/src/assets/hero-primary.png
  - site/src/layouts/Base.astro
  - site/src/pages/index.astro
  - site/src/styles/global.css
  - docs/index.html
autonomous: true

must_haves:
  truths:
    - "Landing page renders identically to current static version"
    - "Hero image loads under 500KB (from 7MB original)"
    - "Dark/light theme toggle works with localStorage persistence"
    - "Copy button copies command to clipboard"
    - "Background works correctly on iOS Safari"
  artifacts:
    - path: "site/astro.config.mjs"
      provides: "Astro configuration with docs/ output"
    - path: "site/src/pages/index.astro"
      provides: "Main landing page component"
    - path: "docs/index.html"
      provides: "Built output for GitHub Pages"
  key_links:
    - from: "site/src/pages/index.astro"
      to: "site/src/assets/hero-primary.png"
      via: "astro:assets Image component"
      pattern: "import.*Image.*from.*astro:assets"
---

<objective>
Migrate the static landing page (docs/index.html) to Astro for image optimization and future docs extensibility.

Purpose: The hero image is 7MB which is unacceptable for web performance. Astro's built-in image optimization will compress this to <500KB while maintaining quality. The Astro structure also enables future documentation pages.

Output: Working Astro site in `site/` that builds to `docs/` with optimized images.
</objective>

<execution_context>
@/Users/jem/.claude/get-shit-done/workflows/execute-plan.md
@/Users/jem/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@docs/index.html (current static page - 534 lines)
</context>

<tasks>

<task type="auto">
  <name>Task 1: Initialize Astro project with correct configuration</name>
  <files>
    site/package.json
    site/astro.config.mjs
    site/tsconfig.json
  </files>
  <action>
Create Astro project in site/ directory:

1. Create site/package.json manually (do not run create-astro):
```json
{
  "name": "esoterica-site",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^5.0.0",
    "sharp": "^0.33.0"
  }
}
```

2. Create site/astro.config.mjs:
```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://jem-computer.github.io',
  base: '/esoterica',
  outDir: '../docs',
  build: {
    assets: '_assets'
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  }
});
```

3. Create site/tsconfig.json with Astro base config.

4. Run `npm install` in site/ directory.

5. Create directory structure:
   - site/public/
   - site/public/fonts/
   - site/src/
   - site/src/assets/
   - site/src/layouts/
   - site/src/pages/
   - site/src/styles/
  </action>
  <verify>
`ls site/node_modules/astro` shows astro installed
`ls site/node_modules/sharp` shows sharp installed
  </verify>
  <done>Astro project initialized with correct output configuration targeting docs/</done>
</task>

<task type="auto">
  <name>Task 2: Copy static assets and source image</name>
  <files>
    site/public/fonts/NewSpirit-Medium.woff2
    site/public/fonts/NewSpirit-Medium.woff
    site/public/favicon.svg
    site/public/favicon-16x16.png
    site/public/favicon-32x32.png
    site/public/apple-touch-icon.png
    site/public/og-image.png
    site/src/assets/hero-primary.png
  </files>
  <action>
Copy assets from docs/ to appropriate locations:

1. Copy fonts to public (served as-is):
   - cp docs/fonts/* site/public/fonts/

2. Copy favicons to public (served as-is):
   - cp docs/favicon.svg site/public/
   - cp docs/favicon-16x16.png site/public/
   - cp docs/favicon-32x32.png site/public/
   - cp docs/apple-touch-icon.png site/public/

3. Copy og-image to public (external URLs need original):
   - cp docs/og-image.png site/public/

4. Copy hero image to src/assets (for optimization):
   - cp docs/hero-primary.png site/src/assets/

Note: hero-primary.png goes to src/assets/ so Astro can optimize it.
og-image.png stays in public/ because OG tags require absolute URLs to the original.
  </action>
  <verify>
`ls -la site/public/fonts/` shows font files
`ls -la site/src/assets/` shows hero-primary.png (7MB source)
  </verify>
  <done>All static assets copied to correct locations for Astro processing</done>
</task>

<task type="auto">
  <name>Task 3: Create Astro components from existing HTML</name>
  <files>
    site/src/styles/global.css
    site/src/layouts/Base.astro
    site/src/pages/index.astro
  </files>
  <action>
Extract and convert docs/index.html to Astro components:

1. Create site/src/styles/global.css:
   - Extract all CSS from the style tag in index.html (lines 49-396)
   - Keep all CSS variables, themes, and responsive styles exactly as-is
   - Add iOS Safari fix for background-attachment:
     ```css
     @supports (-webkit-touch-callout: none) {
       .hero {
         background-attachment: scroll;
       }
     }
     ```

2. Create site/src/layouts/Base.astro:
   - Standard HTML5 doctype with lang="en" data-theme="light"
   - All meta tags from index.html (charset, viewport, description, OG, Twitter)
   - Favicon links (use Astro base path for URLs)
   - Google Fonts preconnect and link
   - Theme detection script in head (prevent FOUC)
   - Import global.css
   - Slot for page content

3. Create site/src/pages/index.astro:
   - Use Base layout
   - Import Image from 'astro:assets'
   - Import hero image: `import heroImage from '../assets/hero-primary.png'`
   - Use Image component for hero with optimization:
     ```astro
     <Image
       src={heroImage}
       alt="Sacred altar with tarot cards"
       width={1920}
       quality={80}
       format="webp"
       class="hero-bg"
     />
     ```
   - Convert hero section to use absolute positioned Image instead of CSS background
   - Keep all HTML structure from index.html
   - Add client-side script at bottom for theme toggle and copy button

Key changes from static version:
- Hero uses <Image> component instead of CSS background-image
- Hero structure: position: relative container, absolute positioned optimized image, content overlay
- All functionality (theme, copy) preserved via client-side script
  </action>
  <verify>
`cat site/src/pages/index.astro | grep "astro:assets"` shows Image import
`cat site/src/styles/global.css | grep "webkit-touch-callout"` shows iOS fix
  </verify>
  <done>Astro components created with optimized image handling and iOS Safari fix</done>
</task>

<task type="auto">
  <name>Task 4: Build and verify output</name>
  <files>
    docs/index.html
  </files>
  <action>
Build Astro site and verify:

1. Run build from site/ directory:
   ```bash
   cd site && npm run build
   ```

2. Check docs/ output:
   - docs/index.html should exist (new optimized version)
   - docs/_assets/ should contain optimized hero image
   - Optimized hero should be <500KB (from 7MB original)

3. Check image optimization:
   ```bash
   ls -la docs/_assets/*.webp
   ```
   Should show webp version well under 500KB.

4. Preview locally to verify:
   ```bash
   cd site && npm run preview
   ```
   Open http://localhost:4321/esoterica/ and verify:
   - Page renders correctly
   - Theme toggle works
   - Copy button works
   - Images load fast

5. Clean up old docs/ files that are now in site/public or optimized:
   - Remove docs/hero-primary.png (7MB - replaced by optimized version)
   - Keep docs/og-image.png (needed for OG tags - or ensure it's copied)
   - Keep docs/fonts/ (or ensure copied)
   - Keep docs/favicon* (or ensure copied)
  </action>
  <verify>
`ls -la docs/` shows index.html and _assets/
`ls -la docs/_assets/*.webp 2>/dev/null || ls -la docs/_assets/*.png` shows optimized image <500KB
`cat docs/index.html | head -5` shows Astro-generated HTML
  </verify>
  <done>Astro builds successfully, hero image optimized from 7MB to <500KB, page renders correctly</done>
</task>

</tasks>

<verification>
After all tasks:
1. `cd site && npm run build` completes without errors
2. `docs/index.html` is Astro-generated (check for Astro comments or structure)
3. Hero image in docs/_assets/ is <500KB (was 7MB)
4. Local preview shows identical appearance to original
5. Theme toggle persists to localStorage
6. Copy button copies "npx @templeofsilicon/esoterica" to clipboard
</verification>

<success_criteria>
- Astro project in site/ builds to docs/
- Hero image reduced from 7MB to <500KB
- Visual appearance matches original static page
- Theme toggle and copy button work
- iOS Safari background fix applied
- Ready for GitHub Pages deployment
</success_criteria>

<output>
After completion, create `.planning/quick/002-migrate-landing-page-to-astro/002-SUMMARY.md`
</output>
