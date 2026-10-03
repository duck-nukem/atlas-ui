import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { html, mobile } from "../html";
import { memberActions } from "./member-actions";

const open: NonNullable<StoryObj["play"]> = async ({ canvas, userEvent }) => {
  await userEvent.click(
    canvas.getByRole("button", { name: "Actions for Ada Lovelace" }),
  );

  await expect(
    canvas.getByRole("link", { name: "View profile" }),
  ).toBeVisible();
};

export default { title: "Overlays/Menu" } satisfies Meta;

export const Closed = html(
  `<div style="display:flex;justify-content:flex-end">${memberActions}</div>`,
);

export const Open: StoryObj = {
  ...html(
    `<div style="display:flex;justify-content:flex-end">${memberActions}</div>`,
  ),
  play: open,
};

export const Mobile: StoryObj = {
  ...mobile(
    `<div style="display:flex;justify-content:flex-end">${memberActions}</div>`,
  ),
  play: open,
};
