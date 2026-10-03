# atlas-ui

- Copy the Atlas app (`~/IdeaProjects/space-clone`) one to one: its markup, class strings, copy and values. Never invent components, variants, copy or numbers. Compare every story with the running app at 375px and desktop.
- Component CSS is `@apply` of the app's class strings; colours and fonts live only in `src/css/tokens.css`.
- Prefer native HTML: `<dialog>`, `popover`, `command`/`commandfor`, `<details>`, links and GET forms. React only for state the browser cannot hold.
- Kit classes are `ui-*`; variants and states are `data-*` or ARIA attributes.
- React components are TypeScript and must pass in both the `react` and `preact` test projects, in Chromium and WebKit.
- Every component has stories for its real uses, with controls; phone sizes come from the viewport picker. Stories must pass axe in light and dark.
- Tests: arrange, act, assert, one assertion, elements found by role or `data-testid`.
- No comments unless the code goes against common sense.
