const DELAY_MS = 150;
const timers = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>();
const pinned = new WeakSet<HTMLElement>();
let uninstall: (() => void) | undefined;

function popoverOf(trigger: HTMLElement): HTMLElement | null {
  return document.getElementById(trigger.getAttribute("interestfor") ?? "");
}

function later(popover: HTMLElement, action: () => void): void {
  clearTimeout(timers.get(popover));
  timers.set(popover, setTimeout(action, DELAY_MS));
}

function show(trigger: HTMLElement): void {
  const popover = popoverOf(trigger);

  if (popover !== null) {
    later(popover, () => {
      if (popover.isConnected && !popover.matches(":popover-open")) {
        popover.showPopover({ source: trigger } as ShowPopoverOptions);
      }
    });
  }
}

function hide(popover: HTMLElement | null): void {
  if (popover !== null && !pinned.has(popover)) {
    later(popover, () => {
      if (popover.isConnected) {
        popover.hidePopover();
      }
    });
  }
}

function triggerFrom(target: EventTarget | null): HTMLElement | null {
  return target instanceof Element
    ? target.closest<HTMLElement>("[interestfor]")
    : null;
}

export function installInterest(always = false): () => void {
  uninstall?.();

  if (!always && "interestForElement" in HTMLButtonElement.prototype) {
    return () => undefined;
  }

  const listeners: [string, (event: Event) => void][] = [
    [
      "pointerover",
      (event) => {
        const trigger = triggerFrom(event.target);
        const popover =
          event.target instanceof Element
            ? event.target.closest<HTMLElement>("[popover]")
            : null;

        if (
          (event as PointerEvent).pointerType === "mouse" &&
          trigger !== null
        ) {
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
        const popover =
          pointer.target instanceof Element
            ? pointer.target.closest<HTMLElement>("[popover]")
            : null;

        if (pointer.pointerType !== "mouse") {
          return;
        }

        if (trigger !== null) {
          hide(popoverOf(trigger));
        } else if (
          popover !== null &&
          !(
            pointer.relatedTarget instanceof Node &&
            popover.contains(pointer.relatedTarget)
          )
        ) {
          hide(popover);
        }
      },
    ],
    [
      "click",
      (event) => {
        const trigger = triggerFrom(event.target);
        const popover = trigger === null ? null : popoverOf(trigger);

        if (popover === null) {
          return;
        }

        clearTimeout(timers.get(popover));

        if (popover.matches(":popover-open") && !pinned.has(popover)) {
          event.preventDefault();
          pinned.add(popover);
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

  listeners.forEach(([type, listener]) =>
    document.addEventListener(type, listener, true),
  );
  uninstall = () => {
    listeners.forEach(([type, listener]) =>
      document.removeEventListener(type, listener, true),
    );
    uninstall = undefined;
  };

  return uninstall;
}
