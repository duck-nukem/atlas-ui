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

const mirrored = ["aria-label", "aria-describedby", "aria-invalid"] as const;

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

function optionOf(option: HTMLOptionElement): SelectOption {
  const hint = option.dataset["hint"];

  return hint === undefined
    ? { value: option.value, label: option.label }
    : { value: option.value, label: option.label, hint };
}

function isOption(candidate: unknown): candidate is SelectOption {
  const { value, label, hint } = (candidate ?? {}) as Record<string, unknown>;

  return (
    typeof value === "string" &&
    typeof label === "string" &&
    (hint === undefined || typeof hint === "string")
  );
}

export async function searchUrl(
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

  const { options } = ((await response.json()) ?? {}) as { options?: unknown };

  if (!Array.isArray(options) || !options.every(isOption)) {
    throw new Error("option search answered without a list of options");
  }

  return options;
}

export class AtlasSelect extends HTMLElement {
  static readonly observedAttributes = [
    "placeholder",
    "clearable",
    ...Object.keys(texts).map((name) => `text-${name}`),
  ];

  searchOptions: SearchOptions | undefined;

  #select: HTMLSelectElement | undefined;
  #trigger = element("button", {});
  #summary = element("span", {});
  #search = element("input", {});
  #list = element("ul", {});
  #note = element("p", {});
  #panel = element("div", {});
  #done = element("button", {});
  #popover: Popover | undefined;
  #options: readonly SelectOption[] = [];
  #known: readonly SelectOption[] = [];
  #selected: string[] = [];
  #query = "";
  #active = 0;
  #status = SearchStatus.Ready;
  #unsaved = false;
  #timer: ReturnType<typeof setTimeout> | undefined;
  #request: AbortController | undefined;
  #host = new MutationObserver(() => this.#sync());
  #content = new MutationObserver(() => this.#sync());
  #reset = () => setTimeout(() => this.#sync());
  #focusTrigger = () => this.#trigger.focus();
  #flaggedInvalid = false;
  #invalid = (event: Event) => {
    event.preventDefault();
    this.#flaggedInvalid = true;
    this.#select?.setAttribute("aria-invalid", "true");
    this.#trigger.focus();
  };
  #outside = (event: Event) => {
    if (!(event instanceof CustomEvent)) {
      this.#sync();
    }
  };

  connectedCallback(): void {
    this.#host.observe(this, { childList: true });
    this.#sync();
  }

  disconnectedCallback(): void {
    this.#cancel();
    this.#host.disconnect();
    this.#content.disconnect();
    this.#select?.form?.removeEventListener("reset", this.#reset);
    this.#select = undefined;
  }

  attributeChangedCallback(): void {
    if (this.#select !== undefined) {
      this.#label();
      this.#render();
    }
  }

  #text(name: Text): string {
    return this.getAttribute(`text-${name}`) ?? texts[name];
  }

  #mode(): SelectionMode {
    return {
      multiple: this.#select?.multiple === true,
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

  #quietly(change: () => void): void {
    change();
    this.#host.takeRecords();
    this.#content.takeRecords();
  }

  #sync(): void {
    const select = this.querySelector<HTMLSelectElement>(":scope > select");

    if (select === null) {
      this.#quietly(() =>
        this.querySelectorAll(
          ":scope > .ui-select-trigger, :scope > .ui-select-popover",
        ).forEach((stale) => stale.remove()),
      );

      return;
    }

    this.#quietly(() => {
      if (select !== this.#select || !this.contains(this.#trigger)) {
        this.#attach(select);
      }

      const options = [...select.options].filter(
        (option) => option.value !== "",
      );
      const enabled = options
        .filter((option) => !option.disabled)
        .map(optionOf);

      if (this.#server() === undefined) {
        this.#options = enabled;
      }

      this.#known = [
        ...options.map(optionOf),
        ...this.#known.filter(
          (option) => !options.some((native) => native.value === option.value),
        ),
      ];
      this.#selected = initialSelection(
        [...select.selectedOptions]
          .map((option) => option.value)
          .filter((value) => value !== ""),
        enabled,
        this.#mode(),
      );
      select.classList.add("ui-select-native");
      select.tabIndex = -1;
      select.setAttribute("aria-hidden", "true");
      this.#trigger.disabled = select.disabled;
      this.#trigger.setAttribute("aria-required", String(select.required));
      this.#label();
      this.#render();
    });
  }

  #attach(select: HTMLSelectElement): void {
    this.#select?.form?.removeEventListener("reset", this.#reset);
    this.#select?.removeEventListener("change", this.#outside);
    this.#select?.removeEventListener("focus", this.#focusTrigger);
    this.#select?.removeEventListener("invalid", this.#invalid);
    this.#cancel();

    if (this.#unsaved) {
      this.#unsaved = false;
      this.#submit();
    }
    this.querySelectorAll(
      ":scope > .ui-select-trigger, :scope > .ui-select-popover",
    ).forEach((stale) => stale.remove());
    this.#select = select;
    this.#build();
    this.#content.disconnect();
    this.#content.observe(select, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: [
        "selected",
        "disabled",
        "required",
        "value",
        "label",
        "multiple",
        "class",
        "tabindex",
        "aria-hidden",
        "aria-labelledby",
        "data-hint",
        ...mirrored,
      ],
    });
    select.form?.addEventListener("reset", this.#reset);
    select.addEventListener("change", this.#outside);
    select.addEventListener("focus", this.#focusTrigger);
    select.addEventListener("invalid", this.#invalid);
  }

  #build(): void {
    const select = this.#select;

    if (select === undefined) {
      return;
    }

    const id = `atlas-select-${String((count += 1))}`;
    const listId = `${id}-list`;
    const previousTestId = this.#trigger.dataset["testid"];

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

    const testId = this.dataset["testid"] ?? previousTestId;

    if (testId !== undefined) {
      this.#trigger.dataset["testid"] = testId;
      this.removeAttribute("data-testid");
    }

    this.#search = element("input", {
      type: "text",
      role: "searchbox",
      "data-testid": "select-search",
      "aria-controls": listId,
    });
    this.#list = element("ul", {
      id: listId,
      role: "listbox",
      class: "ui-listbox",
    });
    this.#note = element("p", {
      role: "status",
      class: "ui-select-note",
      "data-testid": "select-note",
    });
    this.#done = element("button", {
      type: "button",
      class: "ui-select-done",
      "data-testid": "select-done",
    });
    this.#panel = element(
      "div",
      { id, popover: "auto", class: "ui-select-popover", role: "dialog" },
      this.#search,
      this.#list,
      this.#note,
    );

    if (select.multiple) {
      this.#panel.append(this.#done);
    }

    this.append(this.#trigger, this.#panel);
    this.#popover = new Popover(this.#panel, this.#trigger, {
      changing: (open) => (open ? this.#opened() : this.#closed()),
      shown: () => this.#search.focus(),
    });
    this.#done.addEventListener("click", () => this.#popover?.hide());
    this.#trigger.addEventListener("focus", () => this.#sync());
    this.#search.addEventListener("input", () =>
      this.#typed(this.#search.value),
    );
    this.#search.addEventListener("keydown", (event) => this.#key(event));
    this.#list.addEventListener("mousedown", (event) => event.preventDefault());
    this.#list.addEventListener("mousemove", (event) => {
      const item =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>("[role=option]")
          : null;
      const position = Number(item?.dataset["position"]);

      if (item !== null && position !== this.#active) {
        this.#active = position;
        this.#highlight();
      }
    });
    this.#list.addEventListener("click", (event) => {
      const item =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>("[role=option]")
          : null;
      const value = item?.dataset["value"];

      if (value === "") {
        this.#clear();
      } else if (value !== undefined) {
        this.#choose(value);
      }
    });
  }

  #label(): void {
    const select = this.#select;

    if (select === undefined) {
      return;
    }

    const labelledBy = select.getAttribute("aria-labelledby") ?? "";
    const labelText = [...select.labels]
      .map((label) => label.textContent?.trim() ?? "")
      .filter(Boolean)
      .join(" ");

    mirrored.forEach((name) => {
      const value = select.getAttribute(name);

      if (value === null) {
        this.#trigger.removeAttribute(name);
      } else {
        this.#trigger.setAttribute(name, value);
      }
    });

    if (labelledBy !== "") {
      this.#trigger.setAttribute("aria-labelledby", labelledBy);
      this.#list.setAttribute("aria-labelledby", labelledBy);
    } else {
      const name =
        select.getAttribute("aria-label") ??
        (labelText === "" ? null : labelText);

      this.#trigger.removeAttribute("aria-labelledby");
      this.#list.removeAttribute("aria-labelledby");

      if (name === null) {
        this.#trigger.removeAttribute("aria-label");
      } else {
        this.#trigger.setAttribute("aria-label", name);
      }

      this.#list.setAttribute("aria-label", name ?? this.#text("search"));
    }

    this.#list.setAttribute("aria-multiselectable", String(select.multiple));
    this.#search.setAttribute("aria-label", this.#text("search"));
    this.#search.placeholder = this.#text("type-to-search");
    this.#panel.setAttribute("aria-label", this.#text("search"));
    this.#done.textContent = this.#text("done");
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
    const first = firstOptionIndex(showClear);
    const note = listNote(status, matches.length);
    const open = this.#popover?.open === true;
    const none = showClear
      ? [this.#option({ value: "", label: this.#text("none") }, 0)]
      : [];

    this.#summary.textContent = summarize(
      this.#known,
      this.#selected,
      this.getAttribute("placeholder") ?? this.#text("choose"),
    );
    this.#trigger.dataset["value"] = this.#selected.join(",");
    this.#trigger.dataset["empty"] = String(this.#selected.length === 0);
    this.#trigger.dataset["open"] = String(open);
    this.#trigger.setAttribute("aria-expanded", String(open));
    this.#list.replaceChildren(
      ...none,
      ...matches.map((option, index) => this.#option(option, index + first)),
    );
    this.#note.dataset["note"] = note;
    this.#note.textContent = note === ListNote.None ? "" : this.#text(note);
    this.#highlight();
  }

  #highlight(): void {
    const highlighted = this.#highlighted();
    const active = this.#list.children.item(highlighted);

    [...this.#list.children].forEach((item, position) => {
      item.setAttribute("data-active", String(position === highlighted));
    });

    if (active === null) {
      this.#search.removeAttribute("aria-activedescendant");
    } else {
      this.#search.setAttribute("aria-activedescendant", active.id);
    }
  }

  #option(option: SelectOption, position: number): HTMLLIElement {
    const clear = option.value === "";
    const item = element("li", {
      id: `${this.#list.id}-${String(position)}`,
      role: "option",
      class: "ui-option",
      "data-testid": clear ? "option-none" : `option-${option.value}`,
      "data-value": option.value,
      "data-position": String(position),
      "aria-selected": String(
        clear
          ? this.#selected.length === 0
          : this.#selected.includes(option.value),
      ),
    });

    if (clear) {
      item.dataset["none"] = "";
    }

    item.insertAdjacentHTML("beforeend", clear ? icons.x : icons.check);
    item.append(element("span", {}, option.label));

    if (option.hint !== undefined) {
      item.append(element("span", { class: "ui-option-hint" }, option.hint));
    }

    return item;
  }

  #startOver(): void {
    this.#query = "";
    this.#search.value = "";
    this.#active = firstOptionIndex(clearShown(this.#mode(), ""));
  }

  #opened(): void {
    this.#sync();
    this.#startOver();

    if (this.#server() !== undefined) {
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
      this.#highlight();
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
    this.#commit(toggleValue(this.#selected, value, this.#mode().multiple));

    if (!this.#mode().multiple) {
      this.#popover?.hide();
    }
  }

  #clear(): void {
    this.#commit([]);
    this.#popover?.hide();
  }

  #commit(values: string[]): void {
    const select = this.#select;

    if (select === undefined) {
      return;
    }

    this.#quietly(() => {
      this.#selected = values;

      if (
        values.length === 0 &&
        !select.multiple &&
        ![...select.options].some((option) => option.value === "")
      ) {
        select.add(new Option("", ""), 0);
      }

      values
        .filter(
          (value) =>
            ![...select.options].some((option) => option.value === value),
        )
        .forEach((value) => {
          const known = this.#known.find((option) => option.value === value);

          select.add(new Option(known?.label ?? value, value));
        });
      [...select.options].forEach((option) => {
        option.selected =
          values.includes(option.value) ||
          (values.length === 0 && option.value === "");
      });
    });
    if (this.#flaggedInvalid && select.checkValidity()) {
      this.#flaggedInvalid = false;
      select.removeAttribute("aria-invalid");
    }

    select.dispatchEvent(new CustomEvent("input", { bubbles: true }));
    select.dispatchEvent(new CustomEvent("change", { bubbles: true }));

    const submitting = this.hasAttribute("submit-on-change");

    if (submitting && !select.multiple) {
      this.#submit();
    }

    this.#unsaved = submitting && select.multiple;
    this.#render();
  }

  #submit(): void {
    this.#select?.form?.requestSubmit();
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
    const failed = () => {
      if (!request.signal.aborted) {
        this.#status = SearchStatus.Failed;
        this.#render();
      }
    };

    this.#request = request;
    this.#status = SearchStatus.Searching;
    this.#render();

    try {
      search(text, request.signal).then((options) => {
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
      }, failed);
    } catch {
      failed();
    }
  }
}
