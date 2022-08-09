import { getConfig } from "../config/index.ts";
import { RuntimeConfiguration } from "../config/types/index.ts";
import { Cliffy } from '../deps.ts';
import { getLogger } from "../util/logging.ts";

const { Command } = Cliffy;

export type GlobalOptions = {
  verbose?: true; // this is a load-bearing 'true'
  nonInteractive?: true; // ditto
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

export async function handleErrors(ctx: ErrorContext, err: unknown) {
  if (err instanceof Deno.errors.NotFound) {
    (await getLogger()).error(`File not found: ${ctx.path ?? 'UNKNOWN PATH'}`);
  }

  Deno.exit(2);
}
