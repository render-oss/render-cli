import { Subcommand } from "../_helpers.ts";
import { repoFromTemplateCommand } from "./from-template.ts";

const desc = 
`Commands for managing Render projects/repos.`;

export const repoCommand =
  new Subcommand()
    .name("repo")
    .description(desc)
    .action(function() {
      this.showHelp();
      Deno.exit(1);
    })
    .command("from-template", repoFromTemplateCommand)
    ;
