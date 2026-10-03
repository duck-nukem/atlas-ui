// usage: node scripts/build-css.ts
import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

execFileSync(
  "npx",
  [
    "tailwindcss",
    "-i",
    "src/css/index.css",
    "-o",
    "dist/atlas-ui.css",
    "--minify",
  ],
  { stdio: "inherit" },
);

mkdirSync("dist/fonts", { recursive: true });

const faces = ["geist", "geist-mono"].map((font) => {
  const folder = `node_modules/@fontsource-variable/${font}`;

  cpSync(`${folder}/files`, "dist/fonts", { recursive: true });

  return readFileSync(`${folder}/index.css`, "utf8").replaceAll(
    "./files/",
    "./fonts/",
  );
});

writeFileSync("dist/fonts.css", faces.join("\n"));
