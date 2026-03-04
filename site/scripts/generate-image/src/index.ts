import { GenerateOptions, GenerationResult } from "./types.js";
import { ReplicateClient } from "./replicate-client.js";
import { buildEsotericaPrompt } from "./prompt-builder.js";
import { promises as fs } from "fs";
import path from "path";

/**
 * Generate images using Replicate's Nano Banana Pro model
 *
 * @param options - Generation configuration
 * @returns Array of generation results with image paths and metadata
 * @throws Error if REPLICATE_API_TOKEN is not set
 */
export async function generateImages(
  options: GenerateOptions
): Promise<GenerationResult[]> {
  // Check for required environment variable
  const apiToken = process.env.REPLICATE_API_TOKEN;
  if (!apiToken) {
    throw new Error(
      "REPLICATE_API_TOKEN environment variable is required. " +
      "Get your token from: Replicate Dashboard -> Account Settings -> API tokens"
    );
  }

  // Initialize Replicate client
  const client = new ReplicateClient(apiToken);

  // Ensure output directory exists
  await fs.mkdir(options.outputDir, { recursive: true });

  const results: GenerationResult[] = [];

  // Generate each variation
  for (let i = 0; i < options.variations; i++) {
    console.log(`\nGenerating variation ${i + 1}/${options.variations}...`);

    // Build prompt using Esoterica template
    const prompt = buildEsotericaPrompt({
      sceneDescription: options.scene,
      screenContent: options.screenContent,
      figures: options.figures,
      timeOfDay: options.timeOfDay,
    });

    console.log(`Prompt: ${prompt}`);

    // Generate image via Replicate
    const imageUrls = await client.generateImage(
      prompt,
      options.aspectRatio,
      options.resolution
    );

    // Download first image from the output (Nano Banana Pro typically returns 1 image)
    const imageUrl = imageUrls[0];
    const timestamp = new Date().toISOString().replace(/:/g, "-").split(".")[0];
    const filename = `hero-${timestamp}-${i + 1}.png`;
    const imagePath = path.join(options.outputDir, filename);

    await client.downloadImage(imageUrl, imagePath);

    // Record result
    results.push({
      id: `prediction-${timestamp}-${i + 1}`,
      prompt,
      imagePath,
      timestamp: new Date().toISOString(),
    });

    // Add delay between generations to respect rate limits (150ms = ~400/min with buffer)
    if (i < options.variations - 1) {
      console.log("Rate limit throttle: waiting 150ms before next generation...");
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }

  return results;
}

// Export types and utilities
export * from "./types.js";
export { buildEsotericaPrompt, HERO_PROMPT_CONFIG } from "./prompt-builder.js";
export { ReplicateClient } from "./replicate-client.js";
