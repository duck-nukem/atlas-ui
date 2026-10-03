import type { Meta } from "@storybook/react-vite";
import { html, select, type Story } from "../html";

const variants = ["default", "secondary", "outline", "destructive"] as const;

type Args = { label: string; variant: (typeof variants)[number] };

export default {
  title: "Primitives/Badge",
  ...html<Args>(
    ({ label, variant }) =>
      `<span class="ui-badge"${variant === "default" ? "" : ` data-variant="${variant}"`}>${label}</span>`,
  ),
  args: { label: "Active", variant: "default" },
  argTypes: { variant: select(variants) },
} satisfies Meta<Args>;

export const Active: Story<Args> = {};

export const Evaluating: Story<Args> = {
  args: { label: "Evaluating", variant: "secondary" },
};

export const Draft: Story<Args> = {
  args: { label: "Draft", variant: "outline" },
};

export const Failed: Story<Args> = {
  args: { label: "Failed", variant: "destructive" },
};
