import type { Meta } from "@storybook/react-vite";
import { icons } from "../../icons/names";
import { html, icon, mobile } from "../html";

const gallery = `
<ul style="display:grid;grid-template-columns:repeat(auto-fill,minmax(10rem,1fr));gap:.75rem;padding:0;list-style:none">
  ${icons.map((name) => `<li style="display:flex;gap:.5rem;align-items:center;font-size:.875rem">${icon(name)}<code>${name}</code></li>`).join("")}
</ul>`;

export default {
  title: "Primitives/Icon",
  parameters: {
    docs: {
      description: {
        component:
          'The Lucide icons the app imports, as one sprite. Reference them with <svg class="ui-icon"><use href="/icons.svg#name"/></svg>.',
      },
    },
  },
} satisfies Meta;

export const Gallery = html(gallery);

export const Sizes = html(
  `<p style="display:flex;gap:1rem;align-items:center">${icon("bell", "3")}${icon("bell", "3.5")}${icon("bell")}${icon("bell", "5")}</p>`,
);

export const Mobile = mobile(gallery);
