import type { Meta } from "@storybook/react-vite";
import { html, icon, mobile } from "../html";

const header = `
<header class="ui-page-header">
  <nav class="ui-breadcrumbs" aria-label="Breadcrumb">
    <ol><li><a href="#goals">Goals</a></li><li><a href="#g-4">G-4</a></li><li><span aria-current="page">T-128</span></li></ol>
  </nav>
  <h1 class="ui-page-title">Export flow metrics as CSV</h1>
  <div class="ui-page-actions">
    <button class="ui-button" data-variant="outline" type="button">${icon("pencil")} Edit</button>
    <button class="ui-button" type="button">Start</button>
  </div>
</header>`;

const detail = `
<div class="ui-page">
  ${header}
  <div class="ui-split">
    <article class="ui-stack">
      <p>Teams want the cycle time chart as a file they can paste into a report.</p>
      <p>Export the visible range with one row per task.</p>
    </article>
    <aside class="ui-split-aside" aria-label="Details">
      <dl class="ui-facts">
        <div><dt>Status</dt><dd><span class="ui-badge" data-tone="2">In progress</span></dd></div>
        <div><dt>Assignee</dt><dd>Ada Lovelace</dd></div>
        <div><dt>Target</dt><dd>12 Oct</dd></div>
      </dl>
    </aside>
  </div>
</div>`;

export default { title: "Layout/Page" } satisfies Meta;

export const Detail = html(detail);

export const CardGrid = html(`
<div class="ui-page">
  <header class="ui-page-header"><h1 class="ui-page-title">Repositories</h1></header>
  <div class="ui-grid">
    ${["atlas", "atlas-ui", "infrastructure", "site"].map((name) => `<section class="ui-card"><h2>${name}</h2><p>Updated 2 hours ago</p></section>`).join("")}
  </div>
</div>`);

export const Narrow = html(`
<div class="ui-page" style="--ui-content-width:40rem">
  <header class="ui-page-header"><h1 class="ui-page-title">Account</h1></header>
  <section class="ui-card"><h2>Email</h2><p>ada@example.com</p></section>
</div>`);

export const Empty = html(`
<div class="ui-empty">
  ${icon("inbox", "lg")}
  <p style="margin:0">No notifications yet</p>
  <a class="ui-button" data-variant="outline" href="#settings">Notification settings</a>
</div>`);

export const Mobile = mobile(detail);
