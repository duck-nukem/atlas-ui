import type { Meta } from "@storybook/react-vite";
import { icons } from "../../icons/names";
import { html, icon, mobile } from "../html";

const gallery = `
<ul style="display:grid;grid-template-columns:repeat(auto-fill,minmax(9rem,1fr));gap:.75rem;list-style:none;padding:0">
  ${icons.map((name) => `<li style="display:flex;gap:.5rem;align-items:center">${icon(name)}<code>${name}</code></li>`).join("")}
</ul>`;

export default { title: "Primitives/Icon" } satisfies Meta;

export const Gallery = html(gallery);

export const Sizes = html(
  `<p>${icon("rocket", "sm")} ${icon("rocket")} ${icon("rocket", "lg")}</p>`,
);

export const WithLabel = html(`
<p>${icon("clock")} Due tomorrow</p>
<p><svg class="ui-icon" role="img" aria-label="Overdue"><use href="icons.svg#clock-alert"/></svg></p>`);

export const Mobile = mobile(gallery);
