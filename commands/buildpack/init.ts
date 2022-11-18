import { Cliffy } from "../../deps.ts";
import { HEROKU_BUILDPACKS } from "../../buildpack/constants.ts";
import { initBuildpacksFile, initDockerfile } from "../../buildpack/crud.ts";
import { isValidBuildpackEntry } from "../../buildpack/validate.ts";
import { standardAction, Subcommand } from "../_helpers.ts";
import { pathExists } from "../../util/paths.ts";
import { ForceRequiredError } from "../../errors.ts";

const desc = 
`Initializes a repository for use with Heroku-style buildpacks within Render.

You can learn more about buildpacks and Heroku migration at:
https://render.com/docs/migrate-from-heroku

Similar to our \`heroku-import\` tool, this command will create a
\`Dockerfile.render\` file and a \`.render-buildpacks.json\` file in the
specified directory. If a path is specified, that path will be used
as the first buildpack in \`.render-buildpacks.json\`; otherwise, you
will be asked for one.`;

export const buildpackInitCommand =
  new Subcommand()
    .name('new')
    .description(desc)
    .option("-f, --force", "overwrites existing files if found.")
    .option("--dir <string>", "the directory in which to run this command")
    .option("--skip-dockerfile", "don't emit a Dockerfile")
    .arguments("[buildpacks...:string]")
    .action((opts, ...buildpacks) => standardAction({
      interactive: async () => {
        const dir = opts.dir ?? '.';

        // this is duplicated in the buildpack crud but we want to fail before we ask
        // the user questions that require mental effort
        const files = [
          `${dir}/.render-buildpacks.json`,
        ];
        (!opts.skipDockerfile) && files.push(`${dir}/Dockerfile`);
        for (const f of files) {
          if (await pathExists(f) && !opts.force) {
            throw new ForceRequiredError(`${f} exists`);
          }
        }

        const initialBuildpacks: Array<string> = buildpacks ?? [];

        if (initialBuildpacks.length === 0) {
          const resp1 = await Cliffy.prompt([
            {
              name: "buildpacks",
              message: "Select appropriate buildpacks (space to toggle)",
              type: Cliffy.Checkbox,
              options: [
                ...HEROKU_BUILDPACKS,
                'I need a custom buildpack',
              ],
            }
          ]);

          initialBuildpacks.push(...(resp1.buildpacks ?? []).filter(bp => HEROKU_BUILDPACKS.includes(bp)));

          if (resp1.buildpacks?.includes("I need a custom buildpack")) {
            console.log(
`
Render's buildpack system accepts either of the following:

- a git url, e.g. \`https://github.com/heroku/heroku-geo-buildpack.git\`
- a full path to a tarball, e.g.
  \`https://github.com/username/repo/archive/refs/heads/main.tar.gz\`

Enter a blank line to finish entering custom buildpacks. Also remember that
you can add more buildpacks later with \`render buildpack add\`!
`);

            while (true) {
              const { bpUrl } = await Cliffy.prompt([
                {
                  name: 'bpUrl',
                  message: "enter a URL for a buildpack (blank line to finish)",
                  type: Cliffy.Input,
                },
              ]);

              if (!bpUrl || bpUrl === '') {
                break;
              }

              if (!isValidBuildpackEntry(bpUrl)) {
                console.error(`!!! '${bpUrl}' isn't a valid buildpack URL.`);
              } else {
                console.log(`${bpUrl} added.`);
                initialBuildpacks.push(bpUrl);
              }
            }
          }
        }

        (!opts.skipDockerfile) && await initDockerfile(dir, !!opts.force);
        await initBuildpacksFile(dir, initialBuildpacks, !!opts.force);

        console.log(
`

${initialBuildpacks.length} buildpacks configured. You're good to go!

We've created the following files for you:

${files.map(f => `- ${f}`).join('\n')}

You can now use this Dockerfile on Render either by creating a Blueprint, also
known as a render.yaml file, or by adding a service manually to the Render
Dashboard.

- For more information on using Dockerfiles on Render, and a step-by-step guide
  to adding a Docker service via the Render Dashboard, please visit
  https://rndr.in/dockerfiles.
- For more information on Blueprints, please visit https://rndr.in/blueprints.

As always if you run into any trouble, Render's support team is standing by to
help. You can reach them by emailing support@render.com.

Thanks for using Render!

`
        );

        return 0;
      }
    }));
