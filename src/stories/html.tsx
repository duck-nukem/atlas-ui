import type { Args, Meta, StoryObj } from "@storybook/react-vite";

export const html = <A extends Args>(markup: (args: A) => string) => ({
  render: (args: A) => (
    <div
      style={{ display: "contents" }}
      dangerouslySetInnerHTML={{ __html: markup(args) }}
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

export const productionContrast = { a11y: { test: "todo" } } as const;

export const select = <T extends string>(options: readonly T[]) => ({
  control: "select" as const,
  options,
});

export type Story<A extends Args> = StoryObj<Meta<A>>;
