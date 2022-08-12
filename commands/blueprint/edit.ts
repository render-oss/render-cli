import { interactivelyEditBlueprint } from "../../new/blueprint/index.ts";
import { Subcommand } from "../_helpers.ts";

const desc = 
`Interactively edits a Render Blueprint (render.yaml) file.`;

export const blueprintNewCommand =
  new Subcommand()
    .name('new')
    .description(desc)
    .arguments<[string]>("<path:string>")
    .action((_opts, path = './render.yaml') => interactivelyEditBlueprint(path));
