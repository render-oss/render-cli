import { ForceRequiredError, RepoNotFound } from "../../errors.ts";
import { Cliffy, Path, FS, download, tgz } from "../../deps.ts";
import { identity } from "../../util/fn.ts";
import { unwrapAsyncIterator } from "../../util/iter.ts";
import { getLogger } from "../../util/logging.ts";
import { pathExists } from "../../util/paths.ts";
import { findUp } from "../../util/find-up.ts";

export type TemplateNewProjectArgs = {
  identifier: string;
  outputDir?: string;
  force?: boolean;
  skipCleanup?: boolean;
}

const GITHUB_REPO_API_BASE = "https://api.github.com/repos";
const IDENTIFIER_REGEX = /^(?:(?:(?<provider>(github)):)?(?:(?<user>[a-zA-Z0-9\-\_]+)\/)?(?:(?<repo>[a-zA-Z0-9\-\_]+))(?:@(?<gitref>.+)))|(?<repoSolo>[a-zA-Z0-9\-\_]+)$/;
const DEFAULT_PROVIDER = 'github';
const DEFAULT_USER = 'render-examples';

type Locator = {
  provider: string,
  user: string,
  repo: string,
  gitref?: string,
}

function resolveTemplateIdentifier(s: string): Locator {
  if (s.startsWith('http:') || s.startsWith('https:')) {
    // the reason we don't support arbitrary git repos is that GitHub lets us download
    // a given gitref as a tarball and it's WAY WAY faster, plus doesn't run the risk of
    // hitting weird git-credential-manager jank.
    throw new Error("TODO: support arbitrary git repos as Render templates.");
  }

  const match = IDENTIFIER_REGEX.exec(s);
  if (!match) {
    throw new Error(`Invalid template identifier: ${s}`);
  }

  const ret: Locator = {
    provider: match.groups?.provider ?? DEFAULT_PROVIDER,
    user: match.groups?.user ?? DEFAULT_USER,
    repo: match.groups?.repoSolo ?? match.groups?.repo!,
    gitref: match.groups?.gitref
  };

  if (!ret.repo) {
    throw new Error(`Couldn't resolve template identifier '${s}'; best guess: '${Deno.inspect(ret)}'.`);
  }

  return ret;
}



export async function templateNewProject(args: TemplateNewProjectArgs): Promise<void> {
  const logger = await getLogger();

  const tempDir = await Deno.makeTempDir({ prefix: 'rendercli_' });

  try {
    logger.debug("CWD:", Deno.cwd());
    logger.debug(`Attempting to resolve template '${args.identifier}'.`);
    const locator = resolveTemplateIdentifier(args.identifier);

    logger.debug(`Ensuring repo is a valid Render template: ${Deno.inspect(locator)}`);
    await ensureRepoIsValid(locator);

    if (!args.outputDir) {
      const response = await Cliffy.prompt([
        {
          name: 'outputDir',
          message: 'What do you want this project to be called?',
          default: locator.repo,
          type: Cliffy.Input,
        },
      ]);

      args.outputDir = response.outputDir ?? `./${locator.repo}`;
    }

    args.outputDir = Path.resolve(args.outputDir);

    if (await pathExists(args.outputDir) && !args.force) {
      throw new ForceRequiredError(`'${args.outputDir}' already exists`);
    }

    logger.debug(`Initializing your project at '${args.outputDir}'...`);
    await downloadRepo(locator, tempDir, args.outputDir, args.force);

    // TODO: much like degit, do we want to offer customization steps per-template?
    //       this could be a separate yaml file in the repo, deleted once the repo
    //       is instantiated

    console.log(`🎉 Done! 🎉 Your project's now ready to use! Just`);
    console.log("");
    console.log(Cliffy.colors.brightYellow(`cd ${args.outputDir}`));
    console.log("");
    console.log("and you're good to go!");
    console.log("");
    console.log(Cliffy.colors.brightWhite("Now that you have a new blueprint set up, you'll need to push it to your repo."))
    console.log(`Once done, ${Cliffy.colors.cyan("render buildpack launch")} to easily deploy your project to Render.`);
    console.log("");
    console.log("Thanks for using Render, and good luck with your new project!");
  } finally {
    if (!args.skipCleanup) {
      await Deno.remove(tempDir, { recursive: true });
    }
  }
}

async function ensureRepoIsValid(loc: Locator) {
  const logger = await getLogger();

  switch (loc.provider) {
    case 'github': {
      const repoInfoResp = await fetch([ GITHUB_REPO_API_BASE, loc.user, loc.repo ].join('/'));
      if (repoInfoResp.status !== 200) {
        throw new RepoNotFound(`github:${loc.user}/${loc.repo}`);
      }

      const repoInfo = await repoInfoResp.json();
      logger.debug(`Found a repo: ${repoInfo.full_name}`);
      return true;
    }
    default: {
      throw new Error(`unrecognized project provider: ${loc.provider}`);
    }
  }
}

// this isn't "clone" repo because we're using the github tarball service to save
// user time.
async function downloadRepo(loc: Locator, tempDir: string, outDir: string, force?: boolean): Promise<void> {
  const logger = await getLogger();

  switch (loc.provider) {
    case 'github': {
      const tarballUrl = [GITHUB_REPO_API_BASE, loc.user, loc.repo, loc.gitref, 'tarball'].filter(identity).join('/');
      logger.debug(`tarball URL: ${tarballUrl}`);

      const destinationFile = `${tempDir}/repo.tgz`;
      const tempUnzip = `${tempDir}/unzipped`

      logger.debug(`Downloading to '${destinationFile}'...`);
      await download(tarballUrl, { dir: tempDir, file: 'repo.tgz' });

      logger.debug(`Decompressing to '${tempUnzip}'...`);
      await tgz.uncompress(destinationFile, tempUnzip);

      // github sticks the actual repo one level deep, so we gotta go get it
      const entries = await unwrapAsyncIterator(FS.expandGlob(`${loc.user}-${loc.repo}-*`, { root: tempUnzip }));
      if (entries.length !== 1) {
        throw new Error(`Wrong number of dir entries in Github tarball download: ${Deno.inspect(entries.map(e => e.path))}`);
      }

      const entry = entries[0];
      logger.debug(`Checking '${entry.path}' for render.yaml...`);
      if (!(await pathExists(`${entry.path}/render.yaml`))) {
        throw new Error("This repo doesn't seem to be a valid Render template; there's no render.yaml file. Contact us for assistance!");
      }

      logger.debug(`Moving '${entry.path}' to '${outDir}'...`);
      await FS.move(entry.path, outDir, { overwrite: force });

      return;
    }
    default: {
      throw new Error(`unrecognized project provider: ${loc.provider}`);
    }
  }
}

export type WriteExampleBlueprintArgs = {
  identifier: string;
  repoDir?: string;
  skipCleanup?: boolean;
};

export async function writeExampleBlueprint(
  args: WriteExampleBlueprintArgs,
) {
  const logger = await getLogger();

  const tempDir = await Deno.makeTempDir({ prefix: 'rendercli_' });
  const userRepoLocation = Path.resolve(args.repoDir ?? Deno.cwd());

  try {
    logger.debug("Repo diretory:", userRepoLocation);
    logger.debug(`Attempting to resolve template '${args.identifier}'.`);
    const locator = resolveTemplateIdentifier(args.identifier);

    logger.debug(`Ensuring repo is a valid Render template: ${Deno.inspect(locator)}`);
    await ensureRepoIsValid(locator);


    logger.debug(`Making sure we're in a git repo from '${userRepoLocation}'...`);
    const gitDir = await findUp(userRepoLocation, '.git', { searchFor: 'directories' });;

    if (!gitDir) {
      throw new Error("You must be in a git repository to use this command.");
    }

    const repoDir = Path.dirname(Path.resolve(gitDir));
    logger.debug(`Repo dir: ${repoDir}`);

    const renderYamlPath = `${repoDir}/render.yaml`;
    if (await pathExists(renderYamlPath)) {
      logger.warning("This repo already has a render.yaml file; we're going to copy it to 'render.yaml.old'.");
      await Deno.copyFile(renderYamlPath, `${renderYamlPath}.old`);
    }

    const unzipDir = `${tempDir}/blueprint-source`;
    await downloadRepo(locator, tempDir, unzipDir, true);

    logger.debug(`Copying '${unzipDir}/render.yaml' to '${renderYamlPath}'...`);
    await Deno.copyFile(`${unzipDir}/render.yaml`, renderYamlPath);

    console.log(`🎉 Done! 🎉 Your project's now ready to use! Your new ${Cliffy.colors.cyan(locator.repo)} blueprint has been saved to`);
    console.log("");
    console.log(Cliffy.colors.brightYellow(renderYamlPath));
    console.log("");
    console.log(Cliffy.colors.brightWhite("Please make sure to review the blueprint's contents to make sure they're appropriate for your app!"));
    console.log("");
    console.log(Cliffy.colors.brightWhite("Now that you have a new blueprint set up, you'll need to push it to your repo."))
    console.log(`Once done, ${Cliffy.colors.cyan("render buildpack launch")} to easily deploy your project to Render.`);
    console.log("");
    console.log("Thanks for using Render, and good luck with your new project!");
  } finally {
    if (!args.skipCleanup) {
      await Deno.remove(tempDir, { recursive: true });
    }
  }
}
