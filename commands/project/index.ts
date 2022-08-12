import { Subcommand } from "../_helpers.ts";
import { projectNewCommand } from "./new.ts";

const desc = 
`Commands for managing Render projects/repos.`;

export const projectsCommand =
  new Subcommand()
    .name("new")
    .description(desc)
    .action(function() {
      this.showHelp();
      Deno.exit(1);
    })
    .command("new", projectNewCommand)
    ;
