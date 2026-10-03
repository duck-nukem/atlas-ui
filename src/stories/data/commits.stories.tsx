import type { Meta } from "@storybook/react-vite";
import { html, mobile } from "../html";

const days = [
  [
    "Today",
    [
      [
        "931da0f",
        "Show chat join and leave lines small and in the chart green",
        "Ada Lovelace",
        "AL",
        0,
        "2 hours ago",
      ],
      [
        "be979e5",
        "Parse task, goal and feature keys before looking them up",
        "Grace Hopper",
        "GH",
        3,
        "5 hours ago",
      ],
    ],
  ],
  [
    "Yesterday",
    [
      [
        "2b58c24",
        "Brand task, goal and feature keys on entities and rows",
        "Alan Turing",
        "AT",
        5,
        "1 day ago",
      ],
    ],
  ],
] as const;

const list = `
<section class="ui-commits" aria-label="Commits">
  ${days
    .map(
      ([day, commits]) => `
  <div>
    <h3>${day}</h3>
    <ol>
      ${commits
        .map(
          ([sha, message, author, initials, tone, when]) => `
      <li class="ui-commit">
        <span class="ui-avatar" data-size="sm" data-tone="${tone}" aria-hidden="true">${initials}</span>
        <a class="ui-commit-message" href="#${sha}">${message}</a>
        <span class="ui-commit-meta">${author} committed ${when}</span>
        <a class="ui-badge ui-commit-sha" data-variant="outline" href="#${sha}" aria-label="Commit ${sha}">${sha}</a>
      </li>`,
        )
        .join("")}
    </ol>
  </div>`,
    )
    .join("")}
</section>`;

export default { title: "Data/Commit list" } satisfies Meta;

export const Default = html(list);

export const Mobile = mobile(list);
