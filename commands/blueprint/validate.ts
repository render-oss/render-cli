import { Path } from "../../deps.ts";

import { validateSchema } from "../../blueprints/validator.ts";
import { logAjvErrors } from "../../util/ajv.ts";
import { standardAction, Subcommand } from "../_helpers.ts";
import { CLINotFound } from "../errors.ts";

const desc = 
`Validates a Render Blueprint (render.yaml).

Currently this only does a JSON schema validation pass over the specified document. In the future (TODO!), we'd like to expand this to include best-practices advice and ways to catch problematic situations before they occur.`;

export const blueprintValidateCommand =
  new Subcommand()
    .description(desc)
    .arguments("[filename:string]")
    .action((_opts, filename = './render.yaml') => 
      standardAction({
        processing: (logger) => {
          const path = Path.resolve(filename);

          logger.debug(`Validating '${path}'.`);

          try {
            return validateSchema({ path });
          } catch (err) {
            if (err instanceof Deno.errors.NotFound) {
              throw new CLINotFound(path, err);
            }

            throw err;
          }
        },
        interactive: (result, logger) => {
          if (result[0]) {
            logger.info("Schema validates correctly.");
          } else {
            logAjvErrors(logger, result[1]);
          }
        },
        nonInteractive: (result, _logger) => {
          if (!result) {
            console.log(JSON.stringify(result[1], null, 2));
          }
        },
        exitCode: (result) => result[0] ? 0 : 1,
      })
    );
