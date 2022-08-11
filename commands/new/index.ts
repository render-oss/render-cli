import { Subcommand } from "../_helpers.ts";
import { newBlueprintCommand } from "./blueprint.ts";
import { newProjectCommand } from "./project.ts";

const desc = 
`Commands for making new things.

Let's go make something great.`;

export const newCommand =
  new Subcommand()
    .name("new")
    .description(desc)
    .action(function() {
      this.showHelp();
      Deno.exit(1);
    })
    .command("project", newProjectCommand)
    // .command("blueprint", newBlueprintCommand)
    ;
