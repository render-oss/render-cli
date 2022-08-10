import { Subcommand } from "../_helpers.ts";

const desc = 
`Creates a new Render Blueprint (render.yaml) based on a template.

If you want to create a whole new project from scratch, see \`render new project\`.`;

export const newBlueprintCommand =
  new Subcommand()
    .name('blueprint')
    .description(desc)
    .arguments<[string]>("<identifier:string>")
    .action((_opts, _identifier) => {
      throw new Error("TODO");
    });
