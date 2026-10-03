export type SelectOption = { value: string; label: string; hint?: string };

export enum SearchStatus {
  Ready = "ready",
  Searching = "searching",
  Failed = "failed",
}

export enum ListNote {
  None = "none",
  Searching = "searching",
  Failed = "searchFailed",
  NoMatches = "noMatches",
}

export function listNote(status: SearchStatus, matchCount: number): ListNote {
  if (status === SearchStatus.Searching) {
    return ListNote.Searching;
  }

  if (status === SearchStatus.Failed) {
    return ListNote.Failed;
  }

  return matchCount === 0 ? ListNote.NoMatches : ListNote.None;
}

export function filterOptions(
  options: readonly SelectOption[],
  query: string,
): readonly SelectOption[] {
  const needle = query.trim().toLowerCase();

  if (needle === "") {
    return options;
  }

  return options.filter((option) =>
    `${option.label} ${option.hint ?? ""}`.toLowerCase().includes(needle),
  );
}

export type SelectionMode = { multiple: boolean; clearable: boolean };

export function initialSelection(
  chosen: readonly string[],
  options: readonly SelectOption[],
  mode: SelectionMode,
): string[] {
  if (
    chosen.length > 0 ||
    mode.multiple ||
    mode.clearable ||
    options.length !== 1
  ) {
    return [...chosen];
  }

  return options.map((option) => option.value);
}

export function toggleValue(
  selected: readonly string[],
  value: string,
  multiple: boolean,
): string[] {
  if (!multiple) {
    return [value];
  }

  return selected.includes(value)
    ? selected.filter((candidate) => candidate !== value)
    : [...selected, value];
}

export function moveActive(
  active: number,
  delta: number,
  count: number,
): number {
  if (count === 0) {
    return 0;
  }

  return (active + delta + count) % count;
}

export function summarize(
  options: readonly SelectOption[],
  selected: readonly string[],
  placeholder: string,
): string {
  const labels = selected
    .map((value) => options.find((option) => option.value === value)?.label)
    .filter((label): label is string => label !== undefined);

  return labels.length === 0 ? placeholder : labels.join(", ");
}

export type ListEntry = { kind: "clear" } | { kind: "option"; value: string };

export function listEntries(
  matches: readonly SelectOption[],
  showClear: boolean,
): ListEntry[] {
  return [
    ...(showClear ? [{ kind: "clear" as const }] : []),
    ...matches.map((option) => ({
      kind: "option" as const,
      value: option.value,
    })),
  ];
}

export function firstOptionIndex(showClear: boolean): number {
  return showClear ? 1 : 0;
}

export function clearShown(mode: SelectionMode, query: string): boolean {
  return mode.clearable && !mode.multiple && query === "";
}

export function toArray(
  value: string | readonly string[] | undefined,
): string[] {
  if (value === undefined || value === "") {
    return [];
  }

  return typeof value === "string" ? [value] : [...value];
}

export function errorReference(
  id: string | undefined,
  invalid: boolean | undefined,
): string | undefined {
  return invalid === true && id !== undefined ? `${id}-error` : undefined;
}
