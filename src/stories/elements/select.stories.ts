import type { Meta } from "@storybook/html-vite";
import { expect, waitFor } from "storybook/test";
import { html, type Story } from "../html";

type Args = {
  label: string;
  options: string;
  selected: string;
  multiple: boolean;
  clearable: boolean;
  placeholder: string;
  disabled: boolean;
  invalid: boolean;
};

const select = ({
  label,
  options,
  selected,
  multiple,
  clearable,
  placeholder,
  disabled,
  invalid,
}: Args) => {
  const chosen = selected.split(",").map((value) => value.trim());

  return `<div class="ui-field" style="max-width:20rem">
  <label class="ui-label" for="feature">${label}</label>
  <atlas-select${clearable ? " clearable" : ""}${placeholder === "" ? "" : ` placeholder="${placeholder}"`}>
    <select class="ui-input" id="feature" name="feature"${multiple ? " multiple" : ""}${disabled ? " disabled" : ""}${invalid ? ' aria-invalid="true" aria-describedby="feature-error"' : ""}>
      ${clearable || !multiple ? '<option value="">None</option>' : ""}
      ${options
        .split("|")
        .map((option) => {
          const [value = "", name = "", hint] = option
            .split(",")
            .map((part) => part.trim());

          return `<option value="${value}"${hint === undefined ? "" : ` data-hint="${hint}"`}${chosen.includes(value) ? " selected" : ""}>${name}</option>`;
        })
        .join("\n      ")}
    </select>
  </atlas-select>${invalid ? '\n  <p class="ui-feedback" id="feature-error">Pick a feature</p>' : ""}
</div>`;
};

export default {
  title: "Elements/Searchable select",
  ...html(select, {
    docs: {
      description: {
        component:
          "Server-render a native select inside atlas-select. Without JavaScript it works as the native select; with atlas-ui/elements.js it becomes the searchable dropdown and keeps the native select as its value.",
      },
    },
  }),
  args: {
    label: "Feature",
    options:
      "f1, F-1 todo.md, Done | f2, F-2 Chat, In progress | f3, F-3 Health dashboard, Ready | f4, F-4 Releases",
    selected: "",
    multiple: false,
    clearable: false,
    placeholder: "",
    disabled: false,
    invalid: false,
  },
} satisfies Meta<Args>;

export const Single: Story<Args> = {};

export const Chosen: Story<Args> = { args: { selected: "f2" } };

export const Clearable: Story<Args> = {
  args: { selected: "f2", clearable: true },
};

export const Multiple: Story<Args> = {
  args: { multiple: true, selected: "f1, f3" },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("combobox", { name: "Feature" }));
    await userEvent.click(canvas.getByRole("option", { name: /F-2 Chat/ }));

    await expect(canvas.getByRole("listbox")).toBeVisible();
  },
};

export const Invalid: Story<Args> = { args: { invalid: true } };

export const Disabled: Story<Args> = {
  args: { disabled: true, selected: "f1" },
};

export const Search: Story<Args> = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("combobox", { name: "Feature" }));
    await waitFor(() =>
      expect(canvas.getByTestId("select-search")).toHaveFocus(),
    );

    await userEvent.keyboard("chat");

    await expect(
      canvas.getAllByRole("option").map((option) => option.textContent),
    ).toEqual(["F-2 ChatIn progress"]);
  },
};
