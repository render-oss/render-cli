import { Subcommand } from "../_helpers.ts";
import { buildpackAddCommand } from "./add.ts";
import { buildpackInitCommand } from "./init.ts";
import { buildpackRemoveCommand } from "./remove.ts";

const desc = 
`Commands for using buildpacks in Render`;

export const buildpackCommand =
  new Subcommand()
    .name("buildpack")
    .description(desc)
    .action(function() {
      this.showHelp();
      Deno.exit(1);
    })
    .command("init", buildpackInitCommand)
    .command("remove", buildpackRemoveCommand)
    .command("add", buildpackAddCommand)
    ;
