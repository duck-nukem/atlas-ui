import type { Meta } from "@storybook/react-vite";
import { esc, html, icon, type Story } from "../html";

type Args = { title: string; body: string; applications: string };

export default {
  title: "Layout/Choose an application",
  ...html<Args>(
    ({
      title,
      body,
      applications,
    }) => `<section class="ui-choose" aria-labelledby="choose-title">
  <div>${icon("app-window")}<h2 id="choose-title">${esc(title)}</h2></div>
  <p>${esc(body)}</p>
  <ul>
    ${applications
      .split(",")
      .map(
        (name) =>
          `<li><a class="ui-button" data-variant="outline" data-size="sm" href="#${name.trim()}"><span>${name.trim()}</span></a></li>`,
      )
      .join("\n    ")}
  </ul>
</section>`,
  ),
  args: {
    title: "Choose an application",
    body: "Delivery metrics are calculated for each application you deploy, even across several repositories. Please select an application from the menu.",
    applications: "Back office, Webapp",
  },
} satisfies Meta<Args>;

export const Default: Story<Args> = {};

type ListArgs = {
  items: string;
  variant: "boxed" | "ruled" | "plain";
  empty: string;
};

export const ItemList: Story<ListArgs> = {
  ...html<ListArgs>(({ items, variant, empty }) =>
    items === ""
      ? `<p class="ui-empty">${empty}</p>`
      : `<ul class="ui-item-list"${variant === "boxed" ? "" : ` data-variant="${variant}"`}>
  ${items
    .split(",")
    .map((item) => `<li>${item.trim()}</li>`)
    .join("\n  ")}
</ul>`,
  ),
  args: {
    items: "Webapp, Back office",
    variant: "boxed",
    empty: "No releases yet",
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["boxed", "ruled", "plain"] },
  },
};
