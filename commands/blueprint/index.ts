import { Subcommand } from "../_helpers.ts";
import { blueprintValidateCommand } from "./validate.ts";

const desc = 
`Commands for interacting with Render Blueprints (render.yaml files).`;

export const blueprintCommand =
  new Subcommand()
    .name("new")
    .description(desc)
    .action(function() {
      this.showHelp();
      Deno.exit(1);
    })
    .command("validate", blueprintValidateCommand)
    ;
