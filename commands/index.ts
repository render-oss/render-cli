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
import { jobsCommand } from "./jobs/index.ts";
import { versionCommand } from './version.ts';
import { dashboardCommand } from './dashboard.ts';
import { getPaths, pathExists } from '../util/paths.ts';


export const ROOT_COMMAND =
  (new Cliffy.Command())
    .name("render")
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
    .action(async function() {
      const { configFile } = await getPaths();

      console.log("render-cli is the command line interface for Render. The goal for");
      console.log("this application is to make it easier to interact with Render in");
      console.log("a programmatic way. It's also a good way to learn about the Render");
      console.log("API and what's available in the programming language of your choice.");

      if (!await pathExists(configFile)) {
        console.log();
        console.log(`To get started, run ${Cliffy.colors.cyan('render config init')} to create a configuration file.`);
      }

      console.log();
      console.log("We're always adding more functionality to the Render CLI. Here are some");
      console.log("common commands you might want to try:");
      console.log();
      console.log(`- ${Cliffy.colors.cyan('render repo from-template')} instantiates a new project from an example`);
      console.log(`  in the Render example library at [ https://github.com/render-examples ].`);
      console.log(`- ${Cliffy.colors.cyan('render blueprint launch')} helps deploy the git repository you're in to`);
      console.log(`  Render, using the blueprint in the repository.`);
      console.log(`- ${Cliffy.colors.cyan('render services ssh')} helps you connect to a service's shell.`);
      console.log(`- ${Cliffy.colors.cyan('render services tail')} lets you stream a service's logs as they happen.`);
      console.log(`- ${Cliffy.colors.cyan('render buildpack')} helps you manage the buildpacks used in services`);
      console.log(`  created by the Render Heroku importer or explicitly instantiated via`);
      console.log(`  ${Cliffy.colors.cyan('render buildpack init')}.`);
      console.log(`- ${Cliffy.colors.cyan('render commands')} will give you a full list of all commands in the Render`);
      console.log(`  CLI, and ${Cliffy.colors.cyan('render <command> --help')} will give you more details on a given`);
      console.log(`  command.`);

      console.log();
      console.log(`You can also run ${Cliffy.colors.cyan('render --help')} for a more structured help file.`);
      console.log();
      console.log("Thanks for using Render!");

      Deno.exit(1);
    })
    .command("version", versionCommand)
    .command("commands", commandsCommand)
    .command("config", configCommand)
    .command("regions", regionsCommand)
    .command("dashboard", dashboardCommand)

    .command("repo", repoCommand)
    .command("blueprint", blueprintCommand)
    .command("buildpack", buildpackCommand)
    .command("services", servicesCommand)
    .command("completions", new Cliffy.CompletionsCommand())
    .command("deploys", deploysCommand)
    .command("jobs", jobsCommand)
    .command("custom-domains", customDomainsCommand)
    ;
