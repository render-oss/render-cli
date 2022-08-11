import { getConfig, validateRegion } from "../config/index.ts";
import { runSSH } from "../ssh/index.ts";
import { getLogger } from "../util/logging.ts";
import { Subcommand } from "./_helpers.ts";

const desc = 
`Opens a SSH session to a Render service.

This command wraps your local \`ssh\` binary and passes any additional command line arguments to that binary. Before invoking \`ssh\`, \`render ssh\` ensures that your local known hosts are updated with current fingerprints for Render services, reducing the likelihood of a TOFU (trust-on-first-use) attack.

NOTE #!: in the future, this command will require a valid API key.`;

export const sshCommand =
  new Subcommand()
    .name('ssh')
    .description(desc)
    .arguments("<serviceId:string> [sshArgs...]")
    .stopEarly() // args after the service name will not be parsed, including flags
    .action(async (opts, serviceName, sshArgs) => {
      const logger = await getLogger();
      const config = await getConfig();

      const status = await runSSH(serviceName, validateRegion(opts.region ?? config.profile.defaultRegion), sshArgs);
      
      if (!status.success) {
        logger.error(`Underlying SSH failure: exit code ${status.code}, signal ${status.signal ?? 'none'}`);
      }
      Deno.exit(status.code);
    });
