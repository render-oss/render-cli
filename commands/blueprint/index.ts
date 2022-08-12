import { Subcommand } from "../_helpers.ts";

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
    .command("validate", blueprintValidateCommand)
    ;
