import { Log } from "../../deps.ts";
import { templateNewProject, writeExampleBlueprint } from "../../new/repo/index.ts";
import { standardAction, Subcommand } from "../_helpers.ts";

const desc =
`Adds a Render Blueprint (render.yaml) to this repo, based on a template.

You can fetch a Render Blueprint from a repo via any of the following identifiers:

repo-name
repo-name@gitref
user/repo-name
user/repo-name@gitref
github:user/repo-name
github:user/repo-name@gitref

If \`user\` is not provided, \`render-examples\` is assumed. If no source prefix is provided, \`github\` is assumed.

At present, \`render blueprint from-template\` does not support private repositories.

Once you've added a Render Blueprint to your repo, you can run \`render blueprint launch\` to deploy your Blueprint.

(Future TODO: enable \`gitlab:\` prefix, enable arbitrary Git repositories, enable private repositories.)`;

export const blueprintFromTemplateCommand =
  new Subcommand()
    .name('from-template')
    .description(desc)
    .arguments<[string]>("<identifier:string>")
    .option("--directory <string>", "directory to write the blueprint to (default: current directory)")
    .option("--skip-cleanup", "skips cleaning up tmpdir (on success or failure)")
    .action((opts, identifier) =>
      standardAction({
        interactive: async (_logger: Log.Logger): Promise<number> => {
          await writeExampleBlueprint({
            identifier,
            repoDir: opts.directory,
            skipCleanup: opts.skipCleanup,
          });
          return 0;
        }
      }));
