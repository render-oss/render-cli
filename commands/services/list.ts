import { Log } from "../../deps.ts";
import { standardAction, Subcommand } from "../_helpers.ts";
import { getConfig } from "../../config/index.ts";
import { getRequestJSONList } from "../../api/index.ts";
import { getLogger, renderInteractiveOutput, renderJsonOutput } from "../../util/logging.ts";

const desc = 
`Lists the services this user can see.`;

export const servicesListCommand =
  new Subcommand()
    .name('list')
    .description(desc)
    .group("Presentational controls")
    .option("--format <fmt:string>", "interactive output format", {
      default: 'table',
    })
    .option("--columns <cols:string[]>", "if --format table, the columns to show.", {
      default: ['id', 'name', 'type', 'slug', 'suspended'],
    })
    .group("API parameters")
    .option("--name <name:string[]>", "the name of a service to filter by", { collect: true })
    .option("--type <type:string[]>", "the service type to filter by", { collect: true })
    .option("--env <env:string[]>", "the runtime environment (docker, ruby, python, etc.)", { collect: true })
    .option("--serviceRegion <svc:string[]>", "the region in which a service is located", { collect: true })
    .option("--ownerId <ownerId:string[]>", "the owner ID for the service", { collect: true })
    .option("--createdBefore <datetime>", "services created before (ISO8601)")
    .option("--createdAfter <datetime>", "services created after (ISO8601)")
    .option("--updatedBefore <datetime>", "services updated before (ISO8601)")
    .option("--updatedAfter <datetime>", "services updated after (ISO8601)")
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
          'service',
          '/services',
          {
            name: opts.name?.flat(Infinity),
            type: opts.type?.flat(Infinity),
            env: opts.env?.flat(Infinity),
            region: opts.serviceRegion?.flat(Infinity),
            createdBefore: opts.createdBefore,
            createdAfter: opts.createdAfter,
            updatedBefore: opts.updatedBefore,
            updatedAfter: opts.createdAfter,
          },
        );
        logger.info(`list call returned ${ret.length} entries.`);

        return ret;
      },
      interactive: (items: Array<unknown>) => {
        renderInteractiveOutput(items, opts.format, opts.columns);
      },
      nonInteractive: (items: Array<unknown>) => {
        renderJsonOutput(items);
      },
      exitCode: (items: Array<unknown>) => items.length > 0 ? 0 : 1,
    }));
