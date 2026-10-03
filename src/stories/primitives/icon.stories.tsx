import type { Meta } from "@storybook/react-vite";
import { icons } from "../../icons/names";
import { html, icon, select, type Story } from "../html";

type Args = { name: string; size: "" | "3" | "3.5" | "5" };

export default {
  title: "Primitives/Icon",
  args: { name: "bell", size: "" },
  argTypes: { name: select(icons), size: select(["", "3", "3.5", "5"]) },
} satisfies Meta<Args>;

export const Single: Story<Args> = {
  ...html<Args>(({ name, size }) => icon(name, size === "" ? undefined : size)),
};

export const Gallery: Story<Args> = {
  ...html<Args>(
    ({
      size,
    }) => `<ul style="display:grid;grid-template-columns:repeat(auto-fill,minmax(10rem,1fr));gap:.75rem;padding:0;list-style:none">
  ${icons.map((name) => `<li style="display:flex;gap:.5rem;align-items:center;font-size:.875rem">${icon(name, size === "" ? undefined : size)}<code>${name}</code></li>`).join("")}
</ul>`,
  ),
};
