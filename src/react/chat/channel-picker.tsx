import { type ReactElement, useId, useRef, useState } from "react";
import {
  ChevronsUpDownIcon,
  HashIcon,
  MessageCircleIcon,
  PlusIcon,
} from "../icons";
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
  unread: string;
};

export const channelPickerTexts: ChannelPickerTexts = {
  channels: "Channels",
  direct: "Direct messages",
  search: "Find a channel or person",
  none: "Nothing matches",
  new: "New channel",
  attention: "Messages for you",
  unread: "Unread",
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
    <div>
      <button
        type="button"
        className="ui-channel-trigger"
        popoverTarget={popoverId}
        data-testid="channel-picker"
        data-attention={attention}
        aria-expanded={popover.open}
        aria-haspopup="dialog"
      >
        <span>{label}</span>
        <ChevronsUpDownIcon className="" />
        {attention ? (
          <span className="ui-dot" role="img" aria-label={texts.attention} />
        ) : null}
      </button>
      <div
        ref={popover.ref}
        id={popoverId}
        popover="auto"
        className="ui-channel-popover"
        role="dialog"
        aria-label={texts.search}
      >
        <input
          ref={searchBox}
          className="ui-input"
          value={query}
          placeholder={texts.search}
          aria-label={texts.search}
          data-testid="channel-search"
          onChange={(event) => setQuery(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.nativeEvent.isComposing) {
              event.preventDefault();
              list.current?.querySelector("a")?.click();
            }
          }}
        />
        <div ref={list} className="ui-channel-list">
          <ul>
            {sections.map((section) => (
              <li key={section.key}>
                <span>{section.title}</span>
                <ul>
                  {section.items.map((entry) => (
                    <li key={entry.id}>
                      <a
                        className="ui-channel-link"
                        href={entry.href}
                        data-testid={`pick-${entry.id}`}
                        data-unread={entry.unread}
                        aria-current={
                          entry.id === activeId ? "page" : undefined
                        }
                        onClick={popover.hide}
                      >
                        {entry.direct ? (
                          <MessageCircleIcon className="" />
                        ) : (
                          <HashIcon className="" />
                        )}
                        <span>{entry.label}</span>
                        {entry.unread ? (
                          <span className="ui-sr-only">, {texts.unread}</span>
                        ) : null}
                        {entry.mentioned && entry.id !== activeId ? (
                          <span
                            className="ui-dot"
                            role="img"
                            aria-label={texts.attention}
                            data-testid={`attention-${entry.id}`}
                          />
                        ) : null}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          {sections.length === 0 ? (
            <p data-testid="no-channel-match">{texts.none}</p>
          ) : null}
        </div>
        <a className="ui-channel-new" href={newHref} onClick={popover.hide}>
          <PlusIcon className="" />
          {texts.new}
        </a>
      </div>
    </div>
  );
}
