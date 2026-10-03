export type ChannelEntry = {
  id: string;
  href: string;
  label: string;
  direct: boolean;
  unread: boolean;
  mentioned: boolean;
};

export function attentionElsewhere(
  entries: readonly ChannelEntry[],
  activeId: string | undefined,
): boolean {
  return entries.some((entry) => entry.id !== activeId && entry.mentioned);
}

export function matchingEntries(
  entries: readonly ChannelEntry[],
  query: string,
): ChannelEntry[] {
  const needle = query.trim().toLowerCase();

  return entries.filter((entry) => entry.label.toLowerCase().includes(needle));
}
