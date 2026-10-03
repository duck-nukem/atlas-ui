import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { html, mobile } from "../html";

const card = `
<p>Blocked by <a href="#t-96" interestfor="t-96-card">T-96</a> until the export API ships.</p>
<div class="ui-popover ui-hovercard" id="t-96-card" popover="hint">
  <p class="ui-row"><span class="ui-badge" data-tone="4">In review</span> <strong>T-96</strong></p>
  <p><strong>Add a CSV export endpoint</strong></p>
  <p>Streams rows for the selected range. Owner: <em>Grace Hopper</em>.</p>
  <ul><li>3 of 4 checks passed</li><li>Due 10 Oct</li></ul>
</div>`;

const info = `
<p class="ui-row">Cycle time
  <button class="ui-button" data-variant="ghost" data-shape="icon" data-size="xs" type="button" popovertarget="cycle-help" interestfor="cycle-help" aria-label="About cycle time">?</button>
</p>
<div class="ui-popover ui-hovercard" id="cycle-help" popover>
  <p><strong>Cycle time</strong></p>
  <p>Days from <em>started</em> to <em>done</em>, as the 85th percentile of the last 30 days.</p>
</div>`;

export default {
  title: "Overlays/Hover popover",
  parameters: {
    docs: {
      description: {
        component:
          "interestfor opens the popover on hover and keyboard focus, and a popovertarget on the same button opens it on tap. Browsers without interestfor never show a link preview, so it holds extras only. A hover card holds no links or buttons, because it closes when the pointer leaves.",
      },
    },
  },
} satisfies Meta;

export const LinkPreview = html(card);

export const HelpButton = html(info);

export const Tapped: StoryObj = {
  ...html(info),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole("button", { name: "About cycle time" }),
    );

    await expect(
      canvas.getByText("Cycle time", { selector: "strong" }),
    ).toBeVisible();
  },
};

export const Mobile = mobile(card + info);
