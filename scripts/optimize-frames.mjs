#!/usr/bin/env node
/**
 * Converts the source PNG frame sequences in public/frames/<sequence>/frame_###.png
 * into WebP files in public/frames-optimized/<sequence>/.
 *
 *   public/frames-optimized/<sequence>/frame_###.webp     full size (source width)
 *   public/frames-optimized/<sequence>/sm/frame_###.webp  small size for phones
 *
 * The original PNGs are never modified.
 *
 * Usage:
 *   npm run optimize:frames
 *   npm run optimize:frames -- --quality 82 --small-width 720 --force
 *
 * Uses `sharp` when it can be imported (it ships with Next.js as an optional
 * dependency), otherwise falls back to the `cwebp` CLI. If neither is available
 * the script exits without touching anything.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcRoot = path.join(root, "public", "frames");
const outRoot = path.join(root, "public", "frames-optimized");

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const quality = Number(arg("quality", 80));
const smallWidth = Number(arg("small-width", 720));
const force = args.includes("--force");

async function loadEncoder() {
  try {
    const { default: sharp } = await import("sharp");
    return {
      name: "sharp",
      async encode(input, output, width) {
        let pipeline = sharp(input);
        if (width) pipeline = pipeline.resize({ width, withoutEnlargement: true });
        await pipeline.webp({ quality, effort: 5 }).toFile(output);
      },
    };
  } catch {
    const probe = spawnSync("cwebp", ["-version"], { encoding: "utf8" });
    if (probe.status === 0) {
      return {
        name: "cwebp",
        async encode(input, output, width) {
          const resize = width ? ["-resize", String(width), "0"] : [];
          const run = spawnSync("cwebp", ["-quiet", "-q", String(quality), "-m", "5", ...resize, input, "-o", output]);
          if (run.status !== 0) throw new Error(`cwebp failed for ${input}`);
        },
      };
    }
    return null;
  }
}

async function isFresh(input, output) {
  if (force || !existsSync(output)) return false;
  const [a, b] = await Promise.all([stat(input), stat(output)]);
  return b.mtimeMs >= a.mtimeMs;
}

async function main() {
  if (!existsSync(srcRoot)) {
    console.error(`No source frames found at ${path.relative(root, srcRoot)}`);
    process.exit(1);
  }

  const encoder = await loadEncoder();
  if (!encoder) {
    console.error("Neither `sharp` nor `cwebp` is available. Install one of them:\n  npm i -D sharp\n  brew install webp");
    process.exit(1);
  }
  console.log(`Encoding with ${encoder.name} (quality ${quality}, small width ${smallWidth}px)`);

  const sequences = (await readdir(srcRoot, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name);

  for (const sequence of sequences) {
    const srcDir = path.join(srcRoot, sequence);
    const outDir = path.join(outRoot, sequence);
    const outSmDir = path.join(outDir, "sm");
    await mkdir(outSmDir, { recursive: true });

    const frames = (await readdir(srcDir)).filter((f) => f.toLowerCase().endsWith(".png")).sort();
    let written = 0;

    for (const file of frames) {
      const input = path.join(srcDir, file);
      const name = file.replace(/\.png$/i, ".webp");
      const targets = [
        [path.join(outDir, name), undefined],
        [path.join(outSmDir, name), smallWidth],
      ];
      for (const [output, width] of targets) {
        if (await isFresh(input, output)) continue;
        await encoder.encode(input, output, width);
        written++;
      }
    }
    console.log(`  ${sequence}: ${frames.length} frames, ${written} files written`);
  }
  console.log(`Done → ${path.relative(root, outRoot)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
