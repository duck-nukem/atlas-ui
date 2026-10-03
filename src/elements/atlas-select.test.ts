import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { userEvent as browser } from "vitest/browser";
import { mount, selectMarkup } from "./markup";

const options = [
  { value: "f1", label: "F-1 todo.md" },
  { value: "f2", label: "F-2 Chat" },
];

const valueOf = (container: HTMLElement, name: string) =>
  [
    ...(container.querySelector<HTMLSelectElement>(`select[name=${name}]`)
      ?.selectedOptions ?? []),
  ].map((option) => option.value);

describe("atlas-select", () => {
  it("filters options by the typed query", async () => {
    mount(selectMarkup({ name: "featureId", options, label: "Feature" }));
    await userEvent.click(screen.getByRole("combobox", { name: "Feature" }));

    await userEvent.type(screen.getByTestId("select-search"), "chat");

    expect(
      screen.getAllByRole("option").map((option) => option.textContent),
    ).toEqual(["F-2 Chat"]);
  });

  it("describes an invalid select by the error of its field", () => {
    mount(
      selectMarkup({
        name: "featureId",
        options,
        label: "Feature",
        id: "featureId",
        invalid: true,
      }),
    );

    const trigger = screen.getByRole("combobox", { name: "Feature" });

    expect(trigger).toHaveAttribute("aria-describedby", "featureId-error");
  });

  it("stores the chosen value in the native select", async () => {
    const container = mount(
      selectMarkup({ name: "featureId", options, label: "Feature" }),
    );
    await userEvent.click(screen.getByRole("combobox", { name: "Feature" }));

    await userEvent.click(screen.getByRole("option", { name: "F-2 Chat" }));

    expect(valueOf(container, "featureId")).toEqual(["f2"]);
  });

  it("keeps several values when multiple", async () => {
    const container = mount(
      selectMarkup({
        name: "ids",
        options,
        multiple: true,
        selected: ["f1"],
        label: "Ids",
      }),
    );
    await userEvent.click(screen.getByRole("combobox", { name: "Ids" }));

    await userEvent.click(screen.getByRole("option", { name: "F-2 Chat" }));

    expect(valueOf(container, "ids")).toEqual(["f1", "f2"]);
  });

  it("selects the highlighted option with Enter", async () => {
    const container = mount(
      selectMarkup({ name: "featureId", options, label: "Feature" }),
    );
    await userEvent.click(screen.getByRole("combobox", { name: "Feature" }));

    await userEvent.type(
      screen.getByTestId("select-search"),
      "{ArrowDown}{Enter}",
    );

    expect(valueOf(container, "featureId")).toEqual(["f2"]);
  });

  it("closes a multiple choice list when done is pressed", async () => {
    mount(
      selectMarkup({
        name: "ids",
        options,
        multiple: true,
        label: "Ids",
        testId: "select",
      }),
    );
    await userEvent.click(screen.getByRole("combobox", { name: "Ids" }));
    await userEvent.click(screen.getByRole("option", { name: "F-2 Chat" }));

    await userEvent.click(screen.getByTestId("select-done"));

    expect(screen.getByTestId("select")).toHaveAttribute("data-open", "false");
  });

  it("auto selects the only value", () => {
    const container = mount(
      selectMarkup({
        name: "featureId",
        options: [{ value: "f1", label: "F-1 todo.md" }],
        label: "Feature",
      }),
    );

    const value = valueOf(container, "featureId");

    expect(value).toEqual(["f1"]);
  });
});

describe("atlas-select choices", () => {
  it("clears a clearable choice", async () => {
    mount(
      selectMarkup({
        name: "featureId",
        options,
        selected: ["f1"],
        clearable: true,
        testId: "select",
      }),
    );
    await userEvent.click(screen.getByTestId("select"));

    await userEvent.click(screen.getByTestId("option-none"));

    expect(screen.getByTestId("select")).toHaveAttribute("data-value", "");
  });

  it("hides the none choice while searching", async () => {
    mount(
      selectMarkup({
        name: "featureId",
        options,
        clearable: true,
        testId: "select",
      }),
    );
    await userEvent.click(screen.getByTestId("select"));

    await userEvent.type(screen.getByTestId("select-search"), "chat");

    expect(screen.queryByTestId("option-none")).toBeNull();
  });

  it("says so when nothing matches the query", async () => {
    mount(selectMarkup({ name: "featureId", options, testId: "select" }));
    await userEvent.click(screen.getByTestId("select"));

    await userEvent.type(screen.getByTestId("select-search"), "zzz");

    expect(screen.getByTestId("select-note")).toHaveAttribute(
      "data-note",
      "noMatches",
    );
  });

  it("chooses nothing on Enter when nothing matches", async () => {
    mount(
      selectMarkup({
        name: "featureId",
        options,
        clearable: true,
        testId: "select",
      }),
    );
    await userEvent.click(screen.getByTestId("select"));
    await userEvent.type(screen.getByTestId("select-search"), "zzz");

    await userEvent.type(screen.getByTestId("select-search"), "{Enter}");

    expect(screen.getByTestId("select")).toHaveAttribute("data-value", "");
  });

  it("moves up to the last option from the first", async () => {
    mount(selectMarkup({ name: "featureId", options, testId: "select" }));
    await userEvent.click(screen.getByTestId("select"));

    await userEvent.type(
      screen.getByTestId("select-search"),
      "{ArrowUp}{Enter}",
    );

    expect(screen.getByTestId("select")).toHaveAttribute("data-value", "f2");
  });

  it("closes the list on Escape", async () => {
    mount(selectMarkup({ name: "featureId", options, testId: "select" }));
    await userEvent.click(screen.getByTestId("select"));

    await browser.keyboard("{Escape}");

    expect(screen.getByTestId("select")).toHaveAttribute("data-open", "false");
  });
});

describe("atlas-select by keyboard", () => {
  it("reaches the none choice above the first option", async () => {
    mount(
      selectMarkup({
        name: "featureId",
        options,
        selected: ["f1"],
        clearable: true,
        testId: "select",
      }),
    );
    await userEvent.click(screen.getByTestId("select"));

    await userEvent.type(
      screen.getByTestId("select-search"),
      "{ArrowUp}{Enter}",
    );

    expect(screen.getByTestId("select")).toHaveAttribute("data-value", "");
  });

  it("tells assistive technology which option is active", async () => {
    mount(selectMarkup({ name: "featureId", options, testId: "select" }));
    await userEvent.click(screen.getByTestId("select"));

    await userEvent.type(screen.getByTestId("select-search"), "{ArrowDown}");

    expect(
      screen.getByTestId("select-search").getAttribute("aria-activedescendant"),
    ).toBe(screen.getByTestId("option-f2").id);
  });
});

describe("atlas-select after a search", () => {
  it("picks the first option again when reopened, not the none choice", async () => {
    mount(
      selectMarkup({
        name: "featureId",
        options,
        clearable: true,
        testId: "select",
      }),
    );
    await userEvent.click(screen.getByTestId("select"));
    await userEvent.type(screen.getByTestId("select-search"), "Chat{Enter}");
    await userEvent.click(screen.getByTestId("select"));

    await userEvent.type(screen.getByTestId("select-search"), "{Enter}");

    expect(screen.getByTestId("select")).toHaveAttribute("data-value", "f1");
  });
});

describe("atlas-select after hovering", () => {
  it("starts at the first option again when reopened", async () => {
    mount(selectMarkup({ name: "featureId", options, testId: "select" }));
    await userEvent.click(screen.getByTestId("select"));
    await userEvent.hover(screen.getByTestId("option-f2"));
    await browser.keyboard("{Escape}");
    await userEvent.click(screen.getByTestId("select"));

    await userEvent.type(screen.getByTestId("select-search"), "{Enter}");

    expect(screen.getByTestId("select")).toHaveAttribute("data-value", "f1");
  });
});

const savingForm = (submits: string[][], multiple: boolean) => {
  const container = mount(
    `<form>${selectMarkup({ name: "ids", options, multiple, submitOnChange: true, label: "Ids" })}</form>`,
  );
  const form = container.querySelector("form");

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    submits.push(new FormData(form).getAll("ids").map(String));
  });
};

describe("atlas-select saving on change", () => {
  it("does not save a multiple choice while picking", async () => {
    const submits: string[][] = [];
    savingForm(submits, true);
    await userEvent.click(screen.getByRole("combobox", { name: "Ids" }));

    await userEvent.click(screen.getByRole("option", { name: "F-1 todo.md" }));
    await userEvent.click(screen.getByRole("option", { name: "F-2 Chat" }));

    expect(submits).toEqual([]);
  });

  it("saves a multiple choice once when the list closes", async () => {
    const submits: string[][] = [];
    savingForm(submits, true);
    await userEvent.click(screen.getByRole("combobox", { name: "Ids" }));
    await userEvent.click(screen.getByRole("option", { name: "F-1 todo.md" }));
    await userEvent.click(screen.getByRole("option", { name: "F-2 Chat" }));

    await browser.keyboard("{Escape}");

    expect(submits).toEqual([["f1", "f2"]]);
  });

  it("saves a single choice right away", async () => {
    const submits: string[][] = [];
    savingForm(submits, false);
    await userEvent.click(screen.getByRole("combobox", { name: "Ids" }));

    await userEvent.click(screen.getByRole("option", { name: "F-2 Chat" }));

    expect(submits).toEqual([["f2"]]);
  });
});

async function openSelect(trigger: HTMLElement): Promise<void> {
  await browser.click(trigger);
  await vi.waitUntil(
    () => document.activeElement === screen.getByTestId("select-search"),
  );
}

describe("atlas-select focus", () => {
  it("moves focus to the search box when opened", async () => {
    mount(selectMarkup({ name: "featureId", options, testId: "select" }));

    await browser.click(screen.getByTestId("select"));

    await expect
      .poll(() => document.activeElement)
      .toBe(screen.getByTestId("select-search"));
  });

  it("gives focus back to the trigger on Escape", async () => {
    mount(selectMarkup({ name: "featureId", options, testId: "select" }));
    await openSelect(screen.getByTestId("select"));

    await browser.keyboard("{Escape}");

    expect(document.activeElement).toBe(screen.getByTestId("select"));
  });

  it("gives focus back to the trigger after an option is clicked", async () => {
    mount(selectMarkup({ name: "featureId", options, testId: "select" }));
    await openSelect(screen.getByTestId("select"));

    await browser.click(screen.getByRole("option", { name: "F-2 Chat" }));

    expect(document.activeElement).toBe(screen.getByTestId("select"));
  });

  it("gives focus back to the trigger after done is pressed", async () => {
    mount(
      selectMarkup({ name: "ids", options, multiple: true, testId: "select" }),
    );
    await openSelect(screen.getByTestId("select"));

    await browser.click(screen.getByTestId("select-done"));

    expect(document.activeElement).toBe(screen.getByTestId("select"));
  });

  it("names the trigger by the label it points to", () => {
    mount(
      `<span id="feature-label">Feature</span>${selectMarkup({ name: "featureId", options, labelledBy: "feature-label" })}`,
    );

    const trigger = screen.getByRole("combobox", { name: "Feature" });

    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
  });
});

const settle = () => new Promise<void>((resolve) => queueMicrotask(resolve));

describe("atlas-select and the server markup", () => {
  it("rebuilds after the server replaces its content", async () => {
    const container = mount(
      selectMarkup({
        name: "featureId",
        options,
        label: "Feature",
        testId: "select",
      }),
    );
    const element = container.querySelector("atlas-select");

    const server = document.createElement("template");
    server.innerHTML = selectMarkup({
      name: "featureId",
      options,
      selected: ["f2"],
      label: "Feature",
    });

    element?.replaceChildren(
      ...(server.content.querySelector("atlas-select")?.childNodes ?? []),
    );
    await settle();

    expect(
      [...(element?.querySelectorAll(".ui-select-trigger") ?? [])].map(
        (trigger) => trigger.textContent,
      ),
    ).toEqual(["F-2 Chat"]);
  });

  it("lists an option the server adds", async () => {
    const container = mount(
      selectMarkup({ name: "featureId", options, label: "Feature" }),
    );
    container.querySelector("select")?.add(new Option("F-3 Health", "f3"));
    await settle();

    await userEvent.click(screen.getByRole("combobox", { name: "Feature" }));

    expect(screen.queryByRole("option", { name: "F-3 Health" })).not.toBeNull();
  });

  it("follows the option the server marks selected", async () => {
    const container = mount(
      selectMarkup({ name: "featureId", options, label: "Feature" }),
    );

    container.querySelector("option[value=f2]")?.setAttribute("selected", "");
    await settle();

    expect(screen.getByRole("combobox", { name: "Feature" }).textContent).toBe(
      "F-2 Chat",
    );
  });

  it("goes back to its first value when its form resets", async () => {
    mount(
      `<form>${selectMarkup({ name: "featureId", options, selected: ["f1"], label: "Feature" })}</form>`,
    );
    await userEvent.click(screen.getByRole("combobox", { name: "Feature" }));
    await userEvent.click(screen.getByRole("option", { name: "F-2 Chat" }));

    document.querySelector("form")?.reset();
    await settle();

    expect(screen.getByRole("combobox", { name: "Feature" }).textContent).toBe(
      "F-1 todo.md",
    );
  });

  it("disables its trigger when the server disables the select", async () => {
    const container = mount(
      selectMarkup({ name: "featureId", options, label: "Feature" }),
    );

    container.querySelector("select")?.setAttribute("disabled", "");
    await settle();

    expect(screen.getByRole("combobox", { name: "Feature" })).toBeDisabled();
  });

  it("tells assistive technology a required choice is required", () => {
    const container = mount(
      selectMarkup({ name: "featureId", options, label: "Feature" }).replace(
        "<select ",
        "<select required ",
      ),
    );

    const trigger = container.querySelector("[role=combobox]");

    expect(trigger).toHaveAttribute("aria-required");
  });

  it("submits an empty value once cleared, even without an empty option", async () => {
    const container = mount(
      `<form>${selectMarkup({ name: "featureId", options, selected: ["f2"], clearable: true, testId: "select" }).replace('<option value="">None</option>', "")}</form>`,
    );
    await userEvent.click(screen.getByTestId("select"));

    await userEvent.click(screen.getByTestId("option-none"));

    expect(
      new FormData(container.querySelector("form") ?? undefined).get(
        "featureId",
      ),
    ).toBe("");
  });

  it("leaves disabled options out of the list", async () => {
    mount(
      selectMarkup({ name: "featureId", options, label: "Feature" }).replace(
        'value="f2"',
        'value="f2" disabled',
      ),
    );

    await userEvent.click(screen.getByRole("combobox", { name: "Feature" }));

    expect(screen.queryByRole("option", { name: "F-2 Chat" })).toBeNull();
  });

  it("builds one trigger when cloned", async () => {
    const container = mount(
      selectMarkup({ name: "featureId", options, label: "Feature" }),
    );
    const clone = container.querySelector("atlas-select")?.cloneNode(true);

    container.replaceChildren(...(clone === undefined ? [] : [clone]));
    await settle();

    expect(container.querySelectorAll("[role=combobox]")).toHaveLength(1);
  });
});

describe("atlas-select with a search url", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("asks the url for options with the typed text", async () => {
    const asked: string[] = [];
    vi.stubGlobal("fetch", (url: URL) => {
      asked.push(url.search);

      return Promise.resolve(
        Response.json({ options: [{ value: "u1", label: "Anna Maria" }] }),
      );
    });
    mount(
      `<atlas-select search-url="/people"><select name="person" aria-label="Person"></select></atlas-select>`,
    );

    await userEvent.click(screen.getByRole("combobox", { name: "Person" }));

    expect(asked).toEqual(["?q="]);
  });

  it("lists the options the url answers with", async () => {
    vi.stubGlobal("fetch", () =>
      Promise.resolve(
        Response.json({ options: [{ value: "u1", label: "Anna Maria" }] }),
      ),
    );
    mount(
      `<atlas-select search-url="/people"><select name="person" aria-label="Person"></select></atlas-select>`,
    );

    await userEvent.click(screen.getByRole("combobox", { name: "Person" }));

    await expect
      .poll(() => screen.queryByRole("option", { name: "Anna Maria" }))
      .not.toBeNull();
  });

  it("says the search failed when the url answers something else", async () => {
    vi.stubGlobal("fetch", () =>
      Promise.resolve(Response.json({ people: [] })),
    );
    mount(
      `<atlas-select search-url="/people"><select name="person" aria-label="Person"></select></atlas-select>`,
    );

    await userEvent.click(screen.getByRole("combobox", { name: "Person" }));

    await expect
      .poll(() => screen.getByTestId("select-note").dataset["note"])
      .toBe("searchFailed");
  });
});
