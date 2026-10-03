import { type ReactElement, useLayoutEffect, useRef, useState } from "react";
import { SearchStatus, type SelectOption } from "./model";
import {
  SearchableSelect,
  type SearchableSelectProps,
} from "./searchable-select";

export type SearchOptions = (
  text: string,
  signal: AbortSignal,
) => Promise<readonly SelectOption[]>;

export const SEARCH_PAUSE_MS = 300;

export type ServerSearchSelectProps = Omit<
  SearchableSelectProps,
  "options" | "defaultValue" | "search"
> & {
  chosen: readonly SelectOption[];
  searchOptions: SearchOptions;
};

export function ServerSearchSelect({
  chosen,
  searchOptions,
  ...props
}: ServerSearchSelectProps): ReactElement {
  const [found, setFound] = useState<readonly SelectOption[]>([]);
  const [known, setKnown] = useState<readonly SelectOption[]>(chosen);
  const [status, setStatus] = useState(SearchStatus.Ready);
  const pending = useRef<{
    timer?: ReturnType<typeof setTimeout>;
    request?: AbortController;
  }>({});

  function cancel(): void {
    clearTimeout(pending.current.timer);
    pending.current.request?.abort();
  }

  useLayoutEffect(() => cancel, []);

  function run(text: string): void {
    const request = new AbortController();

    pending.current.request = request;
    setStatus(SearchStatus.Searching);
    searchOptions(text, request.signal).then(
      (options) => {
        if (request.signal.aborted) {
          return;
        }

        setFound(options);
        setKnown((current) => [
          ...current,
          ...options.filter(
            (option) => !current.some((seen) => seen.value === option.value),
          ),
        ]);
        setStatus(SearchStatus.Ready);
      },
      () => {
        if (!request.signal.aborted) {
          setStatus(SearchStatus.Failed);
        }
      },
    );
  }

  function onQuery(text: string): void {
    cancel();
    setFound([]);

    if (text.trim() === "") {
      run("");

      return;
    }

    setStatus(SearchStatus.Searching);
    pending.current.timer = setTimeout(() => run(text), SEARCH_PAUSE_MS);
  }

  return (
    <SearchableSelect
      {...props}
      options={found}
      defaultValue={chosen.map((option) => option.value)}
      search={{ onQuery, onClose: cancel, status, labels: known }}
    />
  );
}
