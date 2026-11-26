// News Image 20261126 — entry program: copy art.png to /output/entry.png
// v3 pass (26 Nov 2026): front page rebuilt to follow the Top 1 layout
// exactly — Top 1 medium order and ALSO ON list verbatim, 15 fields,
// Top 1 region counts, enriched flat-SVG leads (king + queen on the board,
// analog clocks with hands), bigger in-image data chips on the mediums.
// Same copy + checks as v1/v2.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "art.png");
const outDir = "/output";
const out = join(outDir, "entry.png");

if (!existsSync(src)) {
  console.error("art.png missing");
  process.exit(1);
}
const buf = readFileSync(src);
if (buf.length === 0) {
  console.error("art.png is empty");
  process.exit(1);
}
if (buf.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
  console.error("art.png is not a PNG");
  process.exit(1);
}
if (buf.subarray(12, 16).toString("ascii") !== "IHDR") {
  console.error("art.png has no IHDR chunk");
  process.exit(1);
}
const w = buf.readUInt32BE(16);
const h = buf.readUInt32BE(20);
if (w !== 1024 || h !== 1024) {
  console.error(`art.png is ${w}x${h}, want 1024x1024`);
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });
writeFileSync(out, buf);
// byte-identity check: the copy must be exactly the source
const back = readFileSync(out);
if (!back.equals(buf)) {
  console.error("entry.png differs from art.png");
  process.exit(1);
}
console.log(`wrote ${out} (${buf.length} bytes, ${w}x${h}, byte-identical)`);
