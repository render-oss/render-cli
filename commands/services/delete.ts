import { standardAction, Subcommand } from "../_helpers.ts";
import { getConfig } from "../../config/index.ts";
import { deleteRequestRaw } from "../../api/index.ts";
import { getLogger } from "../../util/logging.ts";

const desc = `Deletes a service`;

export const servicesDeleteCommand = new Subcommand()
  .name("list")
  .description(desc)
  .group("API parameters")
  .option("--id <serviceId:string>", "the service ID (e.g. `srv-12345`)")
  .action((opts) =>
    standardAction({
      exitCode: (res) => (res?.status == 204 ? 0 : 1),
      interactive: () => undefined,
      processing: async () => {
        const cfg = await getConfig();
        const logger = await getLogger();

        const ret = await deleteRequestRaw(logger, cfg, `/services/${opts.id}`);
        logger.debug(`deleted service ${opts.id}: ${ret.status}`);

        return ret;
      },
    })
  );
