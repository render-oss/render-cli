import { Region } from "../config/types/enums.ts";
import { getLogger, NON_INTERACTIVE } from "../util/logging.ts";
import { updateKnownHosts } from "./known-hosts.ts";

const RENDER_CLI_SUBCOMMAND_ENV = {
  IS_RENDERCLI_SUBCOMMAND: "1",
};

export type RunSSHArgs = {
  serviceName: string;
  region: Region;
  sshArgs: Array<string>;
  noHosts?: boolean;
}

export async function runSSH(args: RunSSHArgs): Promise<Deno.ProcessStatus> {
  const logger = await getLogger();

  logger.debug("Updating known hosts before invoking.");
  if (!args.noHosts) {
    await updateKnownHosts();
  }

  const sshTarget = `${args.serviceName}@ssh.${args.region}.render.com`;

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
