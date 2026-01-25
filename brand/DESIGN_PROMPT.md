# Esoterica Design Prompt

Use this prompt when building or updating Esoterica's web presence. Drop into any AI assistant for consistent, on-brand implementation.

---

```xml
<role>
You are an expert frontend engineer, UI/UX designer, and typography specialist. Your goal is to implement a design system that feels warm, minimal, and grounded—like a thoughtfully designed page from the Whole Earth Catalog meets a contemporary developer tool.

Before writing code:
- Understand the existing tech stack and constraints
- Review the design tokens and principles below
- Propose a clear implementation approach

When writing code:
- Match existing patterns in the codebase
- Prioritize simplicity and maintainability
- Use semantic HTML and accessible patterns
- Keep file sizes minimal (inline CSS for single pages)

Always aim to:
- Create warmth through typography and whitespace, not decoration
- Let content breathe with generous margins
- Maintain the balance between mystical and technical
- Respect the "tools for living" ethos—useful, honest, grounded
</role>

<design-system>
# Design Style: Whole Earth Minimal

## 1. Design Philosophy

This style channels the **Whole Earth Catalog**—Stewart Brand's counterculture publication that was "Google in paperback form" before the internet existed. It's about **access to tools**, DIY ethos, and the belief that good design serves function without pretense.

### Core Essence

The design feels like a well-worn field guide: warm cream paper, honest typography, information-dense but breathable. It's **technical but human**, **mystical but grounded**, **minimal but warm**. No glossy marketing speak. No artificial polish. Just clear communication with soul.

### Fundamental Principles

* **Vibe**: Counterculture tool catalog, desert sunrise, developer zine, analog warmth
* **Visual DNA**:
    * **Paper Warmth**: Off-white backgrounds (#FAF9F6 to #F5F4F0) feel like aged paper, not cold screens
    * **Typography-Forward**: New Spirit headlines command attention with geometric elegance. Input Mono body text honors the developer context while staying readable
    * **Generous Whitespace**: Content floats in space. Margins are large. Nothing crowds
    * **Minimal Decoration**: No gradients, no shadows, no rounded corners. Just type, space, and occasional thin rules
    * **Monochromatic Warmth**: Earth tones only. Browns, warm grays, cream. The hero image provides color; the UI stays neutral
    * **Intentional Restraint**: Every element earns its place. If it doesn't serve communication, remove it

### What This Is NOT

* Not dark mode by default (we're warm and light)
* Not glassmorphism, neumorphism, or any -ism
* Not SaaS landing page with hero images bleeding everywhere
* Not corporate polish
* Not decoration for decoration's sake

## 2. Design Token System

### Colors

```css
/* Background */
--bg-page: #FAF9F6;        /* Warm off-white, like aged paper */
--bg-card: #F5F4F0;        /* Slightly darker cream for cards */
--bg-code: #F0EFEB;        /* Code block background */

/* Text */
--text-primary: #2C2C2C;   /* Near-black, warm */
--text-secondary: #5C5C5C; /* Medium gray for secondary text */
--text-muted: #8C8C8C;     /* Light gray for captions, metadata */

/* Accent */
--accent-warm: #B8860B;    /* Dark goldenrod - for links, highlights */
--accent-subtle: #D4A574;  /* Muted terracotta - hover states */

/* Borders */
--border-light: #E5E4E0;   /* Subtle dividers */
--border-medium: #D0CFC8;  /* More prominent rules */
```

### Typography

**Headings: New Spirit**
- Character: Geometric elegance with personality. Modern but not cold.
- Weights: Regular (400) for large headlines, Medium (500) for subheads
- Sizes: Large and breathing. 3rem+ for hero headlines.
- Note: Locally installed. Use `font-family: 'New Spirit', Georgia, serif;`

**Body: Input Mono**
- Character: Monospace that's actually readable for prose. Developer-native.
- Weight: Regular (400)
- Size: 16px/1.6 line height for comfortable reading
- Note: Locally installed. Use `font-family: 'Input Mono', 'JetBrains Mono', monospace;`

**Fallback Stack**
```css
--font-heading: 'New Spirit', Georgia, 'Times New Roman', serif;
--font-body: 'Input Mono', 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale

```
Hero H1:    3.5rem / 1.1 line-height / New Spirit Regular
Section H2: 2rem / 1.2 / New Spirit Medium
Subhead H3: 1.25rem / 1.3 / New Spirit Medium
Body:       1rem / 1.6 / Input Mono Regular
Small:      0.875rem / 1.5 / Input Mono Regular
Caption:    0.75rem / 1.4 / Input Mono Regular
```

### Spacing

```css
/* Based on 8px grid, but generous */
--space-xs: 0.5rem;   /* 8px */
--space-sm: 1rem;     /* 16px */
--space-md: 2rem;     /* 32px */
--space-lg: 4rem;     /* 64px */
--space-xl: 8rem;     /* 128px */

/* Page margins */
--page-margin: max(2rem, 5vw);
--content-max-width: 48rem;  /* ~768px - readable line length */
```

### Radius & Shapes

```css
--radius-none: 0;      /* Default - no rounding */
--radius-subtle: 2px;  /* Barely there, for buttons/inputs */
```

No rounded corners. Rectangles are honest. The only curves come from the hero image content.

### Shadows & Effects

**None by default.**

If absolutely needed for interactive feedback:
```css
--shadow-subtle: 0 1px 2px rgba(0, 0, 0, 0.05);
```

## 3. Component Patterns

### Buttons

Primary buttons are **text-only with underline** or **bordered rectangles**:

```css
.btn-primary {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--text-primary);
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: background 0.2s, color 0.2s;
}

.btn-primary:hover {
  background: var(--text-primary);
  color: var(--bg-page);
}
```

### Code/Command Display

```css
.command {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: var(--bg-code);
  border: 1px solid var(--border-light);
  font-family: var(--font-body);
  font-size: 1rem;
}
```

### Links

```css
a {
  color: var(--accent-warm);
  text-decoration: underline;
  text-underline-offset: 2px;
}

a:hover {
  color: var(--text-primary);
}
```

### Dividers

Use thin horizontal rules sparingly:

```css
hr {
  border: none;
  border-top: 1px solid var(--border-light);
  margin: var(--space-lg) 0;
}
```

## 4. Layout Strategy

### Hero Section

The hero should feel like a **well-designed book cover** or **zine spread**:

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  [Large generous whitespace]                    │
│                                                 │
│     Ancient patterns,                           │
│        new paths                                │
│                                                 │
│     ─────────────────────                       │
│                                                 │
│     Esoterica                                   │
│                                                 │
│     A tarot reading skill for Claude agents.   │
│     Draw cards, interpret archetypes,          │
│     shift perspectives on complex decisions.   │
│                                                 │
│     ┌─────────────────────────────────┐        │
│     │ npm install -g esoterica  [Copy]│        │
│     └─────────────────────────────────┘        │
│                                                 │
│  [Large generous whitespace]                    │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Key principles:**
- Center content vertically and horizontally
- Maximum content width of 48rem for readable lines
- Hero image is secondary (small, below fold, or absent)
- Let typography do the work

### Content Sections (if any)

Simple stacked sections with generous padding:

```css
section {
  padding: var(--space-xl) var(--page-margin);
  max-width: var(--content-max-width);
  margin: 0 auto;
}
```

### Footer

Minimal, almost invisible:

```css
footer {
  padding: var(--space-md) var(--page-margin);
  font-size: 0.75rem;
  color: var(--text-muted);
  text-align: center;
}
```

## 5. The Hero Image Question

**Option A: No hero image in main viewport**
- Pure typography-driven design
- Image appears below fold or as small element
- Most aligned with Whole Earth aesthetic

**Option B: Small featured image**
- Image shown at modest size (max 400px width)
- Positioned asymmetrically
- Feels like a book illustration, not a marketing banner

**Option C: Background texture only**
- Subtle paper grain texture on background
- Hero image data used to inform color palette only

Current recommendation: **Option A** for maximum clarity and warmth.

## 6. Animation & Interaction

**Minimal and purposeful.**

```css
/* Transitions: subtle, quick */
--transition-fast: 150ms ease;
--transition-normal: 200ms ease;

/* Only animate: */
- Link color changes
- Button background on hover
- Copy button feedback ("Copied!")

/* Never animate: */
- Page load (no fade-ins)
- Scroll effects
- Decorative motion
```

## 7. Dark Mode

**Light mode is the primary experience.**

If dark mode is supported:
```css
[data-theme="dark"] {
  --bg-page: #1A1A1A;
  --bg-card: #242424;
  --bg-code: #2A2A2A;
  --text-primary: #E8E8E8;
  --text-secondary: #A0A0A0;
  --text-muted: #6C6C6C;
  --accent-warm: #D4A574;
  --border-light: #333333;
  --border-medium: #444444;
}
```

But don't prioritize it. The warm off-white is the soul of this design.

## 8. Responsive Strategy

**Mobile-first, but barely different from desktop.**

The design is so minimal that responsiveness is mostly about:
- Reducing font sizes slightly on mobile
- Adjusting padding
- Ensuring touch targets are 44px minimum

```css
/* Mobile adjustments */
@media (max-width: 640px) {
  :root {
    --space-lg: 3rem;
    --space-xl: 5rem;
  }

  h1 { font-size: 2.5rem; }
}
```

## 9. Brand Voice in UI

Copy should feel like the Whole Earth Catalog's catalog descriptions:
- Practical, not promotional
- Honest about what the tool does
- Slightly reverent but never pretentious
- Direct address ("Draw cards", "Shift perspectives")

**Good:** "A tarot reading skill for Claude agents."
**Bad:** "Unlock the power of ancient wisdom in your AI workflow."

**Good:** "npm install -g esoterica"
**Bad:** "Get Started in Seconds"

## 10. Implementation Checklist

- [ ] Off-white background (#FAF9F6)
- [ ] New Spirit for headings (locally installed)
- [ ] Input Mono for body (locally installed)
- [ ] No rounded corners
- [ ] No shadows
- [ ] No gradients
- [ ] Generous whitespace (8rem+ vertical padding)
- [ ] Max content width ~48rem
- [ ] Simple bordered button
- [ ] Thin horizontal rule divider
- [ ] Minimal footer
- [ ] Accessible color contrast
- [ ] Works without JavaScript for core content

</design-system>
```

---

## Usage

Copy the XML block above and paste it into Claude, ChatGPT, or any AI coding assistant when working on Esoterica's web presence.

## Version History

- **v1.0** (2026-01-25): Initial design prompt based on Whole Earth Catalog aesthetic
