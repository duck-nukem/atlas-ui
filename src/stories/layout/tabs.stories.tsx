import type { Meta } from "@storybook/react-vite";
import { html, mobile } from "../html";

const tabs = `
<nav class="ui-tabs" aria-label="Pull request">
  <a class="ui-tab" href="#conversation" aria-current="page">Conversation</a>
  <a class="ui-tab" href="#commits">Commits <span class="ui-badge" data-variant="secondary">12</span></a>
  <a class="ui-tab" href="#checks">Checks <span class="ui-badge" data-variant="danger">1</span></a>
  <a class="ui-tab" href="#files">Files changed <span class="ui-badge" data-variant="secondary">48</span></a>
</nav>`;

const panes = `
<div class="ui-panes">
  <details name="settings" open>
    <summary>General</summary>
    <div class="ui-pane-body">Name, time zone and visibility</div>
  </details>
  <details name="settings">
    <summary>Members</summary>
    <div class="ui-pane-body">Invite people and change roles</div>
  </details>
  <details name="settings">
    <summary>Danger zone</summary>
    <div class="ui-pane-body">Delete the organisation</div>
  </details>
</div>`;

export default {
  title: "Layout/Tabs",
  parameters: {
    docs: {
      description: {
        component:
          "Tabs are links to server-rendered pages marked with aria-current. Panes are exclusive details elements that open one at a time",
      },
    },
  },
} satisfies Meta;

export const Links = html(tabs);

export const Panes = html(panes);

export const Mobile = mobile(tabs + panes);
