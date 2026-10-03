declare module "frappe-gantt" {
  export type GanttTask = {
    id: string;
    name: string;
    start: string;
    end: string;
    progress: number;
    custom_class?: string;
  };

  export type ViewMode = {
    name: string;
    padding: string;
    step: string;
    column_width: number;
    date_format: string;
    lower_text: (
      date: Date,
      previous: Date | undefined,
      language: string,
    ) => string;
    upper_text: (
      date: Date,
      previous: Date | undefined,
      language: string,
    ) => string;
    upper_text_frequency?: number;
    thick_line?: (date: Date) => boolean;
  };

  export type GanttOptions = {
    readonly?: boolean;
    view_modes?: ViewMode[];
    language?: string;
    today_button?: boolean;
    popup?: false;
    bar_height?: number;
    padding?: number;
    holidays?: Record<string, string>;
    infinite_padding?: boolean;
    scroll_to?: "today" | "start" | "end";
    on_click?: (task: GanttTask) => void;
  };

  export default class Gantt {
    constructor(
      wrapper: HTMLElement,
      tasks: GanttTask[],
      options?: GanttOptions,
    );
    config: { ignored_positions: number[]; view_mode: ViewMode };
    refresh(tasks: GanttTask[]): void;
    make_grid_highlights(): void;
    highlight_holidays(): void;
    highlight_current(mode: ViewMode): unknown;
  }
}
