import { Log } from "../../deps.ts";
import { standardAction, Subcommand } from "../_helpers.ts";
import { getConfig } from "../../config/index.ts";
import { getRequestJSONList } from "../../api/index.ts";
import { getLogger, renderInteractiveOutput, renderJsonOutput } from "../../util/logging.ts";

const desc = 
`Lists the jobs this user can see.`;

export const jobsListCommand =
  new Subcommand()
    .name('list')
    .description(desc)
    .group("Presentational controls")
    .option("--format <fmt:string>", "interactive output format", {
      default: 'table',
    })
    .option("--columns <cols:string[]>", "if --format table, the columns to show.", {
      default: ['id', 'startCommand', 'planId', 'status', 'finishedAt'],
    })
    .group("API parameters")
    .option(
      "--service-id <serviceId>",
      "the service whose deploys to retrieve",
      { required: true },
    )
    .option("--status <status:string[]>", "'pending', 'running', 'succeeded', or 'failed'", { collect: true })
    .option("--created-before <datetime>", "jobs created before (ISO8601)")
    .option("--created-after <datetime>", "jobs created after (ISO8601)")
    .option("--started-before <datetime>", "jobs started before (ISO8601)")
    .option("--started-after <datetime>", "jobs started after (ISO8601)")
    .option("--finished-before <datetime>", "jobs finished before (ISO8601)")
    .option("--finished-after <datetime>", "jobs finished after (ISO8601)")
    .action((opts) => standardAction({
      // TODO:  wrap this more effectively
      //        API calls will all be basically standard, at least for GETs;
      //        interactive/noninteractive/exit-code should be extracted and not
      //        boilerplated.
      processing: async () => {
        const cfg = await getConfig();
        const logger = await getLogger();

        logger.debug("dispatching getRequestJSONList");
        const ret = await getRequestJSONList(
          logger,
          cfg,
          'job',
          `/services/${opts.serviceId}/jobs`,
          {
            status: opts.status?.flat(Infinity),
            createdBefore: opts.createdBefore,
            createdAfter: opts.createdAfter,
            startedBefore: opts.startedBefore,
            startedAfter: opts.startedAfter,
            finishedBefore: opts.finishedBefore,
            finishedAfter: opts.finishedAfter,
          },
        );
        logger.debug(`list call returned ${ret.length} entries.`);

        return ret;
      },
      interactive: (items: Array<unknown>, logger: Log.Logger) => {
        if (items.length > 0)  {
          renderInteractiveOutput(items, opts.format, opts.columns);
        } else {
          logger.warning("No results found.");
        }
      },
      nonInteractive: (items: Array<unknown>) => {
        renderJsonOutput(items);
      },
      exitCode: (items: Array<unknown>) => items.length > 0 ? 0 : 1,
    }));
