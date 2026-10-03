import type { Meta } from "@storybook/react-vite";
import { html, mobile } from "../html";

const colors = [
  "bg",
  "fg",
  "surface",
  "primary",
  "primary-fg",
  "secondary",
  "muted",
  "muted-fg",
  "accent",
  "danger",
  "border",
  "input",
  "ring",
  "glow",
  "sidebar",
];
const charts = ["neutral", "neutral-soft", "blue", "yellow", "green", "red"];
const tones = [0, 1, 2, 3, 4, 5, 6, 7];

const swatch = (name: string, variable: string) => `
  <li style="display:flex;gap:.5rem;align-items:center">
    <span style="inline-size:2rem;block-size:2rem;border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);background:var(${variable})"></span>
    <code>${name}</code>
  </li>`;

const palette = `
<ul style="display:grid;grid-template-columns:repeat(auto-fill,minmax(10rem,1fr));gap:.75rem;list-style:none;padding:0">
  ${colors.map((name) => swatch(name, `--ui-color-${name}`)).join("")}
  ${charts.map((name) => swatch(`chart-${name}`, `--ui-chart-${name}`)).join("")}
  ${tones.map((tone) => swatch(`tone-${tone}`, `--ui-tone-${tone}`)).join("")}
</ul>`;

export default { title: "Foundations/Tokens" } satisfies Meta;

export const Palette = html(palette);

export const Theming = html(`
<div style="--ui-color-primary:#c2185b;--ui-radius:1rem">
  <p>Every token is a custom property. Override any of them on <code>:root</code> or on a subtree.</p>
  ${palette}
</div>`);

export const Mobile = mobile(palette);
