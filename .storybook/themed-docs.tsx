import { DocsContainer } from "@storybook/addon-docs/blocks";
import { type ComponentProps, useEffect, useState } from "react";
import { GLOBALS_UPDATED } from "storybook/internal/core-events";
import { themes } from "storybook/theming";

type Props = ComponentProps<typeof DocsContainer>;
type Globals = { theme?: string };

export const isDark = (theme: string | undefined) =>
  theme === "dark" ||
  (theme !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);

export function ThemedDocs(props: Props) {
  const store = props.context as unknown as {
    store?: { userGlobals?: { globals?: Globals } };
  };
  const [theme, setTheme] = useState(store.store?.userGlobals?.globals?.theme);

  useEffect(() => {
    const update = ({ globals }: { globals: Globals }) =>
      setTheme(globals.theme);

    props.context.channel.on(GLOBALS_UPDATED, update);

    return () => props.context.channel.off(GLOBALS_UPDATED, update);
  }, [props.context.channel]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark(theme));
  }, [theme]);

  return (
    <DocsContainer
      {...props}
      theme={isDark(theme) ? themes.dark : themes.light}
    />
  );
}
