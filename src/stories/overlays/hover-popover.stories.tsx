import type { Meta } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";
import { html, icon, type Story } from "../html";

type Args = { label: string; hint: string };

export default {
  title: "Overlays/Hover popover",
  ...html<Args>(
    ({
      label,
      hint,
    }) => `<button class="ui-age" type="button" popovertarget="hint" interestfor="hint" aria-label="${hint}">${icon("clock-alert", "3.5")}${label}</button>
<div class="ui-popover" data-size="hint" id="hint" popover><p>${hint}</p></div>`,
  ),
  args: { label: "4d", hint: "Hasn't moved in 4 days" },
  parameters: {
    docs: {
      description: {
        component:
          "Opens 150 ms after the pointer rests on it and pins on click. Browsers without interestfor get the same through atlas-ui/interest.js.",
      },
    },
  },
} satisfies Meta<Args>;

export const Closed: Story<Args> = {};

export const OnHover: Story<Args> = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.hover(canvas.getByRole("button", { name: args.hint }));

    await waitFor(() =>
      expect(canvas.getByText(args.hint, { selector: "p" })).toBeVisible(),
    );
  },
};

export const Pinned: Story<Args> = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: args.hint }));

    await expect(canvas.getByText(args.hint, { selector: "p" })).toBeVisible();
  },
};
