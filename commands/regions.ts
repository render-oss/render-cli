import { ALL_REGIONS } from "../config/types/enums.ts";
import { Subcommand } from "./_helpers.ts";

const desc = 
`Lists the Render regions that this version of the CLI knows about.

NOTE: This list is shipped with a list baked in; in the future we might replace this with an API call.`;

export const regionsCommand =
  new Subcommand()
    .name('regions')
    .description(desc)
    .action(() => {
      for (const region of ALL_REGIONS) {
        console.log(region);
      }
    });
