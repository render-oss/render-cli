import { apiGetAction, Subcommand } from "../_helpers.ts";
import { getConfig } from "../../config/index.ts";
import { getRequestJSONList } from "../../api/index.ts";
import { getLogger } from "../../util/logging.ts";
import { funcError } from "../../util/errors.ts";
import { RenderCLIError } from "../../errors.ts";

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
      default: ['id', 'name', 'type', 'serviceDetails.env', 'slug', 'serviceDetails.numInstances'],
    })
    .group("API parameters")
    .option("--name <name:string[]>", "the name of a service to filter by", { collect: true })
    .option("--type <type:string[]>", "the service type to filter by", { collect: true })
    .option("--env <env:string[]>", "the runtime environment (docker, ruby, python, etc.)", { collect: true })
    .option("--service-region <svc:string[]>", "the region in which a service is located", { collect: true })
    .option("--ownerid <ownerId:string[]>", "the owner ID for the service", { collect: true })
    .option("--created-before <datetime>", "services created before (ISO8601)")
    .option("--created-after <datetime>", "services created after (ISO8601)")
    .option("--updated-before <datetime>", "services updated before (ISO8601)")
    .option("--updated-after <datetime>", "services updated after (ISO8601)")
    .group("API-nonstandard parameters")
    .option("--suspended <susp:string>", "'true'/'yes', 'false'/'no', or 'all'", {
      default: 'false',
    })
    .action((opts) => apiGetAction({
      format: opts.format,
      tableColumns: opts.columns,
      processing: async () => {
        const cfg = await getConfig();
        const logger = await getLogger();

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
            suspended:
              opts.suspended === 'all'
                ? ['suspended', 'not_suspended' ]
                : ['true', 'yes'].includes(opts.suspended.toLowerCase())
                  ? ['suspended']
                  : ['false', 'no'].includes(opts.suspended.toLowerCase())
                    ? ['not_suspended']
                    : funcError(new RenderCLIError(`invalid --suspended: ${opts.suspended}`)),
            createdBefore: opts.createdBefore,
            createdAfter: opts.createdAfter,
            updatedBefore: opts.updatedBefore,
            updatedAfter: opts.createdAfter,
          },
        );
        logger.debug(`list call returned ${ret.length} entries.`);

        return ret;
      },
    }
  )
);
