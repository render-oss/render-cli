import { readBuildpacksFile, writeBuildpacksFile } from "../../buildpack/crud.ts";
import { isValidBuildpackEntry } from "../../buildpack/validate.ts";
import { RenderCLIError } from "../../errors.ts";
import { getLogger } from "../../util/logging.ts";
import { Subcommand } from "../_helpers.ts";

const desc = 
`Adds buildpacks to your .render-buildpacks.json file.`;

export const buildpackAddCommand =
  new Subcommand()
    .name('new')
    .description(desc)
    .option("--dir <string>", "the directory in which to run this command")
    .arguments("<buildpacks...:string>")
    .action(async (opts, ...buildpacks) => {
      const dir = opts.dir ?? Deno.cwd();
      const logger = await getLogger();

      if (buildpacks.length === 0) {
        throw new RenderCLIError("At least one buildpack must be specified.");
      }

      const buildpacksFile = await readBuildpacksFile(dir);

      for (const bp of buildpacks) {
        if (!isValidBuildpackEntry(bp)) {
          throw new RenderCLIError(`Invalid buildpack entry: ${bp}`);
        }

        const idx = buildpacksFile.buildpacks.indexOf(bp);
        if (idx >= 0) {
          throw new RenderCLIError(`Buildpack entry '${bp}' already exists.`);
        }

        logger.info(`Adding '${bp}' to ${dir}/.render-buildpacks.json.`);
        buildpacksFile.buildpacks.push(bp);
      }

      await writeBuildpacksFile(dir, buildpacksFile);
    });
