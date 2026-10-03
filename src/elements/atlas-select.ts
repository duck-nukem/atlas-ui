import { icons } from "./icons";
import { Popover } from "./popover";
import {
  clearShown,
  filterOptions,
  firstOptionIndex,
  initialSelection,
  type ListEntry,
  ListNote,
  listEntries,
  listNote,
  moveActive,
  SearchStatus,
  type SelectOption,
  type SelectionMode,
  summarize,
  toggleValue,
} from "./select-model";

export type SearchOptions = (
  text: string,
  signal: AbortSignal,
) => Promise<readonly SelectOption[]>;

export const SEARCH_PAUSE_MS = 300;

const texts = {
  choose: "Choose…",
  search: "Search options",
  "type-to-search": "Type to search",
  none: "None",
  done: "Done",
  [ListNote.NoMatches]: "No matches",
  [ListNote.Searching]: "Searching…",
  [ListNote.Failed]: "Could not search, try again",
};

type Text = keyof typeof texts;

const transferred = [
  "id",
  "aria-label",
  "aria-labelledby",
  "aria-describedby",
  "aria-invalid",
] as const;

let count = 0;

function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attributes: Record<string, string>,
  ...children: (Node | string)[]
): HTMLElementTagNameMap[K] {
  const created = document.createElement(tag);

  Object.entries(attributes).forEach(([name, value]) =>
    created.setAttribute(name, value),
  );
  created.append(...children);

  return created;
}

function optionsOf(select: HTMLSelectElement): SelectOption[] {
  return [...select.options]
    .filter((option) => option.value !== "")
    .map((option) => {
      const hint = option.dataset["hint"];

      return hint === undefined
        ? { value: option.value, label: option.label }
        : { value: option.value, label: option.label, hint };
    });
}

async function searchUrl(
  url: string,
  text: string,
  signal: AbortSignal,
): Promise<readonly SelectOption[]> {
  const target = new URL(url, location.href);

  target.searchParams.set("q", text);

  const response = await fetch(target, {
    signal,
    headers: { accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`option search answered ${String(response.status)}`);
  }

  const { options } = (await response.json()) as { options: SelectOption[] };

  return options;
}

export class AtlasSelect extends HTMLElement {
  searchOptions: SearchOptions | undefined;

  #select!: HTMLSelectElement;
  #trigger!: HTMLButtonElement;
  #summary!: HTMLSpanElement;
  #search!: HTMLInputElement;
  #list!: HTMLUListElement;
  #note!: HTMLParagraphElement;
  #popover!: Popover;
  #options: readonly SelectOption[] = [];
  #known: readonly SelectOption[] = [];
  #selected: string[] = [];
  #query = "";
  #active = 0;
  #status = SearchStatus.Ready;
  #unsaved = false;
  #timer: ReturnType<typeof setTimeout> | undefined;
  #request: AbortController | undefined;

  connectedCallback(): void {
    const select = this.querySelector("select");

    if (select === null || this.#select !== undefined) {
      return;
    }

    this.#select = select;
    this.#options = optionsOf(select);
    this.#known = this.#options;
    this.#selected = initialSelection(
      [...select.selectedOptions]
        .map((option) => option.value)
        .filter((value) => value !== ""),
      this.#options,
      this.#mode(),
    );
    this.#build();
    this.#commitSelection(this.#selected);
    this.#render();
  }

  disconnectedCallback(): void {
    this.#cancel();
  }

  #text(name: Text): string {
    return this.getAttribute(`text-${name}`) ?? texts[name];
  }

  #mode(): SelectionMode {
    return {
      multiple: this.#select.multiple,
      clearable: this.hasAttribute("clearable"),
    };
  }

  #server(): SearchOptions | undefined {
    const url = this.getAttribute("search-url");

    return (
      this.searchOptions ??
      (url === null
        ? undefined
        : (text, signal) => searchUrl(url, text, signal))
    );
  }

  #build(): void {
    const id = `atlas-select-${String((count += 1))}`;
    const listId = `${id}-list`;

    this.#summary = element("span", {});
    this.#trigger = element(
      "button",
      {
        type: "button",
        role: "combobox",
        class: "ui-select-trigger",
        popovertarget: id,
        "aria-haspopup": "dialog",
        "aria-controls": id,
        "aria-expanded": "false",
      },
      this.#summary,
    );
    this.#trigger.insertAdjacentHTML("beforeend", icons.chevronsUpDown);
    transferred.forEach((name) => {
      const value = this.#select.getAttribute(name);

      if (value !== null) {
        this.#trigger.setAttribute(name, value);
        this.#select.removeAttribute(name);
      }
    });

    const testId = this.dataset["testid"];

    if (testId !== undefined) {
      this.#trigger.dataset["testid"] = testId;
      this.removeAttribute("data-testid");
    }

    this.#trigger.disabled = this.#select.disabled;
    this.#search = element("input", {
      type: "text",
      role: "searchbox",
      "data-testid": "select-search",
      "aria-label": this.#text("search"),
      "aria-controls": listId,
      placeholder: this.#text("type-to-search"),
    });
    this.#list = element("ul", {
      id: listId,
      role: "listbox",
      class: "ui-listbox",
      "aria-multiselectable": String(this.#select.multiple),
    });

    const name = this.#trigger.getAttribute("aria-label");
    const labelledBy = this.#trigger.getAttribute("aria-labelledby");

    if (labelledBy !== null) {
      this.#list.setAttribute("aria-labelledby", labelledBy);
    } else {
      this.#list.setAttribute("aria-label", name ?? this.#text("search"));
    }

    this.#note = element("p", {
      role: "status",
      class: "ui-select-note",
      "data-testid": "select-note",
    });

    const panel = element(
      "div",
      {
        id,
        popover: "auto",
        class: "ui-select-popover",
        role: "dialog",
        "aria-label": this.#text("search"),
      },
      this.#search,
      this.#list,
      this.#note,
    );

    if (this.#select.multiple) {
      const done = element(
        "button",
        {
          type: "button",
          class: "ui-select-done",
          "data-testid": "select-done",
        },
        this.#text("done"),
      );

      done.addEventListener("click", () => this.#popover.hide());
      panel.append(done);
    }

    this.#select.hidden = true;
    this.append(this.#trigger, panel);
    this.#popover = new Popover(panel, this.#trigger, {
      changing: (open) => (open ? this.#opened() : this.#closed()),
      shown: () => this.#search.focus(),
    });
    this.#search.addEventListener("input", () =>
      this.#typed(this.#search.value),
    );
    this.#search.addEventListener("keydown", (event) => this.#key(event));
    this.#list.addEventListener("mousedown", (event) => event.preventDefault());
  }

  #shown(): { matches: readonly SelectOption[]; status: SearchStatus } {
    return this.#server() === undefined
      ? {
          matches: filterOptions(this.#options, this.#query),
          status: SearchStatus.Ready,
        }
      : { matches: this.#options, status: this.#status };
  }

  #entries(): ListEntry[] {
    return listEntries(
      this.#shown().matches,
      clearShown(this.#mode(), this.#query),
    );
  }

  #highlighted(): number {
    return this.#active < this.#entries().length
      ? this.#active
      : firstOptionIndex(clearShown(this.#mode(), this.#query));
  }

  #render(): void {
    const { matches, status } = this.#shown();
    const showClear = clearShown(this.#mode(), this.#query);
    const highlighted = this.#highlighted();
    const first = firstOptionIndex(showClear);
    const listId = this.#list.id;
    const note = listNote(status, matches.length);

    this.#summary.textContent = summarize(
      this.#known,
      this.#selected,
      this.getAttribute("placeholder") ?? this.#text("choose"),
    );
    this.#trigger.dataset["value"] = this.#selected.join(",");
    this.#trigger.dataset["empty"] = String(this.#selected.length === 0);
    this.#trigger.dataset["open"] = String(this.#popover.open);
    this.#trigger.setAttribute("aria-expanded", String(this.#popover.open));

    const none = showClear
      ? [
          this.#option(
            `${listId}-0`,
            { value: "", label: this.#text("none") },
            highlighted === 0,
            this.#selected.length === 0,
            0,
          ),
        ]
      : [];
    const items = matches.map((option, index) =>
      this.#option(
        `${listId}-${String(index + first)}`,
        option,
        index + first === highlighted,
        this.#selected.includes(option.value),
        index + first,
      ),
    );

    this.#list.replaceChildren(...none, ...items);

    if (this.#entries()[highlighted] === undefined) {
      this.#search.removeAttribute("aria-activedescendant");
    } else {
      this.#search.setAttribute(
        "aria-activedescendant",
        `${listId}-${String(highlighted)}`,
      );
    }

    this.#note.dataset["note"] = note;
    this.#note.textContent = note === ListNote.None ? "" : this.#text(note);
  }

  #option(
    id: string,
    option: SelectOption,
    active: boolean,
    selected: boolean,
    position: number,
  ): HTMLLIElement {
    const clear = option.value === "";
    const item = element("li", {
      id,
      role: "option",
      class: "ui-option",
      "data-testid": clear ? "option-none" : `option-${option.value}`,
      "data-active": String(active),
      "aria-selected": String(selected),
    });

    if (clear) {
      item.dataset["none"] = "";
    }

    item.insertAdjacentHTML("beforeend", clear ? icons.x : icons.check);
    item.append(element("span", {}, option.label));

    if (option.hint !== undefined) {
      item.append(element("span", { class: "ui-option-hint" }, option.hint));
    }

    item.addEventListener("mousemove", () => {
      if (this.#active !== position) {
        this.#active = position;
        this.#render();
      }
    });
    item.addEventListener("click", () =>
      clear ? this.#clear() : this.#choose(option.value),
    );

    return item;
  }

  #startOver(): void {
    this.#query = "";
    this.#search.value = "";
    this.#active = firstOptionIndex(clearShown(this.#mode(), ""));
  }

  #opened(): void {
    this.#startOver();

    if (this.#server() !== undefined) {
      this.#query = "";
      this.#lookUp("");
    }

    this.#render();
  }

  #closed(): void {
    this.#cancel();
    this.#render();

    if (this.#unsaved) {
      this.#unsaved = false;
      this.#submit();
    }
  }

  #typed(text: string): void {
    this.#query = text;
    this.#active = firstOptionIndex(clearShown(this.#mode(), text));

    if (this.#server() !== undefined) {
      this.#lookUp(text);
    }

    this.#render();
  }

  #key(event: KeyboardEvent): void {
    const entries = this.#entries();
    const highlighted = this.#highlighted();

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      this.#active = moveActive(
        highlighted,
        event.key === "ArrowDown" ? 1 : -1,
        entries.length,
      );
      this.#render();
    } else if (event.key === "Enter" && !event.isComposing) {
      event.preventDefault();

      const entry = entries[highlighted];

      if (entry?.kind === "clear") {
        this.#clear();
      } else if (entry !== undefined) {
        this.#choose(entry.value);
      }
    }
  }

  #choose(value: string): void {
    this.#commit(toggleValue(this.#selected, value, this.#select.multiple));

    if (!this.#select.multiple) {
      this.#popover.hide();
    }
  }

  #clear(): void {
    this.#commit([]);
    this.#popover.hide();
  }

  #commit(values: string[]): void {
    this.#commitSelection(values);
    this.#select.dispatchEvent(new Event("input", { bubbles: true }));
    this.#select.dispatchEvent(new Event("change", { bubbles: true }));

    const submitting = this.hasAttribute("submit-on-change");

    if (submitting && !this.#select.multiple) {
      this.#submit();
    }

    this.#unsaved = submitting && this.#select.multiple;
    this.#render();
  }

  #commitSelection(values: string[]): void {
    this.#selected = values;

    values
      .filter(
        (value) =>
          ![...this.#select.options].some((option) => option.value === value),
      )
      .forEach((value) => {
        const known = this.#known.find((option) => option.value === value);

        this.#select.add(new Option(known?.label ?? value, value));
      });
    [...this.#select.options].forEach((option) => {
      option.selected =
        values.includes(option.value) ||
        (values.length === 0 && option.value === "");
    });
  }

  #submit(): void {
    requestAnimationFrame(() => this.#select.form?.requestSubmit());
  }

  #cancel(): void {
    clearTimeout(this.#timer);
    this.#request?.abort();
  }

  #lookUp(text: string): void {
    this.#cancel();
    this.#options = [];

    if (text.trim() === "") {
      this.#run("");

      return;
    }

    this.#status = SearchStatus.Searching;
    this.#timer = setTimeout(() => this.#run(text), SEARCH_PAUSE_MS);
  }

  #run(text: string): void {
    const search = this.#server();

    if (search === undefined) {
      return;
    }

    const request = new AbortController();

    this.#request = request;
    this.#status = SearchStatus.Searching;
    this.#render();
    search(text, request.signal).then(
      (options) => {
        if (request.signal.aborted) {
          return;
        }

        this.#options = options;
        this.#known = [
          ...this.#known,
          ...options.filter(
            (option) =>
              !this.#known.some((seen) => seen.value === option.value),
          ),
        ];
        this.#status = SearchStatus.Ready;
        this.#render();
      },
      () => {
        if (!request.signal.aborted) {
          this.#status = SearchStatus.Failed;
          this.#render();
        }
      },
    );
  }
}
