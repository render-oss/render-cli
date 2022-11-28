import { apiGetAction, Subcommand } from "../_helpers.ts";
import { getConfig } from "../../config/index.ts";
import { getRequestJSONList } from "../../api/index.ts";
import { getLogger } from "../../util/logging.ts";

const desc = 
`Lists the custom domains for a given service.`;

export const customDomainsListCommand =
  new Subcommand()
    .name('list')
    .description(desc)
    .group("Presentational controls")
    .option("--format <fmt:string>", "interactive output format", {
      default: 'table',
    })
    .option("--columns <cols:string[]>", "if --format table, the columns to show.", {
      default: ['id', 'name', 'createdAt', 'verificationStatus'],
    })
    .group("API parameters")
    .option(
      "--service-id <serviceId>",
      "the service whose deploys to retrieve",
      { required: true },
    )
    .option("--name <name:string[]>", "domain names to filter by", { collect: true })
    .option("--domain-type <name:string[]>", "'apex' or 'subdomain'", { collect: true })
    .option("--verification-status <name:string[]>", "'verified' or 'unverified'", { collect: true })
    .option("--created-before <datetime>", "services created before (ISO8601)")
    .option("--created-after <datetime>", "services created after (ISO8601)")
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
          'customDomain',
          `/services/${opts.serviceId}/custom-domains`,
          {
            name: opts.name?.flat(Infinity),
            domainType: opts.domainType?.flat(Infinity),
            verificationStatus: opts.verificationStatus?.flat(Infinity),
            createdBefore: opts.createdBefore,
            createdAfter: opts.createdAfter,
          },
        );
        logger.info(`list call returned ${ret.length} entries.`);

        return ret;
      },
    }));
