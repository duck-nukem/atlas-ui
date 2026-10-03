const DELAY_MS = 150;
const timers = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>();

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
  if (popover !== null) {
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

export function installInterest(always = false): void {
  if (!always && "interestForElement" in HTMLButtonElement.prototype) {
    return;
  }

  document.addEventListener("pointerover", (event) => {
    const trigger = triggerFrom(event.target);
    const popover =
      event.target instanceof Element
        ? event.target.closest<HTMLElement>("[popover]")
        : null;

    if (event.pointerType === "mouse" && trigger !== null) {
      show(trigger);
    } else if (popover !== null) {
      clearTimeout(timers.get(popover));
    }
  });
  document.addEventListener("pointerout", (event) => {
    const trigger = triggerFrom(event.target);

    if (event.pointerType === "mouse" && trigger !== null) {
      hide(popoverOf(trigger));
    }
  });
  document.addEventListener("focusin", (event) => {
    const trigger = triggerFrom(event.target);

    if (trigger !== null) {
      show(trigger);
    }
  });
  document.addEventListener("focusout", (event) => {
    const trigger = triggerFrom(event.target);

    if (trigger !== null) {
      hide(popoverOf(trigger));
    }
  });
}
