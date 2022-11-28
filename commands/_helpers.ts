import { getConfig } from "../config/index.ts";
import { RuntimeConfiguration } from "../config/types/index.ts";
import { Cliffy, Log } from '../deps.ts';
import { getLogger, NON_INTERACTIVE, renderInteractiveOutput, renderJsonOutput } from "../util/logging.ts";
import { RenderCLIError } from "../errors.ts";

const { Command } = Cliffy;

export type GlobalOptions = {
  verbose?: true; // this is a load-bearing 'true'
  nonInteractive?: true; // ditto
  prettyJson?: true;
  profile?: string; 
  region?: string;
}

// @ts-ignore Deno is confused, but this is fine; TODO: resolve
export const Subcommand = Command<GlobalOptions>;

export async function withConfig(fn: (cfg: RuntimeConfiguration) => Promise<void>) {
  const config = await getConfig();

  return fn(config);
}

export type ErrorContext = {
  path?: string,
}

export function printErrors(logger: Log.Logger, err: unknown) {
  if (err instanceof Deno.errors.NotFound) {
    logger.error(`Path not found or unreadable, but we should be giving you a better error for '${err?.constructor?.name ?? 'CLASS_NAME_NOT_FOUND'}'. Please file an issue so we can help.`, err);
  } else if (err instanceof RenderCLIError) {
    logger.error(err.message);
  } else {
    logger.error("Unrecognized error; dumping to console.error for full trace.");
    console.error(err);
  }
}


export interface InterrogativeAction {
  /**
   * The _interrogative form_ of an interactive action. A standard action that uses
   * this argument form MUST be async (because it is expected that you use Cliffy's
   * `prompt` module to ask questions of the user). No output handling will be
   * performed on your behalf; everything should be handled in your method.
   * 
   * Should return the exit code for the command.
   * 
   * https://cliffy.io/docs/prompt
   */
  interactive: (logger: Log.Logger) => Promise<number> | number,
}

export interface ProcessingAction<T> {
  /**
   * Shared code between interactive and non-interactive modes. Whatever is returned from
   * this function will be passed to `interactive` or `nonInteractive`, respectively.
   */
  processing: (logger: Log.Logger, isNonInteractive: boolean) => T | Promise<T>;

  /**
   * The interactive formatter for this action. It's expected that all output that is
   * not tabular be printed via `logger`, and tabular content to be printed via Cliffy's
   * `table` facility. https://cliffy.io/docs/table
   */
  interactive: (result: T, logger: Log.Logger) => void | Promise<void>;
  
  /**
   * The non-interactive formatter for this action. If this is not set, the CLI will
   * bail before processing when `--non-interactive` is passed or when stdout isn't
   * a TTY.
   * 
   * You are expected to print only human-readable debug data to `logger`. Any data
   * intended to be consumed (e.g., piped to another application) MUST be passed ONLY
   * to `console.log`.
   */
  nonInteractive?: (result: T, logger: Log.Logger) => void | Promise<void>;

  /**
   * Unifies return code logic. After either interactive() or nonInteractive() are called,
   * this will return the exit code for the command.
   * 
   * If you return `true` or an array that is not empty, the return code will be 0. If you
   * return `false`, `null`, or `undefined`, the return code will be 1. If you return a
   * number, the exit code will be that number.
   */
  exitCode: (result: T) => unknown;
}


export type StandardActionArgs<T> =
  | InterrogativeAction
  | ProcessingAction<T>
  ;

function computeExitCode(exitResult: unknown): number {
  if (Array.isArray(exitResult)) {
    return exitResult.length > 0 ? 0 : 1;
  }
  if (typeof(exitResult) === 'number') {
    return exitResult;
  }

  return exitResult ? 0 : 1;
}

export function standardAction<T = never>(
  args: StandardActionArgs<T>,
) {
  
  return (async () => {
    const logger = await getLogger();

    if (NON_INTERACTIVE && !('nonInteractive' in args)) {
      logger.error("This command can only be run in interactive mode.");
      Deno.exit(3);
    }

    try {
      if (!('processing' in args)) {
        logger.debug("Entering interrogative action.");
        // interrogative, interactive action
        await args.interactive(logger);
      } else {
        logger.debug("Performing processing.");
        const result = await args.processing(logger, NON_INTERACTIVE);

        if (NON_INTERACTIVE) {
          logger.debug("Performing non-interactive rendering.");

          if (!args.nonInteractive) {
            throw new Error("firewall: got to non-interactive rendering of an action with no non-interactive renderer; should have bailed earlier?");
          }

          await args.nonInteractive(result, logger);
        } else {
          logger.debug("Performing interactive rendering.");
          await args.interactive(result, logger);
        }

        const exitResult = args.exitCode(result);
        Deno.exit(computeExitCode(exitResult));
      }
    } catch (err) {
      printErrors(logger, err);
      Deno.exit(2);
    }
  })();
}

export type APIGetActionArgs<T = unknown> =
  | {
    processing: (logger: Log.Logger, isNonInteractive: boolean) => T | Promise<T>;

    format?: string,
    tableColumns?: string[],
  };

export function apiGetAction<T = unknown>(args: APIGetActionArgs<T>) {
  return standardAction({
    processing: args.processing,
    interactive: (items: unknown | Array<unknown>, logger: Log.Logger) => {
      if (items && (!Array.isArray(items) || items.length > 0)) {
        renderInteractiveOutput(items, args.tableColumns, args.format);
      } else {
        logger.warning("No results found.");
      }
    },
    nonInteractive: (items: unknown | Array<unknown>) => {
      renderJsonOutput(items);
    },
    exitCode: (items: unknown | Array<unknown>) =>
      Array.isArray(items)
        ? items.length > 0
          ? 0
          : 1
        : !!items,
  });
}
