import {
  clearShown,
  filterOptions,
  firstOptionIndex,
  listEntries,
  initialSelection,
  ListNote,
  listNote,
  moveActive,
  SearchStatus,
  summarize,
  toggleValue,
} from "./select-model";

const options = [
  { value: "a", label: "Alpha", hint: "first" },
  { value: "b", label: "Beta" },
];

describe("filterOptions", () => {
  it("matches case-insensitively on label and hint", () => {
    const matches = filterOptions(options, "FIR");

    expect(matches.map((option) => option.value)).toEqual(["a"]);
  });
});

describe("toggleValue", () => {
  it("replaces the selection for single choice", () => {
    expect(toggleValue(["a"], "b", false)).toEqual(["b"]);
  });

  it("adds and removes for multiple choice", () => {
    const added = toggleValue(["a"], "b", true);

    expect([added, toggleValue(added, "a", true)]).toEqual([["a", "b"], ["b"]]);
  });
});

describe("moveActive", () => {
  it("wraps around both ends", () => {
    expect([moveActive(0, -1, 3), moveActive(2, 1, 3)]).toEqual([2, 0]);
  });

  it("stays on the first row when nothing matches", () => {
    const noMatches = 0;

    const active = moveActive(0, 1, noMatches);

    expect(active).toBe(0);
  });
});

describe("summarize", () => {
  it("lists the selected labels or the placeholder", () => {
    expect([
      summarize(options, ["b", "a"], "Pick"),
      summarize(options, [], "Pick"),
    ]).toEqual(["Beta, Alpha", "Pick"]);
  });
});

describe("initialSelection", () => {
  const single = [{ value: "a", label: "Alpha" }];

  it("takes the only option when nothing is chosen", () => {
    expect(
      initialSelection([], single, { multiple: false, clearable: false }),
    ).toEqual(["a"]);
  });

  it("keeps what was chosen", () => {
    expect(
      initialSelection(["b"], single, { multiple: false, clearable: false }),
    ).toEqual(["b"]);
  });

  it("chooses nothing when there is more than one option", () => {
    expect(
      initialSelection([], options, { multiple: false, clearable: false }),
    ).toEqual([]);
  });

  it("leaves a clearable field empty, since none is a choice there", () => {
    expect(
      initialSelection([], single, { multiple: false, clearable: true }),
    ).toEqual([]);
  });

  it("leaves a multiple choice field empty", () => {
    expect(
      initialSelection([], single, { multiple: true, clearable: false }),
    ).toEqual([]);
  });
});

describe("listEntries", () => {
  it("puts the none choice first when it is shown", () => {
    const entries = listEntries([{ value: "a", label: "A" }], true);

    expect(entries).toEqual([
      { kind: "clear" },
      { kind: "option", value: "a" },
    ]);
  });
});

describe("firstOptionIndex", () => {
  it("starts after the none choice", () => {
    const index = firstOptionIndex(true);

    expect(index).toBe(1);
  });
});

describe("clearShown", () => {
  it("hides the none choice while searching", () => {
    const shown = clearShown({ multiple: false, clearable: true }, "chat");

    expect(shown).toBe(false);
  });
});

describe("clearShown for the other modes", () => {
  it("shows the none choice of a single clearable select before a search", () => {
    const shown = clearShown({ multiple: false, clearable: true }, "");

    expect(shown).toBe(true);
  });

  it("never shows the none choice when several values can be chosen", () => {
    const shown = clearShown({ multiple: true, clearable: true }, "");

    expect(shown).toBe(false);
  });
});

describe("listEntries without the none choice", () => {
  it("lists only the options", () => {
    const entries = listEntries([{ value: "a", label: "A" }], false);

    expect(entries).toEqual([{ kind: "option", value: "a" }]);
  });
});

describe("firstOptionIndex without the none choice", () => {
  it("starts at the top", () => {
    const index = firstOptionIndex(false);

    expect(index).toBe(0);
  });
});

describe("listNote", () => {
  it("says a search is running", () => {
    const status = SearchStatus.Searching;

    const note = listNote(status, 0);

    expect(note).toBe(ListNote.Searching);
  });

  it("says the search failed", () => {
    const status = SearchStatus.Failed;

    const note = listNote(status, 0);

    expect(note).toBe(ListNote.Failed);
  });

  it("says nothing matched", () => {
    const status = SearchStatus.Ready;

    const note = listNote(status, 0);

    expect(note).toBe(ListNote.NoMatches);
  });

  it("says nothing while there are options to show", () => {
    const status = SearchStatus.Ready;

    const note = listNote(status, 2);

    expect(note).toBe(ListNote.None);
  });
});
