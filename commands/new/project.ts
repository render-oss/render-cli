import { Subcommand } from "../_helpers.ts";

const desc = 
`Initializes a new project repository from a template.

If you want to create a Render Blueprint (render.yaml) for an existing project, see \`render new blueprint\`.

You can initialize a project with any of the following identifiers:

repo-name
repo-name@gitref
user/repo-name
user/repo-name@gitref
github:user/repo-name
github:user/repo-name@gitref

If \`user\` is not provided, \`render-examples\` is assumed. If no source prefix is provided, \`github\` is assumed.

(Future TODO: enable \`gitlab:\` prefix, enable arbitrary Git repositories.)`;

export const newProjectCommand =
  new Subcommand()
    .description(desc)
    .arguments<[string]>("<identifier:string>")
    .action((_opts, _identifier) => {
      throw new Error("TODO");
    });
