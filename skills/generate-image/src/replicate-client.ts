import Replicate from "replicate";
import { promises as fs } from "fs";
import { createWriteStream } from "fs";
import { pipeline } from "stream/promises";

/**
 * Replicate API client for generating images with Nano Banana Pro
 */
export class ReplicateClient {
  private client: Replicate;

  constructor(apiToken: string) {
    this.client = new Replicate({ auth: apiToken });
  }

  /**
   * Generate an image using Nano Banana Pro model with async polling
   *
   * @param prompt - Text prompt for image generation
   * @param aspectRatio - Aspect ratio for the output image
   * @param resolution - Output resolution (1K, 2K, or 4K)
   * @returns Array of image URLs (Replicate delivery URLs, expire after 1 hour)
   */
  async generateImage(
    prompt: string,
    aspectRatio: string,
    resolution: string
  ): Promise<string[]> {
    try {
      // Create prediction with Nano Banana Pro
      let prediction = await this.client.predictions.create({
        version: "0785fb14f5aaa30eddf06fd49b6cbdaac4541b8854eb314211666e23a29087e3",
        input: {
          prompt,
          aspect_ratio: aspectRatio,
          resolution,
          output_format: "png",
          safety_filter_level: "block_only_high",
        },
      });

      console.log(`Created prediction ${prediction.id}, polling for completion...`);

      // Poll for completion with exponential backoff
      let attempts = 0;
      const maxAttempts = 60; // ~10 minutes timeout

      while (
        prediction.status !== "succeeded" &&
        prediction.status !== "failed" &&
        prediction.status !== "canceled"
      ) {
        if (attempts >= maxAttempts) {
          throw new Error(
            `Prediction ${prediction.id} timed out after ${maxAttempts} attempts (~10 minutes)`
          );
        }

        // Exponential backoff: 2s, 4s, 8s, then cap at 10s
        const delay = Math.min(2000 * Math.pow(2, attempts), 10000);
        await new Promise((resolve) => setTimeout(resolve, delay));

        prediction = await this.client.predictions.get(prediction.id);
        attempts++;

        console.log(
          `Polling prediction ${prediction.id}... (attempt ${attempts}, status: ${prediction.status})`
        );
      }

      if (prediction.status === "failed") {
        throw new Error(
          `Prediction ${prediction.id} failed: ${prediction.error || "Unknown error"}`
        );
      }

      if (prediction.status === "canceled") {
        throw new Error(`Prediction ${prediction.id} was canceled`);
      }

      // Return array of image URLs
      const output = prediction.output;
      if (Array.isArray(output)) {
        return output as string[];
      } else if (typeof output === "string") {
        return [output];
      } else {
        throw new Error(
          `Unexpected output format from prediction ${prediction.id}: ${typeof output}`
        );
      }
    } catch (error: any) {
      // Handle rate limit (429) with 60-second retry
      if (error.message?.includes("429") || error.response?.status === 429) {
        console.log(
          "Rate limit hit (600 predictions/minute), waiting 60 seconds before retry..."
        );
        await new Promise((resolve) => setTimeout(resolve, 60000));
        return this.generateImage(prompt, aspectRatio, resolution);
      }

      throw error;
    }
  }

  /**
   * Download an image from URL to local file path
   *
   * @param url - Image URL (Replicate delivery URL)
   * @param outputPath - Local file path to save the image
   */
  async downloadImage(url: string, outputPath: string): Promise<void> {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Failed to download image from ${url}: ${response.status} ${response.statusText}`
        );
      }

      if (!response.body) {
        throw new Error(`No response body from ${url}`);
      }

      // Ensure directory exists
      const dir = outputPath.substring(0, outputPath.lastIndexOf("/"));
      await fs.mkdir(dir, { recursive: true });

      // Stream response body to file
      const fileStream = createWriteStream(outputPath);
      await pipeline(response.body as any, fileStream);

      console.log(`Downloaded image to ${outputPath}`);
    } catch (error: any) {
      throw new Error(
        `Failed to download image from ${url} to ${outputPath}: ${error.message}`
      );
    }
  }
}
