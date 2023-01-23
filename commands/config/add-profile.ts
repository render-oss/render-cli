import { ConfigLatest } from "../../config/types/index.ts";
import { Log, YAML } from "../../deps.ts";
import { ForceRequiredError, InitRequiredError } from "../../errors.ts";
import { ajv } from "../../util/ajv.ts";
import { pathExists } from "../../util/paths.ts";
import { getPaths } from "../../util/paths.ts";
import { standardAction, Subcommand } from "../_helpers.ts";
import { requestProfileInfo, writeProfile } from "./_shared.ts";

const desc = 
`Adds a new profile to a Render CLI config file.`;

export const configAddProfileCommand =
  new Subcommand()
    .name('init')
    .description(desc)
    .option("-f, --force", "overwrites existing profile if found.")
    .arguments("<profileName:string>")
    .action((opts, profileName) => standardAction({
      interactive: async (logger: Log.Logger) => {
        const { configFile } = await getPaths();

        if (!pathExists(configFile)) {
          throw new InitRequiredError(`Render config file does not exist at '${configFile}'`);
        }

        logger.debug({ configFile }, "Loading config.");
        const cfg = YAML.load(await Deno.readTextFile(configFile)) as ConfigLatest;

        logger.debug("Validating config...");
        ajv.validate(ConfigLatest, cfg);

        if (cfg.profiles[profileName] && !opts.force) {
          throw new ForceRequiredError(`Profile '${profileName}' already exists in '${configFile}'`);
        }

        logger.info(`Let's create a profile named '${profileName}'.`);
        const profile = await requestProfileInfo();

        cfg.profiles[profileName] = profile;

        await writeProfile(logger, configFile, cfg);

        return 0;
      }
    })
  );
