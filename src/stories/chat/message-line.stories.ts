import type { Meta } from "@storybook/html-vite";
import { expect, waitFor } from "storybook/test";
import { html, type Story } from "../html";
import { editingLine, type LineArgs, lines, messageLine } from "./chat";

type Args = LineArgs & { editing: boolean };

export default {
  title: "Chat/Message line",
  ...html<Args>((args) =>
    lines([args.editing ? editingLine(args) : messageLine(args)]),
  ),
  args: {
    id: "m1",
    time: "09:35",
    author: "Grace Hopper",
    tone: 4,
    body: "So, a long message | with some line breaks",
    edited: false,
    reactions: "",
    mine: "",
    own: false,
    admin: false,
    held: false,
    editing: false,
  },
  argTypes: { tone: { control: { type: "range", min: 0, max: 7 } } },
} satisfies Meta<Args>;

export const FromSomeoneElse: Story<Args> = {};

export const Own: Story<Args> = {
  args: { author: "Alex", own: true, held: true },
};

export const Edited: Story<Args> = {
  args: { body: "Shipped T-331 to staging", edited: true },
};

export const WithReactions: Story<Args> = {
  args: { reactions: "👍 3, 🎉 1", mine: "👍" },
};

export const Editing: Story<Args> = {
  args: { author: "Alex", own: true, editing: true },
};

export const Reacting: Story<Args> = {
  args: { held: true },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByTestId("react"));

    await waitFor(() =>
      expect(canvas.getByTestId("react-other")).toBeVisible(),
    );
  },
};
