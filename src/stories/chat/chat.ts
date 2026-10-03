import { icon } from "../html";
import { avatar } from "../primitives/people";

export const quickReactions = ["👍", "🎉", "❤️", "😂", "👀"];

export type LineArgs = {
  id: string;
  time: string;
  author: string;
  tone: number;
  body: string;
  edited: boolean;
  reactions: string;
  mine: string;
  own: boolean;
  admin: boolean;
  held: boolean;
};

export const personId = (name: string) =>
  name.toLowerCase().replaceAll(" ", "-");

const authorName = ({ author, own }: LineArgs) =>
  own
    ? `<span>${author}</span>`
    : `<form method="post" action="#direct" class="ui-direct"><button type="submit" data-testid="message-${personId(author)}" title="Message ${author}">${author}</button></form>`;

const reactionList = ({ id, reactions, mine }: LineArgs) =>
  reactions === ""
    ? ""
    : `<div class="ui-reactions">
      ${reactions
        .split(",")
        .map((reaction) => reaction.trim().split(" "))
        .map(([emoji = "", count = "1"]) => {
          const pressed = mine
            .split(",")
            .map((value) => value.trim())
            .includes(emoji);

          return `<form method="post" action="#react"><input type="hidden" name="messageId" value="${id}"><input type="hidden" name="emoji" value="${emoji}"><button type="submit" data-testid="reaction-${emoji}" data-mine="${String(pressed)}" aria-pressed="${String(pressed)}">${emoji} ${count}</button></form>`;
        })
        .join("\n      ")}
    </div>`;

const reactionPicker = (
  id: string,
) => `<button type="button" data-testid="react" aria-label="Add a reaction" popovertarget="react-${id}">${icon("smile-plus", "3.5")}</button>
      <div class="ui-popover" data-size="reactions" id="react-${id}" popover>
        <div>
          ${quickReactions
            .map(
              (emoji) =>
                `<form method="post" action="#react"><input type="hidden" name="messageId" value="${id}"><input type="hidden" name="emoji" value="${emoji}"><button type="submit" data-testid="react-with-${emoji}" aria-label="React with ${emoji}">${emoji}</button></form>`,
            )
            .join("\n          ")}
        </div>
        <form method="post" action="#react">
          <input type="hidden" name="messageId" value="${id}">
          <input class="ui-input" name="emoji" required maxlength="32" autocomplete="off" data-testid="react-other" aria-label="Any other emoji" placeholder="Any other emoji">
          <span>Your system's emoji picker works here: Control+Command+Space on a Mac, Windows key+. on Windows.</span>
        </form>
      </div>`;

const lineActions = (
  args: LineArgs,
) => `<div class="ui-line-actions" data-testid="line-actions">
      ${reactionPicker(args.id)}${args.own ? `\n      <button type="button" data-testid="edit-message" aria-label="Edit">${icon("pencil", "3.5")}</button>` : ""}${
        args.own || args.admin
          ? `\n      <form method="post" action="#delete"><input type="hidden" name="messageId" value="${args.id}"><button type="submit" data-testid="delete-message" aria-label="Delete">${icon("trash-2", "3.5")}</button></form>`
          : ""
      }
    </div>`;

export const messageLine = (
  args: LineArgs,
) => `<li class="ui-chat-line" data-testid="chat-line" data-held="${String(args.held)}">
    <time datetime="2026-10-03T${args.time}" title="3 Oct 2026, ${args.time}" data-testid="line-time">${args.time}</time><span class="ui-line-author" data-tone="${String(args.tone)}" data-testid="line-author">${authorName(args)}</span><div class="ui-chat-body"><div class="ui-chat-text">${args.body
      .split("|")
      .map((paragraph) => `<p>${paragraph.trim()}</p>`)
      .join(
        "",
      )}</div>${args.edited ? '<span class="ui-edited" data-testid="message-edited">(edited)</span>' : ""}
    ${reactionList(args)}</div>
    ${lineActions(args)}
  </li>`;

export const editingLine = (
  args: LineArgs,
) => `<li class="ui-chat-line" data-testid="chat-line" data-held="${String(args.held)}">
    <time datetime="2026-10-03T${args.time}" title="3 Oct 2026, ${args.time}" data-testid="line-time">${args.time}</time><span class="ui-line-author" data-tone="${String(args.tone)}" data-testid="line-author">${authorName(args)}</span><form class="ui-line-editor" method="post" action="#edit">
      <input type="hidden" name="messageId" value="${args.id}">
      <textarea class="ui-textarea" name="body" autofocus required rows="1" data-testid="edit-body" aria-label="Edit message">${args.body.split("|").join("\n\n")}</textarea>
      <span>Enter saves, Escape cancels.</span>
    </form>
  </li>`;

export const presenceLine = (time: string, name: string, joined: boolean) =>
  `<li class="ui-presence-line" data-testid="presence-line" data-kind="${joined ? "joined" : "left"}"><time datetime="2026-10-02T${time}" title="2 Oct 2026, ${time}">${time}</time>*** ${joined ? `${name} just joined!` : `${name} has quit the channel`}</li>`;

export const dayBreak = (day: string, label: string) =>
  `<li class="ui-day-break" data-testid="day-break"><time datetime="${day}">${label}</time></li>`;

export const lines = (rows: readonly string[]) =>
  rows.length === 0
    ? '<p class="ui-chat-empty" data-testid="messages-empty">No messages yet. Say hello!</p>'
    : `<ol class="ui-chat-lines">
  ${rows.join("\n  ")}
</ol>`;

export const typing = (names: string) => {
  const people = names
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name !== "");
  const listed = new Intl.ListFormat("en", { type: "conjunction" }).format(
    people,
  );

  return `<p class="ui-chat-typing" aria-live="polite" data-testid="typing">${people.length === 0 ? "" : `${listed} ${people.length === 1 ? "is typing…" : "are typing…"}`}</p>`;
};

export const room = (
  content: string,
  typists: string,
) => `<div class="ui-chat-room">
  <div class="ui-chat-scroll" data-testid="chat-scroll">
    <div>
${content}
    </div>
  </div>
  ${typing(typists)}
</div>`;

export const composer = (
  placeholder: string,
) => `<form class="ui-composer" method="post" action="#send">
  <div>
    <div><textarea class="ui-textarea" name="body" rows="1" placeholder="${placeholder}" data-testid="message" aria-label="Message" required></textarea></div>
    <button class="ui-button" type="submit" data-testid="send-message">Send</button>
  </div>
  <div>
    <span>Enter sends, Shift+Enter starts a new line. Markdown and @mentions work.</span>
    <button class="ui-lifetime" type="button" data-testid="lifetime-notice" popovertarget="lifetime">${icon("info", "3.5")}Messages disappear after 7 days</button>
    <div class="ui-popover" data-size="lifetime" id="lifetime" popover><p data-testid="lifetime-explained">Chat is for quick syncs. Put decisions, agreements and instructions in documentation or email, where they stay.</p></div>
  </div>
</form>`;

export const joinToPost =
  '<p class="ui-empty" data-testid="join-to-post">Join the channel to post.</p>';

export type MemberArgs = { members: string; total: number; viewer: string };

export const members = ({ members: names, total, viewer }: MemberArgs) => {
  const people = names
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name !== "");

  if (people.length === 0) {
    return "";
  }

  const hiddenFaces = total - Math.min(people.length, 3);
  const unlisted = total - people.length;
  const title = `${String(total)} ${total === 1 ? "member" : "members"}`;

  return `<button class="ui-channel-members" type="button" data-testid="channel-members" data-count="${String(total)}" aria-label="${title}" popovertarget="members">
    <span class="ui-avatar-group">${people
      .slice(0, 3)
      .map((name, index) => avatar(name, index % 8, "sm"))
      .join(
        "",
      )}${hiddenFaces > 0 ? `<span class="ui-avatar-group-count">+${String(hiddenFaces)}</span>` : ""}</span>
  </button>
  <div class="ui-popover" data-size="members" id="members" popover>
    <p>${title}</p>
    <ul>
      ${people
        .map((name, index) =>
          name === viewer
            ? `<li><span class="ui-member">${avatar(name, index % 8, "sm")}<span>${name}</span><span>(you)</span></span></li>`
            : `<li><form method="post" action="#direct" class="ui-direct"><button class="ui-member" type="submit" data-testid="message-${personId(name)}" title="Message ${name}">${avatar(name, index % 8, "sm")}<span>${name}</span></button></form></li>`,
        )
        .join("\n      ")}
    </ul>${unlisted > 0 ? `\n    <p data-testid="members-unlisted">and ${String(unlisted)} more</p>` : ""}
  </div>`;
};

export type HeaderArgs = MemberArgs & {
  channel: string;
  topic: string;
  direct: boolean;
  member: boolean;
  admin: boolean;
};

const actions = ({ channel, direct, member, admin }: HeaderArgs) => {
  const name = direct ? channel : `#${channel}`;
  const mayLeave = member && !direct;
  const leave = (item: boolean) =>
    `<form method="post" action="#leave"><button class="${item ? "ui-menu-item" : "ui-button"}" ${item ? 'data-testid="menu-leave-channel"' : 'data-variant="outline" data-size="sm" data-testid="leave-channel"'} type="submit">Leave</button></form>`;

  return `<div class="ui-channel-actions">${!member && !direct ? '\n    <form method="post" action="#join"><button class="ui-button" data-size="sm" type="submit" data-testid="join-channel">Join</button></form>' : ""}
    <div data-wide-only>${mayLeave ? `\n      ${leave(false)}` : ""}${
      admin
        ? `
      <details class="ui-confirm">
        <summary class="ui-button" data-variant="ghost" data-size="sm" data-testid="confirm-arm"><span>Delete channel</span><span>Cancel</span></summary>
        <form method="post" action="#delete"><button class="ui-button" data-variant="destructive" data-size="sm" type="submit" data-testid="confirm-submit">Delete for good</button></form>
      </details>`
        : ""
    }
    </div>${
      mayLeave || admin
        ? `
    <div data-phones-only>
      <button class="ui-button" data-variant="ghost" data-size="icon-sm" type="button" data-testid="channel-menu" aria-label="Channel options" popovertarget="channel-menu">${icon("ellipsis")}</button>
      <div class="ui-menu" data-align="end" id="channel-menu" popover>${mayLeave ? `\n        ${leave(true)}` : ""}${admin ? '\n        <button class="ui-menu-item" data-variant="destructive" type="button" data-testid="menu-delete-channel" commandfor="delete-channel" command="show-modal">Delete channel</button>' : ""}
      </div>${
        admin
          ? `
      <dialog class="ui-dialog" id="delete-channel" aria-labelledby="delete-channel-title" aria-describedby="delete-channel-body" closedby="any">
        <div class="ui-dialog-header">
          <h2 id="delete-channel-title">Delete ${name}?</h2>
          <p id="delete-channel-body">The channel and all its messages are deleted for everyone.</p>
        </div>
        <div class="ui-dialog-footer">
          <button class="ui-button" data-variant="outline" type="button" commandfor="delete-channel" command="close">Cancel</button>
          <form method="post" action="#delete"><button class="ui-button" data-variant="destructive" type="submit" data-testid="confirm-delete-channel">Delete for good</button></form>
        </div>
        <button class="ui-button ui-dialog-close" data-variant="ghost" data-size="icon-sm" type="button" commandfor="delete-channel" command="close" aria-label="Close">${icon("x")}</button>
      </dialog>`
          : ""
      }
    </div>`
        : ""
    }
  </div>`;
};

export const channelHeader = (
  args: HeaderArgs,
  picker: string,
) => `<header class="ui-channel-header">
  <h1 data-testid="channel-title">${args.direct ? args.channel : `#${args.channel}`}</h1>
  ${picker}${args.topic === "" ? "" : `\n  <p data-testid="channel-topic">${args.topic}</p>`}
  ${members(args)}
  ${actions(args)}
</header>`;
