import type Gantt from "frappe-gantt";
import type { GanttTask, ViewMode } from "frappe-gantt";

export enum GanttStatus {
  Draft = "draft",
  Active = "active",
  PendingReview = "pending_review",
  Succeeded = "succeeded",
  Cancelled = "cancelled",
  Failed = "failed",
}

const statuses: readonly string[] = Object.values(GanttStatus);

let library: Promise<typeof Gantt> | undefined;

const loadGantt = () =>
  (library ??= import("frappe-gantt").then(
    ({ default: Frappe }) =>
      class extends Frappe {
        override make_grid_highlights(): void {
          this.highlight_holidays();
          this.config.ignored_positions = [];
          this.highlight_current(this.config.view_mode);
        }
      },
  ));

const escaped = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export const weeksFor = (month: (date: Date) => string): ViewMode => ({
  name: "Weeks",
  padding: "1m",
  step: "7d",
  column_width: 48,
  date_format: "YYYY-MM-DD",
  lower_text: (date) => String(date.getDate()),
  upper_text: (date, previous) =>
    previous?.getMonth() === date.getMonth() ? "" : month(date),
  upper_text_frequency: 4,
  thick_line: (date) => date.getDate() <= 7,
});

export const heightWithScrollbar = (
  chartHeight: number,
  container: Pick<HTMLElement, "offsetHeight" | "clientHeight">,
): number => chartHeight + container.offsetHeight - container.clientHeight;

const dated = (value: string | undefined): value is string =>
  value !== undefined && value !== "" && !Number.isNaN(Date.parse(value));

const locale = (value: string | null | undefined): string | undefined => {
  try {
    return value === null || value === undefined || value === ""
      ? undefined
      : Intl.getCanonicalLocales(value)[0];
  } catch {
    return undefined;
  }
};

export class AtlasGantt extends HTMLElement {
  #chart = document.createElement("div");
  #internals = this.attachInternals();
  #observer = new MutationObserver((records) => {
    if (records.some((record) => !this.#chart.contains(record.target))) {
      this.#render();
    }
  });
  #gantt: Gantt | undefined;
  #renders = 0;
  #stopResizing = (): void => undefined;

  connectedCallback(): void {
    this.#chart.className = "ui-gantt-chart";
    this.#chart.dataset["testid"] = "gantt-chart";
    this.#chart.setAttribute("aria-hidden", "true");
    this.#observer.observe(this, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: [
        "href",
        "data-status",
        "data-start",
        "data-end",
        "data-progress",
      ],
    });
    this.#render();
  }

  disconnectedCallback(): void {
    this.#observer.disconnect();
    this.#renders += 1;
    this.#stopResizing();
    this.#stopResizing = () => undefined;
  }

  #items(): HTMLLIElement[] {
    return [
      ...this.querySelectorAll<HTMLLIElement>(
        ":scope > ul > li:has(> a[href])",
      ),
    ].filter(
      (item) => dated(item.dataset["start"]) && dated(item.dataset["end"]),
    );
  }

  #language(): string | undefined {
    return locale(this.closest("[lang]")?.getAttribute("lang"));
  }

  #tasks(items: readonly HTMLLIElement[]): GanttTask[] {
    const percent = new Intl.NumberFormat(this.#language(), {
      style: "percent",
    });

    return items.map((item, index) => {
      const given = Number(item.dataset["progress"] ?? "0");
      const progress = Number.isFinite(given) ? given : 0;
      const status = item.dataset["status"] ?? "";
      const label = item.querySelector(":scope > a")?.textContent ?? "";

      return {
        id: String(index),
        name: escaped(`${label.trim()} · ${percent.format(progress)}`),
        start: item.dataset["start"] ?? "",
        end: item.dataset["end"] ?? "",
        progress: Math.round(progress * 100),
        ...(statuses.includes(status)
          ? { custom_class: `ui-gantt-${status.replaceAll("_", "-")}` }
          : {}),
      };
    });
  }

  #follow(task: GanttTask): void {
    this.#items()
      [Number(task.id)]?.querySelector<HTMLAnchorElement>(":scope > a")
      ?.click();
  }

  #clear(): void {
    this.#stopResizing();
    this.#stopResizing = () => undefined;
    this.#chart.replaceChildren();
    this.#chart.remove();
    this.#gantt = undefined;
    this.#internals.states.delete("ready");
  }

  #render(): void {
    const items = this.#items();
    const render = (this.#renders += 1);

    this.#observer.takeRecords();

    if (items.length === 0) {
      this.#clear();
      this.#observer.takeRecords();

      return;
    }

    const tasks = this.#tasks(items);
    const language = this.#language();
    const month = new Intl.DateTimeFormat(language, {
      month: "short",
      year: "numeric",
    });
    const self = new WeakRef(this);

    void loadGantt().then((Chart) => {
      if (render !== this.#renders || !this.isConnected) {
        return;
      }

      this.#stopResizing();
      this.prepend(this.#chart);

      if (this.#gantt === undefined) {
        this.#gantt = new Chart(this.#chart, tasks, {
          readonly: true,
          view_modes: [weeksFor((date) => month.format(date))],
          ...(language === undefined ? {} : { language }),
          today_button: false,
          holidays: {},
          infinite_padding: false,
          scroll_to: "start",
          bar_height: 22,
          padding: 14,
          popup: false,
          on_click: (task) => {
            const element = self.deref();

            if (element !== undefined) {
              element.#follow(task);
            }
          },
        });
      } else {
        this.#gantt.refresh(tasks);
      }

      this.#stopResizing = this.#makeRoomForScrollbar();
      this.#internals.states.add("ready");
      this.#observer.takeRecords();
    });
  }
  #makeRoomForScrollbar(): () => void {
    const container =
      this.#chart.querySelector<HTMLElement>(".gantt-container");

    if (container === null) {
      return () => undefined;
    }

    const chartHeight = container.scrollHeight;
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        container.style.height = `${String(heightWithScrollbar(chartHeight, container))}px`;
      });
    });

    observer.observe(container);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }
}
