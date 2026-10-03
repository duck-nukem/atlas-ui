import type { Args, Meta, StoryObj } from "@storybook/react-vite";

const references =
  /(?<![\w-])(for|popovertarget|interestfor|commandfor|anchor|headers|list|form|aria-labelledby|aria-describedby|aria-controls|aria-owns|aria-activedescendant|aria-errormessage|aria-details)="([^"]+)"/g;
const ids = /(?<![\w-])id="([^"]+)"/g;

const scoped = (markup: string, scope: string) =>
  markup
    .replace(ids, (_, id: string) => `id="${scope}-${id}"`)
    .replace(
      references,
      (_, name: string, targets: string) =>
        `${name}="${targets
          .split(" ")
          .map((id) => `${scope}-${id}`)
          .join(" ")}"`,
    );

const esc = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const escaped = <A extends Args>(args: A): A =>
  Object.fromEntries(
    Object.entries(args).map(([key, value]) => [
      key,
      typeof value === "string" ? esc(value) : value,
    ]),
  ) as A;

type ExtraParameters = {
  layout?: string;
  docs?: { description?: { component: string } };
};

export const html = <A extends Args>(
  markup: (args: A) => string,
  extra: ExtraParameters = {},
) => ({
  render: (args: A, context: { id: string }) => (
    <div
      style={{ display: "contents" }}
      dangerouslySetInnerHTML={{
        __html: scoped(markup(escaped(args)), context.id),
      }}
    />
  ),
  parameters: {
    ...extra,
    docs: {
      ...extra.docs,
      source: {
        language: "html",
        transform: (_: string, context: { args: Args }) =>
          markup(escaped(context.args as A)).trim(),
      },
    },
  },
});

export const icon = (name: string, size?: "3" | "3.5" | "5") =>
  `<svg class="ui-icon"${size === undefined ? "" : ` data-size="${size}"`} aria-hidden="true"><use href="icons.svg#${name}"/></svg>`;

export const select = <T extends string>(options: readonly T[]) => ({
  control: "select" as const,
  options,
});

export type Story<A extends Args> = StoryObj<Meta<A>>;
