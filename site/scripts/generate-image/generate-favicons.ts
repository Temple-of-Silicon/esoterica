import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function generateFavicons() {
  const svgPath = path.resolve(__dirname, "../../brand/favicon/favicon.svg");
  const svgBuffer = await fs.readFile(svgPath);

  const sizes = [
    { size: 16, name: "favicon-16x16.png" },
    { size: 32, name: "favicon-32x32.png" },
    { size: 180, name: "apple-touch-icon.png" },
  ];

  for (const { size, name } of sizes) {
    const outputPath = path.resolve(__dirname, `../../brand/favicon/${name}`);

    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);

    console.log(`Generated: ${name} (${size}x${size})`);
  }
}

generateFavicons().catch(console.error);
