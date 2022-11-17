import { getConfig } from "../config/index.ts";
import { RuntimeConfiguration } from "../config/types/index.ts";
import { Cliffy, Log } from '../deps.ts';
import { getLogger, NON_INTERACTIVE } from "../util/logging.ts";
import { APIKeyRequired, RenderCLIError } from "../errors.ts";
import { getPaths } from "../util/paths.ts";

const { Command } = Cliffy;

export type GlobalOptions = {
  verbose?: true; // this is a load-bearing 'true'
  nonInteractive?: true; // ditto
  prettyJson?: true;
  profile?: string; 
  region?: string;
}

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

export function apiKeyOrThrow(cfg: RuntimeConfiguration): string {
  if (!cfg.profile.apiKey) {
    throw new APIKeyRequired(cfg);
  }

  return cfg.profile.apiKey;
}

export function apiHost(cfg: RuntimeConfiguration) {
  return cfg.profile.apiHost ?? "api.render.com";
}

export async function apiErrorHandling<T>(logger: Log.Logger, fn: () => Promise<T>): Promise<T> {
  try {
    // for clarity: you almost never do `return await` but if we don't, the try-catch won't fire
    return await fn();
  } catch (err) {
    const configFile = (await getPaths()).configFile;

    if (err instanceof DOMException) {
      // TODO:  can this be better?
      //        DOMException.code is deprecated and not very useful. I assume these are relatively safe.
      if (err.message.includes("404")) {
          logger.error('Command received a 404 Not Found. This usually means that')
          logger.error('no resource could be found with a given name or ID. If you')
          logger.error('used a resource ID directly, e.g. `srv-12345678`, please check')
          logger.error('it for correctness. If you used a resource name or slug, it\'s')
          logger.error('likely that we couldn\'t find a resource so named.');
      } else if (err.message.includes("401")) {
          logger.error('Command received a 401 Unauthorized. This usually means that')
          logger.error('you haven\'t provided credentials to the Render API or the credentials')
          logger.error('are incorrect. Please check your API key in your config file,')
          logger.error(`stored at '${configFile}', and refresh it or add it if need be.`)
      } else if (err.message.includes("403")) {
          logger.error('Command received a 403 Forbidden. This usually means that while')
          logger.error('you have made a request with valid Render credentials, the API')
          logger.error('doesn\'t think you have access to that resource. Check to make sure')
          logger.error('you\'re using the right profile and that your user account is a member')
          logger.error('of the correct team.');
      }
    } else {
      logger.error("Unrecognized error: " + JSON.stringify(err, null, 2));
    }

    throw err;
  }
}
