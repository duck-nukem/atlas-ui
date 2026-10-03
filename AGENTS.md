# atlas-ui

- Prefer native HTML and CSS: `<dialog>`, `popover`, `command`/`commandfor`, `<details>`, links and GET forms. Add React only for state the browser cannot hold.
- Classes are `ui-*`, variants and states are `data-*` or ARIA attributes, tokens are `--ui-*` custom properties.
- React components are TypeScript, use no React-only APIs that `preact/compat` lacks, and run in both the `react` and `preact` test projects.
- Every component has stories for its common uses and a `Mobile` story. Stories must pass axe in light and dark.
- Tests: arrange, act, assert, one assertion, elements found by role or `data-testid`.
- No comments unless the code goes against common sense.
