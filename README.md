# atlas-ui

The Atlas app's look as plain HTML and CSS, so any server can render it. Only widgets that hold state ship as React components, and they also run under `preact/compat`.

## Use

```sh
npm install "git+https://<host>/atlas-ui.git#<commit>"
```

```ts
import "atlas-ui/fonts.css";
import "atlas-ui/atlas-ui.css";
import { ChannelPicker, SearchableSelect } from "atlas-ui";
```

Serve `atlas-ui/icons.svg` and reference icons as `<svg class="ui-icon" aria-hidden="true"><use href="/icons.svg#bell"/></svg>`. Storybook shows the markup of every component.

## Theming

Every colour, font, size, weight and radius is a CSS variable. The app's colours sit in `src/css/tokens.css` under the app's own names (`--background`, `--primary`, `--chart-green`, `--tone-3` and so on), with dark values under `.dark` on `<html>`. Spacing, text sizes, weights and radii are Tailwind's theme variables (`--spacing`, `--text-sm`, `--font-weight-medium`, `--radius`). `npm run lint` fails when a component file contains a literal colour or font.

## Build

Components are written as Tailwind `@apply` lists copied from the app's class strings. `npm run build` compiles them into one plain `dist/atlas-ui.css`, so consumers need no Tailwind.

## Native compromises

- Dialogs, menus and popovers open with `commandfor` and `popovertarget`, without script. They need Chrome 135, Safari 26.2 or Firefox 144. Hover popovers also open on hover where `interestfor` exists.
- Menus are links and buttons in a popover. Tab moves through them; arrow keys do not.
- A menu or the mobile navigation does not close by itself after a client-side navigation.
- Dialogs close on a backdrop click only with `closedby="any"` on the `<dialog>`.
- Opening and closing animations are left out.
- The delete button keeps its armed state in `<details>`.

## Contrast to-dos

These production colours fall under WCAG AA, and the affected stories report them without failing:

- Muted text on muted or accent backgrounds: 4.43 to 4.44:1
- Green-tone avatar initials: 4.09:1
- The yellow age badge: 2.26:1

## Develop

```sh
npx playwright install chromium webkit
npm run storybook
npm run check
```

Every story is tested with axe in light and dark mode, in Chromium and WebKit, and every component has a Mobile story at 375px.
