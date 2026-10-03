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

export const segments = ({
  task,
  current,
}: {
  task: string;
  current: Status;
}) => {
  const label = statuses.find(([value]) => value === current)?.[1] ?? "";

  return `<form class="ui-status-segments" method="post" action="#status">
  <span class="ui-status-label" aria-live="polite" data-testid="shown-status" data-status="${current}"><span>${label}</span>${statuses.map(([value, name]) => `<span data-testid="status-preview-${value}">${name}</span>`).join("")}</span>
  <span class="ui-segments" role="group" aria-label="Status of ${task}">
    ${statuses
      .map(
        ([value, name]) =>
          `<button type="submit" data-testid="set-status-${value}" name="status" value="${value}" aria-label="Set ${task} to ${name}" aria-pressed="${String(value === current)}"></button>`,
      )
      .join("\n    ")}
  </span>
</form>`;
};
