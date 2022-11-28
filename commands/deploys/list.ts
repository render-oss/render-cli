import { apiGetAction, Subcommand } from "../_helpers.ts";
import { getConfig } from "../../config/index.ts";
import { getRequestJSONList } from "../../api/index.ts";
import { getLogger } from "../../util/logging.ts";

const desc = 
`Lists the deploys for a given service.`;

export const deploysListCommand =
  new Subcommand()
    .name('list')
    .description(desc)
    .group("Presentational controls")
    .option("--format <fmt:string>", "interactive output format", {
      default: 'table',
    })
    .option("--columns <cols:string[]>", "if --format table, the columns to show.", {
      default: ['id', 'status', 'createdAt', 'commit.id', 'commit.message'],
    })
    .group("API parameters")
    .option(
      "--service-id <serviceId>",
      "the service whose deploys to retrieve",
      { required: true },
    )
    .option(
      "--start-time <timestamp:number>", "start of the time range to return"
    )
    .option(
      "--end-time <timestamp:number>", "end of the time range to return"
    )
    .action((opts) => apiGetAction({
      format: opts.format,
      tableColumns: opts.columns,
      processing: async () => {
        const cfg = await getConfig();
        const logger = await getLogger();

        logger.debug("dispatching getRequestJSONList");
        const ret = await getRequestJSONList(
          logger,
          cfg,
          'deploy',
          `/services/${opts.serviceId}/deploys`,
          {
            startTime: opts.startTime,
            endTime: opts.endTime,
          },
        );
        logger.debug(`list call returned ${ret.length} entries.`);

        return ret;
      },
    }
  )
);
  