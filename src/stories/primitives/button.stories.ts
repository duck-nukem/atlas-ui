import type { Meta } from "@storybook/html-vite";
import { expect } from "storybook/test";
import { icons } from "../../icons/names";
import { html, icon, select, type Story } from "../html";

const variants = [
  "default",
  "outline",
  "secondary",
  "ghost",
  "destructive",
  "link",
] as const;
const sizes = ["default", "sm", "icon", "icon-sm"] as const;

type Args = {
  label: string;
  variant: (typeof variants)[number];
  size: (typeof sizes)[number];
  icon: string;
  link: boolean;
  disabled: boolean;
  busy: boolean;
  spinner: boolean;
};

const button = ({
  label,
  variant,
  size,
  icon: name,
  link,
  disabled,
  busy,
  spinner: withSpinner,
}: Args) => {
  const iconOnly = size.startsWith("icon");
  const attributes = [
    'class="ui-button"',
    variant === "default" ? "" : `data-variant="${variant}"`,
    size === "default" ? "" : `data-size="${size}"`,
    iconOnly ? `aria-label="${label}"` : "",
    busy ? 'aria-busy="true"' : "",
  ]
    .filter(Boolean)
    .join(" ");
  const spinner =
    busy || withSpinner
      ? '<svg class="ui-icon ui-spinner" data-testid="spinner" aria-hidden="true"><use href="icons.svg#loader-circle"/></svg>'
      : "";
  const content = `${spinner}${name === "" ? "" : icon(name, undefined, "icon")}${iconOnly ? "" : label}`;

  return link
    ? `<a ${attributes} href="#${label.toLowerCase().replaceAll(" ", "-")}"${disabled ? ' aria-disabled="true"' : ""}>${content}</a>`
    : `<button ${attributes} type="button"${disabled ? " disabled" : ""}>${content}</button>`;
};

export default {
  title: "Primitives/Button",
  ...html(button),
  args: {
    label: "New task",
    variant: "default",
    size: "default",
    icon: "",
    link: false,
    disabled: false,
    busy: false,
    spinner: false,
  },
  argTypes: {
    variant: select(variants),
    size: select(sizes),
    icon: select(["", ...icons]),
  },
} satisfies Meta<Args>;

export const Default: Story<Args> = {};

export const Outline: Story<Args> = {
  args: { label: "Cancel", variant: "outline" },
};

export const Secondary: Story<Args> = {
  args: { label: "Cancel", variant: "secondary" },
};

export const Ghost: Story<Args> = {
  args: { label: "Cancel", variant: "ghost" },
};

export const Destructive: Story<Args> = {
  args: { label: "Delete task", variant: "destructive" },
};

export const Link: Story<Args> = {
  args: { label: "Account", variant: "link" },
};

export const Small: Story<Args> = { args: { label: "Apply", size: "sm" } };

export const WithIcon: Story<Args> = {
  args: { label: "Add", variant: "outline", icon: "plus" },
};

export const IconOnly: Story<Args> = {
  args: {
    label: "Notifications",
    variant: "ghost",
    size: "icon",
    icon: "bell",
  },
};

export const Pending: Story<Args> = { args: { disabled: true } };

export const Loading: Story<Args> = {
  args: { label: "Save", disabled: true, busy: true },
  play: async ({ canvas }) => {
    const spinner = canvas.getByTestId("spinner");

    await expect(spinner).toBeVisible();
  },
};

export const LoadingIconOnly: Story<Args> = {
  args: {
    label: "Notifications",
    variant: "ghost",
    size: "icon",
    icon: "bell",
    disabled: true,
    busy: true,
  },
  play: async ({ canvas }) => {
    const icon = canvas.getByTestId("icon");

    await expect(icon).not.toBeVisible();
  },
};

export const ReadyToLoad: Story<Args> = {
  args: { label: "Save", spinner: true },
  play: async ({ canvas }) => {
    const spinner = canvas.getByTestId("spinner");

    await expect(spinner).not.toBeVisible();
  },
};
