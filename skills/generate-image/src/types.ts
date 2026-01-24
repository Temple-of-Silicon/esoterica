/**
 * Prompt configuration for generating Esoterica-styled images
 */
export interface PromptConfig {
  /** Main scene description (e.g., "at a sacred altar in Joshua Tree") */
  sceneDescription: string;

  /** Content displayed on selenite crystal screens (optional) */
  screenContent?: string;

  /** How figures should appear in the scene (optional) */
  figures?: "hands_only" | "no_people" | "background_figures";

  /** Time of day specification (optional, e.g., "golden hour sunrise") */
  timeOfDay?: string;
}

/**
 * Options for generating images
 */
export interface GenerateOptions {
  /** Scene description or full prompt */
  scene: string;

  /** Aspect ratio for the generated image */
  aspectRatio: "16:9" | "1:1" | "9:16" | "match_input_image";

  /** Number of variations to generate (1-10) */
  variations: number;

  /** Output resolution */
  resolution: "1K" | "2K" | "4K";

  /** Directory to save generated images */
  outputDir: string;

  /** Content displayed on selenite crystal screens (optional) */
  screenContent?: string;

  /** How figures should appear in the scene (optional) */
  figures?: "hands_only" | "no_people" | "background_figures";

  /** Time of day specification (optional, e.g., "golden hour sunrise") */
  timeOfDay?: string;
}

/**
 * Result from a single image generation
 */
export interface GenerationResult {
  /** Unique prediction ID from Replicate */
  id: string;

  /** Full prompt used for generation */
  prompt: string;

  /** Local file path where image was saved */
  imagePath: string;

  /** ISO 8601 timestamp when image was generated */
  timestamp: string;
}
