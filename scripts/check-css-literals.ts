// usage: node scripts/check-css-literals.ts
import { readdirSync, readFileSync } from "node:fs";

const folder = "src/css/components";
const literal =
  /#[0-9a-f]{3,8}\b|\b(rgba?|hsla?|oklch|oklab)\(|font-family|font-\[/i;
const found = readdirSync(folder).flatMap((file) =>
  readFileSync(`${folder}/${file}`, "utf8")
    .split("\n")
    .flatMap((line, index) =>
      literal.test(line)
        ? [`${folder}/${file}:${index + 1}: ${line.trim()}`]
        : [],
    ),
);

if (found.length > 0) {
  console.error(`Colours and fonts belong in tokens.css:\n${found.join("\n")}`);
  process.exit(1);
}
