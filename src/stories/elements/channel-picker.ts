import { icon } from "../html";

export type PickerArgs = {
  current: string;
  channels: string;
  people: string;
  unread: string;
  mentioned: string;
};

const list = (items: string, direct: boolean, args: PickerArgs) =>
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

export const picker = (args: PickerArgs) => {
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
