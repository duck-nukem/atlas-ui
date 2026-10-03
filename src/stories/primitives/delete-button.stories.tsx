import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { html, mobile } from "../html";

const confirm = `
<details class="ui-confirm">
  <summary class="ui-button" data-variant="ghost" data-size="sm"><span>Remove from organization</span><span>Cancel</span></summary>
  <form method="post" action="#remove">
    <button class="ui-button" data-variant="destructive" data-size="sm" type="submit">Remove Ada Lovelace?</button>
  </form>
</details>`;

export default {
  title: "Primitives/Delete button",
  parameters: {
    docs: {
      description: {
        component:
          "The first press arms the button and shows the confirm and Cancel buttons. Native details hold the state, so it needs no script.",
      },
    },
  },
} satisfies Meta;

export const Default = html(confirm);

export const Armed: StoryObj = {
  ...html(confirm),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByText("Remove from organization"));

    await expect(
      canvas.getByRole("button", { name: "Remove Ada Lovelace?" }),
    ).toBeVisible();
  },
};

export const Mobile = mobile(confirm);
