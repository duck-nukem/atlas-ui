import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { html, icon, mobile, productionContrast } from "../html";

const age = `
<p>T-331 Ask customers
  <button class="ui-age" type="button" popovertarget="age-hint" interestfor="age-hint" aria-label="Hasn't moved in 4 days">${icon("clock-alert", "3.5")}4d</button>
</p>
<div class="ui-popover" data-size="hint" id="age-hint" popover><p>Hasn't moved in 4 days</p></div>`;

export default {
  title: "Overlays/Hover popover",
  parameters: {
    ...productionContrast,
    docs: {
      description: {
        component:
          "Opens on hover after 150 ms where the browser supports interestfor, and on click everywhere through popovertarget.",
      },
    },
  },
} satisfies Meta;

export const Closed = html(age);

export const Pinned: StoryObj = {
  ...html(age),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole("button", { name: "Hasn't moved in 4 days" }),
    );

    await expect(
      canvas.getByText("Hasn't moved in 4 days", { selector: "p" }),
    ).toBeVisible();
  },
};

export const Mobile = mobile(age);
