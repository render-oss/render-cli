import { Subcommand } from "../_helpers.ts";
import { customDomainsListCommand } from "./list.ts";

const desc = 
`Commands for observing and managing custom domains.`;

export const customDomainsCommand =
  new Subcommand()
    .name("custom-domains")
    .description(desc)
    .action(function() {
      this.showHelp();
      Deno.exit(1);
    })
    .command("list", customDomainsListCommand)
    ;
