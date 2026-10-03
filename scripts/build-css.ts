import { bundle } from "lightningcss";
import { writeFileSync } from "node:fs";

const version = (major: number, minor = 0) => (major << 16) | (minor << 8);
const targets = {
  chrome: version(133),
  safari: version(18, 4),
  firefox: version(138),
};
const { code } = bundle({
  filename: "src/css/index.css",
  minify: true,
  targets,
});

writeFileSync("dist/atlas-ui.css", code);
