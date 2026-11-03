# jacks-code-guide

An [Agent Skill](https://vercel.com/docs/agent-resources/skills) that guides coding agents toward clean, consistent code. Use it while writing features or when reviewing code.

The skill (`clean-code-guide`) covers:

- **Comments** — use them sparingly; prefer self-describing names
- **Functions** — prefer pure functions and avoid single-use throwaway wrappers
- **Global variables & state** — constants, singleton stores, or dependency injection
- **TypeScript conventions** — `for...of`, one-line ifs, explicit types, `await` over `.then()`
- **Files & directories** — be prudent about creating new ones
- **UI components** — one component per file, providers/hooks, `useSWR`, SSR
- **DB queries** — use Drizzle over raw SQL
- **Exports** — only export what is defined in the file; no barrel `index.ts`

## Installation
```bash
npx skills add jackmuva/jacks-code-guide
```

