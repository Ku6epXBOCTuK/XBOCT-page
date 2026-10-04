# Agents Guidelines

Chrome extension (Manifest V3) that replaces the new tab page with a bookmark
manager.

## Stack

- Svelte 5 (runes mode only), TypeScript, Vite + CRXJS, pnpm

## Rules

1. **Svelte 5 runes only** — `$state`, `$derived`, `$effect`, `$props()`. No
   legacy `let` reactivity, `$:` or lifecycle functions.
2. **Components** — one responsibility each; all `.svelte` files live in
   `src/components/`. Callback props are lowercase (`onclose`, `onsave`).
3. **Styling** — design tokens from `src/vars.css` only. No hardcoded px/rem
   values in components.
4. **Types** — `import type` for types; prefer `interface` over `type`
   (unions/intersections excepted).
5. **Icons** — from `lucide` via `~icons/lucide/*`.
6. **Config files** — never modify without asking (ESLint, Prettier, Stylelint,
   tsconfig, etc.).
7. **Comments** — only for non-obvious "why", never for self-explanatory code.

## File structure

```
src/
├── lib/
│   ├── state/        # reactive state (runes) — must be named *.svelte.ts
│   ├── services/     # non-reactive logic, I/O
│   ├── composables/  # reusable rune-based logic
│   └── *.ts          # utilities
├── components/       # all Svelte components (ui/, layout/, widgets/, dialogs/)
├── start/            # new tab page
└── popup/            # extension popup
```

## Verification

Run after every task (PowerShell, Windows):

```powershell
powershell -Command "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; pnpm run <cmd>"
```

- Always: `pnpm run check`, `pnpm run format`
- After large changes: `pnpm run lint`, `pnpm run lint:css`
- Fix all errors before finishing. Never call tools directly (`npx`,
  `node_modules/.bin`) — if a script is missing from `package.json`, tell the
  user.

Do not run `pnpm run build` while the dev server is running — it overwrites
`dist`.
