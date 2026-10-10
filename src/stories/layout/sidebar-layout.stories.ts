import type { Meta } from "@storybook/html-vite";
import { expect } from "storybook/test";
import { html, icon, select, type Story } from "../html";

const screens = {
  Account: {
    width: "5xl",
    narrow: true,
    sticky: false,
    subtitle: "Alex Szabo · alex@example.com",
    label: "Account sections",
    sections: [
      ["user-round", "Profile"],
      ["shield-check", "Security"],
      ["key-round", "Access tokens"],
      ["eye-off", "Privacy"],
    ],
    content: `<section class="ui-section">
      <div class="ui-section-heading"><h2>Profile</h2></div>
      <form method="post" action="#profile" style="display:grid;gap:0.75rem">
        <div class="ui-field">
          <label class="ui-label" for="name">Name</label>
          <input class="ui-input" id="name" name="displayName" autocomplete="name" value="Alex Szabo">
        </div>
        <div class="ui-field">
          <label class="ui-label" for="username">Username</label>
          <input class="ui-input" id="username" name="username" autocomplete="username" value="alex">
        </div>
        <p class="ui-empty">Mentions written with your old username will no longer link to you.</p>
        <div><button class="ui-button" data-variant="outline" data-size="sm" type="submit">Save profile</button></div>
      </form>
    </section>`,
  },
  Organization: {
    width: "6xl",
    narrow: false,
    sticky: true,
    subtitle: "Master data for Test org.",
    label: "Organization sections",
    sections: [
      ["building-2", "Organization"],
      ["users", "Members"],
      ["network", "Departments"],
      ["toggle-right", "Features"],
      ["gauge", "Quotas"],
      ["credit-card", "Billing"],
      ["triangle-alert", "Danger zone"],
    ],
    content: `<form method="post" action="#rename" style="display:grid;gap:0.75rem;max-width:42rem">
      <div class="ui-field" style="max-width:24rem">
        <label class="ui-label" for="organization">Organization name</label>
        <input class="ui-input" id="organization" name="name" autocomplete="organization" value="Test org">
      </div>
      <p class="ui-empty" style="font-size:var(--text-xs)">The slug <code>test-org</code> is used in git URLs and does not change.</p>
      <div><button class="ui-button" data-size="sm" type="submit">Rename</button></div>
    </form>`,
  },
} as const;

type Screen = keyof typeof screens;

type Args = { screen: Screen; current: number };

export default {
  title: "Layout/Sidebar layout",
  ...html<Args>(({ screen, current }) => {
    const { width, narrow, sticky, subtitle, label, sections, content } =
      screens[screen];

    return `<div class="ui-page" data-width="${width}">
  <div class="ui-page-header">
    <div class="ui-page-title">
      <h1>${screen}</h1>
      <p>${subtitle}</p>
    </div>
  </div>
  <div class="ui-page-sidebar"${narrow ? ' data-content="narrow"' : ""}>
    <nav class="ui-sidebar-nav" aria-label="${label}"${sticky ? " data-sticky" : ""}>
      ${sections.map(([name, section], index) => `<a class="ui-sidebar-link" href="#${index}"${index === current ? ' aria-current="page"' : ""}>${icon(name)}${section}</a>`).join("\n      ")}
    </nav>
    <div>
      ${content}
    </div>
  </div>
</div>`;
  }),
  args: { screen: "Account", current: 0 },
  argTypes: { screen: select(Object.keys(screens) as Screen[]) },
} satisfies Meta<Args>;

export const Account: Story<Args> = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: "Profile" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  },
};

export const Organization: Story<Args> = {
  args: { screen: "Organization" },
};
