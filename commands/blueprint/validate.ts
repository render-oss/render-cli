import { Path } from "../../deps.ts";

import { validateSchema } from "../../blueprints/validator.ts";
import { getLogger, NON_INTERACTIVE } from "../../util/logging.ts";
import { logAjvErrors } from "../../util/ajv.ts";
import { handleErrors, Subcommand } from "../_helpers.ts";

const desc = 
`Validates a Render Blueprint (render.yaml).

Currently this only does a JSON schema validation pass over the specified document. In the future (TODO!), we'd like to expand this to include best-practices advice and ways to catch problematic situations before they occur.`;

export const blueprintValidateCommand =
  new Subcommand()
    .description(desc)
    .arguments("[filename:string]")
    .action(async (_opts, filename = './render.yaml') => {
      const logger = await getLogger();
      const path = Path.resolve(filename);

      logger.debug(`Validating '${path}'.`);

      try {
        const ret = await validateSchema({ path });

        if (!ret[0]) {
          const errors = ret[1];
          if (NON_INTERACTIVE) {
            console.log(JSON.stringify(errors, null, 2));
          } else {
            logAjvErrors(logger, errors);
          }

          Deno.exit(1);
        }
        
        logger.info("Schema validates correctly.");
        Deno.exit(0);
      } catch (err) {
        await handleErrors({ path }, err);
        Deno.exit(2);
      }
    });
