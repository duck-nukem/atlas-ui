import type { Meta } from "@storybook/html-vite";
import { html, type Story } from "../html";
import {
  dayBreak,
  type LineArgs,
  lines,
  messageLine,
  presenceLine,
  room,
} from "./chat";

type Args = { typists: string; empty: boolean };

const said = (args: Partial<LineArgs>): LineArgs => ({
  id: "m1",
  time: "09:35",
  author: "Alex",
  tone: 4,
  body: "",
  edited: false,
  reactions: "",
  mine: "",
  own: false,
  admin: false,
  held: false,
  ...args,
});

const conversation = [
  dayBreak("2026-10-02", "Friday 2 October"),
  presenceLine("22:50", "Alex", false),
  presenceLine("22:51", "Alex", true),
  dayBreak("2026-10-03", "Saturday 3 October"),
  messageLine(
    said({
      id: "m1",
      author: "Grace Hopper",
      tone: 1,
      body: 'Is <a class="app-link" href="#t-331">T-331</a> ready for review?',
    }),
  ),
  messageLine(
    said({
      id: "m2",
      time: "09:41",
      own: true,
      body: '<a class="mention" href="#grace">@grace</a> yes, it is on staging | Release notes follow',
      reactions: "👍 2",
      mine: "👍",
    }),
  ),
  messageLine(
    said({
      id: "m3",
      time: "09:44",
      author: "Alan Turing",
      tone: 6,
      body: "Run <code>npm run check</code> first",
      edited: true,
    }),
  ),
];

export default {
  title: "Chat/Message list",
  ...html<Args>(({ typists, empty }) =>
    room(lines(empty ? [] : conversation), typists),
  ),
  args: { typists: "", empty: false },
} satisfies Meta<Args>;

export const Conversation: Story<Args> = {};

export const Typing: Story<Args> = {
  args: { typists: "Grace Hopper, Alan Turing" },
};

export const Empty: Story<Args> = { args: { empty: true } };
