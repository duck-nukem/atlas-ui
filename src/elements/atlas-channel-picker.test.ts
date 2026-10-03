import { screen } from "@testing-library/dom";
import { userEvent } from "vitest/browser";
import "./index";
import { mount } from "./markup";

const link = (
  id: string,
  label: string,
  options: {
    direct?: boolean;
    unread?: boolean;
    mentioned?: boolean;
    current?: boolean;
  } = {},
) =>
  `<li><a class="ui-channel-link" href="#${id}" data-testid="pick-${id}" data-unread="${String(options.unread === true)}"${options.current === true ? ' aria-current="page"' : ""}><span>${label}</span>${options.mentioned === true ? `<span class="ui-dot" role="img" aria-label="Messages for you" data-testid="attention-${id}"></span>` : ""}</a></li>`;

const picker = (attention: boolean) =>
  mount(`<atlas-channel-picker label="#random"${attention ? " attention" : ""}>
  <div class="ui-channel-list">
    <ul>
      <li><span>Channels</span><ul>${link("general", "general", { unread: true, mentioned: attention })}${link("random", "random", { current: true })}</ul></li>
      <li><span>Direct messages</span><ul>${link("dm-a-b", "Bob", { direct: true })}</ul></li>
    </ul>
  </div>
  <a class="ui-channel-new" href="#new">New channel</a>
</atlas-channel-picker>`);

describe("atlas-channel-picker", () => {
  it("puts a dot on a channel that mentions the viewer", () => {
    picker(true);

    const dot = screen.getByTestId("attention-general");

    expect(dot).toBeInTheDocument();
  });

  it("lists channels and direct messages", () => {
    picker(false);

    const link = screen.getByTestId("pick-dm-a-b");

    expect(link).toHaveAttribute("href", "#dm-a-b");
  });

  it("narrows the list to what was typed", async () => {
    picker(false);
    await userEvent.click(screen.getByTestId("channel-picker"));

    await userEvent.type(screen.getByTestId("channel-search"), "ran");

    expect(screen.getByTestId("pick-general").closest("li")).toHaveAttribute(
      "hidden",
    );
  });

  it("says so when nothing matches", async () => {
    picker(false);
    await userEvent.click(screen.getByTestId("channel-picker"));

    await userEvent.type(screen.getByTestId("channel-search"), "zzz");

    expect(screen.getByTestId("no-channel-match")).toBeVisible();
  });

  it("marks channels with unread messages", () => {
    picker(false);

    const link = screen.getByTestId("pick-general");

    expect(link).toHaveAttribute("data-unread", "true");
  });

  it("closes once a channel is picked", async () => {
    picker(false);
    await userEvent.click(screen.getByTestId("channel-picker"));

    await userEvent.click(screen.getByTestId("pick-random"));

    expect(screen.getByTestId("channel-picker")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("moves focus to the search box when opened", async () => {
    picker(false);

    await userEvent.click(screen.getByTestId("channel-picker"));

    await expect
      .poll(() => document.activeElement)
      .toBe(screen.getByTestId("channel-search"));
  });

  it("follows the first match on Enter and gives focus back to the trigger", async () => {
    picker(false);
    await userEvent.click(screen.getByTestId("channel-picker"));
    await vi.waitUntil(
      () => document.activeElement === screen.getByTestId("channel-search"),
    );
    await userEvent.type(screen.getByTestId("channel-search"), "ran");

    await userEvent.keyboard("{Enter}");

    expect(document.activeElement).toBe(screen.getByTestId("channel-picker"));
  });

  it("flags the picker when another channel wants attention", () => {
    picker(true);

    const trigger = screen.getByTestId("channel-picker");

    expect(trigger).toHaveAttribute("data-attention", "true");
  });

  it("leaves the picker plain when no other channel wants attention", () => {
    picker(false);

    const trigger = screen.getByTestId("channel-picker");

    expect(trigger).toHaveAttribute("data-attention", "false");
  });

  it("is a plain list of channel links before the script runs", () => {
    const container = document.createElement("div");
    container.innerHTML = `<atlas-channel-picker-without-script><div class="ui-channel-list"><ul><li><span>Channels</span><ul>${link("general", "general")}</ul></li></ul></div></atlas-channel-picker-without-script>`;
    document.body.append(container);

    const general = container.querySelector("a");

    expect(general).toHaveAttribute("href", "#general");
  });
});
