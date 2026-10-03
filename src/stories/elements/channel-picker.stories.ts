import type { Meta } from "@storybook/html-vite";
import { expect } from "storybook/test";
import { html, type Story } from "../html";
import { type PickerArgs as Args, picker } from "./channel-picker";

export default {
  title: "Elements/Channel picker",
  ...html(picker, {
    docs: {
      description: {
        component:
          "Server-render the channel links inside atlas-channel-picker. Without JavaScript it is a plain list of links; with atlas-ui/elements.js it becomes the searchable popover.",
      },
    },
  }),
  args: {
    current: "random",
    channels: "general, releases, random",
    people: "Grace Hopper, Alan Turing",
    unread: "general, releases, Alan Turing",
    mentioned: "general, Alan Turing",
  },
} satisfies Meta<Args>;

export const Closed: Story<Args> = {};

export const Open: Story<Args> = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByTestId("channel-picker"));

    await expect(canvas.getByTestId("channel-search")).toBeVisible();
  },
};

export const NothingWaiting: Story<Args> = { args: { mentioned: "" } };
