import { Log } from '../deps.ts';

let isLoggingSetup = false;
let LOG_VERBOSITY: 'INFO' | 'DEBUG' = 'INFO';
let PRETTY_JSON = false;
export let NON_INTERACTIVE = !Deno.isatty(Deno.stdout.rid);

export function verboseLogging() {
  if (isLoggingSetup) {
    Log.getLogger().warning("`verboseLogging` called after logging setup.");
  }

  LOG_VERBOSITY = 'DEBUG'
}

export function nonInteractive() {
  if (isLoggingSetup) {
    Log.getLogger().warning("`nonInteractive` called after logging setup.");
  }

  NON_INTERACTIVE = true;
}

export function prettyJson() {
  if (isLoggingSetup) {
    Log.getLogger().warning("`prettyJson` called after logging setup.");
  }

  PRETTY_JSON = true;
}


export type SetupLoggingArgs = {
  nonInteractive?: boolean,
  verbosity?: 'INFO' | 'DEBUG',
}

class StderrHandler extends Log.handlers.ConsoleHandler {
  private readonly encoder = new TextEncoder();

  override log(msg: string): void {
    Deno.stderr.writeSync(this.encoder.encode(msg + "\n"));
  }
}

async function setupLogging() {
  if (!isLoggingSetup) {
    const verbosity = LOG_VERBOSITY;
    const handler = NON_INTERACTIVE
      ? new StderrHandler(verbosity)
      : new Log.handlers.ConsoleHandler(verbosity);

    await Log.setup({
      handlers: {
        console: handler,
      },
      loggers: {
        default: {
          level: verbosity,
          handlers: ['console'],
        },
      }
    });

    isLoggingSetup = true;
  }
}

export async function getLogger(name?: string) {
  if (!isLoggingSetup) {
    await setupLogging();
  }

  return Log.getLogger(name);
}


export function renderJson(obj: unknown): string {
  return (
    PRETTY_JSON
      ? JSON.stringify(obj, null, 2)
      : JSON.stringify(obj)
  );
}
