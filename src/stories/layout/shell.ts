import { icon } from "../html";

const link = (name: string, label: string, current = false, dot = false) =>
  `<a class="ui-nav-link" href="#${label.toLowerCase().replaceAll(" ", "-")}"${current ? ' aria-current="page"' : ""}>${icon(name)}${label}${dot ? '<span class="ui-dot" role="status" aria-label="Someone mentioned you"></span>' : ""}</a>`;

export const applicationSelector = (id: string) => `
<button class="ui-button" data-variant="outline" data-size="sm" style="width:100%;min-width:0;justify-content:flex-start" type="button" popovertarget="${id}">
  ${icon("app-window")}<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">All applications</span>${icon("chevron-down").replace('class="ui-icon"', 'class="ui-icon" style="margin-left:auto"')}
</button>
<div class="ui-menu" id="${id}" popover style="max-width:18rem">
  <a class="ui-menu-item" href="#all">All applications</a>
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
<button class="ui-button" data-variant="ghost" data-size="icon" type="button" popovertarget="account-menu" aria-label="Account menu">
  <span class="ui-avatar" style="width:1.75rem;height:1.75rem"><span data-tone="4">A</span></span>
</button>
<div class="ui-menu" id="account-menu" popover>
  <div class="ui-menu-label"><div style="display:grid"><span>Alex Szabo</span><span style="font-size:.75rem;font-weight:400">@alex</span></div></div>
  <hr class="ui-menu-separator">
  <a class="ui-menu-item" href="#account">Account</a>
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
      <a class="ui-button" data-variant="ghost" data-size="icon" href="#docs" aria-label="Docs">${icon("book")}</a>
      <a class="ui-button" data-variant="ghost" data-size="icon" style="position:relative" href="#notifications" aria-label="Notifications, 3 unread">${icon("bell")}<span class="ui-unread">3</span></a>
      <button class="ui-button" data-variant="ghost" data-size="icon" type="button" aria-label="Toggle light or dark mode">${icon("sun-moon")}</button>
      ${userMenu}
    </header>
    <main class="ui-shell-content">${content}</main>
  </div>
</div>
<dialog class="ui-sheet" id="navigation" aria-labelledby="navigation-title" closedby="any" style="width:16rem;padding:.75rem">
  <h2 id="navigation-title" style="padding:.25rem .5rem;font-size:.875rem;font-weight:600">Test org</h2>
  <button class="ui-button ui-dialog-close" data-variant="ghost" data-size="icon-sm" type="button" commandfor="navigation" command="close" aria-label="Close">${icon("x")}</button>
  ${nav("drawer")}
</dialog>`;
