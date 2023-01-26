import { Subcommand } from "../_helpers.ts";
import { configAddProfileCommand } from "./add-profile.ts";
import { configInitCommand } from "./init.ts";
import { configProfilesCommand } from "./profiles.ts";
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
    .command("init", configInitCommand)
    .command("add-profile", configAddProfileCommand)
    .command("profiles", configProfilesCommand)
    .command("schema", configSchemaCommand)
    ;
