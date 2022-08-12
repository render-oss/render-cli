import { Subcommand } from "../_helpers.ts";
import { configSchemaCommand } from "./schema.ts";

const desc = 
`Commands for interacting with the render-cli configuration.`;

export const configCommand =
  new Subcommand()
    .name("config")
    .description(desc)
    .action(function() {
      this.showHelp();
      Deno.exit(1);
    })
    .command("schema", configSchemaCommand)
    ;
