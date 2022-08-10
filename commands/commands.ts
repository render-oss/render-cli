import { ALL_REGIONS } from "../config/types/enums.ts";
import { Cliffy } from "../deps.ts";
import { getLogger, renderJson } from "../util/logging.ts";
import { standardAction, Subcommand } from "./_helpers.ts";

const desc = 
`Lists all commands and subcommands.`;

type CmdInfo = {
  fullName: string;
  shortDesc: string;
}

export const commandsCommand =
  new Subcommand()
    .name('commands')
    .description(desc)
    .action(function () {
      const rootCommand = this.getGlobalParent();

      return standardAction({
        processing: (logger) => {
  
          const result: Array<CmdInfo> = [];
          
          function listCommands(cmd: typeof rootCommand, cmdPath: Array<string> = []) {
            if (!cmd) {
              logger.debug(`${cmdPath.join('/')}: child was falsy?`);
              return;
            }
  
            const p = [...cmdPath, cmd.getName()];
  
            const fullName = p.join(' ');
            const shortDesc = cmd.getShortDescription();

            if (cmd !== rootCommand) {
              result.push({ fullName, shortDesc });
            }
  
            for (const subcommand of cmd.getCommands(false)) {
              listCommands(subcommand, p);
            }
          }
  
          listCommands(rootCommand);
  
          return result;
        },
        interactive: (result, _logger) => {
          for (const item of result) {
            const str = [
              Cliffy.colors.brightCyan(item.fullName),
              " - ",
              item.shortDesc,
            ].join('');

            console.log(str);
          }
        },
        nonInteractive: (result) => {
          console.log(renderJson(result));
        },
        exitCode: () => 0,
      });
    });
