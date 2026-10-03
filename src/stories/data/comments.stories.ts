import type { Meta } from "@storybook/html-vite";
import { expect } from "storybook/test";
import { html, icon, type Story } from "../html";
import { avatar } from "../primitives/people";

type Entry = {
  id: string;
  author: string;
  tone: number;
  at: string;
  body: string;
  edited: boolean;
};

const replies: Entry[] = [
  {
    id: "r1",
    author: "Alex",
    tone: 4,
    at: "28 Sept 2026, 09:41",
    body: "let's see, does it work here too?",
    edited: false,
  },
  {
    id: "r2",
    author: "Grace Hopper",
    tone: 1,
    at: "28 Sept 2026, 09:42",
    body: "@root looks a bit odd, but sure",
    edited: true,
  },
  {
    id: "r3",
    author: "Alan Turing",
    tone: 6,
    at: "28 Sept 2026, 10:05",
    body: "Works for me.",
    edited: false,
  },
];

const editor = (id: string, label: string, rows: number, value = "") =>
  `<div class="ui-field">
  <label class="ui-label" for="${id}">${label}</label>
  <textarea class="ui-textarea" id="${id}" name="body" data-testid="body" rows="${rows}">${value}</textarea>
  <div class="ui-editor-hints">
    <label>Attach file<input class="ui-sr-only" type="file" multiple data-testid="attach-file" aria-label="Attach file"></label>
    <span>Markdown is supported.</span>
  </div>
</div>`;

const tools = `<div class="ui-comment-tools">
        <button class="ui-button" data-variant="ghost" data-size="sm" type="button" data-testid="edit-comment">${icon("pencil", "3")}Edit</button>
        <button class="ui-button" data-variant="ghost" data-size="sm" type="button" data-testid="delete-comment">${icon("trash-2", "3")}Delete</button>
      </div>`;

const editing = (entry: Entry) => `<form class="ui-comment-edit" method="post">
        ${editor(`edit-${entry.id}`, "Edit comment", 4, entry.body)}
        <div>
          <button class="ui-button" data-size="sm" type="submit">Save</button>
          <button class="ui-button" data-variant="ghost" data-size="sm" type="button" data-testid="cancel">Cancel</button>
        </div>
      </form>`;

type CommentOptions = {
  compact: boolean;
  mayChange: boolean;
  editing: boolean;
  replyTo: boolean;
  footer: string;
  href: string;
};

const comment = (
  entry: Entry,
  options: CommentOptions,
) => `<article class="ui-comment"${options.compact ? ' data-size="compact"' : ""} id="comment-${entry.id}">
  ${avatar(entry.author, entry.tone, "default").replace('class="ui-avatar"', 'class="ui-avatar" data-testid="comment-initials"')}
  <div>
    <header>
      <span data-testid="comment-author">${entry.author}</span>
      <time datetime="2026-09-28">${entry.at}</time>${entry.edited ? '\n      <span data-testid="comment-edited">(edited)</span>' : ""}
      <span class="ui-comment-meta">${options.replyTo ? '<button type="button" data-testid="reply-to">Reply</button>' : ""}<a class="ui-permalink" data-testid="permalink" href="${options.href === "" ? `#comment-${entry.id}` : options.href}" aria-label="Link to this comment" title="Link to this comment (copies the link)">${icon("link-2", "3.5")}</a></span>
    </header>
    ${
      options.editing
        ? editing(entry)
        : `<div class="ui-comment-body">
      <div class="ui-markdown"><p>${entry.body}</p></div>${options.mayChange ? `\n      ${tools}` : ""}
    </div>`
    }${options.footer === "" ? "" : `\n    ${options.footer}`}
  </div>
</article>`;

type ThreadArgs = {
  author: string;
  body: string;
  replyCount: number;
  open: boolean;
  canReply: boolean;
  replying: boolean;
  mayChange: boolean;
  editing: boolean;
  edited: boolean;
};

const replyLine = (
  args: ThreadArgs,
  actions: string,
  id: string,
  href: string,
) => {
  const shown = replies.slice(0, args.replyCount);
  const last = shown.at(-1);
  const list =
    last === undefined
      ? ""
      : `<details class="ui-replies"${args.open ? " open" : ""}>
    <summary data-testid="replies-toggle"><span class="ui-repliers" aria-hidden="true">${[
      ...new Map(shown.map((entry) => [entry.author, entry])).values(),
    ]
      .map((entry) => avatar(entry.author, entry.tone, "sm"))
      .join(
        "",
      )}</span><span>${shown.length === 1 ? "1 reply" : `${String(shown.length)} replies`}</span></summary>
    <ol class="ui-comment-replies" data-testid="comment-replies">
      ${shown
        .map(
          (entry) =>
            `<li>${comment({ ...entry, id: `${id}-${entry.id}` }, { compact: true, mayChange: args.mayChange, editing: false, replyTo: args.canReply, footer: "", href })}</li>`,
        )
        .join("\n      ")}
    </ol>
  </details>
  <span class="ui-last-reply">last ${last.at}</span>`;
  const form = args.canReply
    ? `<details class="ui-reply-form"${args.replying ? " open" : ""}>
    <summary data-testid="reply-open">Reply</summary>
    <form class="ui-comment-form" method="post">
      ${editor(`reply-${id}`, "Write a reply", 2)}
      <div><button class="ui-button" type="submit" data-testid="submit">Reply</button></div>
    </form>
  </details>`
    : "";

  return list === "" && form === "" && actions === ""
    ? ""
    : `<div class="ui-reply-line" data-testid="reply-line">
  ${[list, form, actions].filter((part) => part !== "").join("\n  ")}
</div>`;
};

const thread = (
  args: ThreadArgs,
  top = "",
  actions = "",
  id = "c1",
  href = "",
) =>
  `<div class="ui-thread">${top === "" ? "" : `\n  ${top}`}
  ${comment(
    {
      id,
      author: args.author,
      tone: 4,
      at: "28 Sept 2026, 08:46",
      body: args.body,
      edited: args.edited,
    },
    {
      compact: false,
      mayChange: args.mayChange,
      editing: args.editing,
      replyTo: false,
      footer: replyLine(args, actions, id, href),
      href,
    },
  )}
</div>`;

export default {
  title: "Data/Comments",
  ...html<ThreadArgs>(
    (args) => `<ol class="ui-comment-list">
  <li>${thread(args)}</li>
  <li>${thread({ ...args, body: "Another top level", replyCount: 0, replying: false, editing: false, edited: false }, "", "", "c2")}</li>
</ol>`,
  ),
  args: {
    author: "Alex",
    body: "test comment before replies",
    replyCount: 2,
    open: true,
    canReply: true,
    replying: false,
    mayChange: true,
    editing: false,
    edited: false,
  },
  argTypes: { replyCount: { control: { type: "range", min: 0, max: 3 } } },
} satisfies Meta<ThreadArgs>;

export const Threads: Story<ThreadArgs> = {};

export const Collapsed: Story<ThreadArgs> = { args: { open: false } };

export const Replying: Story<ThreadArgs> = {
  args: { replying: true },
  play: async ({ canvas, userEvent }) => {
    const opener = canvas.getAllByTestId("reply-open")[1]!;

    await userEvent.click(opener);

    await expect(
      canvas.getAllByRole("textbox", { name: "Write a reply" })[1],
    ).toBeVisible();
  },
};

export const ReadOnly: Story<ThreadArgs> = {
  args: { canReply: false, mayChange: false },
};

export const Editing: Story<ThreadArgs> = {
  args: { editing: true, replyCount: 0 },
};

export const Empty: Story<ThreadArgs> = {
  ...html<ThreadArgs>(
    ({ canReply }) => `<section class="ui-comments">
  <p class="ui-empty" data-testid="comments-empty">No comments yet.</p>${
    canReply
      ? `
  <form class="ui-comment-form" method="post">
    ${editor("comment", "Add a comment", 4)}
    <div><button class="ui-button" type="submit" data-testid="submit">Comment</button></div>
  </form>`
      : ""
  }
</section>`,
  ),
  parameters: { controls: { include: ["canReply"] } },
};

type ReviewArgs = ThreadArgs & {
  resolvedBy: string;
  commit: string;
  anchor: string;
};

export const ReviewThread: Story<ReviewArgs> = {
  ...html<ReviewArgs>((args) => {
    const anchor = `<a class="ui-thread-anchor" data-testid="thread-anchor" data-commit="${args.commit}" href="#dc-1">${args.commit} · ${args.anchor}</a>`;

    return args.resolvedBy === ""
      ? `<article class="ui-review-thread" id="dc-1">
  ${thread(args, anchor, '<button type="button" data-testid="resolve-thread">Resolve</button>', "c1", "#dc-1")}
</article>`
      : `<div class="ui-review-thread" id="dc-1">
  <div class="ui-resolved-line">
    <details>
      <summary>${icon("check-circle-2", "3")}<span>Resolved by ${args.resolvedBy}</span></summary>
      ${thread(args, "", "", "c1", "#dc-1")}
    </details>
    ${anchor}
    <button type="button" data-testid="reopen-thread">Reopen</button>
  </div>
</div>`;
  }),
  args: {
    open: false,
    resolvedBy: "",
    commit: "931da0f",
    anchor: "src/components/git/changed-files.tsx, line 42",
  },
};

export const ResolvedReviewThread: Story<ReviewArgs> = {
  ...ReviewThread,
  args: { ...ReviewThread.args, resolvedBy: "Grace Hopper" },
  play: async ({ canvas, userEvent, args }) => {
    const summary = canvas.getByText(`Resolved by ${args.resolvedBy}`);

    await userEvent.click(summary);

    await expect(canvas.getByTestId("replies-toggle")).toBeVisible();
  },
};
