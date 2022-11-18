import { Cliffy, Log } from '../deps.ts';
import { VERSION } from '../version.ts';
import { getAtPath } from "./objects.ts";

let isLoggingSetup = false;
let LOG_VERBOSITY: 'INFO' | 'DEBUG' = 'INFO';
let PRETTY_JSON = false;
let JSON_RECORD_PER_LINE = false;
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

export function jsonRecordPerLine() {
  if (isLoggingSetup) {
    Log.getLogger().warning("`prettyJson` called after logging setup.");
  }

  JSON_RECORD_PER_LINE = true;
}


export type SetupLoggingArgs = {
  nonInteractive?: boolean,
  verbosity?: 'INFO' | 'DEBUG',
}

// @ts-ignore: Deno types for Log.handlers seem odd, but it's legit
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

  if (VERSION.startsWith("0")) {
    (await getLogger()).warning(`render-cli is still pre-1.0.0 and as such all functionality should be considered subject to change.`);
  }
}

export async function getLogger(name?: string) {
  if (!isLoggingSetup) {
    await setupLogging();
  }

  return Log.getLogger(name);
}

export function renderInteractiveOutput(
  obj: unknown,
  format: string,
  tableColumns: string[],
): void {
  switch (format) {
    case 'json':
      renderJsonOutput(obj);
      return;
    case 'table':
      if (Array.isArray(obj)) {
        // deno-lint-ignore no-explicit-any
        const table = Cliffy.Table.from(
          obj.map(
            (o: any) => tableColumns.map(c => getAtPath(c, o)),
          ),
        );
        table.unshift(tableColumns);

        table.render();
      } else {
        console.log(Deno.inspect(obj, {
          colors: true,
          depth: Infinity,
          sorted: true,
        }));
      }
      return;
    default:
      throw new Error(`Unrecognized interactive output format: '${format}'`);
  }
}

export function renderJsonOutput(obj: unknown): void {
  const output = (
    JSON_RECORD_PER_LINE
      ? Array.isArray(obj)
        ? obj.map(item => JSON.stringify(item)).join("\n")
        : JSON.stringify(obj)
      : PRETTY_JSON
        ? JSON.stringify(obj, null, 2)
        : JSON.stringify(obj)
  );

  console.log(output);
}
