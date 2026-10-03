import type { Meta } from "@storybook/react-vite";
import { html, mobile } from "../html";

const header = `
<div class="ui-page-header" style="position:static;margin:0">
  <div class="ui-page-title">
    <h1>Flow</h1>
    <p>How work moves from started to released, where it waits, and what could help.</p>
  </div>
</div>`;

const withActions = `
<div class="ui-page-header" style="position:static;margin:0">
  <div class="ui-page-title">
    <div class="ui-page-title-row"><h1>Tasks</h1><div class="ui-page-actions"><a class="ui-button" href="#new">New task</a></div></div>
  </div>
</div>`;

const section = `
<section class="ui-section-heading">
  <h2>Where time is spent</h2>
  <p>How long the 224 tasks finished in the last 30 days stayed in each status, from the moment work on them started until they were released.</p>
</section>`;

const aside = `
<div class="ui-page">
  ${withActions}
  <div class="ui-page-split">
    <div><p>Teams want the cycle time chart as a file they can paste into a report.</p></div>
    <aside aria-label="Details"><p class="ui-empty">No assignee</p></aside>
  </div>
</div>`;

export default { title: "Layout/Page" } satisfies Meta;

export const TitleAndSubtitle = html(header);

export const TitleAndActions = html(withActions);

export const SectionHeading = html(section);

export const WithAside = html(aside);

export const ItemList = html(`
<ul class="ui-item-list">
  <li>Webapp</li>
  <li>CLI</li>
</ul>`);

export const Empty = html(`<p class="ui-empty">No releases yet</p>`);

export const Mobile = mobile(`<div class="ui-page">${header}${section}</div>`);
