import type { Meta } from "@storybook/html-vite";
import { expect } from "storybook/test";
import { html, type Story } from "../html";
import { applicationHeading } from "./shell";

type Args = { applications: string; application: string };

const names = (applications: string) =>
  applications
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name !== "");

export default {
  title: "Layout/Application selector",
  ...html<Args>(
    ({ applications, application }) =>
      `<div class="ui-nav-heading" style="width:12.5rem">${applicationHeading(
        "applications",
        names(applications),
        application === "" ? undefined : application,
      )}</div>`,
  ),
  args: { applications: "Webapp, Back office", application: "" },
} satisfies Meta<Args>;

export const AllApplications: Story<Args> = {};

export const Selected: Story<Args> = {
  args: { application: "Webapp" },
};

export const LongName: Story<Args> = {
  args: {
    applications: "Webapp, Customer onboarding and identity verification",
    application: "Customer onboarding and identity verification",
  },
};

export const OneApplication: Story<Args> = {
  args: { applications: "Webapp" },
};

export const Open: Story<Args> = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole("button", { name: "All applications" }),
    );

    await expect(
      canvas.getByRole("link", { name: "Back office" }),
    ).toBeVisible();
  },
};
