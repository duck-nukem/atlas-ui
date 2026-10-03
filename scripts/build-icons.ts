// usage: node scripts/build-icons.ts
import { readFileSync, writeFileSync } from "node:fs";
import { icons } from "../src/icons/names.ts";

const symbol = (name: string) => {
  const svg = readFileSync(
    `node_modules/lucide-static/icons/${name}.svg`,
    "utf8",
  );
  const body = svg
    .slice(svg.indexOf(">", svg.indexOf("<svg")) + 1, svg.lastIndexOf("</svg>"))
    .trim();

  return `<symbol id="${name}" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</symbol>`;
};

writeFileSync(
  "src/icons/icons.svg",
  `<svg xmlns="http://www.w3.org/2000/svg">\n<!-- Lucide icons, ISC licence, https://lucide.dev/license -->\n${icons.map(symbol).join("\n")}\n</svg>\n`,
);
