#!/usr/bin/env tsx
/**
 * Generate hero image variations with improved terminal text
 *
 * Focus: Better "vibe-coding" aesthetic for terminal screens
 * - More recognizable code/terminal aesthetic
 * - Still mystical/witchy but actual code-like
 * - Claude Code prompting flow style
 *
 * CRITICAL: Uses new timestamps to avoid overwriting existing 11 images
 */

import { readFileSync } from "fs";
import { promises as fs } from "fs";
import path from "path";

// Load environment variables synchronously BEFORE any imports that might use them
const envPath = path.join(process.cwd(), ".env");
try {
  const envContent = readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      const value = valueParts.join("=").trim();
      if (key && value) {
        process.env[key.trim()] = value;
      }
    }
  });
  console.log("✓ Environment variables loaded from .env");
} catch (error) {
  console.error("Warning: Could not load .env file:", error);
}

import { generateImages, HERO_PROMPT_CONFIG } from "../../skills/generate-image/src/index.js";

interface BatchConfig {
  name: string;
  description: string;
  scene: string;
  figures?: "hands_only" | "no_people" | "background_figures";
  screenContent?: string;
  timeOfDay?: string;
  variations: number;
}

// Define batches focused on improved terminal aesthetics
const batches: BatchConfig[] = [
  {
    name: "Batch 5 - Vibe Coding Terminal",
    description: "Code editor aesthetic with mystical variable names, soft syntax highlighting",
    scene: HERO_PROMPT_CONFIG.sceneDescription,
    figures: "hands_only",
    screenContent: "16:9 glowing screen with elegant TypeScript code using mystical variable names (moonPhase, tarotDeck, crystalGrid), pastel syntax highlighting, soft purple and blue glow",
    timeOfDay: HERO_PROMPT_CONFIG.timeOfDay,
    variations: 3,
  },
  {
    name: "Batch 6 - Claude Code Style",
    description: "Terminal with streaming command output, colorful syntax, prompting aesthetic",
    scene: HERO_PROMPT_CONFIG.sceneDescription,
    figures: "hands_only",
    screenContent: "16:9 terminal screen showing streaming colored text output, command prompts with mystical paths (/sacred/altar/readings), soft cyan and magenta ANSI colors, Claude Code aesthetic",
    timeOfDay: HERO_PROMPT_CONFIG.timeOfDay,
    variations: 3,
  },
  {
    name: "Batch 7 - Python Ritual Code",
    description: "Python code with tarot-themed function names, zen aesthetic",
    scene: HERO_PROMPT_CONFIG.sceneDescription,
    figures: "no_people",
    screenContent: "16:9 screen displaying Python code with function names like draw_card(), interpret_spread(), crystal_attunement(), gentle syntax highlighting in earth tones, zen coding aesthetic",
    timeOfDay: HERO_PROMPT_CONFIG.timeOfDay,
    variations: 2,
  },
  {
    name: "Batch 8 - Mystical Code Editor",
    description: "Modern code editor UI with soft glowing interface, witchy but recognizable",
    scene: HERO_PROMPT_CONFIG.sceneDescription,
    figures: "background_figures",
    screenContent: "16:9 modern code editor interface with soft glowing sidebar, code with celestial variable names (moonCycle, starAlignment, divineGuidance), pastel UI theme, VS Code aesthetic",
    timeOfDay: HERO_PROMPT_CONFIG.timeOfDay,
    variations: 2,
  },
];

async function generateTerminalVariations() {
  const outputDir = path.join(process.cwd(), "brand/hero/archive");
  const logPath = path.join(process.cwd(), "brand/hero/GENERATION_LOG.md");

  console.log("\n🎨 Starting terminal text variation generation...\n");
  console.log(`Output directory: ${outputDir}\n`);
  console.log("SAFETY CHECK: Using new timestamps to avoid overwriting existing images\n");

  // Read existing log to append to it
  let existingLog = "";
  try {
    existingLog = await fs.readFile(logPath, "utf-8");
  } catch (error) {
    console.log("Note: Could not read existing log, will create new one");
  }

  let newLogContent = `\n## Terminal Text Variation Batches (Generated: ${new Date().toISOString()})\n\n`;
  newLogContent += `**Goal:** Improve terminal text to be more "vibe-coding" / Claude Code aesthetic\n`;
  newLogContent += `**Change:** More recognizable code/terminal, still witchy, better syntax highlighting\n\n`;

  let totalGenerated = 0;

  for (const batch of batches) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`${batch.name}`);
    console.log(`${batch.description}`);
    console.log(`${"=".repeat(60)}\n`);

    newLogContent += `### ${batch.name}\n\n`;
    newLogContent += `**Description:** ${batch.description}\n\n`;
    newLogContent += `**Configuration:**\n`;
    newLogContent += `- Scene: ${batch.scene}\n`;
    newLogContent += `- Figures: ${batch.figures || "default"}\n`;
    newLogContent += `- Screen content: ${batch.screenContent || "default"}\n`;
    newLogContent += `- Time of day: ${batch.timeOfDay || "default"}\n`;
    newLogContent += `- Variations: ${batch.variations}\n\n`;

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

      newLogContent += `**Generated Images:**\n\n`;
      newLogContent += `| # | Timestamp | Filename | Prompt |\n`;
      newLogContent += `|---|-----------|----------|--------|\n`;

      results.forEach((result, idx) => {
        const filename = path.basename(result.imagePath);
        newLogContent += `| ${idx + 1} | ${result.timestamp} | ${filename} | ${result.prompt.substring(0, 50)}... |\n`;
      });

      newLogContent += `\n`;

      totalGenerated += results.length;
      console.log(`\n✅ Batch complete: ${results.length} images generated`);
    } catch (error) {
      console.error(`\n❌ Batch failed:`, error);
      newLogContent += `**Error:** ${error}\n\n`;
    }

    // Add delay between batches
    if (batches.indexOf(batch) < batches.length - 1) {
      console.log("\nWaiting 2 seconds before next batch...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  // Append to existing log
  const finalLogContent = existingLog + newLogContent;
  await fs.writeFile(logPath, finalLogContent);

  console.log(`\n${"=".repeat(60)}`);
  console.log(`✨ Terminal variation generation complete!`);
  console.log(`${"=".repeat(60)}`);
  console.log(`\nNew images generated: ${totalGenerated}`);
  console.log(`Total images in archive: ${11 + totalGenerated}`);
  console.log(`Output: ${outputDir}`);
  console.log(`Log updated: ${logPath}\n`);
}

// Run generation
generateTerminalVariations().catch(console.error);
