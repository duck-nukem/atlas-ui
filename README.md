# atlas-ui

CSS-first components for Atlas. Layout, forms, overlays, tables and charts are plain HTML with classes from `atlas-ui.css`, so any server can render them. Only widgets that need state ship as React components, which also run under `preact/compat`.

## Use

```sh
npm install "git+https://<host>/atlas-ui.git#<commit>"
```

```ts
import "atlas-ui/atlas-ui.css";
import { SearchableSelect } from "atlas-ui";
```

Serve `atlas-ui/icons.svg` and reference icons as `<svg class="ui-icon" aria-hidden="true"><use href="/icons.svg#trash"/></svg>`.

## Theming

Every token is a `--ui-*` custom property in `src/css/tokens.css`. Colours use `light-dark()`: the page follows the system scheme, and `class="dark"` or `class="light"` on `<html>` (or `data-theme`) forces one.

## Browser support

The kit targets Chrome 135, Safari 26.2 and Firefox 144 or later, which open dialogs with `commandfor` and popovers with `popovertarget` without script. Hover popovers use `interestfor`; where it is missing they open on tap. Popovers sit next to their trigger where anchor positioning exists and in the centre of the screen elsewhere.

The app shell scrolls its content area, not the window. `.ui-page` is a size container, so anything fixed inside it, like a toast, belongs in a popover instead. Buttons show a pressed state only in the outline and ghost variants. A client-side router has to close the menu drawer after it navigates.

## Develop

```sh
npx playwright install chromium
npm run storybook
npm run check
```

Every story is tested with axe in light and dark mode. Every component has a `Mobile` story at 375px.
