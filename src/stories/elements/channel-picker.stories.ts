import type { Meta } from "@storybook/html-vite";
import { expect } from "storybook/test";
import { html, icon, type Story } from "../html";

type Args = {
  current: string;
  channels: string;
  people: string;
  unread: string;
  mentioned: string;
};

const list = (items: string, direct: boolean, args: Args) =>
  items
    .split(",")
    .map((name) => name.trim())
    .map((name) => {
      const unread = args.unread
        .split(",")
        .map((value) => value.trim())
        .includes(name);
      const mentioned =
        args.mentioned
          .split(",")
          .map((value) => value.trim())
          .includes(name) && name !== args.current;

      return `<li><a class="ui-channel-link" href="#${name}" data-unread="${String(unread)}"${name === args.current ? ' aria-current="page"' : ""}>${icon(direct ? "message-circle" : "hash", "3.5")}<span>${name}</span>${unread ? '<span class="ui-sr-only">, Unread</span>' : ""}${mentioned ? '<span class="ui-dot" role="img" aria-label="Messages for you"></span>' : ""}</a></li>`;
    })
    .join("\n          ");

const picker = (args: Args) => {
  const attention = args.mentioned
    .split(",")
    .map((value) => value.trim())
    .some((name) => name !== "" && name !== args.current);

  return `<atlas-channel-picker label="#${args.current}"${attention ? " attention" : ""}>
  <div class="ui-channel-list">
    <ul>
      <li>
        <span>Channels</span>
        <ul>
          ${list(args.channels, false, args)}
        </ul>
      </li>
      <li>
        <span>Direct messages</span>
        <ul>
          ${list(args.people, true, args)}
        </ul>
      </li>
    </ul>
  </div>
  <a class="ui-channel-new" href="#new">${icon("plus", "3.5")}New channel</a>
</atlas-channel-picker>`;
};

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
