#!/usr/bin/env node
// Fitness daily import:
//   npm run fitness:import -- --date 2026-10-09 --photos ./inbox/2026-10-09
// Photos named breakfast*/lunch*/dinner* are matched to meals; otherwise they are
// distributed round-robin (breakfast, lunch, dinner) in sorted order.
// Photos are compressed into public/fitness/<date>/ and the day entry is created
// or merged in src/data/fitness/entries.json (existing fields are preserved).

import { createWriteStream } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA = path.join(root, "src", "data", "fitness", "entries.json");
const PHOTO_DIR = path.join(root, "public", "fitness");

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const m = argv[i].match(/^--(\w+)$/);
    if (m) args[m[1]] = argv[i + 1];
  }
  return args;
}

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function emptyMeal() {
  return { items: "", kcal: null, protein: null, photos: [] };
}

async function main() {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.error("sharp is missing. Run: npm install");
    process.exit(1);
  }

  const args = parseArgs(process.argv.slice(2));
  const date = args.date || dateKey(new Date());
  const photosDir = args.photos;
  if (!photosDir) {
    console.error('Usage: npm run fitness:import -- --date 2026-10-09 --photos ./inbox/2026-10-09');
    process.exit(1);
  }

  const files = (await readdir(photosDir))
    .filter((f) => /\.(jpe?g|png|webp|heic|heif)$/i.test(f))
    .sort();
  if (!files.length) {
    console.error(`No images found in ${photosDir}`);
    process.exit(1);
  }

  const buckets = { breakfast: [], lunch: [], dinner: [] };
  for (const f of files) {
    const lower = f.toLowerCase();
    const meal = ["breakfast", "lunch", "dinner"].find((m) => lower.startsWith(m))
      ?? (lower.startsWith("早") ? "breakfast" : lower.startsWith("午") ? "lunch" : lower.startsWith("晚") ? "dinner" : null);
    if (meal) buckets[meal].push(f);
    else {
      const fallback = ["breakfast", "lunch", "dinner"].find((m) => buckets[m].length === 0) ?? "dinner";
      buckets[fallback].push(f);
    }
  }

  const outDir = path.join(PHOTO_DIR, date);
  await mkdir(outDir, { recursive: true });

  const entry = {
    date,
    weightKg: null,
    workout: { title: "", detail: "", durationMin: null },
    meals: { breakfast: emptyMeal(), lunch: emptyMeal(), dinner: emptyMeal() },
    notes: "",
  };
  const existing = JSON.parse(await readFile(DATA, "utf8"));
  const previous = existing.find((e) => e?.date === date);
  if (previous) Object.assign(entry, JSON.parse(JSON.stringify(previous)));

  let count = 0;
  for (const meal of ["breakfast", "lunch", "dinner"]) {
    const urls = [...(entry.meals[meal]?.photos || [])];
    for (const [i, file] of buckets[meal].entries()) {
      const outName = `${meal}-${urls.length + i + 1}.jpg`;
      const outPath = path.join(outDir, outName);
      await pipeline(
        sharp(path.join(photosDir, file), { failOn: "none" })
          .rotate()
          .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
          .jpeg({ quality: 82, mozjpeg: true }),
        createWriteStream(outPath),
      );
      urls.push(`/fitness/${date}/${outName}`);
      count += 1;
      console.log(`  ${file} -> public/fitness/${date}/${outName}`);
    }
    entry.meals[meal] = { ...(entry.meals[meal] || emptyMeal()), photos: urls };
    for (const key of ["items", "kcal", "protein"]) {
      if (entry.meals[meal][key] == null || entry.meals[meal][key] === "") {
        entry.meals[meal][key] = key === "items" ? "" : null;
      }
    }
  }

  const merged = [...existing.filter((e) => e?.date !== date), entry].sort((a, b) => (a.date < b.date ? -1 : 1));
  await writeFile(DATA, `${JSON.stringify(merged, null, 2)}\n`);
  console.log(`\nImported ${count} photo(s) for ${date}.`);
  console.log("Next: fill in meals' items/kcal/protein, weightKg, and workout in src/data/fitness/entries.json, then commit & push.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
