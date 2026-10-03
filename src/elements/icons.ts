const svg = (body: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

export const icons = {
  check: svg('<path d="M20 6 9 17l-5-5" />'),
  x: svg('<path d="M18 6 6 18" /><path d="m6 6 12 12" />'),
  chevronsUpDown: svg('<path d="m7 15 5 5 5-5" /><path d="m7 9 5-5 5 5" />'),
  hash: svg(
    '<line x1="4" x2="20" y1="9" y2="9" /><line x1="4" x2="20" y1="15" y2="15" /><line x1="10" x2="8" y1="3" y2="21" /><line x1="16" x2="14" y1="3" y2="21" />',
  ),
  messageCircle: svg(
    '<path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />',
  ),
  plus: svg('<path d="M5 12h14" /><path d="M12 5v14" />'),
};
