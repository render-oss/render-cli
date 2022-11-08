import { readBuildpacksFile, writeBuildpacksFile } from "../../buildpack/crud.ts";
import { Cliffy } from "../../deps.ts";
import { RenderCLIError } from "../../errors.ts";
import { getLogger, NON_INTERACTIVE } from "../../util/logging.ts";
import { Subcommand } from "../_helpers.ts";

const desc = 
`Removes buildpacks from your .render-buildpacks.json file.`;

export const buildpackRemoveCommand =
  new Subcommand()
    .name('new')
    .description(desc)
    .option("--dir <string>", "the directory in which to run this command")
    .arguments("[buildpacks...:string]")
    .action(async (opts, ...buildpacks) => {
      const dir = opts.dir ?? Deno.cwd();
      const logger = await getLogger();
      const buildpacksToRemove = [...buildpacks];

      const buildpacksFile = await readBuildpacksFile(dir);

      if (buildpacksToRemove.length === 0) {
        if (NON_INTERACTIVE) {
          throw new RenderCLIError('Buildpacks must be specified as arguments in non-interactive mode.');
        }

        const responses = await Cliffy.prompt([{
          name: 'buildpack',
          message: 'Select buildpacks to remove (toggle with space), or hit Ctrl-C to cancel.',
          type: Cliffy.Checkbox,
          options: buildpacksFile.buildpacks,
        }]);

        if (!responses.buildpack) {
          Deno.exit(1);
        }

        buildpacksToRemove.push(...responses.buildpack);
      }

      for (const bp of buildpacksToRemove) {
        const idx = buildpacksFile.buildpacks.indexOf(bp);
        if (idx < 0) {
          logger.warning(`No buildpack '${bp}' found in buildpack file in ${dir}/.render-buildpacks.json.`);
          continue;
        }

        logger.info(`Removing '${bp}' from ${dir}/.render-buildpacks.json.`);
        buildpacksFile.buildpacks.splice(idx, 1);
      }

      await writeBuildpacksFile(dir, buildpacksFile);
    });
