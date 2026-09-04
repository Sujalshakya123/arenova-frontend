import { readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svgPath = join(root, "src/assets/LogoAligned.svg");
const outPath = join(root, "src/assets/Test_LOGO.png");

const svg = readFileSync(svgPath, "utf8");
const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 512 },
  background: "transparent",
});
const pngData = resvg.render();
writeFileSync(outPath, pngData.asPng());
console.log(`Exported ${outPath}`);
