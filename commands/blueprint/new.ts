import { interactivelyEditBlueprint } from "../../new/blueprint/index.ts";
import { Subcommand } from "../_helpers.ts";

const desc = 
`Creates a new Render Blueprint (render.yaml) file and allows you to interactively edit it.

If you want to create a whole new project from scratch, see \`render project new --help\`.`;

export const blueprintNewCommand =
  new Subcommand()
    .name('new')
    .description(desc)
    .arguments<[string]>("<path:string>")
    .action((_opts, path) => interactivelyEditBlueprint(path));
