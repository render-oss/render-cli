import { Cliffy } from '../deps.ts';
import { nonInteractive, verboseLogging } from "../util/logging.ts";
import { VERSION } from "../version.ts";
import { blueprintCommand } from "./blueprint/index.ts";
import { newCommand } from "./new/index.ts";


export const ROOT_COMMAND =
  (new Cliffy.Command())
    .name("render")
    .version(VERSION)
    .description("The CLI for the easiest cloud platform you'll ever use.")
    .globalOption("-v, --verbose", "Makes render-cli a lot more chatty.", {
      action: () => {
        verboseLogging();
      }
    })
    .globalOption("--non-interactive", "Forces Render to act as though it's not in a TTY.", {
      action: function() {
        nonInteractive();
      }
    })
    .globalOption("-p, --profile <profileName>", "The Render profile to use for this invocation. Overrides RENDERCLI_PROFILE.")
    .globalOption("-r, --region <regionName>", "The Render region to use for this invocation; always accepted but not always relevant. Overrides RENDERCLI_REGION.")
    .action(function() {
      this.showHelp();
      Deno.exit(1);
    })
    .command("new", newCommand)
    .command("blueprint", blueprintCommand)
    .command("completions", new Cliffy.CompletionsCommand())
    ;
