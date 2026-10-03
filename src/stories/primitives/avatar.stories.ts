import type { Meta } from "@storybook/html-vite";
import { html, select, type Story } from "../html";
import { avatar, peopleStack } from "./people";

type Args = {
  names: string;
  size: "default" | "sm";
  tone: number;
  shown: number;
};

const stack = ({ names, shown }: Args) =>
  peopleStack(
    names.split(",").map((name) => name.trim()),
    shown,
  );

export default {
  title: "Primitives/Avatar",
  args: { names: "Alex", size: "default", tone: 4, shown: 3 },
  argTypes: {
    size: select(["default", "sm"]),
    tone: { control: { type: "range", min: 0, max: 7 } },
  },
} satisfies Meta<Args>;

export const Single: Story<Args> = {
  ...html<Args>(({ names, tone, size }) => avatar(names, tone, size)),
};

export const Small: Story<Args> = {
  ...html<Args>(({ names, tone, size }) => avatar(names, tone, size)),
  args: { names: "Dave", size: "sm", tone: 1 },
};

export const Tones: Story<Args> = {
  ...html<Args>(({ names, size }) =>
    Array.from({ length: 8 }, (_, tone) => avatar(names, tone, size)).join(
      "\n",
    ),
  ),
  args: { names: "Grace Hopper" },
};

export const Stack: Story<Args> = {
  ...html(stack),
  args: {
    names: "Ada Lovelace, Grace Hopper, Alan Turing, Katherine Johnson, Dave",
    shown: 3,
  },
};
