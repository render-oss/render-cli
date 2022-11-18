import { Cliffy } from '../deps.ts';

import { jsonRecordPerLine, nonInteractive, prettyJson, verboseLogging } from "../util/logging.ts";
import { VERSION } from "../version.ts";
import { blueprintCommand } from "./blueprint/index.ts";
import { buildpackCommand } from './buildpack/index.ts';
import { commandsCommand } from "./commands.ts";
import { configCommand } from "./config/index.ts";
import { repoCommand } from './repo/index.ts';
import { regionsCommand } from "./regions.ts";
import { servicesCommand } from "./services/index.ts";
import { deploysCommand } from "./deploys/index.ts";
import { customDomainsCommand } from "./custom-domains/index.ts";


export const ROOT_COMMAND =
  (new Cliffy.Command())
    .name("render")
    .version(VERSION)
    .description("The CLI for the easiest cloud platform you'll ever use.\n\nType `render config init` to get started.")
    .globalOption(
      "-v, --verbose",
      "Makes render-cli a lot more chatty.",
      {
        action: () => verboseLogging(),
      })
    .globalOption(
      "--non-interactive",
      "Forces Render to act as though it's not in a TTY.",
      {
        action: () => nonInteractive(),
      })
    .globalOption(
      "--pretty-json",
      "If in non-interactive mode, prints prettified JSON.",
      {
        action: () => prettyJson(),
      })
    .globalOption(
      "--json-record-per-line",
      "if emitting JSON, prints each JSON record as a separate line of stdout.",
      {
        action: () => jsonRecordPerLine(),
        conflicts: ["pretty-json"],
      })
    .globalOption("-p, --profile <profileName>", "The Render profile to use for this invocation. Overrides RENDERCLI_PROFILE.")
    .globalOption("-r, --region <regionName>", "The Render region to use for this invocation; always accepted but not always relevant. Overrides RENDERCLI_REGION.")
    .action(function() {
      this.showHelp();
      Deno.exit(1);
    })
    .command("commands", commandsCommand)
    .command("config", configCommand)
    .command("regions", regionsCommand)
    .command("repo", repoCommand)
    .command("blueprint", blueprintCommand)
    .command("buildpack", buildpackCommand)
    .command("services", servicesCommand)
    .command("deploys", deploysCommand)
    .command("custom-domains", customDomainsCommand)
    .command("completions", new Cliffy.CompletionsCommand())
    ;
