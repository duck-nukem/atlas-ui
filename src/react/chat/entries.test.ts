import {
  attentionElsewhere,
  type ChannelEntry,
  matchingEntries,
} from "./entries";

const entry = (label: string): ChannelEntry => ({
  id: label,
  href: `/chat/${label}`,
  label,
  direct: false,
  unread: false,
  mentioned: false,
});

describe("matchingEntries", () => {
  it("keeps entries whose label contains the query in any case", () => {
    const entries = [entry("general"), entry("Random"), entry("design")];

    const matches = matchingEntries(entries, " RAN ");

    expect(matches.map((match) => match.label)).toEqual(["Random"]);
  });
});

describe("attentionElsewhere", () => {
  it("finds a channel outside the open one that mentions the viewer", () => {
    const entries = [
      entry("general"),
      { ...entry("Bob"), direct: true, mentioned: true },
    ];

    const wanted = attentionElsewhere(entries, "general");

    expect(wanted).toBe(true);
  });

  it("ignores the channel that is open", () => {
    const entries = [{ ...entry("Bob"), direct: true, mentioned: true }];

    const wanted = attentionElsewhere(entries, "Bob");

    expect(wanted).toBe(false);
  });
});
