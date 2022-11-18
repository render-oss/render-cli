import { Subcommand } from "../_helpers.ts";
import { deploysListCommand } from "./list.ts";

const desc = 
`Commands for observing and managing deploys of Render services.`;

export const deploysCommand =
  new Subcommand()
    .name("deploys")
    .description(desc)
    .action(function() {
      this.showHelp();
      Deno.exit(1);
    })
    .command("list", deploysListCommand)
    ;
