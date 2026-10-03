import type { Meta } from "@storybook/html-vite";
import { expect } from "storybook/test";
import { html, type Story } from "../html";

const kibibyte = 1024;

const bytes = (size: number) =>
  size < kibibyte
    ? `${String(size)} B`
    : size < kibibyte ** 2
      ? `${(size / kibibyte).toFixed(1)} KB`
      : size < kibibyte ** 3
        ? `${(size / kibibyte ** 2).toFixed(1)} MB`
        : `${(size / kibibyte ** 3).toFixed(1)} GB`;

const ofLimit = (size: number, limit: number) =>
  `${bytes(size)}/${bytes(limit)}`;

type Args = {
  repositoryBytes: number;
  attachmentBytes: number;
  attachmentLimitBytes: number;
  largest: string;
};

export default {
  title: "Settings/Storage usage",
  ...html<Args>(
    ({ repositoryBytes, attachmentBytes, attachmentLimitBytes, largest }) => {
      const total = repositoryBytes + attachmentBytes;
      const share = (repositoryBytes / total) * 100;
      const repositories = largest
        .split("|")
        .map((row) => row.split(",").map((part) => part.trim()))
        .filter(([name = ""]) => name !== "");

      return `<section class="ui-section ui-storage" data-testid="storage-usage" data-total-bytes="${String(total)}">
  <div class="ui-section-heading">
    <h2>Storage</h2>
    <p>The size of your data. Repository sizes update when someone uploads code, and at least once a day.</p>
  </div>
  <p class="ui-storage-total">${bytes(total)}</p>${
    total === 0
      ? ""
      : `
  <svg class="ui-storage-bar" data-testid="storage-bar" viewBox="0 0 100 1" preserveAspectRatio="none" aria-hidden="true">
    <rect data-part="repositories" x="0" width="${String(share)}" height="1"/>
    <rect data-part="attachments" x="${String(share)}" width="${String(100 - share)}" height="1"/>
  </svg>`
  }
  <dl>
    <div data-testid="storage-repositories" data-bytes="${String(repositoryBytes)}"><span class="ui-storage-swatch" data-part="repositories" aria-hidden="true"></span><dt>Repositories</dt><dd>${bytes(repositoryBytes)}</dd></div>
    <div data-testid="storage-attachments" data-bytes="${String(attachmentBytes)}" data-limit-bytes="${String(attachmentLimitBytes)}"><span class="ui-storage-swatch" data-part="attachments" aria-hidden="true"></span><dt>Attachments</dt><dd>${ofLimit(attachmentBytes, attachmentLimitBytes)}</dd></div>
  </dl>${
    repositories.length === 0
      ? ""
      : `
  <div class="ui-storage-largest">
    <h3>Largest repositories</h3>
    <ol>
      ${repositories
        .map(([name = "", size = "0", limit = "0"]) => {
          const slug = name.toLowerCase().replaceAll(" ", "-");

          return `<li data-testid="storage-repository-${slug}" data-bytes="${size}" data-limit-bytes="${limit}"><a href="#${slug}">${name}</a><span>${ofLimit(Number(size), Number(limit))}</span></li>`;
        })
        .join("\n      ")}
    </ol>
  </div>`
  }
</section>`;
    },
  ),
  args: {
    repositoryBytes: 81920,
    attachmentBytes: 8323472,
    attachmentLimitBytes: 524288000,
    largest: "test, 81920, 524288000",
  },
} satisfies Meta<Args>;

export const Usage: Story<Args> = {};

export const ManyRepositories: Story<Args> = {
  args: {
    repositoryBytes: 1288490188,
    attachmentBytes: 398458880,
    attachmentLimitBytes: 524288000,
    largest:
      "Space Clone, 671088640, 1073741824 | Marketing site, 402653184, 1073741824 | A repository with a name long enough to truncate on a phone screen, 214748364, 1073741824",
  },
  globals: { viewport: { value: "mobile" } },
  play: async ({ canvas }) => {
    const section = canvas.getByTestId("storage-usage");

    await expect(section.scrollWidth).toBeLessThanOrEqual(section.clientWidth);
  },
};

export const Empty: Story<Args> = {
  args: {
    repositoryBytes: 0,
    attachmentBytes: 0,
    attachmentLimitBytes: 524288000,
    largest: "",
  },
  play: async ({ canvas }) => {
    const bar = canvas.queryByTestId("storage-bar");

    await expect(bar).toBeNull();
  },
};
