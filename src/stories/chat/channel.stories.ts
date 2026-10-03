import type { Meta } from "@storybook/html-vite";
import { expect, waitFor } from "storybook/test";
import { html, type Story } from "../html";
import { picker } from "../elements/channel-picker";
import {
  channelHeader,
  composer,
  dayBreak,
  type HeaderArgs,
  joinToPost,
  lines,
  messageLine,
  room,
} from "./chat";

type Args = HeaderArgs & { typists: string };

const page = (args: Args) => {
  const heading = args.direct ? args.channel : `#${args.channel}`;

  return `<div class="ui-chat">
${channelHeader(
  args,
  picker({
    current: args.channel,
    channels: "general, releases, random",
    people: "Grace Hopper, Alan Turing",
    unread: "general",
    mentioned: "",
    label: heading,
  }),
)}
<div class="ui-chat-room">
${room(
  lines([
    dayBreak("2026-10-03", "Saturday 3 October"),
    messageLine({
      id: "m1",
      time: "09:35",
      author: "Grace Hopper",
      tone: 1,
      body: "Morning! Anything blocking the release?",
      edited: false,
      reactions: "",
      mine: "",
      own: false,
      admin: args.admin,
      held: false,
    }),
  ]),
  args.typists,
)}
${args.member ? composer(args.direct ? `Message ${args.channel}` : `Message #${args.channel}`) : joinToPost}
</div>
</div>`;
};

export default {
  title: "Chat/Channel",
  ...html<Args>(page),
  args: {
    channel: "random",
    topic: "jokes and all",
    direct: false,
    member: true,
    admin: false,
    members: "Alex, Grace Hopper, Alan Turing, Katherine Johnson",
    total: 4,
    viewer: "Alex",
    typists: "",
  },
  argTypes: { total: { control: { type: "range", min: 1, max: 80 } } },
} satisfies Meta<Args>;

export const Member: Story<Args> = {};

export const NotMember: Story<Args> = { args: { member: false } };

export const Admin: Story<Args> = { args: { admin: true } };

export const NoTopic: Story<Args> = { args: { topic: "" } };

export const Direct: Story<Args> = {
  args: {
    channel: "Grace Hopper",
    direct: true,
    topic: "",
    members: "Alex, Grace Hopper",
    total: 2,
  },
};

export const Members: Story<Args> = {
  args: { total: 62 },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByTestId("channel-members"));

    await waitFor(() =>
      expect(canvas.getByTestId("members-unlisted")).toBeVisible(),
    );
  },
};

export const MessagesDisappear: Story<Args> = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByTestId("lifetime-notice"));

    await waitFor(() =>
      expect(canvas.getByTestId("lifetime-explained")).toBeVisible(),
    );
  },
};

export const NoChannels: Story<Args> = {
  ...html<Args>(
    (args) => `<div class="ui-chat-index">
  <h1>Chat</h1>
  <div>
    ${picker({
      current: "",
      channels: "",
      people: args.members
        .split(",")
        .map((name) => name.trim())
        .filter((name) => name !== args.viewer)
        .join(", "),
      unread: "",
      mentioned: "",
      label: "Chat",
    })}
  </div>
  <p class="ui-chat-none" data-testid="no-channels">No channels yet. <a href="#new-channel">Create the first one.</a></p>
</div>`,
  ),
};
