
import { Subcommand } from "../_helpers.ts";
import { getConfig } from "../../config/index.ts";

const desc =
`Lists your configured profiles.`;

export const configProfilesCommand =
  new Subcommand()
    .name('profiles')
    .description(desc)
    .action(async () => {
      const config = await getConfig();
      Object.keys(config.fullConfig.profiles).forEach((profile) => console.log(profile));
      return 0;
    });
