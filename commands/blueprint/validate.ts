import { Path } from "../../deps.ts";

import { validateSchema } from "../../blueprints/validator.ts";
import { logAjvErrors } from "../../util/ajv.ts";
import { standardAction, Subcommand } from "../_helpers.ts";
import { PathNotFound } from "../../errors.ts";
import { renderJsonOutput } from "../../util/logging.ts";

const desc = 
`Validates a Render Blueprint (render.yaml).

Currently this only does a JSON schema validation pass over the specified document. In the future (TODO!), we'd like to expand this to include best-practices advice and ways to catch problematic situations before they occur.`;

export const blueprintValidateCommand =
  new Subcommand()
    .name('validate')
    .description(desc)
    .arguments("[filename:string]")
    .action((_opts, filename = './render.yaml') => 
      standardAction({
        processing: async (logger) => {
          const path = Path.resolve(filename);
          logger.debug(`Validating '${path}'.`);

          try {
            const ret = await validateSchema({ path });

            // required; we want to catch and rethrow for better info
            logger.debug("Validation complete. Success:", !!ret);
            return ret;
          } catch (err) {
            if (err instanceof Deno.errors.NotFound) {
              throw new PathNotFound(path, err);
            }

            throw err;
          }
        },
        interactive: (result, logger) => {
          if (result[0]) {
            logger.info("Schema validates correctly.");
          } else {
            logAjvErrors(logger, result[1].jsonSchema);
          }
        },
        nonInteractive: (result, _logger) => {
          if (!result[0]) {
            renderJsonOutput(result[1]);
          }
        },
        exitCode: (result) => result[0] ? 0 : 1,
      })
    );
