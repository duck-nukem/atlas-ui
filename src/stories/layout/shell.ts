import { icon } from "../html";

const sections = [
  {
    heading: "Work",
    links: [
      ["house", "Home", true],
      ["square-check", "Tasks", false],
      ["target", "Goals", false],
      ["puzzle", "Features", false],
    ],
  },
  {
    heading: "Team",
    links: [
      ["message-square", "Chat", false],
      ["git-branch", "Repositories", false],
      ["heart-pulse", "Health", false],
    ],
  },
] as const;

export const nav = () => `
<nav class="ui-nav" aria-label="Main">
  ${sections
    .map(
      ({ heading, links }) => `
  <section>
    <h2 class="ui-nav-heading">${heading}</h2>
    <ul role="list">
      ${links
        .map(
          ([name, text, current]) =>
            `<li><a class="ui-nav-link" href="#${text.toLowerCase()}"${current ? ' aria-current="page"' : ""}>${icon(name)} ${text}${text === "Chat" ? '<span class="ui-nav-dot" role="img" aria-label="Unread"></span>' : ""}</a></li>`,
        )
        .join("")}
    </ul>
  </section>`,
    )
    .join("")}
</nav>`;

export const shell = (content: string) => `
<div class="ui-shell">
  <div class="ui-shell-sidebar">
    <div class="ui-shell-brand">Acme</div>
    ${nav()}
  </div>
  <div class="ui-shell-main">
    <header class="ui-shell-header">
      <button class="ui-button ui-shell-menu" data-variant="ghost" data-shape="icon" type="button" commandfor="nav-drawer" command="show-modal" aria-label="Open menu">${icon("menu")}</button>
      <span class="ui-shell-title">Acme</span>
      <span class="ui-shell-spacer"></span>
      <a class="ui-button" data-variant="ghost" data-shape="icon" href="#docs" aria-label="Docs">${icon("book")}</a>
      <a class="ui-button" data-variant="ghost" data-shape="icon" href="#inbox" aria-label="Notifications, 3 unread">${icon("bell")}</a>
      <a class="ui-avatar" data-size="sm" data-tone="1" href="#account" aria-label="Account">AL</a>
    </header>
    <main class="ui-shell-content">${content}</main>
  </div>
</div>
<dialog class="ui-drawer" id="nav-drawer" aria-label="Menu" closedby="any">
  <div class="ui-drawer-header">Acme
    <button class="ui-button" data-variant="ghost" data-shape="icon" type="button" commandfor="nav-drawer" command="close" aria-label="Close menu">${icon("x")}</button>
  </div>
  ${nav()}
</dialog>`;
