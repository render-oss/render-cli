import { Subcommand } from "../_helpers.ts";
import { deployNewCommand } from "./new.ts";

const desc = 
`Commands for interacting with deploys to Render.`;

export const deployCommand =
  new Subcommand()
    .name("blueprint")
    .description(desc)
    .action(function() {
      this.showHelp();
      Deno.exit(1);
    })
    .command("new", deployNewCommand)
    ;
