#!/usr/bin/env tsx
/**
 * Generate hero image variations for Esoterica visual identity
 *
 * Explores different figure treatments:
 * - Batch 1: Hands only (3 variations)
 * - Batch 2: No people (3 variations)
 * - Batch 3: Background figures (3 variations)
 * - Batch 4: Additional exploration (2-4 variations)
 */

import { generateImages, HERO_PROMPT_CONFIG } from "../../skills/generate-image/src/index.js";
import { promises as fs } from "fs";
import path from "path";

interface BatchConfig {
  name: string;
  description: string;
  scene: string;
  figures?: "hands_only" | "no_people" | "background_figures";
  screenContent?: string;
  timeOfDay?: string;
  variations: number;
}

// Define batch configurations
const batches: BatchConfig[] = [
  {
    name: "Batch 1 - Hands Only",
    description: "Intimate focus on hands arranging cards, selenite computer nearby",
    scene: HERO_PROMPT_CONFIG.sceneDescription,
    figures: "hands_only",
    screenContent: HERO_PROMPT_CONFIG.screenContent,
    timeOfDay: HERO_PROMPT_CONFIG.timeOfDay,
    variations: 3,
  },
  {
    name: "Batch 2 - No People",
    description: "Pure environmental composition, altar with cards and computer",
    scene: HERO_PROMPT_CONFIG.sceneDescription,
    figures: "no_people",
    screenContent: HERO_PROMPT_CONFIG.screenContent,
    timeOfDay: HERO_PROMPT_CONFIG.timeOfDay,
    variations: 3,
  },
  {
    name: "Batch 3 - Background Figures",
    description: "Soft-focus figures in flowing robes in background, altar in foreground",
    scene: HERO_PROMPT_CONFIG.sceneDescription,
    figures: "background_figures",
    screenContent: HERO_PROMPT_CONFIG.screenContent,
    timeOfDay: HERO_PROMPT_CONFIG.timeOfDay,
    variations: 3,
  },
  {
    name: "Batch 4 - Dawn Variation",
    description: "Try pink dawn instead of golden sunrise",
    scene: HERO_PROMPT_CONFIG.sceneDescription,
    figures: "hands_only",
    screenContent: HERO_PROMPT_CONFIG.screenContent,
    timeOfDay: "pink dawn, soft magenta-pink morning light",
    variations: 2,
  },
];

async function generateAllBatches() {
  const outputDir = path.join(process.cwd(), "brand/hero/archive");
  const logPath = path.join(process.cwd(), "brand/hero/GENERATION_LOG.md");

  // Initialize generation log
  let logContent = `# Hero Image Generation Log\n\n`;
  logContent += `Generated: ${new Date().toISOString()}\n\n`;
  logContent += `## Batches\n\n`;

  console.log("\n🎨 Starting hero image generation...\n");
  console.log(`Output directory: ${outputDir}\n`);

  let totalGenerated = 0;

  for (const batch of batches) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`${batch.name}`);
    console.log(`${batch.description}`);
    console.log(`${"=".repeat(60)}\n`);

    logContent += `### ${batch.name}\n\n`;
    logContent += `**Description:** ${batch.description}\n\n`;
    logContent += `**Configuration:**\n`;
    logContent += `- Scene: ${batch.scene}\n`;
    logContent += `- Figures: ${batch.figures || "default"}\n`;
    logContent += `- Screen content: ${batch.screenContent || "default"}\n`;
    logContent += `- Time of day: ${batch.timeOfDay || "default"}\n`;
    logContent += `- Variations: ${batch.variations}\n\n`;

    try {
      const results = await generateImages({
        scene: batch.scene,
        aspectRatio: "16:9",
        variations: batch.variations,
        resolution: "2K",
        outputDir,
        screenContent: batch.screenContent,
        figures: batch.figures,
        timeOfDay: batch.timeOfDay,
      });

      logContent += `**Generated Images:**\n\n`;
      logContent += `| # | Timestamp | Filename | Prompt |\n`;
      logContent += `|---|-----------|----------|--------|\n`;

      results.forEach((result, idx) => {
        const filename = path.basename(result.imagePath);
        logContent += `| ${idx + 1} | ${result.timestamp} | ${filename} | ${result.prompt.substring(0, 50)}... |\n`;
      });

      logContent += `\n`;

      totalGenerated += results.length;
      console.log(`\n✅ Batch complete: ${results.length} images generated`);
    } catch (error) {
      console.error(`\n❌ Batch failed:`, error);
      logContent += `**Error:** ${error}\n\n`;
    }

    // Add delay between batches
    if (batches.indexOf(batch) < batches.length - 1) {
      console.log("\nWaiting 2 seconds before next batch...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  // Write generation log
  await fs.writeFile(logPath, logContent);

  console.log(`\n${"=".repeat(60)}`);
  console.log(`✨ Generation complete!`);
  console.log(`${"=".repeat(60)}`);
  console.log(`\nTotal images: ${totalGenerated}`);
  console.log(`Output: ${outputDir}`);
  console.log(`Log: ${logPath}\n`);
}

// Run generation
generateAllBatches().catch(console.error);
