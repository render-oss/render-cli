import { getRequestJSON } from "../../api/requests.ts";
import { Region } from "../../config/types/enums.ts";
import { RuntimeConfiguration } from "../../config/types/index.ts";
import { RenderCLIError } from "../../errors.ts";
import { getLogger, NON_INTERACTIVE } from "../../util/logging.ts";
import { UNSHELLABLE_SERVICE_TYPES } from "../constants.ts";
import { updateKnownHosts } from "./known-hosts.ts";

const RENDER_CLI_SUBCOMMAND_ENV = {
  IS_RENDERCLI_SUBCOMMAND: "1",
};

export type RunSSHArgs = {
  config: RuntimeConfiguration,
  serviceId: string;
  region: Region;
  sshArgs: Array<string>;
  noHosts?: boolean;
}

export async function runSSH(args: RunSSHArgs): Promise<Deno.ProcessStatus> {
  const config = args.config;
  const logger = await getLogger();

  logger.debug("dispatching to check for static_site");
  const service = (await getRequestJSON(
    logger,
    config,
    `/services/${args.serviceId}`,
  // TODO: resolve later when API clients are functional
  // deno-lint-ignore no-explicit-any
  )) as any;

  if (UNSHELLABLE_SERVICE_TYPES.has(service.type)) {
    throw new RenderCLIError(`Service '${args.serviceId}' is of type '${service.type}', which cannot be SSH'd into.`);
  }

  logger.debug("Updating known hosts before invoking.");
  if (!args.noHosts) {
    await updateKnownHosts();
  }

  const sshTarget = `${args.serviceId}@ssh.${args.region}.render.com`;

  logger.debug(`SSH target: ${sshTarget}`);

  const cmd = ['ssh', sshTarget, ...args.sshArgs];
  logger.debug(`Deno.run args: ${JSON.stringify(cmd)}`);

  const process = Deno.run({
    cmd,
    stdout: 'inherit',
    stderr: 'inherit',
    stdin: NON_INTERACTIVE ? 'null' : 'inherit',
    env: RENDER_CLI_SUBCOMMAND_ENV,
  });

  logger.debug(`SSH process started as PID ${process.pid}`);
  const status = await process.status();

  return status;
}
