import type { Meta } from "@storybook/html-vite";
import { expect, waitFor } from "storybook/test";
import { html, select, type Story } from "../html";
import { segments, type Status, statuses } from "./statuses";

type Args = { task: string; current: Status };

export default {
  title: "Data/Status selector",
  ...html(segments, {
    docs: {
      description: {
        component:
          "A form with one submit button per status, in order. The bar fills up to the pressed status; hovering or focusing a segment previews it. Works without JavaScript.",
      },
    },
  }),
  args: { task: "T-331", current: "ready" },
  argTypes: { current: select(statuses.map(([value]) => value)) },
} satisfies Meta<Args>;

export const Ready: Story<Args> = {};

export const Implementing: Story<Args> = { args: { current: "implementing" } };

export const Paused: Story<Args> = { args: { current: "paused" } };

export const Done: Story<Args> = { args: { current: "done" } };

export const Previewing: Story<Args> = {
  play: async ({ canvas }) => {
    canvas.getByTestId("set-status-testing").focus();

    await waitFor(() =>
      expect(canvas.getByTestId("status-preview-testing")).toBeVisible(),
    );
  },
};
