import type { Meta } from "@storybook/html-vite";
import { expect } from "storybook/test";
import { html, type Story } from "../html";

type Args = { files: string };

const counts = (added: number, deleted: number) =>
  `<span class="ui-line-counts" data-testid="line-counts"><span>+${String(added)}</span> <span>−${String(deleted)}</span></span>`;

export default {
  title: "Data/Changed files",
  ...html<Args>(({ files }) => {
    const rows = files.split("|").map((file) => {
      const [path = "", added = "0", deleted = "0"] = file
        .split(",")
        .map((part) => part.trim());

      return { path, added: Number(added), deleted: Number(deleted) };
    });
    const added = rows.reduce((sum, row) => sum + row.added, 0);
    const deleted = rows.reduce((sum, row) => sum + row.deleted, 0);

    return `<section class="ui-changed-files">
  <h2><span data-testid="changes-total" data-added="${String(added)}" data-deleted="${String(deleted)}">${String(rows.length)} ${rows.length === 1 ? "file" : "files"} changed ${counts(added, deleted)}</span></h2>
  <ul>
    ${rows.map((row) => `<li><span>${row.path}</span>${counts(row.added, row.deleted)}</li>`).join("\n    ")}
  </ul>
</section>`;
  }),
  args: {
    files:
      "src/app/(app)/chat/new/new-channel-form.tsx, 2, 2 | src/components/git/changed-files.tsx, 12, 3 | src/components/git/line-counts.tsx → src/components/git/counts.tsx, 0, 0",
  },
} satisfies Meta<Args>;

export const Files: Story<Args> = {};

export const OneFile: Story<Args> = {
  args: { files: "README.md, 4, 1" },
};

export const LongPaths: Story<Args> = {
  args: {
    files: `src/${"app/(app)/repositories/[slug]/settings/".repeat(8)}danger-zone/delete-repository-form.tsx, 2, 2 | src/components/git/changed-files.tsx, 12, 3`,
  },
  play: async ({ canvas }) => {
    const list = canvas.getByTestId("changes-total").closest("section")!;

    await expect(list.scrollWidth).toBeLessThanOrEqual(list.clientWidth);
  },
};
