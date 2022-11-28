import { Subcommand } from "../_helpers.ts";
import { jobsListCommand } from "./list.ts";

const desc = 
`Commands for observing and managing Render jobs.`;

export const jobsCommand =
  new Subcommand()
    .name("jobs")
    .description(desc)
    .action(function() {
      this.showHelp();
      Deno.exit(1);
    })
    .command("list", jobsListCommand)
    ;
