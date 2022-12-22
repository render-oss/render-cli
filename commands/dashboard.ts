import { sleep } from "https://deno.land/x/sleep@v1.2.1/sleep.ts";
import { Log, openAWebsite } from "../deps.ts";
import { standardAction, Subcommand } from "./_helpers.ts";

const desc = 
`Opens the Render dashboard in your browser.`;

export const dashboardCommand =
  new Subcommand()
    .name('new')
    .description(desc)
    .option("-l, --link", "Prints out the Render Dashboard URL rather than attempting to open it.")
    .arguments<[string]>("[path:string]")
    .action((opts, path) => standardAction({
      processing: () => {
        return `https://dashboard.render.com`;
      },
      interactive: async (url: string, logger: Log.Logger) => {
        if (opts.link) {
          console.log(url);
        } else {
          logger.info(`Taking you to the dashboard: ${url}`);
          await sleep(1);
          
          const p = await openAWebsite(url);

          if (!(await p.status()).success) {
            logger.error(`Could not automatically open browser. Please navigate to this URL directly: ${url}`); 
          }
        }
      },
      nonInteractive: (url: string) => {
        console.log(url);
      },
      exitCode: () => 0,
    }));
