import { YAML } from "../../deps.ts";

import { ConfigLatest } from "../../config/types/index.ts";
import { standardAction, Subcommand } from "../_helpers.ts";

const desc = 
`Displays the render-cli config schema (YAML; JSON Schema format).`;

export const configSchemaCommand =
  new Subcommand()
    .name('regions')
    .description(desc)
    .action(() => standardAction({
        interactive: () => {
            console.log(YAML.dump(ConfigLatest));
            return 0;
        },
    }));
