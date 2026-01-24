import { PromptConfig } from "./types.js";

/**
 * Build an Esoterica-branded prompt for image generation
 *
 * Maintains eco-futurist utopian divine feminine aesthetic with:
 * - 1980s-meets-2180s style
 * - Kodak Eastman 100T 5247 35mm film look
 * - Selenite crystal devices with embedded screens
 * - Flowing gauzy dresses and crystal jewelry
 * - Soft, peaceful, pastoral cybernetic merging
 *
 * @param config - Prompt configuration
 * @returns Complete prompt string (optimized to stay under 75 words)
 */
export function buildEsotericaPrompt(config: PromptConfig): string {
  // Base template with locked aesthetic elements
  const baseAesthetic =
    "Candid scene from an eco-futurist utopian divine feminine society";
  const filmStyle =
    "1980s-meets-2180s. Kodak Eastman 100T 5247 35mm film, grain, halation, faded warm colors, natural lens flares, shallow depth-of-field.";

  // Build scene description with optional time of day
  let sceneDesc = config.sceneDescription;
  if (config.timeOfDay) {
    sceneDesc = `${config.timeOfDay}, ${sceneDesc}`;
  }

  // Build device clause
  const deviceClause = config.screenContent
    ? `Selenite crystal devices with ${config.screenContent}.`
    : "Selenite crystal devices with glowing screens.";

  // Build figures clause if specified
  let figuresClause = "";
  if (config.figures === "hands_only") {
    figuresClause = " Focus on hands and objects, no faces visible.";
  } else if (config.figures === "no_people") {
    figuresClause = " Scene without people, focusing on objects and environment.";
  } else if (config.figures === "background_figures") {
    figuresClause = " Figures softly blurred in background.";
  }

  // Build consistent visual elements
  const visualElements =
    "Diverse women in flowing white, black, or iridescent gauzey cotton max-dresses, opal, labradorite, moonstone, amethyst jewelry, silver, black, or iridescent fingernails.";

  // Build mood
  const mood =
    "Soft, peaceful, gentle, pastoral cybernetic merging of femininity & technology.";

  // Combine all elements
  // Keep concise (under 75 words) for better model performance
  const prompt = [
    baseAesthetic,
    sceneDesc,
    filmStyle,
    deviceClause,
    visualElements,
    mood,
    figuresClause,
  ]
    .filter(Boolean)
    .join(" ");

  return prompt;
}

/**
 * Hero image prompt configuration
 *
 * Default configuration for Esoterica's hero image:
 * - Sacred altar scene in Joshua Tree at sunrise
 * - Three tarot cards (High Priestess, Justice, Chariot) from the tagline
 * - Selenite crystal-computer with terminal screen
 * - Hands-only focus (no faces)
 * - Golden hour sunrise lighting
 */
export const HERO_PROMPT_CONFIG: PromptConfig = {
  sceneDescription:
    "at a sacred altar in a sun-drenched Joshua Tree grove at sunrise, three tarot cards (High Priestess, Justice, Chariot) laid beside a selenite crystal-computer",
  screenContent: "16:9 screen displaying terminal text with mystical symbols",
  figures: "hands_only",
  timeOfDay: "golden hour sunrise, pink-gold morning light",
};
