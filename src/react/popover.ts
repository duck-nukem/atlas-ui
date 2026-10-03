import { type RefObject, useLayoutEffect, useRef, useState } from "react";

export type Popover = {
  ref: RefObject<HTMLDivElement | null>;
  open: boolean;
  hide: () => void;
};

export function usePopover(onChange: (open: boolean) => void): Popover {
  const ref = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const changed = useRef(onChange);

  useLayoutEffect(() => {
    changed.current = onChange;
  });

  useLayoutEffect(() => {
    const element = ref.current;
    const toggled = (event: Event): void => {
      const next = (event as ToggleEvent).newState === "open";

      setOpen(next);
      changed.current(next);
    };

    element?.addEventListener("beforetoggle", toggled);

    return () => element?.removeEventListener("beforetoggle", toggled);
  }, []);

  return { ref, open, hide: () => ref.current?.hidePopover() };
}
