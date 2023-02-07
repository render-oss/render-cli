import { Cliffy, sortBy } from "../deps.ts";
import { renderJsonOutput } from "../util/logging.ts";
import { standardAction, Subcommand } from "./_helpers.ts";

const desc =
`Lists all commands and subcommands.`;

type CmdInfo = {
  fullName: string;
  shortDesc: string;
}

type CmdTreeNode = {
  name: string;
  description: string;
  subcommands: Array<CmdTreeNode>;
}

export const commandsCommand =
  new Subcommand()
    .name('commands')
    .description(desc)
    .action(function () {
      return standardAction({
        processing: (logger) => {
          // TODO: some odd typing here. are the Deno imports correct?
          const rootCommand = this.getGlobalParent() as Cliffy.Command;

          function listCommands(cmd: Cliffy.Command): CmdTreeNode {
            if (!cmd) {
              logger.debug("can't happen: command was falsy in 'render commands'?");
              throw new Error();
            }

            const subcommands = sortBy(
              cmd.getCommands(false).map(subcmd => listCommands(subcmd)),
              (i: CmdTreeNode) => i.name,
            );

            const ret: CmdTreeNode = {
              name: cmd.getName(),
              description: cmd.getDescription().split("\n")[0].trim(),
              subcommands,
            }

            return ret;
          }

          return listCommands(rootCommand);
        },
        interactive: (result, _logger) => {
          function printCommand(cmd: CmdTreeNode, cmdPath: Array<string> = [], indent = "") {
            if (cmdPath.length !== 0) {
              const precedingPath = Cliffy.colors.cyan(cmdPath.join(" "));
              const currentNode = Cliffy.colors.brightWhite(cmd.name);
              console.log(`${indent}${precedingPath} ${currentNode}: ${cmd.description}`);
            }

            cmd.subcommands.forEach(subcmd => {
              printCommand(
                subcmd,
                [...cmdPath, cmd.name],
                indent + (cmdPath.length === 0 ? '' : ' \\- '),
              );
            });
          }

          printCommand(result);
          console.log();
          console.log(`Remember that you can always pass ${Cliffy.colors.brightWhite('--help')} to any command (for example,`);
          console.log(`${Cliffy.colors.cyan("render services tail --help")}) to see more information about it.`);
        },
        nonInteractive: (result) => {
          renderJsonOutput(result);
        },
        exitCode: () => 0,
      });
    });
