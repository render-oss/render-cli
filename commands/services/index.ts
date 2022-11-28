import { Subcommand } from "../_helpers.ts";
import { servicesListCommand } from "./list.ts";
import { servicesShowCommand } from "./show.ts";
import { servicesSshCommand } from "./ssh.ts";
import { servicesTailCommand } from "./tail.ts";

const desc = 
`Commands for observing and managing Render services.`;

export const servicesCommand =
  new Subcommand()
    .name("new")
    .description(desc)
    .action(function() {
      this.showHelp();
      Deno.exit(1);
    })
    .command("show", servicesShowCommand)
    .command("list", servicesListCommand)
    .command("tail", servicesTailCommand)
    .command("ssh", servicesSshCommand)
    ;
