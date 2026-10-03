import "./index";
import type { SelectOption } from "./select-model";

export type SelectMarkup = {
  name: string;
  options: readonly SelectOption[];
  selected?: readonly string[];
  multiple?: boolean;
  clearable?: boolean;
  submitOnChange?: boolean;
  label?: string;
  labelledBy?: string;
  id?: string;
  invalid?: boolean;
  testId?: string;
};

export const selectMarkup = (select: SelectMarkup): string => {
  const attributes = [
    select.clearable === true ? " clearable" : "",
    select.submitOnChange === true ? " submit-on-change" : "",
    select.testId === undefined ? "" : ` data-testid="${select.testId}"`,
  ].join("");
  const native = [
    `name="${select.name}"`,
    select.multiple === true ? "multiple" : "",
    select.id === undefined ? "" : `id="${select.id}"`,
    select.label === undefined ? "" : `aria-label="${select.label}"`,
    select.labelledBy === undefined
      ? ""
      : `aria-labelledby="${select.labelledBy}"`,
    select.invalid === true && select.id !== undefined
      ? `aria-invalid="true" aria-describedby="${select.id}-error"`
      : "",
  ]
    .filter(Boolean)
    .join(" ");
  const options = select.options
    .map(
      (option) =>
        `<option value="${option.value}"${option.hint === undefined ? "" : ` data-hint="${option.hint}"`}${select.selected?.includes(option.value) === true ? " selected" : ""}>${option.label}</option>`,
    )
    .join("");
  const none =
    select.clearable === true || select.multiple !== true
      ? '<option value="">None</option>'
      : "";

  return `<atlas-select${attributes}><select ${native}>${select.clearable === true ? none : ""}${options}</select></atlas-select>`;
};

export const mount = (markup: string): HTMLElement => {
  const container = document.createElement("div");

  container.innerHTML = markup;
  document.body.append(container);

  return container;
};
