import { type ReactElement, useId, useRef, useState } from "react";
import { usePopover } from "../popover";
import {
  attentionElsewhere,
  type ChannelEntry,
  matchingEntries,
} from "./entries";

export type ChannelPickerTexts = {
  channels: string;
  direct: string;
  search: string;
  none: string;
  new: string;
  attention: string;
};

export const channelPickerTexts: ChannelPickerTexts = {
  channels: "Channels",
  direct: "Direct messages",
  search: "Find a channel or person",
  none: "Nothing matches",
  new: "New channel",
  attention: "Messages for you",
};

export type ChannelPickerProps = {
  entries: readonly ChannelEntry[];
  activeId: string | undefined;
  label: string;
  newHref: string;
  texts?: Partial<ChannelPickerTexts>;
};

export function ChannelPicker({
  entries,
  activeId,
  label,
  newHref,
  texts: overrides,
}: ChannelPickerProps): ReactElement {
  const texts = { ...channelPickerTexts, ...overrides };
  const popoverId = useId();
  const [query, setQuery] = useState("");
  const searchBox = useRef<HTMLInputElement | null>(null);
  const list = useRef<HTMLDivElement | null>(null);
  const popover = usePopover(
    (open) => {
      if (open) {
        setQuery("");
      }
    },
    () => searchBox.current?.focus(),
  );
  const matches = matchingEntries(entries, query);
  const sections = [
    {
      key: "channels",
      title: texts.channels,
      items: matches.filter((entry) => !entry.direct),
    },
    {
      key: "direct",
      title: texts.direct,
      items: matches.filter((entry) => entry.direct),
    },
  ].filter((section) => section.items.length > 0);
  const attention = attentionElsewhere(entries, activeId);

  return (
    <div className="ui-channel-picker">
      <button
        type="button"
        className="ui-channel-picker-trigger"
        popoverTarget={popoverId}
        data-testid="channel-picker"
        data-attention={attention}
        aria-expanded={popover.open}
      >
        <span>{label}</span>
        {attention ? (
          <span
            className="ui-nav-dot"
            role="img"
            aria-label={texts.attention}
          />
        ) : null}
      </button>
      <div
        ref={popover.ref}
        id={popoverId}
        popover="auto"
        className="ui-popover ui-channel-picker-popover"
      >
        <>
          <input
            ref={searchBox}
            type="search"
            className="ui-input"
            value={query}
            placeholder={texts.search}
            aria-label={texts.search}
            data-testid="channel-search"
            onChange={(event) => setQuery(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                list.current?.querySelector("a")?.click();
              }
            }}
          />
          <div ref={list} className="ui-channel-picker-list">
            {sections.map((section) => (
              <section
                key={section.key}
                aria-labelledby={`${popoverId}-${section.key}`}
              >
                <h2
                  id={`${popoverId}-${section.key}`}
                  className="ui-nav-heading"
                >
                  {section.title}
                </h2>
                <ul role="list">
                  {section.items.map((entry) => (
                    <li key={entry.id}>
                      <a
                        className="ui-nav-link"
                        href={entry.href}
                        data-testid={`pick-${entry.id}`}
                        data-unread={entry.unread}
                        data-direct={entry.direct}
                        aria-current={
                          entry.id === activeId ? "page" : undefined
                        }
                        onClick={popover.hide}
                      >
                        <span>{entry.label}</span>
                        {entry.mentioned && entry.id !== activeId ? (
                          <span
                            className="ui-nav-dot"
                            role="img"
                            aria-label={texts.attention}
                            data-testid={`attention-${entry.id}`}
                          />
                        ) : null}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            {sections.length === 0 ? (
              <p className="ui-select-note" data-testid="no-channel-match">
                {texts.none}
              </p>
            ) : null}
          </div>
          <a
            className="ui-button"
            data-variant="ghost"
            data-size="sm"
            href={newHref}
            onClick={popover.hide}
          >
            {texts.new}
          </a>
        </>
      </div>
    </div>
  );
}
