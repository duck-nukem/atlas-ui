import type { Meta } from "@storybook/html-vite";
import { expect } from "storybook/test";
import { html, icon, type Story } from "../html";
import { peopleStack } from "../primitives/people";
import { segments, type Status } from "./statuses";

type Args = {
  goal: string;
  shown: boolean;
  feature: string;
  done: number;
  started: number;
  waiting: number;
  slow: boolean;
  direct: boolean;
  empty: boolean;
};

type Task = [
  key: string,
  title: string,
  status: Status,
  people: string[],
  age: string,
];

const tasks: Task[] = [
  [
    "T-331",
    "Show join and leave lines small",
    "implementing",
    ["Ada Lovelace"],
    "4d",
  ],
  ["T-332", "Keep the channel picker open while typing", "ready", [], ""],
  [
    "T-333",
    "Group messages by day",
    "in_review",
    ["Grace Hopper", "Alan Turing"],
    "",
  ],
];

const age = (
  testId: string,
  id: string,
  duration: string,
  explanation: string,
  label: string,
) =>
  `<button class="ui-age" type="button" data-testid="${testId}" data-duration="${duration}" popovertarget="${id}" interestfor="${id}" aria-label="${explanation}">${icon("clock-alert", "3.5")}${label}</button>
    <div class="ui-popover" data-size="hint" id="${id}" popover><p data-testid="${testId}-explanation">${explanation}</p></div>`;

const row = ([
  key,
  title,
  status,
  people,
  taskAge,
]: Task) => `<li data-testid="task-row-${key}">
          <a class="ui-keyed-title" href="#${key}" title="${title}"><span class="ui-key">${key}</span> <span>${title}</span></a>
          ${taskAge === "" ? "" : age("task-age", `age-${key}`, taskAge, `Hasn't moved in ${taskAge}`, taskAge)}
          ${people.length === 0 ? "" : peopleStack(people, 3)}
          <div class="ui-task-row-status">${segments({ task: key, current: status })}</div>
        </li>`;

const progress = (done: number, started: number, waiting: number) => {
  const label = `${String(done)} done, ${String(started)} started, ${String(waiting)} not started`;
  const parts = (count: number, state: string) =>
    `<span data-state="${state}"></span>`.repeat(count);

  return `<span class="ui-feature-progress">
            <span class="ui-feature-segments" role="img" aria-label="${label}" title="${label}" data-testid="feature-segments" data-done="${String(done)}" data-started="${String(started)}" data-waiting="${String(waiting)}">${parts(done, "done")}${parts(started, "started")}${parts(waiting, "waiting")}</span>
            <span data-testid="feature-tally" data-done="${String(done)}" data-total="${String(done + started + waiting)}">${String(done)}/${String(done + started + waiting)} done</span>
          </span>`;
};

const toggle = (name: string) =>
  `<label class="ui-section-toggle"><input type="checkbox" role="switch" aria-label="Show ${name}" checked>${icon("chevron-right")}</label>`;

const groups = ({
  goal,
  shown,
  feature,
  done,
  started,
  waiting,
  slow,
  direct,
  empty,
}: Args) =>
  empty
    ? `<p class="ui-empty">Nothing is ready to start. <a class="ui-link" href="#features" data-testid="make-ready">Make the next feature ready</a></p>`
    : `<div class="ui-goal-groups">
  <section class="ui-goal" aria-labelledby="goal-title-G-3" data-testid="goal-G-3">
    <label class="ui-goal-toggle">
      <input type="checkbox" role="switch" aria-label="Show ${goal}" data-testid="goal-toggle-G-3"${shown ? " checked" : ""}>
      ${icon("eye")}${icon("eye-off")}
    </label>
    <a class="ui-goal-title" id="goal-title-G-3" href="#G-3" title="${goal}">${goal}</a>
    <span class="ui-goal-count" data-testid="goal-count-G-3" data-count="${String(tasks.length + (direct ? 1 : 0))}">${String(tasks.length + (direct ? 1 : 0))} tasks</span>
    <div class="ui-goal-body">
      <div class="ui-task-section" data-testid="section-F-2">
        <div class="ui-section-header" data-testid="section-header-F-2">
          ${toggle(feature)}
          <a href="#F-2">${feature}</a>
          ${progress(done, started, waiting)}
          ${slow ? age("feature-age", "age-F-2", "6d", "Some tasks are taking longer than usual", "") : ""}
          <span class="ui-section-people">${peopleStack(["Ada Lovelace", "Grace Hopper", "Alan Turing"], 3)}</span>
        </div>
        <ul class="ui-task-rows">
        ${tasks.map(row).join("\n        ")}
        </ul>
      </div>${
        direct
          ? `
      <div class="ui-task-section" data-testid="section-direct">
        <div class="ui-section-header" data-testid="section-header-direct">
          ${toggle("Tasks")}
          <span>Tasks</span>
        </div>
        <ul class="ui-task-rows">
        ${row(["T-340", "Write the release notes", "specifying", [], ""])}
        </ul>
      </div>`
          : ""
      }
    </div>
  </section>
  <section class="ui-goal" aria-labelledby="goal-title-no-goal" data-testid="goal-no-goal">
    <label class="ui-goal-toggle">
      <input type="checkbox" role="switch" aria-label="Show No goal" data-testid="goal-toggle-no-goal" checked>
      ${icon("eye")}${icon("eye-off")}
    </label>
    <span class="ui-goal-title" id="goal-title-no-goal" title="No goal">No goal</span>
    <span class="ui-goal-count" data-testid="goal-count-no-goal" data-count="1">1 task</span>
    <div class="ui-goal-body">
      <div class="ui-task-section" data-testid="section-direct">
        <ul class="ui-task-rows">
        ${row(["T-341", "Rename queued to ready", "testing", ["Katherine Johnson"], ""])}
        </ul>
      </div>
    </div>
  </section>
</div>`;

export default {
  title: "Data/Task groups",
  ...html(groups, {
    docs: {
      description: {
        component:
          "Ready work grouped by goal, then by feature. The eye switch hides a goal without JavaScript: a hidden goal has its switch unchecked. The app keeps the hidden goals by listening for change on the switch.",
      },
    },
  }),
  args: {
    goal: "G-3 Ship the chat rework",
    shown: true,
    feature: "F-2 Chat",
    done: 2,
    started: 1,
    waiting: 1,
    slow: true,
    direct: true,
    empty: false,
  },
  argTypes: {
    done: { control: { type: "range", min: 0, max: 20 } },
    started: { control: { type: "range", min: 0, max: 20 } },
    waiting: { control: { type: "range", min: 0, max: 20 } },
  },
} satisfies Meta<Args>;

export const Groups: Story<Args> = {};

export const HiddenGoal: Story<Args> = { args: { shown: false } };

export const OnlyFeatureTasks: Story<Args> = {
  args: { direct: false, slow: false },
};

export const Empty: Story<Args> = { args: { empty: true } };

export const Hiding: Story<Args> = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByTestId("goal-toggle-G-3"));

    await expect(canvas.getByTestId("goal-count-G-3")).toBeVisible();
  },
};
