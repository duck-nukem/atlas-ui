import type { Meta } from "@storybook/react-vite";
import { esc, html, type Story } from "../html";

type Args = { title: string; intro: string; action: string };

export default {
  title: "Layout/Section heading",
  ...html<Args>(({ title, intro, action }) => {
    const heading =
      action === ""
        ? `<h2>${esc(title)}</h2>`
        : `<div class="ui-section-row"><h2>${esc(title)}</h2><a class="ui-button" data-variant="outline" data-size="sm" href="#action">${esc(action)}</a></div>`;

    return `<section class="ui-section">
  <div class="ui-section-heading">
    ${heading}${intro === "" ? "" : `\n    <p>${esc(intro)}</p>`}
  </div>
</section>`;
  }),
  args: {
    title: "Where time is spent",
    intro:
      "How long the 224 tasks finished in the last 30 days stayed in each status, from the moment work on them started until they were released.",
    action: "",
  },
} satisfies Meta<Args>;

export const Default: Story<Args> = {};

export const WithAction: Story<Args> = {
  args: {
    title: "Application health",
    intro: "Rated on the releases of the last 30 days.",
    action: "See releases",
  },
};
