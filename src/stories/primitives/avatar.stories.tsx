import type { Meta } from "@storybook/react-vite";
import { html, select, type Story } from "../html";

type Args = {
  names: string;
  size: "default" | "sm";
  tone: number;
  shown: number;
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

const avatar = (name: string, tone: number, size: string) =>
  `<span class="ui-avatar"${size === "default" ? "" : ` data-size="${size}"`}><span data-tone="${tone}">${initials(name)}</span></span>`;

const stack = ({ names, shown }: Args) => {
  const people = names.split(",").map((name) => name.trim());
  const more = people.length - shown;

  return `<button class="ui-avatar-stack" type="button" aria-label="${people.join(", ")}">
  <span class="ui-avatar-group">
    ${people
      .slice(0, shown)
      .map((name, index) => avatar(name, index % 8, "sm"))
      .join(
        "",
      )}${more > 0 ? `<span class="ui-avatar-group-count">+${more}</span>` : ""}
  </span>
</button>`;
};

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
  parameters: { ...html(stack).parameters },
};
