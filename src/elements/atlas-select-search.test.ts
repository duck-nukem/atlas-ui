import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { userEvent as browser } from "vitest/browser";
import { type AtlasSelect, SEARCH_PAUSE_MS, type SearchOptions } from "./index";
import { mount, selectMarkup } from "./markup";
import type { SelectOption } from "./select-model";

const anna = { value: "u1", label: "Anna Maria", hint: "@anna" };
const bob = { value: "u2", label: "Bob Stone", hint: "@bob" };

type Answer = {
  resolve: (options: SelectOption[]) => void;
  reject: () => void;
  signal: AbortSignal;
};

function answering(): SearchOptions & { asked: string[]; answers: Answer[] } {
  const asked: string[] = [];
  const answers: Answer[] = [];
  const search = (
    query: string,
    signal: AbortSignal,
  ): Promise<SelectOption[]> =>
    new Promise((resolve, reject) => {
      asked.push(query);
      answers.push({
        signal,
        resolve,
        reject: () => reject(new Error("offline")),
      });
    });

  return Object.assign(search, { asked, answers });
}

const settle = () => new Promise<void>((resolve) => queueMicrotask(resolve));

async function answer(
  search: ReturnType<typeof answering>,
  index: number,
  options: SelectOption[],
) {
  search.answers[index]?.resolve(options);
  await settle();
  await settle();
}

function renderSelect(search: SearchOptions, chosen: SelectOption[] = []) {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  const container = mount(
    selectMarkup({
      name: "reviewerId",
      label: "Reviewer",
      options: chosen,
      selected: chosen.map((option) => option.value),
    }),
  );
  const element = container.querySelector<AtlasSelect>("atlas-select");

  if (element !== null) {
    element.searchOptions = search;
  }

  return {
    user,
    element,
    trigger: screen.getByRole("combobox", { name: "Reviewer" }),
  };
}

describe("atlas-select with a server search", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("names the chosen value it was given", () => {
    const search = answering();

    const { trigger } = renderSelect(search, [anna]);

    expect(trigger.textContent).toBe("Anna Maria");
  });

  it("asks the server nothing until opened", () => {
    const search = answering();

    renderSelect(search, [anna]);

    expect(search.asked).toEqual([]);
  });

  it("asks for the first options when opened", async () => {
    const search = answering();
    const { user, trigger } = renderSelect(search);

    await user.click(trigger);

    expect(search.asked).toEqual([""]);
  });

  it("waits for a pause in typing before it searches", async () => {
    const search = answering();
    const { user, trigger } = renderSelect(search);
    await user.click(trigger);

    await user.type(screen.getByTestId("select-search"), "ann");

    expect(search.asked).toEqual([""]);
  });

  it("searches the typed text once the pause is over", async () => {
    const search = answering();
    const { user, trigger } = renderSelect(search);
    await user.click(trigger);
    await user.type(screen.getByTestId("select-search"), "ann");

    vi.advanceTimersByTime(SEARCH_PAUSE_MS);

    expect(search.asked).toEqual(["", "ann"]);
  });

  it("says it is searching while the answer is on its way", async () => {
    const search = answering();
    const { user, trigger } = renderSelect(search);

    await user.click(trigger);

    expect(screen.getByTestId("select-note")).toHaveAttribute(
      "data-note",
      "searching",
    );
  });

  it("stops saying it is searching once the answer arrives", async () => {
    const search = answering();
    const { user, trigger } = renderSelect(search);
    await user.click(trigger);

    await answer(search, 0, [anna]);

    expect(screen.getByTestId("select-note")).toHaveAttribute(
      "data-note",
      "none",
    );
  });

  it("offers nothing to pick while a newer search is on its way", async () => {
    const search = answering();
    const { user, trigger } = renderSelect(search);
    await user.click(trigger);
    await answer(search, 0, [anna, bob]);

    await user.type(screen.getByTestId("select-search"), "b");

    expect(screen.queryAllByRole("option")).toEqual([]);
  });

  it("searches at once when the text is cleared", async () => {
    const search = answering();
    const { user, trigger } = renderSelect(search);
    await user.click(trigger);
    await user.type(screen.getByTestId("select-search"), "b");

    await user.clear(screen.getByTestId("select-search"));

    expect(search.asked).toEqual(["", ""]);
  });

  it("cancels the search a newer one replaces", async () => {
    const search = answering();
    const { user, trigger } = renderSelect(search);
    await user.click(trigger);
    await user.type(screen.getByTestId("select-search"), "b");

    vi.advanceTimersByTime(SEARCH_PAUSE_MS);

    expect(search.answers[0]?.signal.aborted).toBe(true);
  });

  it("cancels its search when it goes away", async () => {
    const search = answering();
    const { user, trigger, element } = renderSelect(search);
    await user.click(trigger);

    element?.remove();

    expect(search.answers[0]?.signal.aborted).toBe(true);
  });

  it("says when the search failed", async () => {
    const search = answering();
    const { user, trigger } = renderSelect(search);
    await user.click(trigger);

    search.answers[0]?.reject();
    await settle();
    await settle();

    expect(screen.getByTestId("select-note")).toHaveAttribute(
      "data-note",
      "searchFailed",
    );
  });

  it("keeps a chosen option named after a search that no longer finds it", async () => {
    const search = answering();
    const { user, trigger } = renderSelect(search);
    await user.click(trigger);
    await answer(search, 0, [anna, bob]);
    await user.click(screen.getByTestId("option-u2"));
    await user.click(trigger);

    await answer(search, 1, [anna]);

    expect(trigger.textContent).toBe("Bob Stone");
  });

  it("ignores an answer to a search that a newer one replaced", async () => {
    const search = answering();
    const { user, trigger } = renderSelect(search);
    await user.click(trigger);
    await user.type(screen.getByTestId("select-search"), "b");
    vi.advanceTimersByTime(SEARCH_PAUSE_MS);
    await answer(search, 1, [bob]);

    await answer(search, 0, [anna, bob]);

    expect(
      screen.getAllByRole("option").map((option) => option.dataset["testid"]),
    ).toEqual(["option-u2"]);
  });

  it("picks the first result with Enter once the answer arrives", async () => {
    const search = answering();
    const { user, trigger } = renderSelect(search);
    await user.click(trigger);
    await answer(search, 0, [anna, bob]);
    await vi.waitUntil(
      () => document.activeElement === screen.getByTestId("select-search"),
    );

    await user.keyboard("{Enter}");

    expect(trigger.textContent).toBe("Anna Maria");
  });

  it("drops the search it was waiting to run when closed", async () => {
    const search = answering();
    const { user, trigger } = renderSelect(search);
    await user.click(trigger);
    await user.type(screen.getByTestId("select-search"), "b");
    await browser.keyboard("{Escape}");

    vi.advanceTimersByTime(SEARCH_PAUSE_MS);

    expect(search.asked).toEqual([""]);
  });
});
