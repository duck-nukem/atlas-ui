import { icon } from "../html";

export type ShellArgs = {
  organization: string;
  current: string;
  unread: number;
  mentioned: boolean;
  application: string;
};

const link = (name: string, label: string, current = false, dot = false) =>
  `<a class="ui-nav-link" href="#${label.toLowerCase().replaceAll(" ", "-")}"${current ? ' aria-current="page"' : ""}>${icon(name)}${label}${dot ? '<span class="ui-dot" role="status" aria-label="Someone mentioned you"></span>' : ""}</a>`;

export const applicationSelector = (
  id: string,
  application = "All applications",
) => `
<button class="ui-button ui-selector" data-variant="outline" data-size="sm" type="button" popovertarget="${id}">
  ${icon("app-window")}<span>${application}</span>${icon("chevron-down")}
</button>
<div class="ui-menu" data-align="end" id="${id}" popover>
  <a class="ui-menu-item" href="#all" autofocus>All applications</a>
  <hr class="ui-menu-separator">
  <a class="ui-menu-item" href="#webapp">Webapp</a>
  <a class="ui-menu-item" href="#cli">CLI</a>
</div>`;

export const nav = (
  id: string,
  { current, mentioned, application }: ShellArgs,
) => `
<nav class="ui-nav" aria-label="Main">
  <div class="ui-nav-section" role="group" aria-label="Team">
    <div class="ui-nav-heading"><span>Team</span></div>
    ${link("inbox", "My desk", current === "My desk")}${link("target", "Goals", current === "Goals")}${link("puzzle", "Features", current === "Features")}${link("dam", "Flow", current === "Flow")}${link("broom-sparkles", "Housekeeping", current === "Housekeeping")}${link("message-square", "Chat", current === "Chat", mentioned)}
  </div>
  <div class="ui-nav-section" role="group" aria-label="Application">
    <div class="ui-nav-heading">${applicationSelector(`${id}-applications`, application)}</div>
    ${link("square-check", "Tasks", current === "Tasks")}${link("git-branch", "Repositories", current === "Repositories")}${link("package", "Releases", current === "Releases")}${link("heart-pulse", "Health", current === "Health")}
  </div>
  <div class="ui-nav-section" role="group" aria-label="Settings">
    <div class="ui-nav-heading"><span>Settings</span></div>
    ${link("app-window", "Applications", current === "Applications")}${link("building-2", "Organization", current === "Organization")}
  </div>
</nav>`;

export const userMenu = `
<button class="ui-button ui-account" data-variant="ghost" data-size="icon" type="button" popovertarget="account-menu" aria-label="Account menu">
  <span class="ui-avatar"><span data-tone="4">A</span></span>
</button>
<div class="ui-menu" data-align="end" id="account-menu" popover>
  <div class="ui-menu-label"><div class="ui-account-name"><span>Alex Szabo</span><span>@alex</span></div></div>
  <hr class="ui-menu-separator">
  <a class="ui-menu-item" href="#account" autofocus>Account</a>
  <a class="ui-menu-item" href="#tokens">Personal access tokens</a>
  <form method="post" action="#logout"><button class="ui-menu-item" type="submit">Sign out</button></form>
</div>`;

export const shell = (args: ShellArgs, content: string) => `
<div class="ui-shell">
  <aside class="ui-shell-sidebar">
    <div class="ui-shell-org">${args.organization}</div>
    ${nav("sidebar", args)}
  </aside>
  <div class="ui-shell-main">
    <header class="ui-shell-header">
      <button class="ui-button ui-shell-menu" data-variant="ghost" data-size="icon" type="button" commandfor="navigation" command="show-modal" aria-label="Open navigation">${icon("menu", "5")}</button>
      <span class="ui-shell-title">${args.organization}</span>
      <span class="ui-shell-spacer"></span>
      <a class="ui-button" data-variant="ghost" data-size="icon" href="#docs" target="_blank" aria-label="Docs">${icon("book")}</a>
      <a class="ui-button" data-variant="ghost" data-size="icon" href="#notifications" aria-label="${args.unread === 0 ? "Notifications" : `Notifications, ${args.unread} unread`}">${icon("bell")}${args.unread === 0 ? "" : `<span class="ui-unread">${args.unread > 99 ? "99+" : args.unread}</span>`}</a>
      <button class="ui-button" data-variant="ghost" data-size="icon" type="button" aria-label="Toggle light or dark mode">${icon("sun-moon")}</button>
      ${userMenu}
    </header>
    <main class="ui-shell-content">${content}</main>
  </div>
</div>
<dialog class="ui-sheet ui-nav-sheet" id="navigation" aria-labelledby="navigation-title" closedby="any">
  <h2 id="navigation-title">${args.organization}</h2>
  <button class="ui-button ui-dialog-close" data-variant="ghost" data-size="icon-sm" type="button" commandfor="navigation" command="close" aria-label="Close">${icon("x")}</button>
  ${nav("drawer", args)}
</dialog>`;
