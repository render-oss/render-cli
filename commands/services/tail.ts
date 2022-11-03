import { LogTailEntry } from "../../services/types.ts";
import { ajv, logAjvErrors } from "../../util/ajv.ts";
import { getLogger, NON_INTERACTIVE } from "../../util/logging.ts";
import { apiKeyOrThrow, apiHost, Subcommand, withConfig } from "../_helpers.ts";

const desc = 
`Tails logs for a given service.

TODO: support specifying a particular deploy ID from which to source logs.

TODO: support pulling only the last X lines of a log.`;

export const servicesTailCommand =
  new Subcommand()
    .name('new')
    .description(desc)
    .option("--raw", "only prints the bare text of the log to stdout")
    .option("--json", "prints Render's log tail as JSON, one per message", { conflicts: ['raw'] })
    .option("--deploy-id <deployId>", "filter logs to the requested deploy ID", { collect: true })
    .option("--service-id <serviceId>", "the service ID whose logs to request", { required: true })
    .action((opts) => withConfig(async (cfg) => {
      const logger = await getLogger();
      const apiKey = apiKeyOrThrow(cfg);

      opts.deployId = opts.deployId ?? [];
      const deployIds = opts.deployId.length > 0 ? new Set(opts.deployId ?? []) : null;

      const url = `wss://${apiHost(cfg)}/v1/services/${opts.serviceId}/logs/tail`;
      logger.debug(`tail url: ${url}, profile name: ${cfg.profileName}`);

      const stream = new WebSocketStream(
        url,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      
      const conn = await stream.connection;
      const reader = await conn.readable.getReader();
      const writer = await conn.writable.getWriter();

      const logEntryValidator = ajv.compile<LogTailEntry>(LogTailEntry);


      setInterval(() => {
        writer.write('{ "ping": true }');
      }, 15000);
      
      while (true) {
        const input = (await reader.read()).value;
        if (!input) {
          logger.debug("empty packet received from web socket?");
          continue;
        }

        let json: string;
        if (typeof(input) === 'string') {
          json = input;
        } else {
          json = (new TextDecoder()).decode(input);
        }

        const msg = JSON.parse(json);
        
        if (logEntryValidator(msg)) {
          if (deployIds && !deployIds.has(msg.deployID)) {
            continue;
          }

          let output;
          if (opts.json) {
            output = json.trim();
          } else {
            output = "";

            if (!opts.raw) {
              output += `${msg.deployID}: `;
            }
  
            output += msg.text;
          }

          console.log(output);
        } else {
          logger.error("Unparseable entry from tail socket.")
          logAjvErrors(logger, logEntryValidator.errors);
          continue;
        }
      }
    }));
