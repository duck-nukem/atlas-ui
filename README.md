# atlas-ui

The Atlas app's look as plain HTML and CSS, so any server can render it. Two widgets that need state, the searchable select and the channel picker, are custom elements that upgrade server-rendered HTML and keep working without JavaScript.

## Use

```sh
npm install "git+https://<host>/atlas-ui.git#<commit>"
```

```html
<link rel="stylesheet" href="/atlas-ui/fonts.css" />
<link rel="stylesheet" href="/atlas-ui/atlas-ui.css" />
<script type="module" src="/atlas-ui/elements.js"></script>
<script type="module">
  import { installInterest } from "/atlas-ui/interest.js";
  installInterest();
</script>
```

Copy `dist/` into your static files, or import the same paths from the npm package. There is nothing to compile in the app.

`<atlas-select>` wraps a server-rendered `<select>`; without JavaScript it is that select, with `elements.js` it becomes the searchable dropdown and keeps the select as its value, so forms and Datastar see a normal select. Add `search-url` to search on the server; it is asked `?q=<text>` and answers `{"options":[{"value","label","hint"}]}`. `<atlas-channel-picker>` wraps a `.ui-channel-list` of `li > a` channel links and turns it into a searchable popover. Both elements rebuild themselves when the server patches or morphs their content, so Datastar can update them like any other HTML. Two caveats: a value set by Datastar's `data-bind` (which fires no event) shows once the select is focused or opened, and with `search-url` the server should render the chosen option inside the select, because the options the search found exist only in the browser. Storybook shows the markup for both.

`interest.js` makes hover popovers open on hover in browsers without `interestfor` (Safari, Firefox).

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

## Contrast

Three production colours were darkened to meet WCAG AA: muted text (`--muted-foreground` #6c707e to #666a78), the light chart yellow (#e0a100 to #a87900) and the tone text on avatars (65% tone instead of 80%). Text on the Flow status tiles sits over the bar fill, which axe cannot see, so the fill strength (`--status-fill`, 22% in dark) and the median text (`--status-median`) are tuned for 4.5:1 and checked by a story test. Every story passes axe in light and dark mode.

## Develop

```sh
npx playwright install chromium webkit
npm run storybook
npm run check
```

Every story has controls, and its Code panel shows the HTML that story renders. Use the viewport picker for phone sizes. Storybook's Run tests button runs the stories with axe in Chromium. `npm test` runs every story in light and dark mode, and the element tests, in Chromium and WebKit.
