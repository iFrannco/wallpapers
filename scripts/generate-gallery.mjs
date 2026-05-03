// scripts/generate-gallery.mjs
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const WALLPAPERS_DIR = "wallpapers";
const OUTPUT_FILE = "dist/wallpapers.json";

const SUPPORTED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".avif"
]);

function toTitle(fileName) {
  const nameWithoutExtension = fileName.replace(/\.[^.]+$/, "");

  return nameWithoutExtension
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function toWebPath(fileName) {
  return `./wallpapers/${encodeURIComponent(fileName)}`;
}

const entries = await readdir(WALLPAPERS_DIR, { withFileTypes: true });

const wallpapers = entries
  .filter((entry) => entry.isFile())
  .filter((entry) => SUPPORTED_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((entry) => ({
    title: toTitle(entry.name),
    fileName: entry.name,
    path: toWebPath(entry.name)
  }));

await writeFile(OUTPUT_FILE, JSON.stringify(wallpapers, null, 2));

console.log(`Generated ${OUTPUT_FILE} with ${wallpapers.length} wallpapers.`);
