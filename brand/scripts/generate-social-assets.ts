import sharp from "sharp";
import path from "path";

const SOCIAL_VARIANTS = [
  { name: "og-image", width: 1200, height: 630 },      // Open Graph
  { name: "linkedin", width: 1200, height: 627 },      // LinkedIn
  { name: "twitter", width: 1200, height: 675 },       // Twitter/X
  { name: "instagram-square", width: 1080, height: 1080 }, // Instagram feed
  { name: "instagram-story", width: 1080, height: 1920 },  // Instagram stories
];

async function generateSocialAssets() {
  const heroPath = path.resolve(__dirname, "../../brand/hero/winners/hero-primary.png");
  const outputDir = path.resolve(__dirname, "../../brand/social");

  for (const variant of SOCIAL_VARIANTS) {
    const outputPath = path.join(outputDir, `${variant.name}.png`);

    await sharp(heroPath)
      .resize(variant.width, variant.height, {
        fit: "cover",
        position: "attention", // Smart crop focusing on important areas
      })
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(outputPath);

    console.log(`Generated: ${variant.name} (${variant.width}x${variant.height})`);
  }
}

generateSocialAssets().catch(console.error);
