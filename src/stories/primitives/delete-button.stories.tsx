import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { html, type Story } from "../html";

type Args = { label: string; confirm: string };

export default {
  title: "Primitives/Delete button",
  ...html<Args>(
    ({ label, confirm }) => `<details class="ui-confirm">
  <summary class="ui-button" data-variant="ghost" data-size="sm"><span>${label}</span><span>Cancel</span></summary>
  <form method="post" action="#remove">
    <button class="ui-button" data-variant="destructive" data-size="sm" type="submit">${confirm}</button>
  </form>
</details>`,
  ),
  args: { label: "Remove from organization", confirm: "Remove Ada Lovelace?" },
} satisfies Meta<Args>;

export const Default: Story<Args> = {};

export const Armed: Story<Args> = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByText(args.label));

    await expect(
      canvas.getByRole("button", { name: args.confirm }),
    ).toBeVisible();
  },
};
