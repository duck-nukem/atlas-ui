import { icon } from "../html";

const link = (name: string, label: string, current = false, dot = false) =>
  `<a class="ui-nav-link" href="#${label.toLowerCase().replaceAll(" ", "-")}"${current ? ' aria-current="page"' : ""}>${icon(name)}${label}${dot ? '<span class="ui-dot" role="status" aria-label="Someone mentioned you"></span>' : ""}</a>`;

export const applicationSelector = (id: string) => `
<button class="ui-button ui-selector" data-variant="outline" data-size="sm" type="button" popovertarget="${id}">
  ${icon("app-window")}<span>All applications</span>${icon("chevron-down")}
</button>
<div class="ui-menu" data-align="end" id="${id}" popover>
  <a class="ui-menu-item" href="#all" autofocus>All applications</a>
  <hr class="ui-menu-separator">
  <a class="ui-menu-item" href="#webapp">Webapp</a>
  <a class="ui-menu-item" href="#cli">CLI</a>
</div>`;

export const nav = (id: string) => `
<nav class="ui-nav" aria-label="Main">
  <div class="ui-nav-section" role="group" aria-label="Team">
    <div class="ui-nav-heading"><span>Team</span></div>
    ${link("inbox", "My desk")}${link("target", "Goals")}${link("puzzle", "Features")}${link("dam", "Flow")}${link("broom-sparkles", "Housekeeping")}${link("message-square", "Chat", false, true)}
  </div>
  <div class="ui-nav-section" role="group" aria-label="Application">
    <div class="ui-nav-heading">${applicationSelector(`${id}-applications`)}</div>
    ${link("square-check", "Tasks", true)}${link("git-branch", "Repositories")}${link("package", "Releases")}${link("heart-pulse", "Health")}
  </div>
  <div class="ui-nav-section" role="group" aria-label="Settings">
    <div class="ui-nav-heading"><span>Settings</span></div>
    ${link("app-window", "Applications")}${link("building-2", "Organization")}
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

export const shell = (content: string) => `
<div class="ui-shell">
  <aside class="ui-shell-sidebar">
    <div class="ui-shell-org">Test org</div>
    ${nav("sidebar")}
  </aside>
  <div class="ui-shell-main">
    <header class="ui-shell-header">
      <button class="ui-button ui-shell-menu" data-variant="ghost" data-size="icon" type="button" commandfor="navigation" command="show-modal" aria-label="Open navigation">${icon("menu", "5")}</button>
      <span class="ui-shell-title">Test org</span>
      <span class="ui-shell-spacer"></span>
      <a class="ui-button" data-variant="ghost" data-size="icon" href="#docs" target="_blank" aria-label="Docs">${icon("book")}</a>
      <a class="ui-button" data-variant="ghost" data-size="icon" href="#notifications" aria-label="Notifications, 3 unread">${icon("bell")}<span class="ui-unread">3</span></a>
      <button class="ui-button" data-variant="ghost" data-size="icon" type="button" aria-label="Toggle light or dark mode">${icon("sun-moon")}</button>
      ${userMenu}
    </header>
    <main class="ui-shell-content">${content}</main>
  </div>
</div>
<dialog class="ui-sheet ui-nav-sheet" id="navigation" aria-labelledby="navigation-title" closedby="any">
  <h2 id="navigation-title">Test org</h2>
  <button class="ui-button ui-dialog-close" data-variant="ghost" data-size="icon-sm" type="button" commandfor="navigation" command="close" aria-label="Close">${icon("x")}</button>
  ${nav("drawer")}
</dialog>`;
