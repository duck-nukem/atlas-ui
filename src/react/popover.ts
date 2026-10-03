import { type RefObject, useLayoutEffect, useRef, useState } from "react";

export type Popover = {
  ref: RefObject<HTMLDivElement | null>;
  open: boolean;
  hide: () => void;
};

export function usePopover(
  onChange: (open: boolean) => void,
  onShown: () => void,
): Popover {
  const ref = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const handlers = useRef({ onChange, onShown });

  useLayoutEffect(() => {
    handlers.current = { onChange, onShown };
  });

  useLayoutEffect(() => {
    const element = ref.current;
    const changing = (event: Event): void => {
      const next = (event as ToggleEvent).newState === "open";

      setOpen(next);
      handlers.current.onChange(next);
    };
    const toggled = (event: Event): void => {
      if ((event as ToggleEvent).newState === "open") {
        handlers.current.onShown();
      }
    };

    element?.addEventListener("beforetoggle", changing);
    element?.addEventListener("toggle", toggled);

    return () => {
      element?.removeEventListener("beforetoggle", changing);
      element?.removeEventListener("toggle", toggled);
    };
  }, []);

  return { ref, open, hide: () => ref.current?.hidePopover() };
}
