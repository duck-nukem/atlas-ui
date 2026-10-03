import type { Args, Meta, StoryObj } from "@storybook/react-vite";

const referencing =
  /\b(id|for|popovertarget|interestfor|commandfor|aria-labelledby|aria-describedby|aria-controls)="([^"]+)"/g;

const scoped = (markup: string, scope: string) =>
  markup.replace(
    referencing,
    (_, name: string, ids: string) =>
      `${name}="${ids
        .split(" ")
        .map((id) => `${scope}-${id}`)
        .join(" ")}"`,
  );

export const esc = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

export const html = <A extends Args>(markup: (args: A) => string) => ({
  render: (args: A, context: { id: string }) => (
    <div
      style={{ display: "contents" }}
      dangerouslySetInnerHTML={{ __html: scoped(markup(args), context.id) }}
    />
  ),
  parameters: {
    docs: {
      source: {
        language: "html",
        transform: (_: string, context: { args: Args }) =>
          markup(context.args as A).trim(),
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
