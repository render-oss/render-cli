import { VERSION } from "../version.ts";
import { Subcommand } from "./_helpers.ts";

const desc = `Shows the application version.`;

export const versionCommand =
  new Subcommand()
    .name('version')
    .description(desc)
    .action(() => {
      console.log(VERSION);
    });
