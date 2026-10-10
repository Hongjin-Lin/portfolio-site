// 把一张餐食照片压缩进 public/fitness/<date>/，并挂到 entries.json 对应餐次上。
// 用法: node scripts/fitness-attach-photo.mjs --date 2026-10-10 --type breakfast --slot 2 --src "D:/path/photo.jpg"
// slot = 该餐次的第几个（1 起）；用于同一天有两顿同类餐时区分。
import { mkdir, readFile, writeFile, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA = path.join(root, "src", "data", "fitness", "entries.json");
const PHOTO_DIR = path.join(root, "public", "fitness");

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const m = argv[i].match(/^--([\w-]+)$/);
    if (m) out[m[1]] = argv[i + 1];
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
const date = args.date;
const type = args.type || "breakfast";
const slot = Number(args.slot || 1);
const src = args.src;
if (!date || !src) {
  console.error('Usage: node scripts/fitness-attach-photo.mjs --date 2026-10-10 --type breakfast --slot 2 --src "/path/photo.jpg"');
  process.exit(1);
}

const outDir = path.join(PHOTO_DIR, date);
await mkdir(outDir, { recursive: true });
const outName = `${type}-${slot}.jpg`;
await sharp(src, { failOn: "none" })
  .rotate()
  .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(outDir, outName));
const url = `/fitness/${date}/${outName}`;

const entries = JSON.parse(await readFile(DATA, "utf8"));
const entry = entries.find((e) => e?.date === date);
if (!entry) {
  console.error(`No entry for ${date}`);
  process.exit(1);
}

const meals = Array.isArray(entry.meals)
  ? entry.meals
  : Object.entries(entry.meals || {}).map(([k, v]) => ({ type: k, ...v }));
const same = meals.filter((m) => m.type === type);
const target = same[slot - 1];
if (!target) {
  console.error(`Only ${same.length} ${type} slot(s) on ${date}`);
  process.exit(1);
}
target.photos = [...(target.photos || []).filter((p) => p !== url), url];
entry.meals = meals;

await writeFile(DATA, `${JSON.stringify(entries, null, 2)}\n`);
console.log(`attached ${src} -> public/fitness/${date}/${outName} (${type} #${slot})`);
