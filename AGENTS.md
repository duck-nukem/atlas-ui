# atlas-ui

- Copy the Atlas app (`~/IdeaProjects/space-clone`) one to one: its markup, class strings, copy and values. Never invent components, variants, copy or numbers. Compare every story with the running app at 375px and desktop.
- Component CSS is `@apply` of the app's class strings; colours and fonts live only in `src/css/tokens.css`.
- Prefer native HTML: `<dialog>`, `popover`, `command`/`commandfor`, `<details>`, links and GET forms. State the browser cannot hold goes in a custom element (no shadow DOM, no framework) that upgrades server-rendered HTML which already works without JavaScript.
- Kit classes are `ui-*`; variants and states are `data-*` or ARIA attributes.
- Custom elements are TypeScript compiled to plain ES modules, tested in Chromium and WebKit.
- Every component has stories for its real uses, with controls; phone sizes come from the viewport picker. Stories must pass axe in light and dark.
- Tests: arrange, act, assert, one assertion, elements found by role or `data-testid`.
- No comments unless the code goes against common sense.
