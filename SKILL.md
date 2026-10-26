---
name: clean-code-guide
description: Guide for coding standards when generating code by agents. Use this while development or when reviewing code.
---

## On commenting
Use comments sparingly. In general variable and function names should describethe use and functionality. Code should also be readable enough for other programmers to understand. 

Only when writing longer functions or more complex code should comments be used to describe certain lines or functions.

## On functions
Prefer pure functions over closure-style functions with variables used outside of its scope over input parameters.

Do not create functions short functions that are just used once. If a function is used only once, it should describe a piece of logic that is part of a larger series of steps. For example, this `loadMcp` function is suitable for being used once because it's used in a setup script for an agent harness:

```typescript
const loadMcp = async (initialMessage: string): Promise<string> => {
  console.log('Connecting MCPs...');
  try {
    await mcpClient.loadConfig();
    const mcpStatuses = await mcpClient.connectAll();
    const mcpConnectErrors = mcpStatuses
      .filter((status) => !status.connected)
      .map((status) => `[mcp] ${status.server} not connected: ${status.error}`);
    if (mcpConnectErrors.length > 0) {
      return [initialMessage, ...mcpConnectErrors].filter(Boolean).join('\n');
    }
    return initialMessage;
  } catch (e) {
    return [initialMessage, `Error with MCP process: ${e}`].filter(Boolean).join('\n');
  }
}

export async function runTui({ syncWarning }: { syncWarning: string | null }): Promise<void> {
  const { createCliRenderer } = await import('@opentui/core');
  const { createRoot } = await import('@opentui/react');
  const { App } = await import('./ui/App');
  const { disposeAppClipboard, initAppClipboard } = await import('./ui/lib/clipboard/app-clipboard');

  let initialMessage: string = syncWarning ?? "";
  initialMessage = await loadMcp(initialMessage);
    //...
}
```

## On global variables and states
If a constant is used throughout the codebase, consider creating a `constants.json` file if it doesn't exist, or adding it to an existing `.ts` or `.json` file if a current file exists.

If the variable is constantly being get and set, use a singleton pattern such as a store. Example: 

```typescript
class ActiveWorkflowStore {
  private activeWorkflow: ActiveWorkflow | null = null;
  get(): ActiveWorkflow | null {
    return this.activeWorkflow;
  }
  set(workflow: WorkflowRecord, userInstructions = ''): void {
    this.activeWorkflow = { workflow, userInstructions };
  }
  clear(): void {
    this.activeWorkflow = null;
  }
}
export const activeWorkflowStore = new ActiveWorkflowStore();
```

Lastly, if a function's state should not be global, use dependency injection and thread the state as a parameter. Make good calls when it comes to using singletons, parameters, and constants.

## On typescript conventions

Prefer the following:
- for loops that use const of
- one-line if statements when possible
- explicit typing
- await over .then().finally() - Do use Promise.all, allSettled, race, etc.

## On new files and directories
Be prudent when creating new files and directories. 

- When writing new code, first ask: can this code live in an existing service file?
- When creating new files, first ask: where does this file best fit in the existing codebase structure?

## On UI components
Create new component files over packing multiple components in a single file. There are exceptions for small components that are only used within a parent component.

Prefer the following:
- providers over hooks
- useSWR for fetching data
- server-side rendering/components for marketing pages

