import type { Meta } from "@storybook/react-vite";
import { html, icon, mobile } from "../html";

const tasks = [
  [
    "T-128",
    "Export flow metrics as CSV",
    "In progress",
    2,
    "Ada Lovelace",
    "3 d",
  ],
  [
    "T-127",
    "Show join and leave lines in chat",
    "Ready",
    0,
    "Grace Hopper",
    "1 d",
  ],
  [
    "T-126",
    "Parse work item keys before lookups",
    "Done",
    3,
    "Alan Turing",
    "5 d",
  ],
  [
    "T-125",
    "Brand keys on entities and rows",
    "In review",
    4,
    "Katherine Johnson",
    "2 d",
  ],
] as const;

const filters = `
<form class="ui-filter-bar" method="get" action="#tasks" role="search" aria-label="Filter tasks">
  <div class="ui-field">
    <label class="ui-label" for="q">Search</label>
    <input class="ui-input" id="q" name="q" type="search" value="export">
  </div>
  <div class="ui-field">
    <label class="ui-label" for="status">Status</label>
    <select class="ui-input" id="status" name="status">
      <option value="">Any</option><option selected>In progress</option><option>Ready</option><option>Done</option>
    </select>
  </div>
  <button class="ui-button" data-variant="outline" type="submit">${icon("funnel")} Filter</button>
</form>
<div class="ui-row">
  <span class="ui-badge" data-variant="secondary">Status: In progress <a class="ui-badge-remove" href="#tasks?q=export" aria-label="Remove Status: In progress">${icon("x", "sm")}</a></span>
  <a href="#tasks">Clear filters</a>
</div>`;

const table = (stack: boolean) => `
<div class="ui-table-scroll" role="region" aria-label="Tasks" tabindex="0">
  <table class="ui-table"${stack ? " data-stack" : ""}>
    <thead>
      <tr>
        <th scope="col" aria-sort="descending"><a class="ui-sort" href="#tasks?sort=key">Key</a></th>
        <th scope="col"><a class="ui-sort" href="#tasks?sort=title">Title</a></th>
        <th scope="col">Status</th>
        <th scope="col">Assignee</th>
        <th scope="col" data-align="end"><a class="ui-sort" href="#tasks?sort=age">Age</a></th>
      </tr>
    </thead>
    <tbody>
      ${tasks
        .map(
          ([key, title, status, tone, person, age]) => `
      <tr>
        <td data-label="Key"><a href="#${key}">${key}</a></td>
        <td data-label="Title">${title}</td>
        <td data-label="Status"><span class="ui-badge" data-tone="${tone}">${status}</span></td>
        <td data-label="Assignee">${person}</td>
        <td data-label="Age" data-align="end">${age}</td>
      </tr>`,
        )
        .join("")}
    </tbody>
  </table>
</div>`;

const pagination = `
<nav class="ui-pagination" aria-label="Pagination">
  <span>21–40 of 312</span>
  <ol>
    <li><a class="ui-button" data-variant="outline" data-size="sm" href="#page-1" rel="prev">${icon("chevron-left")} Previous</a></li>
    <li><a class="ui-button" data-variant="outline" data-size="sm" href="#page-1">1</a></li>
    <li><a class="ui-button" data-variant="outline" data-size="sm" href="#page-2" aria-current="page">2</a></li>
    <li><a class="ui-button" data-variant="outline" data-size="sm" href="#page-3">3</a></li>
    <li><a class="ui-button" data-variant="outline" data-size="sm" href="#page-3" rel="next">Next ${icon("chevron-right")}</a></li>
  </ol>
</nav>`;

export default {
  title: "Data/Table",
  parameters: {
    docs: {
      description: {
        component:
          "Sorting, filtering and paging are links and a GET form, so the server renders every state. data-stack turns rows into cards below 640px",
      },
    },
  },
} satisfies Meta;

export const Full = html(
  `<div class="ui-stack">${filters}${table(true)}${pagination}</div>`,
);

export const Plain = html(table(false));

export const Empty = html(`
<div class="ui-table-scroll">
  <table class="ui-table">
    <thead><tr><th scope="col">Key</th><th scope="col">Title</th></tr></thead>
    <tbody><tr><td class="ui-table-empty" colspan="2">No tasks match these filters</td></tr></tbody>
  </table>
</div>`);

export const Mobile = mobile(
  `<div class="ui-stack">${filters}${table(true)}${pagination}</div>`,
);

export const MobileScroll = mobile(table(false));
