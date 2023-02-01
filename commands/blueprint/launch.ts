import { sleep } from "https://deno.land/x/sleep@v1.2.1/sleep.ts";
import { Log, openAWebsite } from "../../deps.ts";
import { gitUrlToHttpsUrl, listRemotes } from "../../util/git.ts";
import { RenderCLIError } from "../../errors.ts";
import { standardAction, Subcommand } from "../_helpers.ts";

const desc =
`Opens Render Deploy for this repo.

This will open Render Deploy for the \`origin\` upstream for the repo (for the current working directory) or a remote repo that you've specified. You must have created a GitHub or GitLab repo and pushed to it for this to work!

If it can't open your browser, it'll provide you a link instead.

NOTE: This is only tested for GitHub and GitLab HTTPS repos. Git SSH URLs will be converted to HTTPS as best we can.`;

export const blueprintLaunchCommand =
  new Subcommand()
    .name('new')
    .description(desc)
    .option("-l, --link", "Prints out the Render Deploy URL rather than attempting to open it.")
    .option("-r, --remote <remoteName:string>", "The remote to use")
    .arguments<[string]>("[path:string]")
    .action((opts, path) => standardAction({
      processing: async () => {
        let httpsGitUrl: string;
        if (path) {
          httpsGitUrl = gitUrlToHttpsUrl(path);
        } else {
          const originName = opts.remote ?? 'origin';
          const remotes = await listRemotes({ https: true });

          const originUrl = remotes[originName];
          if (!originUrl) {
            throw new RenderCLIError(`Could not find an '${originName}' upstream for this repo. Upstreams found: ${Object.keys(remotes).join(', ')}`);
          }
          httpsGitUrl = originUrl;
        }

        return `https://render.com/deploy?repo=${httpsGitUrl}`;
      },
      interactive: async (httpsGitUrl: string, logger: Log.Logger) => {
        if (opts.link) {
          console.log(httpsGitUrl);
        } else {
          logger.info(`Taking you to the deploy page: ${httpsGitUrl}`);
          await sleep(1);

          const p = await openAWebsite(httpsGitUrl);

          if (!(await p.status()).success) {
            logger.error(`Could not automatically open browser. Please navigate to this URL directly: ${httpsGitUrl}`);
          }
        }
      },
      nonInteractive: (httpsGitUrl: string) => {
        console.log(httpsGitUrl);
      },
      exitCode: () => 0,
    }));
