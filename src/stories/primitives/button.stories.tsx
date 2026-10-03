import type { Meta } from "@storybook/react-vite";
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
};

const button = ({ label, variant, size, icon: name, link, disabled }: Args) => {
  const iconOnly = size.startsWith("icon");
  const attributes = [
    'class="ui-button"',
    variant === "default" ? "" : `data-variant="${variant}"`,
    size === "default" ? "" : `data-size="${size}"`,
    iconOnly ? `aria-label="${label}"` : "",
  ]
    .filter(Boolean)
    .join(" ");
  const content = `${name === "" ? "" : icon(name)}${iconOnly ? "" : label}`;

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
