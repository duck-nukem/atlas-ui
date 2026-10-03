import { screen } from "@testing-library/dom";
import { userEvent } from "vitest/browser";
import { Idiomorph } from "idiomorph";
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

const markup = (
  attention: boolean,
) => `<atlas-channel-picker label="#random"${attention ? " attention" : ""}>
  <div class="ui-channel-list">
    <ul>
      <li><span>Channels</span><ul>${link("general", "general", { unread: true, mentioned: attention })}${link("random", "random", { current: true })}</ul></li>
      <li><span>Direct messages</span><ul>${link("dm-a-b", "Bob", { direct: true })}</ul></li>
    </ul>
  </div>
  <a class="ui-channel-new" href="#new">New channel</a>
</atlas-channel-picker>`;

const picker = (attention: boolean) => mount(markup(attention));

describe("atlas-channel-picker", () => {
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

  it("filters again after a morph to the server markup", async () => {
    const container = picker(false);
    Idiomorph.morph(container, markup(false), { morphStyle: "innerHTML" });
    await new Promise<void>((resolve) => queueMicrotask(resolve));
    await userEvent.click(screen.getByTestId("channel-picker"));

    await userEvent.type(screen.getByTestId("channel-search"), "ran");

    expect(screen.getByTestId("pick-general").closest("li")).toHaveAttribute(
      "hidden",
    );
  });

  it("shows attention when the server adds it later", () => {
    const container = picker(false);

    container
      .querySelector("atlas-channel-picker")
      ?.setAttribute("attention", "");

    expect(screen.getAllByTestId("channel-picker")[0]).toHaveAttribute(
      "data-attention",
      "true",
    );
  });

  it("hides a section with no matching channel", async () => {
    picker(false);
    await userEvent.click(screen.getByTestId("channel-picker"));

    await userEvent.type(screen.getByTestId("channel-search"), "ran");

    expect(screen.getByText("Direct messages").closest("li")).toHaveAttribute(
      "hidden",
    );
  });
});
