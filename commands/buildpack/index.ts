import { Subcommand } from "../_helpers.ts";
import { buildpackInitCommand } from "./init.ts";

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
    ;
