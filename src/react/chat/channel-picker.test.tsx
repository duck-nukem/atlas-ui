import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChannelPicker } from "./channel-picker";
import type { ChannelEntry } from "./entries";

const entries: ChannelEntry[] = [
  {
    id: "general",
    href: "#general",
    label: "general",
    direct: false,
    unread: true,
    mentioned: true,
  },
  {
    id: "random",
    href: "#random",
    label: "random",
    direct: false,
    unread: false,
    mentioned: false,
  },
  {
    id: "dm-a-b",
    href: "#dm-a-b",
    label: "Bob",
    direct: true,
    unread: false,
    mentioned: false,
  },
];

const picker = (activeId: string) => (
  <ChannelPicker
    entries={entries}
    activeId={activeId}
    label={`#${activeId}`}
    newHref="/chat/new"
  />
);

describe("ChannelPicker", () => {
  it("puts a dot on a channel that mentions the viewer", async () => {
    render(picker("random"));

    await userEvent.click(screen.getByTestId("channel-picker"));

    expect(screen.getByTestId("attention-general")).toBeInTheDocument();
  });

  it("lists channels and direct messages once opened", async () => {
    render(picker("general"));

    await userEvent.click(screen.getByTestId("channel-picker"));

    expect(screen.getByTestId("pick-dm-a-b")).toHaveAttribute(
      "href",
      "#dm-a-b",
    );
  });

  it("narrows the list to what was typed", async () => {
    render(picker("general"));
    await userEvent.click(screen.getByTestId("channel-picker"));

    await userEvent.type(screen.getByTestId("channel-search"), "ran");

    expect(screen.queryByTestId("pick-general")).not.toBeInTheDocument();
  });

  it("says so when nothing matches", async () => {
    render(picker("general"));
    await userEvent.click(screen.getByTestId("channel-picker"));

    await userEvent.type(screen.getByTestId("channel-search"), "zzz");

    expect(screen.getByTestId("no-channel-match")).toBeInTheDocument();
  });

  it("marks channels with unread messages", async () => {
    render(picker("random"));

    await userEvent.click(screen.getByTestId("channel-picker"));

    expect(screen.getByTestId("pick-general")).toHaveAttribute(
      "data-unread",
      "true",
    );
  });

  it("closes once a channel is picked", async () => {
    render(picker("general"));
    await userEvent.click(screen.getByTestId("channel-picker"));

    await userEvent.click(screen.getByTestId("pick-random"));

    expect(screen.getByTestId("channel-picker")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("flags the picker when another channel wants attention", () => {
    render(picker("random"));

    const trigger = screen.getByTestId("channel-picker");

    expect(trigger).toHaveAttribute("data-attention", "true");
  });

  it("leaves the picker plain when only the open channel wants attention", () => {
    render(picker("general"));

    const trigger = screen.getByTestId("channel-picker");

    expect(trigger).toHaveAttribute("data-attention", "false");
  });
});
