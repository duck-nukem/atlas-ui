export type PopoverEvents = {
  changing: (open: boolean) => void;
  shown: () => void;
};

export class Popover {
  open = false;

  constructor(
    private readonly panel: HTMLElement,
    private readonly trigger: HTMLElement,
    events: PopoverEvents,
  ) {
    let focusedInside = false;

    panel.addEventListener("beforetoggle", (event) => {
      this.open = event.newState === "open";
      focusedInside = !this.open && panel.contains(document.activeElement);
      events.changing(this.open);
    });
    panel.addEventListener("toggle", (event) => {
      if (event.newState === "open") {
        events.shown();
      } else if (focusedInside) {
        trigger.focus();
      }
    });
  }

  hide(): void {
    this.panel.hidePopover();
    this.trigger.focus();
  }
}
