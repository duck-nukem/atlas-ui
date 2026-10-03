import type { Meta } from "@storybook/html-vite";
import { expect, waitFor } from "storybook/test";
import { html, select, type Story } from "../html";
import { type Status, statuses } from "./statuses";

type Args = { task: string; current: Status };

const segments = ({ task, current }: Args) => {
  const label = statuses.find(([value]) => value === current)?.[1] ?? "";

  return `<form class="ui-status-segments" method="post" action="#status">
  <span class="ui-status-label" aria-live="polite" data-testid="shown-status" data-status="${current}"><span>${label}</span>${statuses.map(([value, name]) => `<span data-testid="status-preview-${value}">${name}</span>`).join("")}</span>
  <span class="ui-segments" role="group" aria-label="Status of ${task}">
    ${statuses
      .map(
        ([value, name]) =>
          `<button type="submit" data-testid="set-status-${value}" name="status" value="${value}" aria-label="Set ${task} to ${name}" aria-pressed="${String(value === current)}"></button>`,
      )
      .join("\n    ")}
  </span>
</form>`;
};

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
