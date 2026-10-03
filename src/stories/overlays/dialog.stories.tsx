import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { html, mobile } from "../html";
import { memberActions } from "./member-actions";

const confirm: NonNullable<StoryObj["play"]> = async ({
  canvas,
  userEvent,
}) => {
  await userEvent.click(
    canvas.getByRole("button", { name: "Actions for Ada Lovelace" }),
  );
  await userEvent.click(
    canvas.getByRole("button", { name: "Remove from organization" }),
  );

  await expect(
    canvas.getByRole("dialog", { name: "Remove Ada Lovelace?" }),
  ).toBeVisible();
};

export default { title: "Overlays/Dialog" } satisfies Meta;

export const Confirm: StoryObj = { ...html(memberActions), play: confirm };

export const Mobile: StoryObj = { ...mobile(memberActions), play: confirm };
