const DELAY_MS = 150;
const timers = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>();
const pinned = new WeakSet<HTMLElement>();
let installed: (() => void) | undefined;

function popoverOf(trigger: HTMLElement): HTMLElement | null {
  return document.getElementById(trigger.getAttribute("interestfor") ?? "");
}

function interestPopover(target: EventTarget | null): HTMLElement | null {
  const popover =
    target instanceof Element ? target.closest<HTMLElement>("[popover]") : null;

  return popover !== null &&
    document.querySelector(`[interestfor="${CSS.escape(popover.id)}"]`) !== null
    ? popover
    : null;
}

function triggerFrom(target: EventTarget | null): HTMLElement | null {
  return target instanceof Element
    ? target.closest<HTMLElement>("[interestfor]")
    : null;
}

function later(popover: HTMLElement, action: () => void): void {
  clearTimeout(timers.get(popover));
  timers.set(
    popover,
    setTimeout(() => {
      if (installed !== undefined && popover.isConnected) {
        action();
      }
    }, DELAY_MS),
  );
}

function show(trigger: HTMLElement): void {
  const popover = popoverOf(trigger);

  if (popover !== null) {
    later(popover, () => {
      if (!popover.matches(":popover-open")) {
        popover.showPopover({ source: trigger } as ShowPopoverOptions);
      }
    });
  }
}

function hide(popover: HTMLElement | null): void {
  if (popover !== null && !pinned.has(popover)) {
    later(popover, () => popover.hidePopover());
  }
}

const listeners: [string, (event: Event) => void][] = [
  [
    "pointerover",
    (event) => {
      const trigger = triggerFrom(event.target);
      const popover = interestPopover(event.target);

      if ((event as PointerEvent).pointerType === "mouse" && trigger !== null) {
        show(trigger);
      } else if (popover !== null) {
        clearTimeout(timers.get(popover));
      }
    },
  ],
  [
    "pointerout",
    (event) => {
      const pointer = event as PointerEvent;
      const trigger = triggerFrom(pointer.target);
      const popover = interestPopover(pointer.target);
      const stillInside =
        popover !== null &&
        pointer.relatedTarget instanceof Node &&
        popover.contains(pointer.relatedTarget);

      if (pointer.pointerType !== "mouse") {
        return;
      }

      if (trigger !== null) {
        hide(popoverOf(trigger));
      } else if (popover !== null && !stillInside) {
        hide(popover);
      }
    },
  ],
  [
    "click",
    (event) => {
      const trigger = triggerFrom(event.target);
      const popover = trigger === null ? null : popoverOf(trigger);

      if (popover === null || pinned.has(popover)) {
        return;
      }

      clearTimeout(timers.get(popover));
      pinned.add(popover);

      if (popover.matches(":popover-open")) {
        event.preventDefault();
      }
    },
  ],
  [
    "toggle",
    (event) => {
      if (
        event.target instanceof HTMLElement &&
        (event as ToggleEvent).newState === "closed"
      ) {
        pinned.delete(event.target);
      }
    },
  ],
  [
    "focusin",
    (event) => {
      const trigger = triggerFrom(event.target);

      if (trigger !== null) {
        show(trigger);
      }
    },
  ],
  [
    "focusout",
    (event) => {
      const trigger = triggerFrom(event.target);

      if (trigger !== null) {
        hide(popoverOf(trigger));
      }
    },
  ],
];

export function installInterest(always = false): () => void {
  installed?.();

  if (!always && "interestForElement" in HTMLButtonElement.prototype) {
    return () => undefined;
  }

  listeners.forEach(([type, listener]) =>
    document.addEventListener(type, listener, true),
  );

  const uninstall = (): void => {
    listeners.forEach(([type, listener]) =>
      document.removeEventListener(type, listener, true),
    );

    if (installed === uninstall) {
      installed = undefined;
    }
  };

  installed = uninstall;

  return uninstall;
}
