import getColors from "get-image-colors";
import { writeFile } from "fs/promises";

async function extractPalette() {
  const heroPath = "brand/hero/winners/hero-primary.png";
  const colors = await getColors(heroPath, { count: 8, type: "image/png" });

  const brandColors = [
    { name: "Primary", color: colors[0], usage: "Hero text overlays, primary CTAs, key accent elements" },
    { name: "Secondary", color: colors[1], usage: "Subheadings, secondary buttons, icon highlights" },
    { name: "Accent", color: colors[2], usage: "Links, hover states, active indicators" },
    { name: "Warm Neutral", color: colors[3], usage: "Background warmth, card surfaces, soft dividers" },
    { name: "Cool Neutral", color: colors[4], usage: "Secondary backgrounds, disabled states, subtle borders" },
    { name: "Dark Base", color: colors[5], usage: "Body text, headers, dark mode backgrounds" }
  ];

  const markdown = `# Esoterica Color Palette

**Extracted from:** hero-primary.png
**Date:** ${new Date().toISOString().split('T')[0]}

## Brand Colors

${brandColors.map(c => `### ${c.name}
- **Hex:** \`${c.color.hex()}\`
- **RGB:** \`rgb(${c.color.rgb().array().map(Math.round).join(", ")})\`
- **Usage:** ${c.usage}
`).join("\n")}

## Usage Guidelines

### Digital Applications
- Use Primary for CTAs and key interactive elements
- Use Dark Base for body text (ensure WCAG AA contrast)
- Use Warm Neutral for surface backgrounds
- Accent for links and hover states

### Accessibility Notes
Verify contrast ratios before use:
- Text on backgrounds must meet WCAG AA (4.5:1 for normal text)
- Use Dark Base on Warm Neutral for body text
`;

  await writeFile("brand/COLOR_PALETTE.md", markdown);
  console.log("Color palette extracted to brand/COLOR_PALETTE.md");
}

extractPalette().catch(console.error);
