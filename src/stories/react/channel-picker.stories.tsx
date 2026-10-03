import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { ChannelPicker } from "../../react/chat/channel-picker";

const entries = [
  {
    id: "general",
    href: "#general",
    label: "general",
    direct: false,
    unread: true,
    mentioned: true,
  },
  {
    id: "releases",
    href: "#releases",
    label: "releases",
    direct: false,
    unread: true,
    mentioned: false,
  },
  {
    id: "random",
    href: "#random",
    label: "random",
    direct: false,
    unread: false,
    mentioned: false,
  },
  {
    id: "dm-grace",
    href: "#dm-grace",
    label: "Grace Hopper",
    direct: true,
    unread: false,
    mentioned: false,
  },
  {
    id: "dm-alan",
    href: "#dm-alan",
    label: "Alan Turing, Ada Lovelace",
    direct: true,
    unread: true,
    mentioned: true,
  },
];

const meta = {
  title: "React/Channel picker",
  component: ChannelPicker,
  args: { entries, activeId: "random", label: "#random", newHref: "#new" },
} satisfies Meta<typeof ChannelPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Closed: Story = {};

export const Open: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByTestId("channel-picker"));

    await expect(canvas.getByTestId("channel-search")).toBeVisible();
  },
};

export const NothingWaiting: Story = {
  args: {
    activeId: "general",
    entries: entries.slice(0, 4),
    label: "#general",
  },
};
