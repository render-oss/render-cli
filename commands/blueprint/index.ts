import { Subcommand } from "../_helpers.ts";
import { blueprintFromTemplateCommand } from "./from-template.ts";
import { blueprintLaunchCommand } from "./launch.ts";

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
    .command("from-template", blueprintFromTemplateCommand)
    // .command("validate", blueprintValidateCommand)
    ;
