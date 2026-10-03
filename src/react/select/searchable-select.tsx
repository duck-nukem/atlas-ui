import {
  type KeyboardEvent,
  type ReactElement,
  type RefObject,
  useId,
  useRef,
  useState,
} from "react";
import { usePopover } from "../popover";
import {
  clearShown,
  errorReference,
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
  summarize,
  toArray,
  toggleValue,
} from "./model";
import { type SelectTexts, selectTexts } from "./texts";

export type ServerSearch = {
  readonly onQuery: (query: string) => void;
  readonly onClose: () => void;
  readonly status: SearchStatus;
  readonly labels: readonly SelectOption[];
};

export type SearchableSelectProps = {
  name: string;
  options: readonly SelectOption[];
  defaultValue?: string | readonly string[];
  multiple?: boolean;
  placeholder?: string;
  clearable?: boolean;
  submitOnChange?: boolean;
  onChange?: (values: string[]) => void;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "data-testid"?: string;
  id?: string;
  disabled?: boolean;
  invalid?: boolean;
  search?: ServerSearch;
  texts?: Partial<SelectTexts>;
};

function shown(
  options: readonly SelectOption[],
  query: string,
  search: ServerSearch | undefined,
) {
  return search === undefined
    ? {
        matches: filterOptions(options, query),
        labels: options,
        status: SearchStatus.Ready,
      }
    : { matches: options, labels: search.labels, status: search.status };
}

function ChosenValues({
  name,
  selected,
  anchor,
}: {
  name: string;
  selected: readonly string[];
  anchor: RefObject<HTMLInputElement | null>;
}): ReactElement {
  const named = name === "" ? {} : { name };

  return (
    <>
      {selected.length === 0 ? (
        <input ref={anchor} type="hidden" {...named} value="" />
      ) : null}
      {selected.map((value, index) => (
        <input
          key={value}
          ref={index === 0 ? anchor : undefined}
          type="hidden"
          {...named}
          value={value}
        />
      ))}
    </>
  );
}

export function SearchableSelect({
  name,
  options,
  defaultValue,
  multiple = false,
  placeholder,
  clearable = false,
  submitOnChange = false,
  onChange,
  id,
  disabled = false,
  invalid,
  search,
  texts: overrides,
  ...rest
}: SearchableSelectProps): ReactElement {
  const texts = { ...selectTexts, ...overrides };
  const listId = useId();
  const popoverId = useId();
  const mode = { multiple, clearable };
  const [selected, setSelected] = useState<string[]>(() =>
    initialSelection(toArray(defaultValue), options, mode),
  );
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(() =>
    firstOptionIndex(clearShown(mode, "")),
  );
  const anchor = useRef<HTMLInputElement | null>(null);
  const searchBox = useRef<HTMLInputElement | null>(null);
  const unsaved = useRef(false);
  const popover = usePopover(
    (open) => (open ? opened() : closed()),
    () => searchBox.current?.focus(),
  );
  const { matches, labels, status } = shown(options, query, search);
  const showClear = clearShown(mode, query);
  const entries = listEntries(matches, showClear);
  const note = listNote(status, matches.length);
  const highlighted =
    active < entries.length ? active : firstOptionIndex(showClear);

  function submit(): void {
    requestAnimationFrame(() => anchor.current?.form?.requestSubmit());
  }

  function startOver(): void {
    setQuery("");
    setActive(firstOptionIndex(clearShown(mode, "")));
  }

  function opened(): void {
    startOver();
    search?.onQuery("");
  }

  function closed(): void {
    search?.onClose();

    if (unsaved.current) {
      unsaved.current = false;
      submit();
    }
  }

  function commit(values: string[]): void {
    setSelected(values);
    onChange?.(values);

    if (submitOnChange && !multiple) {
      submit();
    }

    unsaved.current = submitOnChange && multiple;
  }

  function choose(value: string): void {
    commit(toggleValue(selected, value, multiple));

    if (!multiple) {
      popover.hide();
    }
  }

  function clear(): void {
    commit([]);
    popover.hide();
  }

  function pick(entry: ListEntry | undefined): void {
    if (entry?.kind === "clear") {
      clear();
    } else if (entry !== undefined) {
      choose(entry.value);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setActive(
        moveActive(
          highlighted,
          event.key === "ArrowDown" ? 1 : -1,
          entries.length,
        ),
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      pick(entries[highlighted]);
    }
  }

  return (
    <div className="ui-select">
      <ChosenValues name={name} selected={selected} anchor={anchor} />
      <button
        type="button"
        id={id}
        role="combobox"
        className="ui-input ui-select-trigger"
        popoverTarget={popoverId}
        data-testid={rest["data-testid"]}
        data-value={selected.join(",")}
        data-open={popover.open}
        data-empty={selected.length === 0}
        aria-expanded={popover.open}
        aria-controls={listId}
        aria-label={rest["aria-label"]}
        aria-labelledby={rest["aria-labelledby"]}
        aria-haspopup="listbox"
        aria-invalid={invalid}
        aria-describedby={errorReference(id, invalid)}
        disabled={disabled}
      >
        <span>{summarize(labels, selected, placeholder ?? texts.choose)}</span>
      </button>
      <div
        ref={popover.ref}
        id={popoverId}
        popover="auto"
        className="ui-popover ui-select-popover"
        role="dialog"
        aria-label={texts.search}
      >
        <>
          <input
            ref={searchBox}
            type="text"
            role="searchbox"
            className="ui-input"
            data-testid="select-search"
            aria-label={texts.search}
            aria-controls={listId}
            {...(entries[highlighted] === undefined
              ? {}
              : {
                  "aria-activedescendant": `${listId}-${String(highlighted)}`,
                })}
            value={query}
            placeholder={texts.typeToSearch}
            onChange={(event) => {
              const text = event.currentTarget.value;

              setQuery(text);
              search?.onQuery(text);
              setActive(firstOptionIndex(clearShown(mode, text)));
            }}
            onKeyDown={onKeyDown}
          />
          <ul
            id={listId}
            role="listbox"
            aria-multiselectable={multiple}
            className="ui-listbox"
            onMouseDown={(event) => event.preventDefault()}
          >
            {showClear ? (
              <li
                id={`${listId}-0`}
                role="option"
                className="ui-option"
                data-testid="option-none"
                data-active={highlighted === 0}
                aria-selected={selected.length === 0}
                onMouseMove={() => setActive(0)}
                onClick={clear}
              >
                {texts.none}
              </li>
            ) : null}
            {matches.map((option, index) => {
              const position = index + firstOptionIndex(showClear);

              return (
                <li
                  key={option.value}
                  id={`${listId}-${String(position)}`}
                  role="option"
                  className="ui-option"
                  data-testid={`option-${option.value}`}
                  data-active={position === highlighted}
                  aria-selected={selected.includes(option.value)}
                  onMouseMove={() => setActive(position)}
                  onClick={() => choose(option.value)}
                >
                  <span>{option.label}</span>
                  {option.hint === undefined ? null : (
                    <span className="ui-option-hint">{option.hint}</span>
                  )}
                </li>
              );
            })}
          </ul>
          <p
            role="status"
            className="ui-select-note"
            data-testid="select-note"
            data-note={note}
          >
            {note === ListNote.None ? "" : texts[note]}
          </p>
          {multiple ? (
            <button
              type="button"
              className="ui-button ui-select-done"
              data-variant="outline"
              data-testid="select-done"
              onClick={popover.hide}
            >
              {texts.done}
            </button>
          ) : null}
        </>
      </div>
    </div>
  );
}
