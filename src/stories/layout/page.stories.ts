import type { Meta } from "@storybook/html-vite";
import { html, icon, type Story } from "../html";

type HeaderArgs = {
  title: string;
  subtitle: string;
  action: string;
  badge: string;
  breadcrumbs: string;
  tabs: string;
  current: number;
};

const header = ({
  title,
  subtitle,
  action,
  badge,
  breadcrumbs,
  tabs,
  current,
}: HeaderArgs) => {
  const crumbs =
    breadcrumbs === ""
      ? []
      : breadcrumbs.split("/").map((crumb) => crumb.trim());
  const parent = crumbs.at(-2);
  const heading =
    badge === ""
      ? `<h1>${title}</h1>`
      : `<div class="ui-page-title-name"><h1>${title}</h1><span class="ui-badge">${badge}</span></div>`;
  const titled =
    action === ""
      ? heading
      : `<div class="ui-page-title-row">${heading}<div class="ui-page-actions"><a class="ui-button" href="#action">${action}</a></div></div>`;

  return `<div class="ui-page-header">${
    crumbs.length === 0
      ? ""
      : `
  <nav class="ui-breadcrumbs" aria-label="Breadcrumb">${
    parent === undefined
      ? ""
      : `
    <a class="ui-back" data-mobile-only href="#back">${icon("chevron-left")}${parent}</a>`
  }
    <ol>
      ${crumbs.map((crumb, index) => (index === crumbs.length - 1 ? `<li><span aria-current="page" title="${crumb}">${crumb}</span></li>` : `<li><a href="#${index}" title="${crumb}">${crumb}</a><span aria-hidden="true">/</span></li>`)).join("\n      ")}
    </ol>
  </nav>`
  }
  <div class="ui-page-title">
    ${titled}${subtitle === "" ? "" : `\n    <p>${subtitle}</p>`}
  </div>${
    tabs === ""
      ? ""
      : `
  <nav class="ui-tabs" aria-label="Sections">
    ${tabs
      .split(",")
      .map(
        (tab, index) =>
          `<a class="ui-tab" href="#${index}"${index === current ? ' aria-current="page"' : ""}>${tab.trim()}</a>`,
      )
      .join("\n    ")}
  </nav>`
  }
</div>`;
};

export default {
  title: "Layout/Page header",
  ...html(header),
  args: {
    title: "Flow",
    subtitle:
      "How work moves from started to released, where it waits, and what could help.",
    action: "",
    badge: "",
    breadcrumbs: "",
    tabs: "",
    current: 0,
  },
} satisfies Meta<HeaderArgs>;

export const TitleAndSubtitle: Story<HeaderArgs> = {};

export const TitleAndAction: Story<HeaderArgs> = {
  args: { title: "Tasks", subtitle: "", action: "New task" },
};

export const TitleAndBadge: Story<HeaderArgs> = {
  args: {
    title: "G-7 Provide useful suggestions to our customers",
    subtitle: "",
    badge: "Active",
  },
};

export const BreadcrumbsAndTabs: Story<HeaderArgs> = {
  args: {
    title: "Space Clone",
    subtitle: "This application, mirrored from the local working copy",
    breadcrumbs: "Repositories / Space Clone / Commits",
    tabs: "Overview, Commits, Branches, Files, Pull requests, Releases, Settings",
    current: 1,
  },
};
