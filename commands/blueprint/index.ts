import { Subcommand } from "../_helpers.ts";
import { blueprintLaunchCommand } from "./launch.ts";

import { blueprintValidateCommand } from "./validate.ts";

const desc = 
`Commands for interacting with Render Blueprints (render.yaml files).`;

export const blueprintCommand =
  new Subcommand()
    .name("blueprint")
    .description(desc)
    .action(function() {
      this.showHelp();
      Deno.exit(1);
    })
    // .command("new", blueprintNewCommand)
    .command("launch", blueprintLaunchCommand)
    // .command("validate", blueprintValidateCommand)
    ;
