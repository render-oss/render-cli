import { Log } from "../../deps.ts";
import { gitUrlToHttpsUrl, listRemotes } from "../../util/git.ts";
import { RenderCLIError } from "../errors.ts";
import { standardAction, Subcommand } from "../_helpers.ts";

const desc = 
`Opens the browser-based Render Deploy for the \`origin\` upstream for the repo (for the current working directory) or a remote repo that you've specified.

If it can't open your browser, it'll provide you a link instead.

NOTE: This is only tested for GitHub and GitLab HTTPS repos. Git SSH URLs will be converted to HTTPS as best we can.`;

export const deployNewCommand =
  new Subcommand()
    .name('new')
    .description(desc)
    .option("-l, --link", "Prints out the Render Deploy URL rather than attempting to open it.")
    .arguments<[string]>("[path:string]")
    .action((opts, path) => standardAction({
      processing: async () => {
        let httpsGitUrl: string;
        if (path) {
          httpsGitUrl = gitUrlToHttpsUrl(path);
        } else {
          const remote = await listRemotes({ https: true });

          const originUrl = remote.origin;
          if (!originUrl) {
            throw new RenderCLIError("Could not find an origin upstream for this repo.");
          }
          httpsGitUrl = originUrl;
        }

        return `https://render.com/deploy?repo=${httpsGitUrl}`;
      },
      interactive: async (httpsGitUrl: string, logger: Log.Logger) => {
        if (opts.link) {
          console.log(httpsGitUrl);
        }
      },
      nonInteractive: (httpsGitUrl: string) => {
        console.log(httpsGitUrl);
      },
      exitCode: () => 0,
    }));
