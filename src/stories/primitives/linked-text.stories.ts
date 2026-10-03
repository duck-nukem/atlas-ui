import type { Meta } from "@storybook/html-vite";
import { expect } from "storybook/test";
import { html, type Story } from "../html";

type Args = { text: string };

const linked = (text: string) =>
  text.replaceAll(
    /(?<![\w-])T-\d+\b/g,
    (key) => `<a class="ui-key-link" href="#${key}">${key}</a>`,
  );

export default {
  title: "Primitives/Linked text",
  ...html<Args>(({ text }) => `<p>${linked(text)}</p>`, {
    docs: {
      description: {
        component:
          "Plain text such as a commit subject, with each T- key linked to its task.",
      },
    },
  }),
  args: { text: "Fix the drill wipe bug from T-250 and T-251" },
} satisfies Meta<Args>;

export const CommitSubject: Story<Args> = {};

export const KeysOnly: Story<Args> = {
  args: { text: "T-12 and XT-13" },
  play: async ({ canvas }) => {
    const links = canvas.getAllByRole("link");

    await expect(links.map((link) => link.textContent)).toEqual(["T-12"]);
  },
};
