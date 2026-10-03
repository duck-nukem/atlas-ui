import { waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { heightWithScrollbar } from "./atlas-gantt";
import { mount } from "./markup";

type Goal = {
  label: string;
  status: string;
  start: string;
  end: string;
  progress: number;
};

const goals: Goal[] = [
  {
    label: "G-6 Code review follow-ups",
    status: "succeeded",
    start: "2026-09-15",
    end: "2026-09-20",
    progress: 1,
  },
  {
    label: "G-11 Import",
    status: "pending_review",
    start: "2026-10-01",
    end: "2026-10-30",
    progress: 0.4,
  },
];

const gantt = (rows: readonly Goal[], lang = "en-GB") =>
  `<atlas-gantt lang="${lang}"><ul>${rows
    .map(
      (goal) =>
        `<li data-status="${goal.status}" data-start="${goal.start}" data-end="${goal.end}" data-progress="${String(goal.progress)}"><a href="#${goal.label.split(" ")[0] ?? ""}">${goal.label}</a></li>`,
    )
    .join("")}</ul></atlas-gantt>`;

beforeAll(() => {
  const policy = document.createElement("meta");

  policy.httpEquiv = "Content-Security-Policy";
  policy.content = "style-src-attr 'none'";
  document.head.append(policy);

  const probe = document.createElement("div");

  probe.innerHTML = '<span style="color: red"></span>';

  if ((probe.firstElementChild as HTMLElement).style.length !== 0) {
    throw new Error("The strict style policy is not enforced");
  }
});

const violations: string[] = [];

beforeEach(() => {
  violations.length = 0;
});

document.addEventListener("securitypolicyviolation", (event) => {
  violations.push(event.violatedDirective);
});

const chart = (container: ParentNode) =>
  container.querySelector('[data-testid="gantt-chart"]');

const frames = async (count: number) => {
  for (let frame = 0; frame < count; frame += 1) {
    await new Promise(requestAnimationFrame);
  }
};

const bars = (container: HTMLElement) =>
  container.querySelectorAll(".bar-wrapper");

const rendered = async (container: HTMLElement, count: number) =>
  waitFor(() => expect(bars(container)).toHaveLength(count));

describe("atlas-gantt", () => {
  it("draws one bar per goal", async () => {
    const container = mount(gantt(goals));

    await waitFor(() => expect(bars(container)).toHaveLength(2));
  });

  it("marks each bar with the status of its goal", async () => {
    const container = mount(gantt(goals));
    await rendered(container, 2);

    const second = bars(container)[1];

    expect(second).toHaveClass("ui-gantt-pending-review");
  });

  it("labels a bar with the goal and its percent done", async () => {
    const container = mount(gantt(goals));
    await rendered(container, 2);

    const label = bars(container)[1]?.querySelector(".bar-label");

    expect(label).toHaveTextContent("G-11 Import · 40%");
  });

  it("shows a title as text, not markup", async () => {
    const container = mount(
      gantt([{ ...goals[0]!, label: "G-1 Use <b>bold</b>" }]),
    );
    await rendered(container, 1);

    const label = bars(container)[0]?.querySelector(".bar-label");

    expect(label?.querySelector("b")).toBeNull();
  });

  it("follows the link of a goal when its bar is clicked", async () => {
    const container = mount(gantt(goals));
    await rendered(container, 2);
    const followed: string[] = [];
    container.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", (event) => {
        event.preventDefault();
        followed.push(link.getAttribute("href") ?? "");
      }),
    );

    await userEvent.click(bars(container)[1]!.querySelector(".bar")!);

    expect(followed).toEqual(["#G-11"]);
  });

  it("draws a goal the server adds later", async () => {
    const container = mount(gantt(goals.slice(0, 1)));
    await rendered(container, 1);

    container
      .querySelector("ul")
      ?.insertAdjacentHTML(
        "beforeend",
        `<li data-status="active" data-start="2026-10-01" data-end="2026-10-09" data-progress="0"><a href="#G-12">G-12 Later</a></li>`,
      );

    await waitFor(() => expect(bars(container)).toHaveLength(2));
  });

  it("removes the chart when the last goal goes", async () => {
    const container = mount(gantt(goals));
    await rendered(container, 2);

    container.querySelector("ul")?.replaceChildren();

    await waitFor(() => expect(chart(container)).toBeNull());
  });

  it("draws under a strict style policy without a violation", async () => {
    const container = mount(gantt(goals));

    await rendered(container, 2);

    expect(violations).toEqual([]);
  });

  it("follows the link of a goal the server added later", async () => {
    const container = mount(gantt(goals.slice(0, 1)));
    await rendered(container, 1);
    container
      .querySelector("ul")
      ?.insertAdjacentHTML(
        "beforeend",
        `<li data-status="active" data-start="2026-10-01" data-end="2026-10-09" data-progress="0"><a href="#G-12">G-12 Later</a></li>`,
      );
    await rendered(container, 2);
    const followed: string[] = [];
    container.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", (event) => {
        event.preventDefault();
        followed.push(link.getAttribute("href") ?? "");
      }),
    );

    await userEvent.click(bars(container)[1]!.querySelector(".bar")!);

    expect(followed).toEqual(["#G-12"]);
  });

  it("skips a goal without a start or end date", async () => {
    const container = mount(gantt([{ ...goals[0]!, start: "" }, goals[1]!]));

    await rendered(container, 1);

    expect(bars(container)).toHaveLength(1);
  });

  it("draws nothing when no goal has dates", () => {
    const container = mount(gantt([{ ...goals[0]!, end: "" }]));

    const drawn = chart(container);

    expect(drawn).toBeNull();
  });

  it("counts a progress that is not a number as nothing done", async () => {
    const container = mount(gantt([{ ...goals[1]!, progress: Number.NaN }]));
    await rendered(container, 1);

    const label = bars(container)[0]?.querySelector(".bar-label");

    expect(label).toHaveTextContent("G-11 Import · 0%");
  });

  it("still draws with a language tag that is not valid", async () => {
    const container = mount(gantt(goals, "not a language!"));

    await rendered(container, 2);

    expect(bars(container)).toHaveLength(2);
  });

  it("drops a pending drawing when it leaves the page", async () => {
    const container = mount(gantt(goals));
    const removed = container.querySelector("atlas-gantt")!;
    removed.remove();
    const later = mount(gantt(goals));

    await rendered(later, 2);

    expect(chart(removed)).toBeNull();
  });

  it("does not redraw itself after drawing", async () => {
    const container = mount(gantt(goals));
    await rendered(container, 2);
    const first = bars(container)[0];

    await frames(3);

    expect(bars(container)[0]).toBe(first);
  });
});

describe("heightWithScrollbar", () => {
  it("adds the height of a horizontal scrollbar", () => {
    const container = { offsetHeight: 315, clientHeight: 300 };

    const height = heightWithScrollbar(300, container);

    expect(height).toBe(315);
  });
});
