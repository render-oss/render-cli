import { getConfig } from "../../config/index.ts";
import { ConfigAny } from "../../config/types/index.ts";
import { YAML } from "../../deps.ts";
import { getLogger } from "../../util/logging.ts";
import { getPaths } from "../../util/paths.ts";
import { Subcommand } from "../_helpers.ts";

const desc =
`Upgrades a Render CLI config file to the latest version.`;

export const configUpgradeCommand =
  new Subcommand()
    .name('upgrade')
    .description(desc)
    .action(async (opts) => {
      const logger = await getLogger();
      const { configFile } = await getPaths();
      const config = await getConfig();

      const currentConfig = YAML.load(await Deno.readTextFile(configFile)) as ConfigAny;

      if (currentConfig.version === config.fullConfig.version) {
        logger.info("Config is already up to date. No upgrades needed.");
      } else {
        logger.info(`Upgrading config from version ${currentConfig.version} to ${config.fullConfig.version}.`);
        await Deno.copyFile(configFile, `${configFile}.${currentConfig.version}.bak`);
        await Deno.writeTextFile(configFile, YAML.dump(config.fullConfig));

        logger.info("Config upgrade complete. Thanks for using Render!");
      }
    });
