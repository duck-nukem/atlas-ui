import type { Meta } from "@storybook/html-vite";
import { html, select, type Story } from "../html";

type Args = {
  label: string;
  type: string;
  value: string;
  error: string;
  multiline: boolean;
  disabled: boolean;
};

export default {
  title: "Primitives/Form field",
  ...html<Args>(({ label, type, value, error, multiline, disabled }) => {
    const described =
      error === "" ? "" : ' aria-invalid="true" aria-describedby="field-error"';
    const control = multiline
      ? `<textarea class="ui-textarea" id="field" name="field"${described}${disabled ? " disabled" : ""}>${value}</textarea>`
      : `<input class="ui-input" id="field" name="field" type="${type}" value="${value}"${described}${disabled ? " disabled" : ""}>`;

    return `<div class="ui-field" style="max-width:24rem">
  <label class="ui-label" for="field">${label}</label>
  ${control}${error === "" ? "" : `\n  <p class="ui-feedback" id="field-error">${error}</p>`}
</div>`;
  }),
  args: {
    label: "Email",
    type: "email",
    value: "",
    error: "",
    multiline: false,
    disabled: false,
  },
  argTypes: { type: select(["text", "email", "password", "date", "search"]) },
} satisfies Meta<Args>;

export const Text: Story<Args> = {};

export const WithError: Story<Args> = {
  args: { value: "ada@", error: "Enter a valid email address" },
};

export const Textarea: Story<Args> = {
  args: { label: "Description", multiline: true },
};

export const Disabled: Story<Args> = {
  args: { value: "root@example.com", disabled: true },
};
