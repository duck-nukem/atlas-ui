export const statuses = [
  ["paused", "Paused"],
  ["specifying", "Specifying"],
  ["ready", "Ready"],
  ["implementing", "Implementing"],
  ["in_review", "In review"],
  ["testing", "Testing"],
  ["awaiting_deployment", "Awaiting deployment"],
  ["done", "Done"],
] as const;

export type Status = (typeof statuses)[number][0];
