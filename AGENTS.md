## Common rules and standards

This package is a submodule in the Diplodoc metapackage. When working in metapackage mode, also follow:

- `../../.agents/style-and-testing.md` — code style, import organization, testing, English-only docs/comments/commit messages
- `../../.agents/monorepo.md` — workspace vs standalone dependency management (`--no-workspaces`)
- `../../.agents/dev-infrastructure.md` — infrastructure update recipes and CI conventions

## Project description

`@diplodoc/page-constructor-extension` integrates Gravity UI Page Constructor into the Diplodoc transformer/build pipeline.

Key outputs:

- **Plugin** (`./plugin`, `./plugin/csr`, `./plugin` node entrypoints) — transformer integration
- **Runtime** (`./runtime`) — browser runtime for hydration/rendering
- **React** (`./react`) — helper hooks/components
- **Renderer** (`./renderer`) — server/browser renderer helpers

## Development commands

```bash
npm run typecheck
npm test
npm run lint
npm run build
```
